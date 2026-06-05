export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export interface JobProgress {
  stage?: string | null;
  detail?: string | null;
  fraction?: number | null;
}

/** Fields sent to ai-history-api POST /v1/jobs (CreateJobRequest). */
export interface JobCreateRequest {
  topic: string;
  duration?: number;
  mode?: string;
  style_preset?: string;
  voice?: string | null;
  music?: string | null;
  skip_image_to_video?: boolean;
  enable_image_to_video?: boolean;
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
  progress?: JobProgress | null;
  video_url?: string | null;
}
