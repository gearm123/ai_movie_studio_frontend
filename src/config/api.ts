/** Empty in dev → same-origin `/api` (Vite proxy). Set on Netlify to your Render backend URL. */
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

/**
 * Production: empty VITE_API_BASE_URL uses netlify.toml proxy (/api, /health on same host).
 * Set VITE_API_BASE_URL only for direct cross-origin calls to Render.
 */
export function isBackendUrlConfigured(): boolean {
  return true;
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const NETLIFY_BACKEND_SETUP_HINT =
  "In Netlify → Environment variables: set VITE_BACKEND_API_KEY (matches Render). Leave VITE_API_BASE_URL unset so /api and /health use the Netlify proxy in netlify.toml. Then redeploy.";
