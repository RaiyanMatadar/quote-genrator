import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const targetUrl = new URL('sitemap-0.xml', site ?? 'https://quotegeneratorfree.com').href;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${targetUrl}</loc>
  </sitemap>
</sitemapindex>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
