import { STUDIO_CONFIG, clampBeatCount } from "../constants/studio";
import { DEFAULT_PROJECT_SETTINGS, createBeatDraft } from "../constants/parameters";
import type { BeatDraft, MovieProjectDraft, ProjectSettings, VisualStyle } from "../types/project";

export function resizeBeats(current: BeatDraft[], beatCount: number, visualStyle: VisualStyle = "image"): BeatDraft[] {
  const nextCount = clampBeatCount(beatCount);
  if (current.length === nextCount) {
    return current.map((beat, idx) => ({
      ...beat,
      index: idx + 1,
    }));
  }

  const next: BeatDraft[] = [];
  for (let i = 1; i <= nextCount; i += 1) {
    const existing = current[i - 1];
    next.push(
      existing
        ? {
            ...existing,
            index: i,
            composition: {
              ...existing.composition,
              transition_in:
                existing.composition.transition_in || (i === 1 ? "fade in" : "cut"),
              transition_out:
                existing.composition.transition_out || (i === nextCount ? "fade out" : "cut"),
            },
          }
        : createBeatDraft(i, nextCount, visualStyle),
    );
  }
  return next;
}

export function createInitialDraft(beatCount = STUDIO_CONFIG.defaultBeats): MovieProjectDraft {
  const count = clampBeatCount(beatCount);
  const visualStyle = DEFAULT_PROJECT_SETTINGS.visual_style;
  return {
    beatCount: count,
    beats: resizeBeats([], count, visualStyle),
    settings: {
      ...DEFAULT_PROJECT_SETTINGS,
      duration: count * STUDIO_CONFIG.secondsPerBeat,
    },
  };
}

export function updateBeatInDraft(
  draft: MovieProjectDraft,
  beatIndex: number,
  updater: (beat: BeatDraft) => BeatDraft,
): MovieProjectDraft {
  return {
    ...draft,
    beats: draft.beats.map((beat) => (beat.index === beatIndex ? updater(beat) : beat)),
  };
}

export function updateSettingsInDraft(
  draft: MovieProjectDraft,
  patch: Partial<ProjectSettings>,
): MovieProjectDraft {
  return {
    ...draft,
    settings: { ...draft.settings, ...patch },
  };
}
