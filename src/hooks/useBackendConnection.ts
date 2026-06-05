import { useEffect, useState } from "react";
import { checkHealth, HealthCheckError } from "../api/jobs";
import { isBackendUrlConfigured, NETLIFY_BACKEND_SETUP_HINT } from "../config/api";

export type BackendConnectionState =
  | { status: "checking" }
  | { status: "misconfigured"; message: string }
  | { status: "connected"; service: string; authRequired: boolean }
  | { status: "error"; message: string; details: string };

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
            message: `VITE_API_BASE_URL is not set for this build. ${NETLIFY_BACKEND_SETUP_HINT}`,
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
            service: health.service ?? "ai-history-backend",
            authRequired: health.auth_required ?? false,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof HealthCheckError ? err.message : err instanceof Error ? err.message : "Unknown error";
          setConnection({
            status: "error",
            message,
            details: NETLIFY_BACKEND_SETUP_HINT,
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
