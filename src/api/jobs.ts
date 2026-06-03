import { apiFetch } from "./client";
import { apiUrl, getApiKey } from "../config/api";
import type { HealthResponse, JobCreateRequest, JobCreateResponse, JobRecord } from "./types";

/** Public endpoint — no API key (avoids CORS preflight on the connection check). */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(apiUrl("/health"));
  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`);
  }
  return response.json() as Promise<HealthResponse>;
}

export async function createJob(request: JobCreateRequest): Promise<JobRecord> {
  const response = await apiFetch("/api/v1/jobs", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const payload = (await response.json()) as JobCreateResponse;
  return payload.job;
}

export async function getJob(jobId: string): Promise<JobRecord> {
  const response = await apiFetch(`/api/v1/jobs/${jobId}`);
  return response.json() as Promise<JobRecord>;
}

export async function getJobLog(jobId: string): Promise<string> {
  const response = await apiFetch(`/api/v1/jobs/${jobId}/log`);
  return response.text();
}

export function jobVideoUrl(jobId: string): string {
  return apiUrl(`/api/v1/jobs/${jobId}/video`);
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
