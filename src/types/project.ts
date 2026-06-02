export interface MovieProjectDraft {
  /** Number of story beats / shots in the movie. */
  beatCount: number;
}

export interface StudioConfig {
  minBeats: number;
  maxBeats: number;
  defaultBeats: number;
  /** Rough seconds per beat for duration preview in the UI. */
  secondsPerBeat: number;
}
