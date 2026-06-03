import { apiUrl, getApiKey } from "../config/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const key = getApiKey();
  if (key) {
    headers.set("X-API-Key", key);
  }
  const response = await fetch(apiUrl(path), { ...init, headers });
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        detail = payload.detail;
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(response.status, detail);
  }
  return response;
}
