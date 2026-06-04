import { getApiBaseUrl, getApiKey } from "../config/api";
import type { HealthResponse } from "../api/types";

export type HealthProbeResult =
  | { ok: true; data: HealthResponse; elapsedMs: number }
  | { ok: false; report: ConnectionFailureReport };

export type ConnectionFailureReport = {
  summary: string;
  lines: string[];
  consoleDetail: Record<string, unknown>;
};

function pageOrigin(): string {
  if (typeof window === "undefined") {
    return "(unknown)";
  }
  return window.location.origin;
}

function formatFetchError(err: unknown): { name: string; message: string; cause?: string } {
  if (!(err instanceof Error)) {
    return { name: "Error", message: String(err) };
  }
  const cause = (err as Error & { cause?: unknown }).cause;
  return {
    name: err.name,
    message: err.message,
    cause:
      cause !== undefined
        ? cause instanceof Error
          ? `${cause.name}: ${cause.message}`
          : String(cause)
        : undefined,
  };
}

function classifyFailure(
  err: unknown,
  httpStatus: number | null,
  acao: string | null,
): string {
  if (httpStatus === 401) {
    return "HTTP 401 — /health should not need an API key; check Render logs.";
  }
  if (httpStatus === 403) {
    return "HTTP 403 — request blocked before your app (browser extension, network filter, or edge). API keys do not affect /health.";
  }
  if (httpStatus !== null && httpStatus >= 400) {
    return `HTTP ${httpStatus} — server returned an error (see Response tab in DevTools → Network).`;
  }
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (msg.includes("failed to fetch") || err instanceof TypeError) {
    if (acao) {
      return "Network error despite CORS header — try hard refresh or Incognito.";
    }
    const apiHost = getApiBaseUrl();
    if (apiHost.includes("-api.") || apiHost.includes(".api.")) {
      return "Failed to fetch — hostnames with “-api” are often blocked. Use ai-movie-studio-backend.onrender.com (like translate-chat-backend).";
    }
    return "Failed to fetch — often CORS (wrong origin on Render) OR blocked request (403). Check DevTools → Network → health.";
  }
  return "Connection failed — see details below.";
}

/** Probe GET /health and build a report browsers can show when fetch fails. */
export async function probeHealthConnection(): Promise<HealthProbeResult> {
  const origin = pageOrigin();
  const apiBase = getApiBaseUrl();
  const healthUrl = apiBase ? `${apiBase}/health` : "(VITE_API_BASE_URL not set)";
  const lines: string[] = [
    "=== Backend connection report ===",
    `Time: ${new Date().toISOString()}`,
    `Page origin: ${origin}`,
    `VITE_API_BASE_URL: ${apiBase || "(empty)"}`,
    `Health URL: ${healthUrl}`,
    `VITE_BACKEND_API_KEY set: ${getApiKey() ? "yes" : "no"} (not used for /health)`,
    "",
  ];

  if (!apiBase) {
    return {
      ok: false,
      report: {
        summary: "VITE_API_BASE_URL is missing in this Netlify build.",
        lines: [...lines, "Fix: Netlify → Environment variables → VITE_API_BASE_URL → redeploy."],
        consoleDetail: { origin, apiBase, healthUrl },
      },
    };
  }

  const t0 = performance.now();
  let httpStatus: number | null = null;
  let acao: string | null = null;
  let acac: string | null = null;
  let server: string | null = null;
  let responseType: string | null = null;

  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      signal: AbortSignal.timeout(90_000),
    });
    httpStatus = response.status;
    acao = response.headers.get("access-control-allow-origin");
    acac = response.headers.get("access-control-allow-credentials");
    server = response.headers.get("server");
    responseType = response.type;
    const elapsedMs = Math.round(performance.now() - t0);

    lines.push(`[fetch] completed in ${elapsedMs}ms`);
    lines.push(`  HTTP status: ${httpStatus}`);
    lines.push(`  response.type: ${responseType}`);
    lines.push(`  Access-Control-Allow-Origin: ${acao ?? "(missing)"}`);
    lines.push(`  Access-Control-Allow-Credentials: ${acac ?? "(missing)"}`);
    lines.push(`  Server: ${server ?? "(missing)"}`);

    if (!response.ok) {
      let bodyPreview = "";
      try {
        bodyPreview = (await response.text()).slice(0, 200);
      } catch {
        bodyPreview = "(could not read body)";
      }
      if (bodyPreview) {
        lines.push(`  Body preview: ${bodyPreview.replace(/\s+/g, " ")}`);
      }
      const summary = classifyFailure(null, httpStatus, acao);
      lines.push("", "=== What to check ===");
      lines.push("DevTools → Network → click “health” → Headers (Request Origin vs Render CORS_ORIGINS).");
      if (httpStatus === 403) {
        lines.push("403 + missing CORS on error pages = blocked before FastAPI (not an API key issue).");
        lines.push("Try: new Incognito window, disable extensions, or rename Render host (remove “-api”).");
      }
      return {
        ok: false,
        report: {
          summary,
          lines,
          consoleDetail: { origin, apiBase, healthUrl, httpStatus, acao, acac, server, responseType },
        },
      };
    }

    if (acao && acao !== "*" && acao !== origin) {
      lines.push("", `CORS mismatch: server allows "${acao}", page is "${origin}".`);
      lines.push(`Render → CORS_ORIGINS=${origin}`);
      return {
        ok: false,
        report: {
          summary: `CORS allows "${acao}" but this page is "${origin}".`,
          lines,
          consoleDetail: { origin, apiBase, healthUrl, httpStatus, acao },
        },
      };
    }

    const data = (await response.json()) as HealthResponse;
    lines.push(`  Body: status=${data.status}, service=${data.service}`);
    return { ok: true, data, elapsedMs };
  } catch (err) {
    const elapsedMs = Math.round(performance.now() - t0);
    const fe = formatFetchError(err);
    lines.push(`[fetch] threw after ${elapsedMs}ms`);
    lines.push(`  ${fe.name}: ${fe.message}`);
    if (fe.cause) {
      lines.push(`  cause: ${fe.cause}`);
    }
    if (httpStatus !== null) {
      lines.push(`  (partial) HTTP status: ${httpStatus}`);
    }

    lines.push("", "=== What this usually means ===");
    lines.push(
      "Chrome shows “No Access-Control-Allow-Origin” when the response has no CORS headers.",
    );
    lines.push("That often happens with HTTP 403 from an ad blocker or edge filter — not wrong API keys.");
    lines.push("");
    lines.push("1. Open in a new tab: " + healthUrl);
    lines.push("   → JSON = API up; problem is cross-origin from this page.");
    lines.push("2. DevTools → Network → health → Status (403? failed?) and Response headers.");
    lines.push(`3. Render CORS_ORIGINS must exactly match page origin: ${origin}`);
    lines.push("4. API keys: only needed for /api/v1/* — not for /health.");

    const summary = classifyFailure(err, httpStatus, acao);
    return {
      ok: false,
      report: {
        summary,
        lines,
        consoleDetail: {
          origin,
          apiBase,
          healthUrl,
          elapsedMs,
          error: fe,
          httpStatus,
          acao,
          hint:
            "If Network tab shows 403, disable browser extensions or allowlist ai-movie-studio-api.onrender.com",
        },
      },
    };
  }
}

export function logConnectionFailure(report: ConnectionFailureReport): void {
  console.error("[AI Movie Studio] Backend connection failed:", report.summary);
  console.error(report.consoleDetail);
  console.error(report.lines.join("\n"));
}

export function formatReportText(report: ConnectionFailureReport): string {
  return `${report.summary}\n\n${report.lines.join("\n")}`;
}
