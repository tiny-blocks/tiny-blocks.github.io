/**
 * How the libraries depend on each other, worked out from the `require` and `require-dev` sections of
 * the `composer.json` of each one, the same source the ecosystem's dependency graph is drawn from.
 */
import { ORGANIZATION } from './catalog'

/** The parts of a `composer.json` the graph reads. */
export interface Manifest {
  readonly require?: Readonly<Record<string, string>>
  readonly 'require-dev'?: Readonly<Record<string, string>>
}

/**
 * The place of a library in the ecosystem, by how many libraries pull it in at runtime: a hub is pulled
 * in by four or more, a library by at least one, a test-only one only by test suites, and an unused one
 * by none.
 */
type Role = 'hub' | 'library' | 'test-only' | 'unused'

export interface Node {
  readonly name: string
  /** The libraries this one requires at runtime. */
  readonly dependsOn: readonly string[]
  /** The libraries that require this one at runtime. */
  readonly usedBy: readonly string[]
  /** The libraries that require this one only to run their tests. */
  readonly testedWith: readonly string[]
  readonly role: Role
  /** How far the library sits from the foundation: 0 requires nothing, 1 requires only layer 0, and so on. */
  readonly layer: number
}

const PREFIX = `${ORGANIZATION}/`

function ecosystemPackages(section: Readonly<Record<string, string>> | undefined, known: ReadonlySet<string>) {
  return Object.keys(section ?? {})
    .filter((name) => name.startsWith(PREFIX))
    .map((name) => name.slice(PREFIX.length))
    .filter((name) => known.has(name))
    .sort()
}

function roleOf(usedBy: number, testedWith: number): Role {
  if (usedBy >= 4) {
    return 'hub'
  }
  if (usedBy >= 1) {
    return 'library'
  }
  return testedWith >= 1 ? 'test-only' : 'unused'
}

/** Answers the graph of the libraries, one node per library, in the order the manifests were given. */
export function dependencyGraph(manifests: ReadonlyMap<string, Manifest>): readonly Node[] {
  const known = new Set(manifests.keys())
  const runtime = new Map([...manifests].map(([name, manifest]) => [name, ecosystemPackages(manifest.require, known)]))
  const development = new Map(
    [...manifests].map(([name, manifest]) => [name, ecosystemPackages(manifest['require-dev'], known)]),
  )

  const layers = new Map<string, number>()
  const layerOf = (name: string, path: readonly string[]): number => {
    const cached = layers.get(name)
    if (cached !== undefined) {
      return cached
    }
    if (path.includes(name)) {
      throw new Error(`The libraries depend on each other in a cycle: ${[...path, name].join(' -> ')}.`)
    }
    const dependencies = runtime.get(name) ?? []
    const layer =
      dependencies.length === 0
        ? 0
        : 1 + Math.max(...dependencies.map((dependency) => layerOf(dependency, [...path, name])))
    layers.set(name, layer)
    return layer
  }

  return [...manifests.keys()].map((name) => {
    const usedBy = [...runtime].filter(([, dependencies]) => dependencies.includes(name)).map(([consumer]) => consumer)
    const testedWith = [...development]
      .filter(([consumer, dependencies]) => dependencies.includes(name) && !usedBy.includes(consumer))
      .map(([consumer]) => consumer)
    return {
      name,
      dependsOn: runtime.get(name) ?? [],
      usedBy: usedBy.sort(),
      testedWith: testedWith.sort(),
      role: roleOf(usedBy.length, testedWith.length),
      layer: layerOf(name, []),
    }
  })
}
