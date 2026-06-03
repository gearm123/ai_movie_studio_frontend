export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type PipelineMode =
  | "full"
  | "synthesize-composition"
  | "synthesize-video"
  | "synthesize-audio"
  | "synthesize-animation"
  | "regenerate-audio-only"
  | "regenerate-video-only"
  | "debug-compose";

export interface BeatScriptPayload {
  index: number;
  narration: string;
}

export interface JobCreateRequest {
  topic: string;
  pipeline_mode?: PipelineMode;
  duration?: number;
  mode?: string;
  style_preset?: string;
  skip_image_to_video?: boolean | null;
  enable_image_to_video?: boolean | null;
  brand_show?: boolean;
  to_be_continued?: boolean;
  israel_war_hero?: boolean;
  interpolate?: boolean;
  voice?: string | null;
  beats?: BeatScriptPayload[] | null;
}

export interface JobRecord {
  id: string;
  status: JobStatus;
  request: JobCreateRequest;
  argv: string[];
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  exit_code?: number | null;
  error?: string | null;
  log_path?: string | null;
  output_video_path?: string | null;
  project_dir?: string | null;
}

export interface JobCreateResponse {
  job: JobRecord;
}

export interface HealthResponse {
  status: string;
  service: string;
  auth_required: boolean;
}
