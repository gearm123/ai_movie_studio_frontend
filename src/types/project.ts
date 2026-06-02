/** Per-beat visual mode: still image or animated video (maps to SKIP_IMAGE_TO_VIDEO / visual_delivery). */
export type VisualStyle = "image" | "video";

/** Mirrors backend planner `audio_params` keys (planner.py). */
export interface BeatAudioParams {
  speaker: string;
  tone: string;
  delivery: string;
  cadence: string;
  pauses: string;
  energy: string;
  /** Empty string or numeric seconds (0–0.45). */
  clause_pause_sec: string;
}

/** Mirrors backend per-beat composition `params` + Shot fields used at compose time. */
export interface BeatCompositionParams {
  motion_prompt: string;
  transition_in: string;
  transition_out: string;
  emphasis_text: string;
  visual_asset: string;
  visual_delivery: string;
}

export interface BeatDraft {
  index: number;
  duration: number;
  /** Spoken script — backend field `narration` (planner: `audio_prompt`). */
  narration: string;
  visual_prompt: string;
  audio_params: BeatAudioParams;
  voice_reference_tone: string;
  /** Still frame or animated clip for this beat. */
  visual_style: VisualStyle;
  composition: BeatCompositionParams;
}

export interface ProjectSettings {
  topic: string;
  style_preset: string;
  mode: "tiktok" | "youtube_shorts";
  duration: number;
  /** UI narrator key — maps to backend voice id when submitted. */
  narrator: string;
  /** Backend CLI `--voice` (kept in sync with narrator). */
  voice: string;
  delivery_profile: "cinematic_suspense" | "neutral";
  brand_show: boolean;
  to_be_continued: boolean;
  israel_war_hero: boolean;
  /** Default visual mode for beats — image = stills, video = animation (SVD/I2V). */
  visual_style: VisualStyle;
  /** Backend: true when visual_style is image (SKIP_IMAGE_TO_VIDEO=1). */
  skip_image_to_video: boolean;
  interpolate: boolean;
}

export interface MovieProjectDraft {
  beatCount: number;
  beats: BeatDraft[];
  settings: ProjectSettings;
}

export interface StudioConfig {
  minBeats: number;
  maxBeats: number;
  defaultBeats: number;
  secondsPerBeat: number;
}

export type BeatFieldPath =
  | "narration"
  | "visual_prompt"
  | "duration"
  | "voice_reference_tone"
  | `audio_params.${keyof BeatAudioParams}`
  | `composition.${keyof BeatCompositionParams}`;
