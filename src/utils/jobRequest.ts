import { getNarrator, skipImageToVideoFromVisualStyle } from "../constants/parameters";
import type { JobCreateRequest } from "../api/types";
import type { MovieProjectDraft } from "../types/project";

export function draftToJobRequest(draft: MovieProjectDraft): JobCreateRequest {
  const narrator = getNarrator(draft.settings.narrator);
  const beats = draft.beats
    .filter((beat) => beat.narration.trim())
    .map((beat) => ({
      index: beat.index,
      narration: beat.narration.trim(),
    }));

  const request: JobCreateRequest = {
    topic: draft.settings.topic.trim(),
    pipeline_mode: "full",
    duration: draft.settings.duration,
    mode: draft.settings.mode,
    style_preset: draft.settings.style_preset,
    voice: draft.settings.voice || narrator.backendVoice,
    brand_show: draft.settings.brand_show,
    to_be_continued: draft.settings.to_be_continued,
    israel_war_hero: draft.settings.israel_war_hero,
    interpolate: draft.settings.interpolate,
    skip_image_to_video: skipImageToVideoFromVisualStyle(draft.settings.visual_style),
  };

  if (beats.length > 0) {
    request.beats = beats;
  }

  if (!request.skip_image_to_video) {
    request.enable_image_to_video = true;
  }

  return request;
}

export function validateDraftForJob(draft: MovieProjectDraft): string | null {
  if (!draft.settings.topic.trim()) {
    return "Enter a topic / figure on the setup page (e.g. my_mysteriosgrandfather).";
  }
  const filled = draft.beats.filter((beat) => beat.narration.trim()).length;
  if (filled === 0) {
    return "Add narration text for at least one beat.";
  }
  return null;
}
