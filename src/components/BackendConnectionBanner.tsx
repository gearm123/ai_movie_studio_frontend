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
        {connection.authRequired ? " · API key required" : null}
      </div>
    );
  }

  const message =
    connection.status === "misconfigured" || connection.status === "error"
      ? connection.message
      : "";

  return (
    <div className="backend-banner backend-banner--error" role="alert">
      <strong>Backend not reachable</strong>
      <p>{message}</p>
    </div>
  );
}
