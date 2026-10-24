/**
 * The documentation of a library as plain Markdown, for the language models and agents that read the site
 * rather than render it: what the library is, how to install it, then its documentation as its page shows it.
 */

export interface MarkdownSource {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly version: string
  readonly body: string
}

/** Answers the Markdown of a library, whose page is at the given address. */
export function libraryMarkdown(library: MarkdownSource, page: string): string {
  const packageName = `tiny-blocks/${library.name}`
  return [
    `# ${library.title}`,
    '',
    `> ${library.description}`,
    '',
    `The Composer package \`${packageName}\`, at version ${library.version}, documented at ${page}.`,
    '',
    `Install it with \`composer require ${packageName}\`.`,
    '',
    library.body.trim(),
    '',
  ].join('\n')
}

const FENCE = /^\s*(```|~~~)/

/** Moves every heading one level down, so a document nests under a heading of its own, code left alone. */
export function demote(markdown: string): string {
  let fenced = false
  return markdown
    .split('\n')
    .map((line) => {
      if (FENCE.test(line)) {
        fenced = !fenced
      }
      return !fenced && /^#{1,5} /.test(line) ? `#${line}` : line
    })
    .join('\n')
}
