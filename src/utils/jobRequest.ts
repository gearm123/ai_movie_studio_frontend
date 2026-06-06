import { isBundledCustomTopic, visualPathFromVisualStyle } from "../constants/parameters";
import type { JobCreateRequest } from "../api/types";
import type { MovieProjectDraft } from "../types/project";

export function draftToJobRequest(draft: MovieProjectDraft): JobCreateRequest {
  const { visual_style } = draft.settings;
  const visualPath = visualPathFromVisualStyle(visual_style);

  const request: JobCreateRequest = {
    topic: draft.settings.topic.trim(),
    duration: draft.settings.duration,
    mode: draft.settings.mode,
    style_preset: draft.settings.style_preset,
    voice: draft.settings.voice || "auto",
    realistic: true,
    cartoon: false,
    cartoon_network: false,
    disney: false,
    debug: false,
    brand_show: draft.settings.brand_show,
    to_be_continued: draft.settings.to_be_continued,
    israel_war_hero: draft.settings.israel_war_hero,
    interpolate: draft.settings.interpolate,
    visualpath_blueprint: visualPath,
    prefer_text_to_video: visual_style === "animation",
    skip_image_to_video: visual_style !== "animation",
  };

  return request;
}

export function validateDraftForJob(draft: MovieProjectDraft): string | null {
  const topic = draft.settings.topic.trim();
  if (!topic) {
    return "Enter a historical figure or topic on the setup page (e.g. ragnar or my_mysteriosgrandfather).";
  }

  if (draft.settings.visual_style === "custom" && !isBundledCustomTopic(topic)) {
    const missingVisuals = draft.beats.filter((beat) => !beat.custom_visual_url).length;
    if (missingVisuals > 0) {
      return `Custom templates need a still image for every beat (${missingVisuals} missing). Bundled figures like my_mysteriosgrandfather use server-side assets and do not require uploads here.`;
    }
  }

  return null;
}
