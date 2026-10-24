import type { APIRoute } from 'astro'
import { libraries } from '../content'
import { demote, libraryMarkdown } from '../content/markdown'
import { SITE, TEXT } from '../content/site'

/**
 * The whole documentation of the site for language models in one file, the companion of llms.txt: what
 * Tiny Blocks is, then every library as its Markdown, one after another under its own heading.
 */
export const GET: APIRoute = async ({ site, url }) => {
  const origin = site ?? new URL(url.origin)
  const sections = (await libraries()).map(({ data, body }) =>
    demote(libraryMarkdown({ ...data, body: body ?? '' }, new URL(`/${data.name}/`, origin).href)),
  )
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${TEXT.home.lede}`,
    '',
    'Every library is a Composer package named `tiny-blocks/<name>`, installed with `composer require tiny-blocks/<name>`.',
    '',
    ...sections,
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
