/**
 * The libraries of the site, read from their repositories and from Packagist when the site is built.
 */
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { AREAS, CATALOG } from './content/catalog'
import { dependencyGraph } from './content/graph'
import { documentation } from './content/readme'
import { composerFile, downloads, latestRelease, readme } from './content/sources'

const libraries = defineCollection({
  loader: {
    name: 'tiny-blocks-libraries',
    load: async ({ store, renderMarkdown, logger }) => {
      const names = new Set(CATALOG.map((entry) => entry.name))
      const sources = await Promise.all(
        CATALOG.map(async (entry) => {
          const [text, composer, release, stats] = await Promise.all([
            readme(entry.name),
            composerFile(entry.name),
            latestRelease(entry.name),
            downloads(entry.name),
          ])
          return { entry, text, composer, release, stats }
        }),
      )
      const graph = dependencyGraph(new Map(sources.map((source) => [source.entry.name, source.composer])))

      store.clear()
      for (const [index, { entry, text, composer, release, stats }] of sources.entries()) {
        const node = graph[index]
        if (node === undefined) {
          throw new Error(`No node of the graph for ${entry.name}.`)
        }
        const body = documentation(entry.name, text, names)
        store.set({
          id: entry.name,
          data: {
            name: entry.name,
            title: /^# (.+)$/m.exec(text)?.[1]?.trim() ?? entry.name,
            description: composer.description ?? '',
            area: entry.area,
            order: index,
            php: composer.require?.php ?? '',
            license: [composer.license ?? 'MIT'].flat().join(', '),
            version: release.version,
            released: release.time,
            downloads: stats,
            dependsOn: node.dependsOn,
            usedBy: node.usedBy,
            testedWith: node.testedWith,
            role: node.role,
            layer: node.layer,
          },
          body,
          rendered: await renderMarkdown(body),
        })
      }
      logger.info(`Read ${sources.length} libraries.`)
    },
  },
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    area: z.enum(AREAS),
    order: z.number(),
    php: z.string(),
    license: z.string(),
    version: z.string(),
    released: z.string(),
    downloads: z.object({ total: z.number(), monthly: z.number() }),
    dependsOn: z.array(z.string()),
    usedBy: z.array(z.string()),
    testedWith: z.array(z.string()),
    role: z.enum(['hub', 'library', 'test-only', 'unused']),
    layer: z.number(),
  }),
})

export const collections = { libraries }
