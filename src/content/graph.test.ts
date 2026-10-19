import { describe, expect, it } from 'vitest'
import { dependencyGraph, type Manifest } from './graph'

const manifests = (entries: Record<string, Manifest>) => new Map(Object.entries(entries))

describe('the dependency graph', () => {
  it('reads only the libraries of the ecosystem as dependencies', () => {
    // Given a library that requires PHP, a third-party package and another library
    const graph = dependencyGraph(
      manifests({
        mapper: {},
        collection: { require: { php: '^8.5', 'psr/log': '^3.0', 'tiny-blocks/mapper': '^2.0' } },
      }),
    )

    // When the dependencies of the collection are read
    const collection = graph.find((node) => node.name === 'collection')

    // Then only the library is one
    expect(collection?.dependsOn).toEqual(['mapper'])
  })

  it('places each library one layer above its highest dependency', () => {
    // Given a chain of libraries and one that depends on two layers
    const graph = dependencyGraph(
      manifests({
        mapper: {},
        collection: { require: { 'tiny-blocks/mapper': '^2.0' } },
        time: { require: { 'tiny-blocks/collection': '^2.0', 'tiny-blocks/mapper': '^2.0' } },
      }),
    )

    // When their layers are read
    const layers = Object.fromEntries(graph.map((node) => [node.name, node.layer]))

    // Then each sits above everything it requires
    expect(layers).toEqual({ mapper: 0, collection: 1, time: 2 })
  })

  it('names the role of a library by how many libraries use it at runtime', () => {
    // Given a library used by four others, one used by one, one used only in tests and one used by none
    const uses = (name: string) => ({ require: { [`tiny-blocks/${name}`]: '^1.0' } })
    const graph = dependencyGraph(
      manifests({
        collection: {},
        mapper: {},
        encoder: {},
        ksuid: {},
        a: { require: { 'tiny-blocks/collection': '^1.0', 'tiny-blocks/mapper': '^1.0' } },
        b: uses('collection'),
        c: uses('collection'),
        d: { ...uses('collection'), 'require-dev': { 'tiny-blocks/encoder': '^1.0' } },
      }),
    )

    // When their roles are read
    const roles = Object.fromEntries(graph.slice(0, 4).map((node) => [node.name, node.role]))

    // Then each is named by its consumers
    expect(roles).toEqual({ collection: 'hub', mapper: 'library', encoder: 'test-only', ksuid: 'unused' })
  })

  it('refuses libraries that depend on each other in a cycle', () => {
    // Given two libraries that require each other
    const cyclic = manifests({
      a: { require: { 'tiny-blocks/b': '^1.0' } },
      b: { require: { 'tiny-blocks/a': '^1.0' } },
    })

    // When the graph is worked out
    const build = () => dependencyGraph(cyclic)

    // Then it is refused
    expect(build).toThrow('cycle')
  })
})
