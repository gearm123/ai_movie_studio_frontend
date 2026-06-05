import type { JobCreateRequest, JobRecord, JobStatus } from "./types";

/** Raw job payload accepted by ai-history-api (FastAPI CreateJobRequest). */
export type BackendJobCreateRequest = {
  topic: string;
  duration?: number;
  mode?: string;
  style_preset?: string;
  voice?: string;
  music?: string | null;
  enable_image_to_video?: boolean;
  skip_image_to_video?: boolean;
  realistic?: boolean;
  cartoon?: boolean;
  cartoon_network?: boolean;
  cartoon_style?: string | null;
  disney?: boolean;
  debug?: boolean;
  brand_show?: boolean;
  event_blueprint?: string | null;
  visualpath_blueprint?: string | null;
  prefer_text_to_video?: boolean;
  israel_war_hero?: boolean;
  to_be_continued?: boolean;
  interpolate?: boolean;
};

type BackendJobProgress = {
  stage?: string | null;
  detail?: string | null;
  fraction?: number | null;
};

export type BackendJobResponse = {
  id: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  request: BackendJobCreateRequest;
  progress?: BackendJobProgress | null;
  error?: string | null;
  final_video_path?: string | null;
  project_dir?: string | null;
  worker_compute?: string | null;
  video_url?: string | null;
};

export const API_V1_PREFIX = "/v1";

export function normalizeJobStatus(status: BackendJobResponse["status"]): JobStatus {
  if (status === "completed") {
    return "succeeded";
  }
  if (status === "cancelled") {
    return "failed";
  }
  return status;
}

export function toBackendJobRequest(request: JobCreateRequest): BackendJobCreateRequest {
  return {
    topic: request.topic,
    duration: request.duration,
    mode: request.mode,
    style_preset: request.style_preset,
    voice: request.voice,
    music: request.music,
    enable_image_to_video: request.enable_image_to_video ?? undefined,
    skip_image_to_video: request.skip_image_to_video ?? undefined,
    realistic: request.realistic,
    cartoon: request.cartoon,
    cartoon_network: request.cartoon_network,
    cartoon_style: request.cartoon_style,
    disney: request.disney,
    debug: request.debug,
    brand_show: request.brand_show,
    event_blueprint: request.event_blueprint,
    visualpath_blueprint: request.visualpath_blueprint,
    prefer_text_to_video: request.prefer_text_to_video,
    israel_war_hero: request.israel_war_hero,
    to_be_continued: request.to_be_continued,
    interpolate: request.interpolate,
  };
}

export function normalizeJobRecord(raw: BackendJobResponse): JobRecord {
  return {
    id: raw.id,
    status: normalizeJobStatus(raw.status),
    request: {
      topic: raw.request.topic,
      duration: raw.request.duration,
      mode: raw.request.mode,
      style_preset: raw.request.style_preset,
      voice: raw.request.voice,
      skip_image_to_video: raw.request.skip_image_to_video,
      enable_image_to_video: raw.request.enable_image_to_video,
      brand_show: raw.request.brand_show,
      to_be_continued: raw.request.to_be_continued,
      israel_war_hero: raw.request.israel_war_hero,
      interpolate: raw.request.interpolate,
    },
    argv: [],
    created_at: raw.created_at,
    started_at: raw.status === "running" ? raw.updated_at : null,
    finished_at:
      raw.status === "completed" || raw.status === "failed" ? raw.updated_at : null,
    error: raw.error ?? null,
    output_video_path: raw.final_video_path ?? null,
    project_dir: raw.project_dir ?? null,
    progress: raw.progress ?? null,
    video_url: raw.video_url ?? null,
  };
}
