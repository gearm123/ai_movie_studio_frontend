import { getNarrator, skipImageToVideoFromVisualStyle } from "../constants/parameters";
import type { JobCreateRequest } from "../api/types";
import type { MovieProjectDraft } from "../types/project";

export function draftToJobRequest(draft: MovieProjectDraft): JobCreateRequest {
  const narrator = getNarrator(draft.settings.narrator);
  const skipImageToVideo = skipImageToVideoFromVisualStyle(draft.settings.visual_style);

  const request: JobCreateRequest = {
    topic: draft.settings.topic.trim(),
    duration: draft.settings.duration,
    mode: draft.settings.mode,
    style_preset: draft.settings.style_preset,
    voice: draft.settings.voice || narrator.backendVoice,
    realistic: true,
    cartoon: false,
    cartoon_network: false,
    disney: false,
    debug: false,
    brand_show: draft.settings.brand_show,
    to_be_continued: draft.settings.to_be_continued,
    israel_war_hero: draft.settings.israel_war_hero,
    interpolate: draft.settings.interpolate,
    skip_image_to_video: skipImageToVideo,
  };

  if (!skipImageToVideo) {
    request.enable_image_to_video = true;
  }

  return request;
}

export function validateDraftForJob(draft: MovieProjectDraft): string | null {
  if (!draft.settings.topic.trim()) {
    return "Enter a topic / figure on the setup page (e.g. my_mysteriosgrandfather).";
  }
  return null;
}
