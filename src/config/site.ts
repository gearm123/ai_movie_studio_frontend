/** Public site URL — no trailing slash. Set `VITE_SITE_URL` on Netlify when you attach a custom domain. */
export function getSiteUrl(): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "https://gearmstudio.netlify.app";
}

export const SITE_NAME = "AI Movie Studio";

export const SITE_TAGLINE = "Plan and generate short-form AI movies beat by beat.";

export const SITE_DESCRIPTION =
  "AI Movie Studio helps you write a story beat by beat, then generates a narrated short video with AI visuals — figure biographies, history shorts, and custom stories.";

/** Paths listed in sitemap.xml (SPA; only public entry points). */
export const SITEMAP_PATHS = ["/"] as const;
