import type { StudioConfig } from "../types/project";

export const STUDIO_CONFIG: StudioConfig = {
  minBeats: 2,
  maxBeats: 12,
  defaultBeats: 4,
  secondsPerBeat: 4,
};

export function clampBeatCount(value: number, config: StudioConfig = STUDIO_CONFIG): number {
  return Math.min(config.maxBeats, Math.max(config.minBeats, Math.round(value)));
}

export function estimateDurationSeconds(beatCount: number, config: StudioConfig = STUDIO_CONFIG): number {
  return beatCount * config.secondsPerBeat;
}
