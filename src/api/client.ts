import {
  NETLIFY_BACKEND_SETUP_HINT,
  apiUrl,
  getApiBaseUrl,
  getApiKey,
  isBackendUrlConfigured,
  isProductionBuild,
} from "../config/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function misconfiguredMessage(status: number): string | null {
  if (isProductionBuild() && !isBackendUrlConfigured()) {
    return `Backend URL is not configured for this Netlify build. ${NETLIFY_BACKEND_SETUP_HINT}`;
  }
  if (isProductionBuild() && status === 404) {
    return `Backend returned 404. Check VITE_API_BASE_URL (currently “${getApiBaseUrl() || "not set"}”). ${NETLIFY_BACKEND_SETUP_HINT}`;
  }
  if (status === 401) {
    return "Invalid or missing API key. Set VITE_BACKEND_API_KEY on Netlify to match BACKEND_API_KEY on Render, then redeploy.";
  }
  return null;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (isProductionBuild() && !isBackendUrlConfigured()) {
    throw new ApiError(0, misconfiguredMessage(0) ?? "Backend URL not configured.");
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const key = getApiKey();
  if (key) {
    headers.set("X-API-Key", key);
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), { ...init, headers });
  } catch (cause) {
    const hint = isProductionBuild()
      ? `Cannot reach the API at ${getApiBaseUrl() || "(not set)"}. Add this page origin to CORS_ORIGINS on Render; confirm VITE_API_BASE_URL on Netlify.`
      : "Cannot reach the API. Start the backend locally and run npm run dev (Vite proxy).";
    throw new ApiError(0, cause instanceof Error ? `${hint} (${cause.message})` : hint);
  }

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
    const configured = misconfiguredMessage(response.status);
    throw new ApiError(response.status, configured ?? detail);
  }
  return response;
}
