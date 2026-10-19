/**
 * Turns the README of a library into the documentation of its page.
 *
 * Every README follows the same structure (a title, the license badge, a table of contents, then
 * Overview, Installation, How to use, an optional FAQ, License and Contributing), so the page can draw
 * on its own what the README spells out for GitHub: the title and the badge go to the cover, the table of
 * contents is drawn from the headings, the Installation section becomes the copyable command, and the
 * License and Contributing sections are the same for every library. Links relative to the repository
 * are made absolute, and a link to another library of the catalog becomes a link to its page.
 */
import { ORGANIZATION, rawUrl, repositoryUrl } from './catalog'

/** The sections every README carries that the page draws on its own. */
const DROPPED = new Set(['installation', 'license', 'contributing', 'code of conduct'])

const FENCE = /^\s*(```|~~~)/

/** Splits a Markdown document at its `##` headings, ignoring any inside a code block. */
function sections(markdown: string): string[][] {
  const parts: string[][] = [[]]
  let fenced = false
  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      fenced = !fenced
    }
    if (!fenced && /^## /.test(line)) {
      parts.push([])
    }
    parts.at(-1)?.push(line)
  }
  return parts
}

function headingOf(section: readonly string[]): string {
  return (section[0] ?? '').replace(/^## /, '').trim().toLowerCase()
}

/** Answers the address a link of the README should lead to on the site. */
function resolve(name: string, target: string, image: boolean, catalog: ReadonlySet<string>): string {
  const sibling = new RegExp(`^https://github\\.com/${ORGANIZATION}/([\\w-]+)/?(#[\\w-]*)?$`).exec(target)
  if (sibling?.[1] && catalog.has(sibling[1])) {
    return `/${sibling[1]}/${sibling[2] ?? ''}`
  }
  if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) {
    return target
  }
  const path = target.replace(/^\.?\//, '')
  return image ? rawUrl(name, path) : `${repositoryUrl(name)}/blob/main/${path}`
}

/** Answers the documentation of a library, from its README, ready to be rendered on its page. */
export function documentation(name: string, readme: string, catalog: ReadonlySet<string>): string {
  const [, ...body] = sections(readme.replace(/\r\n/g, '\n'))
  return body
    .filter((section) => !DROPPED.has(headingOf(section)))
    .flat()
    .filter((line) => !/^\s*<div id=['"][^'"]*['"]>\s*<\/div>\s*$/.test(line))
    .join('\n')
    .replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (_, bang: string, label: string, target: string) => {
      return `${bang}[${label}](${resolve(name, target, bang === '!', catalog)})`
    })
    .replace(/(<img[^>]*\ssrc=")([^"]+)(")/g, (_, open: string, target: string, close: string) => {
      return `${open}${resolve(name, target, true, catalog)}${close}`
    })
    .trim()
}
