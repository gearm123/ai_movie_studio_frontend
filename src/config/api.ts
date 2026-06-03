/**
 * Empty → same-origin `/api` and `/health` (Vite proxy locally, Netlify proxy in production).
 * Set VITE_API_BASE_URL only if you intentionally call Render directly (requires CORS_ORIGINS).
 */
export function getApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export function getApiKey(): string {
  return (import.meta.env.VITE_BACKEND_API_KEY as string | undefined)?.trim() ?? "";
}

export function isProductionBuild(): boolean {
  return import.meta.env.PROD;
}

/** Production uses netlify.toml proxy when VITE_API_BASE_URL is unset. */
export function isBackendUrlConfigured(): boolean {
  return true;
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const NETLIFY_BACKEND_SETUP_HINT =
  "In Netlify → Environment variables: set VITE_BACKEND_API_KEY to match Render BACKEND_API_KEY. Leave VITE_API_BASE_URL unset (delete it if present) so /api and /health proxy via netlify.toml. Then redeploy.";
