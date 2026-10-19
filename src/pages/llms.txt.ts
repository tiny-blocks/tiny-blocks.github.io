import type { APIRoute } from 'astro'
import { libraries } from '../content'
import { rawUrl } from '../content/catalog'
import { SITE, TEXT } from '../content/site'

/**
 * The index of the site for language models, in the llms.txt format: what Tiny Blocks is and every library
 * with its summary, its page and the README it is documented by, as plain Markdown.
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
    '## Libraries',
    '',
    ...(await libraries()).map(
      (library) =>
        `- [tiny-blocks/${library.data.name}](${new URL(`/${library.data.name}/`, origin).href}): ${library.data.description} README: ${rawUrl(library.data.name, 'README.md')}`,
    ),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
