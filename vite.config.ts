import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const SITE_NAME = "AI Movie Studio";
const SITE_TITLE = "AI Movie Studio — Generate AI Short Movies";
const SITE_DESCRIPTION =
  "AI Movie Studio helps you write a story beat by beat, then generates a narrated short video with AI visuals — figure biographies, history shorts, and custom stories.";

function injectSiteMeta(html: string, siteUrl: string): string {
  const replacements: Record<string, string> = {
    __SITE_URL__: siteUrl,
    __SITE_NAME__: SITE_NAME,
    __SITE_TITLE__: SITE_TITLE,
    __SITE_DESCRIPTION__: SITE_DESCRIPTION,
  };
  let result = html;
  for (const [token, value] of Object.entries(replacements)) {
    result = result.split(token).join(value);
  }
  return result;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000";
  const siteUrl = (env.VITE_SITE_URL || "https://gearmstudio.netlify.app").replace(/\/$/, "");

  return {
    plugins: [
      react(),
      {
        name: "inject-site-seo-meta",
        transformIndexHtml(html) {
          return injectSiteMeta(html, siteUrl);
        },
      },
    ],
    server: {
      proxy: {
        "/v1": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/health": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
