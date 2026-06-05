import { apiFetch } from "./client";
import { getApiBaseUrl, getApiKey } from "../config/api";
import {
  API_V1_PREFIX,
  normalizeJobRecord,
  toBackendJobRequest,
  type BackendJobResponse,
} from "./aiHistoryBackend";
import type { JobCreateRequest, JobRecord } from "./types";

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
