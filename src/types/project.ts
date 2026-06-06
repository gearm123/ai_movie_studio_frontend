/** Whole-movie visual pipeline — maps to backend visualpath_blueprint. */
export type VisualStyle = "still" | "animation" | "custom";

export type VisualPathBlueprint = "text_to_image" | "text_to_video" | "static_images";

/** Whole-movie blueprint category — extend as backend adds pipelines. */
export type MovieType = "figure_blueprint";

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
  /** Mirrors project visual_style for per-beat preview. */
  visual_style: VisualStyle;
  /** Local preview URL when the user picks a custom still (object URL). */
  custom_visual_url?: string | null;
  custom_visual_name?: string | null;
  composition: BeatCompositionParams;
}

export interface ProjectSettings {
  /** Blueprint category for the whole movie (maps to backend pipeline family). */
  movie_type: MovieType;
  topic: string;
  style_preset: string;
  mode: "tiktok" | "youtube_shorts";
  duration: number;
  /** Backend CLI `--voice`. */
  voice: string;
  delivery_profile: "cinematic_suspense" | "neutral";
  brand_show: boolean;
  to_be_continued: boolean;
  israel_war_hero: boolean;
  /** still → text_to_image, animation → text_to_video, custom → static_images. */
  visual_style: VisualStyle;
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
