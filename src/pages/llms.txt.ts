import type { APIRoute } from 'astro'
import { libraries } from '../content'
import { SITE, TEXT } from '../content/site'

/**
 * The index of the site for language models, in the llms.txt format: what Tiny Blocks is and every library
 * with its summary, its page and its documentation as plain Markdown, beside the whole of it in llms-full.txt.
 */
export const GET: APIRoute = async ({ site, url }) => {
  const origin = site ?? new URL(url.origin)
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${TEXT.home.lede}`,
    '',
    'Every library is a Composer package named `tiny-blocks/<name>`, installed with `composer require tiny-blocks/<name>`.',
    '',
    `The documentation of every library in one file: ${new URL('/llms-full.txt', origin).href}`,
    '',
    '## Libraries',
    '',
    ...(await libraries()).map(
      (library) =>
        `- [tiny-blocks/${library.data.name}](${new URL(`/${library.data.name}/`, origin).href}): ${library.data.description} Markdown: ${new URL(`/${library.data.name}.md`, origin).href}`,
    ),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
