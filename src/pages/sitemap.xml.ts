import type { APIRoute } from 'astro'
import { libraries } from '../content'

/**
 * The addresses the site asks to have indexed: the home and every library. The search page is a tool and
 * declares itself out of the index, so it stays out of here too. Each library carries the date of its
 * latest release, which is when its page last changed in substance.
 */
export const GET: APIRoute = async ({ site, url }) => {
  const origin = site ?? new URL(url.origin)
  const entries = [
    `  <url>\n    <loc>${new URL('/', origin).href}</loc>\n  </url>`,
    ...(await libraries()).map(
      (library) =>
        `  <url>\n    <loc>${new URL(`/${library.data.name}/`, origin).href}</loc>\n    <lastmod>${library.data.released.slice(0, 10)}</lastmod>\n  </url>`,
    ),
  ]
  const document = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
  return new Response(document, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
