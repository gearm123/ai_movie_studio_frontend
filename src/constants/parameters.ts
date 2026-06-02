import type { BeatAudioParams, BeatCompositionParams, BeatDraft, ProjectSettings, VisualStyle } from "../types/project";

export const NARRATION_VOICES = ["", "gary", "james", "jon", "laura", "rose"] as const;

/** Project narrators — extend this list as you add clone references / voice ids. */
export const NARRATORS = [
  {
    key: "studio_default",
    label: "Studio narrator",
    description: "Coqui XTTS voice clone from voice_clone_reference.wav (default pipeline voice).",
    /** Maps to CLI `--voice` / NARRATION_VOICE_DEFAULT when wired to backend. */
    backendVoice: "gary",
    /** Maps to per-beat `audio_params.speaker` (empty = style default). */
    backendSpeaker: "",
  },
] as const;

export type NarratorKey = (typeof NARRATORS)[number]["key"];

export function getNarrator(key: string) {
  return NARRATORS.find((narrator) => narrator.key === key) ?? NARRATORS[0];
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
    key: "image" as const,
    label: "Image",
    description: "Each beat uses a still frame with narration (T2I → still MP4).",
    backendSkipImageToVideo: true,
    backendVisualDelivery: "still",
  },
  {
    key: "video" as const,
    label: "Video",
    description: "Each beat uses animation with narration (T2I → SVD / I2V).",
    backendSkipImageToVideo: false,
    backendVisualDelivery: "animation",
  },
] as const;

export function visualStyleFromSkipImageToVideo(skip: boolean): VisualStyle {
  return skip ? "image" : "video";
}

export function skipImageToVideoFromVisualStyle(style: VisualStyle): boolean {
  return style === "image";
}

export function visualDeliveryFromVisualStyle(style: VisualStyle): string {
  return style === "image" ? "still" : "animation";
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
  topic: "",
  style_preset: "tiktok_ai_history",
  mode: "tiktok",
  duration: 14,
  narrator: "studio_default",
  voice: "gary",
  delivery_profile: "cinematic_suspense",
  brand_show: false,
  to_be_continued: false,
  israel_war_hero: false,
  visual_style: "image",
  skip_image_to_video: true,
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

export function createBeatDraft(index: number, total: number, visualStyle: VisualStyle = "image"): BeatDraft {
  return {
    index,
    duration: 4,
    narration: "",
    visual_prompt: "",
    audio_params: { ...TIKTOK_DEFAULT_AUDIO_PARAMS },
    voice_reference_tone: "",
    visual_style: visualStyle,
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
