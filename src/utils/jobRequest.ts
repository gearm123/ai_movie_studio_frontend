import {
  isBundledCustomTopic,
  isFigureBlueprintTemplateKey,
  visualPathFromVisualStyle,
} from "../constants/parameters";
import type { JobCreateRequest } from "../api/types";
import type { MovieProjectDraft, ProjectSettings } from "../types/project";

/**
 * Topic sent to the backend CLI positional arg.
 * Template mode → existing blueprint key (e.g. ragnar).
 * New figure mode → user-provided name (backend slugifies; blueprint creation follows).
 */
export function resolveJobTopic(settings: ProjectSettings): string {
  return settings.topic.trim();
}

export function validateSetupSettings(settings: ProjectSettings): string | null {
  const topic = resolveJobTopic(settings);
  if (!topic) {
    return settings.figure_source === "template"
      ? "Select a figure template."
      : "Enter a figure name.";
  }

  if (settings.figure_source === "template" && !isFigureBlueprintTemplateKey(topic)) {
    return "Select a valid figure template.";
  }

  return null;
}

export function draftToJobRequest(draft: MovieProjectDraft): JobCreateRequest {
  const { visual_style } = draft.settings;
  const visualPath = visualPathFromVisualStyle(visual_style);

  const request: JobCreateRequest = {
    topic: resolveJobTopic(draft.settings),
    duration: draft.settings.duration,
    mode: draft.settings.mode,
    style_preset: draft.settings.style_preset,
    voice:
      draft.settings.voice === "auto" || !draft.settings.voice.trim()
        ? "gary"
        : draft.settings.voice.trim(),
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

/** Equivalent local CLI argv (ai_history_realtime run …) for the setup choices. */
export function buildCliArgv(request: JobCreateRequest): string[] {
  const argv: string[] = [request.topic];

  if (request.duration != null) {
    argv.push("--duration", String(request.duration));
  }
  if (request.mode) {
    argv.push("--mode", request.mode);
  }
  if (request.style_preset) {
    argv.push("--style-preset", request.style_preset);
  }
  if (request.voice && request.voice !== "auto") {
    argv.push("--voice", request.voice);
  }
  if (request.visualpath_blueprint) {
    argv.push("--visualpath-blueprint", request.visualpath_blueprint);
  } else if (request.prefer_text_to_video) {
    argv.push("--text-to-video");
  }
  if (request.skip_image_to_video) {
    argv.push("--skip-image-to-video");
  } else if (request.enable_image_to_video) {
    argv.push("--enable-image-to-video");
  }
  if (request.brand_show) {
    argv.push("--brand-show");
  }
  if (request.to_be_continued) {
    argv.push("--to-be-continued");
  }
  if (request.israel_war_hero) {
    argv.push("--israel-war-hero");
  }
  if (request.interpolate) {
    argv.push("--interpolate");
  }

  return argv;
}

export function buildCliCommand(draft: MovieProjectDraft): string {
  const argv = buildCliArgv(draftToJobRequest(draft));
  return `ai_history_realtime ${argv.join(" ")}`;
}

export function validateDraftForJob(draft: MovieProjectDraft): string | null {
  const setupError = validateSetupSettings(draft.settings);
  if (setupError) {
    return setupError;
  }

  const topic = resolveJobTopic(draft.settings);

  if (draft.settings.visual_style === "custom" && !isBundledCustomTopic(topic)) {
    const missingVisuals = draft.beats.filter((beat) => !beat.custom_visual_url).length;
    if (missingVisuals > 0) {
      return `Upload one image for every beat (${missingVisuals} missing). You chose custom images on the setup page.`;
    }
  }

  return null;
}
