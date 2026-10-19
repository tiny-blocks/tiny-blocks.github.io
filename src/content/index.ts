/**
 * The libraries of the site, in the order of the catalog, and what each one reaches through the graph.
 */
import { type CollectionEntry, getCollection } from 'astro:content'

export type Library = CollectionEntry<'libraries'>

export async function libraries(): Promise<readonly Library[]> {
  return (await getCollection('libraries')).sort((a, b) => a.data.order - b.data.order)
}

/**
 * Answers every library reached from one by following an edge again and again: everything it stands on,
 * directly or not, when following what it depends on, and everything that stands on it the other way.
 */
export function reach(start: string, edges: (name: string) => readonly string[]): readonly string[] {
  const seen = new Set<string>()
  const queue = [...edges(start)]
  while (queue.length > 0) {
    const name = queue.shift()
    if (name !== undefined && !seen.has(name)) {
      seen.add(name)
      queue.push(...edges(name))
    }
  }
  return [...seen].sort()
}
