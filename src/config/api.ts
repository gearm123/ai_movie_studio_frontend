/** Backend base URL, no trailing slash. Set in `.env` / Netlify as VITE_API_BASE_URL */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (base?.trim()) {
    return base.trim().replace(/\/$/, "");
  }
  return "";
}

export function getApiKey(): string {
  return (import.meta.env.VITE_BACKEND_API_KEY as string | undefined)?.trim() ?? "";
}

export function isProductionBuild(): boolean {
  return import.meta.env.PROD;
}

export function isBackendUrlConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}

export const NETLIFY_BACKEND_SETUP_HINT =
  "Netlify → Environment variables: VITE_API_BASE_URL must match your Render URL (https://…onrender.com, no trailing slash). UI vars override netlify.toml. Set VITE_BACKEND_API_KEY = Render API_KEY. Render: CORS_ORIGINS = this page origin exactly. Redeploy both after changes.";
