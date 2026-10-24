import type { APIRoute, GetStaticPaths } from 'astro'
import { type Library, libraries } from '../content'
import { libraryMarkdown } from '../content/markdown'

export const getStaticPaths = (async () =>
  (await libraries()).map((library) => ({
    params: { library: library.data.name },
    props: { library },
  }))) satisfies GetStaticPaths

/** The documentation of one library as plain Markdown, beside its page, for language models and agents. */
export const GET: APIRoute<{ library: Library }> = ({ props, site, url }) => {
  const { data, body } = props.library
  const page = new URL(`/${data.name}/`, site ?? url.origin).href
  return new Response(libraryMarkdown({ ...data, body: body ?? '' }, page), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
