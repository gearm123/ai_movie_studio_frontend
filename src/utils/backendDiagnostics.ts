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
  const usingProxy = !base;
  lines.push(`VITE_API_BASE_URL: ${base || "(empty — Netlify proxy mode, expected)"}`);
  lines.push(`Health URL: ${healthUrl}`);
  lines.push(`Mode: ${usingProxy ? "same-origin via netlify.toml" : "cross-origin to Render"}`);
  lines.push(`navigator.onLine: ${typeof navigator !== "undefined" ? navigator.onLine : "?"}`);
  lines.push(`VITE_BACKEND_API_KEY set: ${getApiKey() ? "yes" : "no"}`);
  lines.push("");

  let corsGetFailed = false;
  let acaoOnSuccess: string | null = null;
  const hostLooksLikeApi =
    !usingProxy && /(^|[.-])api([.-]|$)/i.test(new URL(healthUrl).hostname);

  // 1) Normal browser request (what the app uses)
  try {
    const t0 = performance.now();
    const res = await fetch(healthUrl, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    });
    const ms = Math.round(performance.now() - t0);
    acaoOnSuccess = res.headers.get("access-control-allow-origin");
    const acac = res.headers.get("access-control-allow-credentials");
    lines.push(`[1] GET /health (cors mode) → HTTP ${res.status} in ${ms}ms`);
    lines.push(`    Access-Control-Allow-Origin: ${acaoOnSuccess ?? "(header missing)"}`);
    lines.push(`    Access-Control-Allow-Credentials: ${acac ?? "(missing)"}`);
    if (!res.ok) {
      const hint = usingProxy
        ? "Netlify proxy returned an error — check netlify.toml and Render service is up."
        : `Backend returned HTTP ${res.status}.`;
      return { summary: hint, details: lines.join("\n") };
    }
    if (usingProxy) {
      return {
        summary: "/health OK via Netlify proxy (hard-refresh if banner still red).",
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
  if (hostLooksLikeApi) {
    lines.push(
      "[note] Hostname contains “api” (e.g. ai-movie-studio-api.onrender.com).",
      "       Many ad blockers block *-api* hosts — disable for this site or use incognito.",
    );
    lines.push("");
  }

  // 2) Request with API key (triggers CORS preflight)
  try {
    const headers = new Headers();
    const key = getApiKey();
    if (key) {
      headers.set("X-API-Key", key);
    }
    const t0 = performance.now();
    const res = await fetch(healthUrl, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      headers,
      cache: "no-store",
    });
    const ms = Math.round(performance.now() - t0);
    const acao = res.headers.get("access-control-allow-origin");
    lines.push(`[2] GET /health + X-API-Key header → HTTP ${res.status} in ${ms}ms`);
    lines.push(`    Access-Control-Allow-Origin: ${acao ?? "(missing)"}`);
  } catch (err) {
    lines.push("[2] GET /health + X-API-Key header → FAILED");
    lines.push(`    ${formatError(err).replace(/\n/g, "\n    ")}`);
    lines.push("    (Custom headers require a successful OPTIONS preflight.)");
  }

  lines.push("");
  lines.push("=== Likely cause ===");

  if (corsGetFailed) {
    if (usingProxy) {
      lines.push(
        "Same-origin /health failed. Open this URL in a tab:",
        `  ${origin}/health`,
        "If that shows JSON, hard-refresh the app (Ctrl+Shift+R).",
        "If 404 HTML, redeploy Netlify with netlify.toml (commit 962d8e2+).",
      );
      return {
        summary: "Could not reach /health on this site (Netlify proxy).",
        details: lines.join("\n"),
      };
    }
    lines.push(
      "If DevTools shows HTTP 403 + “No Access-Control-Allow-Origin”, use the Netlify proxy:",
      "delete VITE_API_BASE_URL and redeploy (netlify.toml).",
      `Test: fetch("${apiUrl("/health")}").then(r=>r.json()).then(console.log)`,
    );
    const summary = hostLooksLikeApi
      ? "Cross-origin request blocked (403) — leave VITE_API_BASE_URL unset (proxy mode)."
      : "Cross-origin request blocked — leave VITE_API_BASE_URL unset (proxy mode).";
    return { summary, details: lines.join("\n") };
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
