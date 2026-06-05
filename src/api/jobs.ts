import { apiFetch } from "./client";
import { getApiBaseUrl, getApiKey } from "../config/api";
import {
  API_V1_PREFIX,
  normalizeJobRecord,
  toBackendJobRequest,
  type BackendJobResponse,
} from "./aiHistoryBackend";
import {
  logConnectionFailure,
  probeHealthConnection,
  type ConnectionFailureReport,
} from "../utils/backendConnectionReport";
import type { HealthResponse, JobCreateRequest, JobRecord } from "./types";

export class HealthCheckError extends Error {
  report: ConnectionFailureReport;

  constructor(report: ConnectionFailureReport) {
    super(report.summary);
    this.name = "HealthCheckError";
    this.report = report;
  }
}

/** Public endpoint — no API key. */
export async function checkHealth(): Promise<HealthResponse> {
  const result = await probeHealthConnection();
  if (result.ok === false) {
    logConnectionFailure(result.report);
    throw new HealthCheckError(result.report);
  }
  return result.data;
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
