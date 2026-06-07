import { useCallback, useState } from "react";
import { clampBeatCount } from "../constants/studio";
import { applyVisualStyleToBeat } from "../constants/parameters";
import { createInitialDraft, resizeBeats, updateBeatInDraft, updateSettingsInDraft } from "../utils/beats";
import type { BeatAudioParams, BeatCompositionParams, BeatDraft, MovieProjectDraft, ProjectSettings, VisualStyle } from "../types/project";

const CUSTOM_TEMPLATE_BEAT_COUNT = 8;

export function useProjectDraft(initial?: MovieProjectDraft) {
  const [draft, setDraft] = useState<MovieProjectDraft>(initial ?? createInitialDraft());

  const setBeatCount = useCallback((beatCount: number) => {
    const count = clampBeatCount(beatCount);
    setDraft((prev) => {
      const beats = resizeBeats(prev.beats, count, prev.settings.visual_style);
      return {
        ...prev,
        beatCount: count,
        beats,
      };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<ProjectSettings>) => {
    setDraft((prev) => {
      let next = updateSettingsInDraft(prev, patch);

      if (patch.visual_style !== undefined) {
        const visualStyle = patch.visual_style as VisualStyle;
        next = {
          ...next,
          beats: next.beats.map((beat) => applyVisualStyleToBeat(beat, visualStyle)),
        };

        if (visualStyle === "custom" && prev.settings.visual_style !== "custom") {
          const count = clampBeatCount(CUSTOM_TEMPLATE_BEAT_COUNT);
          next = {
            ...next,
            beatCount: count,
            beats: resizeBeats(next.beats, count, visualStyle),
          };
        }
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

  const updateBeatVisual = useCallback((beatIndex: number, file: File | null) => {
    setDraft((prev) =>
      updateBeatInDraft(prev, beatIndex, (beat) => {
        if (beat.custom_visual_url) {
          URL.revokeObjectURL(beat.custom_visual_url);
        }
        return {
          ...beat,
          custom_visual_url: file ? URL.createObjectURL(file) : null,
          custom_visual_name: file?.name ?? null,
        };
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

  const updateBeatText = useCallback((beatIndex: number, text: string) => {
    updateBeat(beatIndex, { narration: text });
  }, [updateBeat]);

  const updateBeatVoiceReferenceTone = useCallback((beatIndex: number, tone: string) => {
    updateBeat(beatIndex, { voice_reference_tone: tone });
  }, [updateBeat]);

  return {
    draft,
    setBeatCount,
    updateSettings,
    updateBeat,
    updateBeatText,
    updateBeatVoiceReferenceTone,
    updateBeatVisual,
    updateBeatAudioParam,
    updateBeatCompositionParam,
  };
}

