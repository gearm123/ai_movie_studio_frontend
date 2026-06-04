import type { BackendConnectionState } from "../hooks/useBackendConnection";
import { getApiBaseUrl } from "../config/api";
import "./BackendConnectionBanner.css";

interface BackendConnectionBannerProps {
  connection: BackendConnectionState;
}

export function BackendConnectionBanner({ connection }: BackendConnectionBannerProps) {
  if (connection.status === "checking") {
    return (
      <div className="backend-banner backend-banner--checking" role="status">
        Checking connection to video server…
      </div>
    );
  }

  if (connection.status === "connected") {
    return (
      <div className="backend-banner backend-banner--ok" role="status">
        Connected to backend
        {getApiBaseUrl() ? (
          <span className="backend-banner__url"> · {getApiBaseUrl()}</span>
        ) : null}
        {connection.authRequired ? " · API key required for jobs" : null}
      </div>
    );
  }

  const message =
    connection.status === "misconfigured" || connection.status === "error"
      ? connection.message
      : "";
  const details = connection.status === "error" ? connection.details : undefined;

  return (
    <div className="backend-banner backend-banner--error" role="alert">
      <strong>Backend not reachable</strong>
      <p className="backend-banner__summary">{message}</p>
      {details ? (
        <>
          <p className="backend-banner__hint">
            Full report is also in DevTools → <strong>Console</strong> (filter: AI Movie Studio).
          </p>
          <pre className="backend-banner__details">{details}</pre>
        </>
      ) : null}
    </div>
  );
}
