import { useEffect, useState } from "react";
import { checkHealth, HealthCheckError } from "../api/jobs";
import { isBackendUrlConfigured } from "../config/api";
import { formatReportText } from "../utils/backendConnectionReport";

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
            message:
              "VITE_API_BASE_URL is not set for this build. Netlify → Environment variables → set it to your Render URL → Deploy site.",
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
          if (err instanceof HealthCheckError) {
            setConnection({
              status: "error",
              message: err.report.summary,
              details: formatReportText(err.report),
            });
            return;
          }
          const detail = err instanceof Error ? err.message : "Unknown error";
          setConnection({
            status: "error",
            message: detail,
            details: "Open DevTools → Console for more. Full report is logged when the health check runs.",
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
