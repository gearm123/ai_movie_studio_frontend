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

/** Netlify builds must set VITE_API_BASE_URL or requests hit the static site (404), not Render. */
export function isBackendUrlConfigured(): boolean {
  if (!isProductionBuild()) {
    return true;
  }
  return Boolean(getApiBaseUrl());
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const NETLIFY_BACKEND_SETUP_HINT =
  "In Netlify → Site configuration → Environment variables, set VITE_API_BASE_URL to your Render URL (e.g. https://ai-movie-studio-api.onrender.com) and VITE_BACKEND_API_KEY to match Render BACKEND_API_KEY, then trigger a new deploy.";
