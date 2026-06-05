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
  "Netlify: VITE_API_BASE_URL=https://ai-history-api.onrender.com · VITE_BACKEND_API_KEY = Render API_KEY. Render: CORS_ORIGINS = your Netlify origin (e.g. https://gearmstudio.netlify.app). Redeploy both.";
