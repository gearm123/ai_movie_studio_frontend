import { apiFetch } from "./client";
import { getApiBaseUrl, getApiKey } from "../config/api";
import {
  API_V1_PREFIX,
  isAiHistoryHealth,
  normalizeJobRecord,
  toBackendJobRequest,
  type BackendHealthResponse,
  type BackendJobResponse,
} from "./aiHistoryBackend";
import type { HealthResponse, JobCreateRequest, JobRecord } from "./types";

export class HealthCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HealthCheckError";
  }
}

/** Public endpoint — no API key (same as translate-chat `fetchHealth`). */
export async function checkHealth(): Promise<HealthResponse> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new HealthCheckError("VITE_API_BASE_URL is not set");
  }
  const healthUrl = `${base}/health`;
  let response: Response;
  try {
    response = await fetch(healthUrl);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new HealthCheckError(`Could not reach ${healthUrl} (${detail})`);
  }
  if (!response.ok) {
    throw new HealthCheckError(`Health check failed: HTTP ${response.status} for ${healthUrl}`);
  }
  const data = (await response.json()) as BackendHealthResponse;
  if (!isAiHistoryHealth(data)) {
    throw new HealthCheckError("Unexpected /health response from this API URL.");
  }
  return {
    status: data.status,
    service: data.service ?? "ai-history-backend",
    service_mode: data.service_mode,
    worker_compute: data.worker_compute,
    auth_required: Boolean(getApiKey()),
  };
}

export async function createJob(request: JobCreateRequest): Promise<JobRecord> {
  const response = await apiFetch(`${API_V1_PREFIX}/jobs`, {
    method: "POST",
    body: JSON.stringify(toBackendJobRequest(request)),
  });
  const payload = (await response.json()) as BackendJobResponse;
  return normalizeJobRecord(payload);
}

export async function getJob(jobId: string): Promise<JobRecord> {
  const response = await apiFetch(`${API_V1_PREFIX}/jobs/${jobId}`);
  const payload = (await response.json()) as BackendJobResponse;
  return normalizeJobRecord(payload);
}

export async function getJobLog(jobId: string): Promise<string> {
  const response = await apiFetch(`${API_V1_PREFIX}/jobs/${jobId}/log`);
  return response.text();
}

export function jobVideoUrl(jobId: string): string {
  const base = getApiBaseUrl();
  const path = `${API_V1_PREFIX}/jobs/${jobId}/video`;
  return base ? `${base}${path}` : path;
}

/** Fetch MP4 with API key for in-browser playback (video src cannot send headers). */
export async function fetchJobVideoBlob(jobId: string): Promise<Blob> {
  const headers = new Headers();
  const key = getApiKey();
  if (key) {
    headers.set("X-API-Key", key);
  }
  const response = await fetch(jobVideoUrl(jobId), { headers });
  if (!response.ok) {
    throw new Error(`Video download failed (${response.status})`);
  }
  return response.blob();
}
