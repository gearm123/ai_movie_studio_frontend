/**
 * Writes public/robots.txt and public/sitemap.xml before Vite build.
 * Set VITE_SITE_URL on Netlify when you switch from *.netlify.app to a custom domain.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const siteUrl = (process.env.VITE_SITE_URL || "https://gearmstudio.netlify.app").replace(/\/$/, "");
const lastmod = new Date().toISOString().slice(0, 10);

const sitemapPaths = [{ path: "/", changefreq: "weekly", priority: "1.0" }];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `# AI Movie Studio
User-agent: *
Allow: /

# App steps (setup, beats) are in-app only — not separate crawlable routes.
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(`[seo] Wrote robots.txt and sitemap.xml for ${siteUrl}`);
