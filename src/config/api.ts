/** Empty in dev → same-origin `/api` (Vite proxy). Set on Netlify to your Render backend URL. */
export function getApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export function getApiKey(): string {
  return (import.meta.env.VITE_BACKEND_API_KEY as string | undefined)?.trim() ?? "";
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
