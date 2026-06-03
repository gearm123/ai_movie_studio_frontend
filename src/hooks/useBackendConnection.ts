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
          setConnection({
            status: "error",
            message: `Cannot reach the backend at ${getApiBaseUrl()}. (${detail}) Open ${getApiBaseUrl()}/health in a new tab and wait until JSON appears (Render free tier may take ~60s to wake). On Render, set CORS_ORIGINS to include exactly ${origin} (comma-separated if you use multiple domains), then redeploy.`,
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
