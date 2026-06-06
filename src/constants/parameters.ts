import type {
  BeatAudioParams,
  BeatCompositionParams,
  BeatDraft,
  ProjectSettings,
  VisualPathBlueprint,
  VisualStyle,
} from "../types/project";

export const NARRATION_VOICES = ["auto", "gary", "james", "jon", "laura"] as const;

export const VOICE_OPTIONS = [
  { key: "auto", label: "Auto (figure default)" },
  { key: "gary", label: "Gary" },
  { key: "james", label: "James" },
  { key: "jon", label: "Jon" },
  { key: "laura", label: "Laura" },
] as const;

/** Figure-video style presets (matches local CLI `--style-preset` for biographical shorts). */
export const FIGURE_STYLE_PRESETS = [
  { key: "tiktok_ai_history", title: "TikTok" },
  { key: "instagram_epictok", title: "Instagram Epictok" },
  { key: "pixels", title: "Kane Pixels" },
] as const;

/** Bundled custom templates with server-side stills (no AI visuals). */
export const SERVER_BUNDLED_CUSTOM_TOPICS = [
  "my_mysteriosgrandfather",
  "my_mysterious_grandfather",
  "my_mysteriousgrandfather",
] as const;

export function isBundledCustomTopic(topic: string): boolean {
  const normalized = topic.trim().toLowerCase().replace(/-/g, "_");
  return (SERVER_BUNDLED_CUSTOM_TOPICS as readonly string[]).includes(normalized);
}

/** Whole-movie types — add entries as backend pipelines ship. */
export const MOVIE_TYPES = [
  {
    key: "figure_blueprint" as const,
    label: "Figure video",
    description:
      "Biographical short about a historical figure. The backend plans beats from your topic, like the local CLI.",
  },
] as const;

export type MovieTypeKey = (typeof MOVIE_TYPES)[number]["key"];

export function getMovieType(key: string) {
  return MOVIE_TYPES.find((type) => type.key === key) ?? MOVIE_TYPES[0];
}

export const STYLE_PRESETS = [
  { key: "tiktok_ai_history", title: "TikTok AI History" },
  { key: "instagram_epictok", title: "Instagram Epictok" },
  { key: "pixels", title: "Kane Pixels" },
  { key: "translate_chat_promotion", title: "Translate Chat Promotion" },
  { key: "buffalomoneysend", title: "Buffalo Money Send" },
] as const;

export const OUTPUT_MODES = [
  { key: "tiktok", label: "TikTok (1080×1920)" },
  { key: "youtube_shorts", label: "YouTube Shorts (1080×1920)" },
] as const;

export const DELIVERY_PROFILES = [
  { key: "cinematic_suspense", label: "Cinematic suspense" },
  { key: "neutral", label: "Neutral" },
] as const;

export const TRANSITIONS = [
  "cut",
  "fade in",
  "fade out",
  "flash",
  "soft fade",
  "push-in",
  "blur",
  "no transition",
] as const;

export const VISUAL_DELIVERY_OPTIONS = ["", "still", "animation"] as const;

export const TRANSLATE_CHAT_VISUAL_ASSETS = [
  "problem",
  "inputs",
  "guidance",
  "config",
  "result",
  "problem_inputs",
  "guidance_config",
] as const;

export const BUFFALO_VISUAL_ASSETS = [
  "site_ui_initial",
  "site_ui_second",
  "site_ui_final",
] as const;

export const VOICE_REFERENCE_TONES = [
  { key: "", label: "Default (voice_clone_reference)" },
  { key: "authoritative", label: "Authoritative" },
  { key: "bright", label: "Bright" },
  { key: "calm", label: "Calm" },
  { key: "defiant", label: "Defiant" },
  { key: "fearful", label: "Fearful" },
  { key: "grave", label: "Grave" },
  { key: "heroic", label: "Heroic" },
  { key: "hopeful", label: "Hopeful" },
  { key: "mourning", label: "Mourning" },
  { key: "neutral", label: "Neutral" },
  { key: "resolute", label: "Resolute" },
  { key: "revelatory", label: "Revelatory" },
  { key: "reverent", label: "Reverent" },
  { key: "shocked", label: "Shocked" },
  { key: "silent_memorial", label: "Silent memorial (no narration)" },
  { key: "somber", label: "Somber" },
  { key: "suspenseful", label: "Suspenseful" },
  { key: "tense", label: "Tense" },
  { key: "triumphant", label: "Triumphant" },
  { key: "urgent", label: "Urgent" },
  { key: "warm", label: "Warm" },
] as const;

/** Matches backend `available_voice_reference_tones()` stems under assets/voice_references/. */
export const VOICE_REFERENCE_TONE_KEYS = VOICE_REFERENCE_TONES.map((tone) => tone.key).filter(
  Boolean,
) as string[];

export const TIKTOK_DEFAULT_AUDIO_PARAMS: BeatAudioParams = {
  speaker: "",
  tone: "clear",
  delivery: "cinematic",
  cadence: "measured",
  pauses: "steady",
  energy: "confident",
  clause_pause_sec: "",
};

export const AUDIO_PARAM_SUGGESTIONS: Record<keyof Omit<BeatAudioParams, "speaker" | "clause_pause_sec">, string[]> = {
  tone: ["clear", "suspenseful", "eerie", "authoritative"],
  delivery: ["cinematic", "bright", "documentary"],
  cadence: ["measured", "direct", "restrained", "urgent"],
  pauses: ["steady", "tight", "long", "dramatic"],
  energy: ["confident", "rising", "cold", "controlled", "intense"],
};

export const VISUAL_STYLE_OPTIONS = [
  {
    key: "still" as const,
    label: "Still image",
    description: "Text-to-image still per beat with narration (local: --visualpath-blueprint text_to_image).",
    backendVisualPath: "text_to_image" as VisualPathBlueprint,
    backendVisualDelivery: "still",
  },
  {
    key: "animation" as const,
    label: "Animation",
    description: "Native text-to-video clip per beat (local: --visualpath-blueprint text_to_video).",
    backendVisualPath: "text_to_video" as VisualPathBlueprint,
    backendVisualDelivery: "animation",
  },
  {
    key: "custom" as const,
    label: "Custom template",
    description:
      "Your own still per beat — no AI visuals. Example: my_mysteriosgrandfather with images under assets/zadey_visuals/<topic>/.",
    backendVisualPath: "static_images" as VisualPathBlueprint,
    backendVisualDelivery: "still",
  },
] as const;

export function visualPathFromVisualStyle(style: VisualStyle): VisualPathBlueprint {
  return getVisualStyleOption(style).backendVisualPath;
}

export function visualDeliveryFromVisualStyle(style: VisualStyle): string {
  return getVisualStyleOption(style).backendVisualDelivery;
}

export function getVisualStyleOption(style: VisualStyle) {
  return VISUAL_STYLE_OPTIONS.find((option) => option.key === style) ?? VISUAL_STYLE_OPTIONS[0];
}

export function applyVisualStyleToBeat(beat: BeatDraft, style: VisualStyle): BeatDraft {
  return {
    ...beat,
    visual_style: style,
    composition: {
      ...beat.composition,
      visual_delivery: visualDeliveryFromVisualStyle(style),
    },
  };
}

export const PUNCTUATION_MARKUP = [
  { tag: "[soft_pause]", seconds: 0.1 },
  { tag: "[tense_pause]", seconds: 0.18 },
  { tag: "[long_pause]", seconds: 0.3 },
  { tag: "[silence]", seconds: 0.48 },
] as const;

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  movie_type: "figure_blueprint",
  topic: "",
  style_preset: "tiktok_ai_history",
  mode: "tiktok",
  duration: 14,
  voice: "auto",
  delivery_profile: "cinematic_suspense",
  brand_show: false,
  to_be_continued: false,
  israel_war_hero: false,
  visual_style: "still",
  interpolate: false,
};

export function defaultTransitionIn(index: number): string {
  return index === 1 ? "fade in" : "cut";
}

export function defaultTransitionOut(index: number, total: number): string {
  return index === total ? "fade out" : "cut";
}

export function defaultCompositionParams(index: number, total: number): BeatCompositionParams {
  return {
    motion_prompt: "steady hold",
    transition_in: defaultTransitionIn(index),
    transition_out: defaultTransitionOut(index, total),
    emphasis_text: "",
    visual_asset: "",
    visual_delivery: "",
  };
}

export function createBeatDraft(index: number, total: number, visualStyle: VisualStyle = "still"): BeatDraft {
  return {
    index,
    duration: 4,
    narration: "",
    visual_prompt: "",
    audio_params: { ...TIKTOK_DEFAULT_AUDIO_PARAMS },
    voice_reference_tone: "",
    visual_style: visualStyle,
    custom_visual_url: null,
    custom_visual_name: null,
    composition: {
      ...defaultCompositionParams(index, total),
      visual_delivery: visualDeliveryFromVisualStyle(visualStyle),
    },
  };
}

export function isAssetPromoStyle(stylePreset: string): boolean {
  return stylePreset === "translate_chat_promotion" || stylePreset === "buffalomoneysend";
}

export function visualAssetOptions(stylePreset: string): readonly string[] {
  if (stylePreset === "buffalomoneysend") return BUFFALO_VISUAL_ASSETS;
  if (stylePreset === "translate_chat_promotion") return TRANSLATE_CHAT_VISUAL_ASSETS;
  return [];
}

export function styleLocksMotion(stylePreset: string): boolean {
  return stylePreset === "tiktok_ai_history";
}

export function stylePlannerControllableAudioKeys(stylePreset: string): (keyof BeatAudioParams)[] {
  if (
    stylePreset === "tiktok_ai_history" ||
    stylePreset === "translate_chat_promotion" ||
    stylePreset === "buffalomoneysend"
  ) {
    return ["clause_pause_sec"];
  }
  return [];
}

export function stylePlannerControllableCompositionKeys(stylePreset: string): (keyof BeatCompositionParams)[] {
  if (stylePreset === "translate_chat_promotion" || stylePreset === "buffalomoneysend") {
    return ["visual_asset", "visual_delivery"];
  }
  return [];
}
