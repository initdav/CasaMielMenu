import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const ROBOTS_TXT = `User-agent: *
Allow: /
Sitemap: https://menu.casamiel.co/sitemap.xml`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://menu.casamiel.co/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

function textResponse(body: string, contentType: string) {
  return new Response(body, {
    headers: { "content-type": contentType },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/robots.txt") {
      return textResponse(ROBOTS_TXT, "text/plain; charset=utf-8");
    }
    if (url.pathname === "/sitemap.xml") {
      return textResponse(SITEMAP_XML, "application/xml; charset=utf-8");
    }
    return requestHandler(request);
  },
} satisfies ExportedHandler<Env>;
