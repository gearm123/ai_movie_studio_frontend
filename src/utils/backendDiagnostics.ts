import { apiUrl, getApiBaseUrl, getApiKey } from "../config/api";

export interface BackendDiagnosticReport {
  summary: string;
  details: string;
}

function formatError(err: unknown): string {
  if (!(err instanceof Error)) {
    return String(err);
  }
  const lines = [`${err.name}: ${err.message}`];
  const cause = (err as Error & { cause?: unknown }).cause;
  if (cause !== undefined) {
    lines.push(
      `cause: ${cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause)}`,
    );
  }
  return lines.join("\n");
}

function pageOrigin(): string {
  if (typeof window === "undefined") {
    return "(unknown)";
  }
  return window.location.origin;
}

/** Run when health check fails — explains CORS vs network vs config. */
export async function diagnoseBackendConnection(): Promise<BackendDiagnosticReport> {
  const lines: string[] = [];
  const origin = pageOrigin();
  const base = getApiBaseUrl();
  const healthUrl = apiUrl("/health");

  lines.push("=== Connection diagnostic ===");
  lines.push(`Page origin: ${origin}`);
  lines.push(`VITE_API_BASE_URL: ${base || "(empty)"}`);
  lines.push(`Health URL: ${healthUrl}`);
  lines.push(`navigator.onLine: ${typeof navigator !== "undefined" ? navigator.onLine : "?"}`);
  lines.push(`VITE_BACKEND_API_KEY set: ${getApiKey() ? "yes" : "no"}`);
  lines.push("");

  if (!base) {
    return {
      summary: "VITE_API_BASE_URL is missing in this Netlify build.",
      details: lines.join("\n"),
    };
  }

  let corsGetFailed = false;
  let opaqueReachable = false;
  let acaoOnSuccess: string | null = null;

  // 1) Normal browser request (what the app uses)
  try {
    const t0 = performance.now();
    const res = await fetch(healthUrl, { method: "GET", mode: "cors", cache: "no-store" });
    const ms = Math.round(performance.now() - t0);
    acaoOnSuccess = res.headers.get("access-control-allow-origin");
    const acac = res.headers.get("access-control-allow-credentials");
    lines.push(`[1] GET /health (cors mode) → HTTP ${res.status} in ${ms}ms`);
    lines.push(`    Access-Control-Allow-Origin: ${acaoOnSuccess ?? "(header missing)"}`);
    lines.push(`    Access-Control-Allow-Credentials: ${acac ?? "(missing)"}`);
    if (!res.ok) {
      return {
        summary: `Backend reachable but returned HTTP ${res.status} on /health.`,
        details: lines.join("\n"),
      };
    }
    if (!acaoOnSuccess) {
      return {
        summary: "Backend responded but sent no Access-Control-Allow-Origin (browser blocks cross-origin).",
        details: lines.join("\n"),
      };
    }
    if (acaoOnSuccess !== "*" && acaoOnSuccess !== origin) {
      return {
        summary: `CORS origin mismatch: Render allows "${acaoOnSuccess}", this page is "${origin}".`,
        details: [
          ...lines,
          "",
          `Fix: On Render set CORS_ORIGINS=${origin}`,
          "(comma-separate multiple origins if needed, no trailing slashes)",
        ].join("\n"),
      };
    }
    return {
      summary: "Backend /health succeeded in diagnostic (try hard-refresh if banner still red).",
      details: lines.join("\n"),
    };
  } catch (err) {
    corsGetFailed = true;
    lines.push("[1] GET /health (cors mode) → FAILED");
    lines.push(`    ${formatError(err).replace(/\n/g, "\n    ")}`);
  }

  lines.push("");

  // 2) no-cors probe: did the host answer at all?
  try {
    const t0 = performance.now();
    const res = await fetch(healthUrl, { method: "GET", mode: "no-cors", cache: "no-store" });
    const ms = Math.round(performance.now() - t0);
    lines.push(`[2] GET /health (no-cors mode) → response.type=${res.type}, status=${res.status} in ${ms}ms`);
    if (res.type === "opaque") {
      opaqueReachable = true;
      lines.push("    Host answered on the network; readable response blocked (typical CORS).");
    }
  } catch (err) {
    lines.push("[2] GET /health (no-cors mode) → FAILED");
    lines.push(`    ${formatError(err).replace(/\n/g, "\n    ")}`);
  }

  lines.push("");

  // 3) Request with API key (triggers CORS preflight on some browsers)
  try {
    const headers = new Headers();
    const key = getApiKey();
    if (key) {
      headers.set("X-API-Key", key);
    }
    const t0 = performance.now();
    const res = await fetch(healthUrl, { method: "GET", mode: "cors", headers, cache: "no-store" });
    const ms = Math.round(performance.now() - t0);
    const acao = res.headers.get("access-control-allow-origin");
    lines.push(`[3] GET /health + X-API-Key header → HTTP ${res.status} in ${ms}ms`);
    lines.push(`    Access-Control-Allow-Origin: ${acao ?? "(missing)"}`);
  } catch (err) {
    lines.push("[3] GET /health + X-API-Key header → FAILED");
    lines.push(`    ${formatError(err).replace(/\n/g, "\n    ")}`);
    lines.push("    (Custom headers require a successful OPTIONS preflight.)");
  }

  lines.push("");
  lines.push("=== Likely cause ===");

  if (corsGetFailed && opaqueReachable) {
    lines.push(
      "Render is up, but CORS headers do not allow this site origin.",
      `Set CORS_ORIGINS=${origin} on Render and redeploy.`,
    );
    return {
      summary: `CORS blocked: server reachable but origin "${origin}" not allowed.`,
      details: lines.join("\n"),
    };
  }

  if (corsGetFailed && !opaqueReachable) {
    lines.push(
      "Browser could not complete a request to Render (not a CORS header issue).",
      "Common causes: Render service asleep (open /health in a tab, wait ~60s), DNS/ad blocker,",
      "wrong VITE_API_BASE_URL, or SSL/network failure.",
    );
    return {
      summary: "Network blocked or Render unreachable (not CORS) — wake Render via /health tab.",
      details: lines.join("\n"),
    };
  }

  if (acaoOnSuccess) {
    return {
      summary: `Unexpected failure after HTTP response (Allow-Origin: ${acaoOnSuccess}).`,
      details: lines.join("\n"),
    };
  }

  return {
    summary: "Failed to fetch — see diagnostic details below.",
    details: lines.join("\n"),
  };
}
