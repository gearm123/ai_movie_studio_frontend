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

  if (connection.status === "misconfigured") {
    return (
      <div className="backend-banner backend-banner--error" role="alert">
        <strong>Backend URL not configured</strong>
        <p className="backend-banner__summary">{connection.message}</p>
      </div>
    );
  }

  return (
    <div className="backend-banner backend-banner--checking" role="status">
      <strong>Backend check skipped or failed</strong>
      <p className="backend-banner__summary">
        {connection.message} — translate-chat does not run /health from the browser; you can still
        try Generate movie.
      </p>
      {getApiBaseUrl() ? (
        <p className="backend-banner__hint">
          API: <code>{getApiBaseUrl()}</code>
        </p>
      ) : null}
    </div>
  );
}
