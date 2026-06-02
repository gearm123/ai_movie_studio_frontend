import { useCallback, useState } from "react";
import { STUDIO_CONFIG, clampBeatCount } from "../constants/studio";
import { getNarrator, applyVisualStyleToBeat, skipImageToVideoFromVisualStyle } from "../constants/parameters";
import { createInitialDraft, resizeBeats, updateBeatInDraft, updateSettingsInDraft } from "../utils/beats";
import type { BeatAudioParams, BeatCompositionParams, BeatDraft, MovieProjectDraft, ProjectSettings, VisualStyle } from "../types/project";

export function useProjectDraft(initial?: MovieProjectDraft) {
  const [draft, setDraft] = useState<MovieProjectDraft>(initial ?? createInitialDraft());
  const [activeBeatIndex, setActiveBeatIndex] = useState(1);

  const setBeatCount = useCallback((beatCount: number) => {
    const count = clampBeatCount(beatCount);
    setDraft((prev) => {
      const beats = resizeBeats(prev.beats, count, prev.settings.visual_style);
      return {
        ...prev,
        beatCount: count,
        beats,
        settings: {
          ...prev.settings,
          duration: count * STUDIO_CONFIG.secondsPerBeat,
        },
      };
    });
    setActiveBeatIndex((current) => Math.min(current, count));
  }, []);

  const updateSettings = useCallback((patch: Partial<ProjectSettings>) => {
    setDraft((prev) => {
      let next = updateSettingsInDraft(prev, patch);
      if (patch.narrator !== undefined) {
        const narrator = getNarrator(patch.narrator);
        next = updateSettingsInDraft(next, {
          voice: narrator.backendVoice,
        });
        next = {
          ...next,
          beats: next.beats.map((beat) => ({
            ...beat,
            audio_params: {
              ...beat.audio_params,
              speaker: narrator.backendSpeaker,
            },
          })),
        };
      }
      if (patch.visual_style !== undefined) {
        const skip = skipImageToVideoFromVisualStyle(patch.visual_style);
        next = updateSettingsInDraft(next, { skip_image_to_video: skip });
        next = {
          ...next,
          beats: next.beats.map((beat) => applyVisualStyleToBeat(beat, patch.visual_style as VisualStyle)),
        };
      }
      return next;
    });
  }, []);

  const updateBeat = useCallback((beatIndex: number, patch: Partial<BeatDraft>) => {
    setDraft((prev) =>
      updateBeatInDraft(prev, beatIndex, (beat) => {
        let nextBeat: BeatDraft = {
          ...beat,
          ...patch,
          audio_params: patch.audio_params ? { ...beat.audio_params, ...patch.audio_params } : beat.audio_params,
          composition: patch.composition ? { ...beat.composition, ...patch.composition } : beat.composition,
        };
        if (patch.visual_style !== undefined) {
          nextBeat = applyVisualStyleToBeat(nextBeat, patch.visual_style);
        }
        return nextBeat;
      }),
    );
  }, []);

  const updateBeatAudioParam = useCallback(
    (beatIndex: number, key: keyof BeatAudioParams, value: string) => {
      setDraft((prev) =>
        updateBeatInDraft(prev, beatIndex, (beat) => ({
          ...beat,
          audio_params: { ...beat.audio_params, [key]: value },
        })),
      );
    },
    [],
  );

  const updateBeatCompositionParam = useCallback(
    (beatIndex: number, key: keyof BeatCompositionParams, value: string) => {
      setDraft((prev) =>
        updateBeatInDraft(prev, beatIndex, (beat) => ({
          ...beat,
          composition: { ...beat.composition, [key]: value },
        })),
      );
    },
    [],
  );

  return {
    draft,
    activeBeatIndex,
    setActiveBeatIndex,
    setBeatCount,
    updateSettings,
    updateBeat,
    updateBeatAudioParam,
    updateBeatCompositionParam,
  };
}
