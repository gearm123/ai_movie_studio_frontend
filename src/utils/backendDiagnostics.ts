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
  let acaoOnSuccess: string | null = null;
  const hostLooksLikeApi = /(^|[.-])api([.-]|$)/i.test(new URL(healthUrl).hostname);

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
    lines.push(
      "Server-side CORS on Render may already be correct (CORS_ORIGINS with your Netlify URL).",
      "“Failed to fetch” in the browser is often:",
      "  • Ad blocker / privacy extension (especially hosts with “api” in the name)",
      "  • Cached failed CORS preflight — try Incognito or wait 10 minutes",
      "  • DevTools → Network → health → Status may show (blocked:other) or (failed)",
      "",
      `If Render env is missing: CORS_ORIGINS=${origin}`,
      "Test in DevTools Console on this page:",
      `  fetch("${healthUrl}").then(r=>r.json()).then(console.log)`,
    );
    const summary = hostLooksLikeApi
      ? "Browser blocked the request (ad blocker often blocks *-api* hostnames on Render)."
      : `Browser blocked cross-origin fetch to Render (check extensions; CORS_ORIGINS=${origin} on Render).`;
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
