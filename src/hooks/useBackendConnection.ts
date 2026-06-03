import { useEffect, useState } from "react";
import { checkHealth } from "../api/jobs";
import { NETLIFY_BACKEND_SETUP_HINT, getApiBaseUrl, isBackendUrlConfigured } from "../config/api";

export type BackendConnectionState =
  | { status: "checking" }
  | { status: "misconfigured"; message: string }
  | { status: "connected"; service: string; authRequired: boolean }
  | { status: "error"; message: string };

export function useBackendConnection(enabled: boolean) {
  const [connection, setConnection] = useState<BackendConnectionState>({ status: "checking" });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    async function run() {
      if (!isBackendUrlConfigured()) {
        if (!cancelled) {
          setConnection({
            status: "misconfigured",
            message: `Backend URL is not set for this site build. ${NETLIFY_BACKEND_SETUP_HINT}`,
          });
        }
        return;
      }

      setConnection({ status: "checking" });
      try {
        const health = await checkHealth();
        if (!cancelled) {
          setConnection({
            status: "connected",
            service: health.service,
            authRequired: health.auth_required,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const origin =
            typeof window !== "undefined" && window.location?.origin
              ? window.location.origin
              : "your site URL";
          const detail = err instanceof Error ? err.message : "Unknown error";
          const healthUrl = getApiBaseUrl() ? `${getApiBaseUrl()}/health` : `${origin}/health`;
          setConnection({
            status: "error",
            message: `Cannot reach the backend. (${detail}) Open ${healthUrl} in a new tab and wait for JSON (Render may take ~60s on first request). If you set VITE_API_BASE_URL on Netlify, remove it and redeploy so traffic uses the Netlify proxy instead of cross-origin calls to Render.`,
          });
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return connection;
}
