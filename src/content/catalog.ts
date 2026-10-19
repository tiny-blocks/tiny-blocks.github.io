/**
 * The libraries the site documents and the areas the home groups them in. Everything else about a
 * library (its description, its documentation, its version, what it depends on) is read from its own
 * repository and from Packagist when the site is built, so adding a library to the site takes one line
 * here.
 */

export const ORGANIZATION = 'tiny-blocks'

/** The repository every library is read from, on GitHub, and the branch it is read on. */
export const BRANCH = 'main'

export const AREAS = ['domain', 'http', 'data', 'infrastructure'] as const

export type Area = (typeof AREAS)[number]

export interface CatalogEntry {
  /** The name of the repository, which is also the name of the Composer package after the vendor. */
  readonly name: string
  readonly area: Area
}

export const CATALOG: readonly CatalogEntry[] = [
  { name: 'building-blocks', area: 'domain' },
  { name: 'value-object', area: 'domain' },
  { name: 'outbox', area: 'domain' },
  { name: 'http', area: 'http' },
  { name: 'http-correlation-id', area: 'http' },
  { name: 'http-error-handler', area: 'http' },
  { name: 'http-health-check', area: 'http' },
  { name: 'http-logging', area: 'http' },
  { name: 'http-query', area: 'http' },
  { name: 'collection', area: 'data' },
  { name: 'mapper', area: 'data' },
  { name: 'time', area: 'data' },
  { name: 'math', area: 'data' },
  { name: 'currency', area: 'data' },
  { name: 'country', area: 'data' },
  { name: 'ksuid', area: 'data' },
  { name: 'encoder', area: 'data' },
  { name: 'logger', area: 'infrastructure' },
  { name: 'environment-variable', area: 'infrastructure' },
  { name: 'docker-container', area: 'infrastructure' },
]

export const AREA_TEXT: Readonly<Record<Area, { readonly title: string; readonly lede: string }>> = {
  domain: {
    title: 'Domain modeling',
    lede: 'The tactical building blocks of Domain Driven Design, value objects and the Transactional Outbox.',
  },
  http: {
    title: 'HTTP',
    lede: 'PSR-7, PSR-15, PSR-17 and PSR-18 primitives, and the middleware every service rewrites.',
  },
  data: {
    title: 'Data and values',
    lede: 'Collections, mapping, time, exact numbers, money, countries and identifiers.',
  },
  infrastructure: {
    title: 'Infrastructure',
    lede: 'Structured logging, environment configuration and disposable containers for tests.',
  },
}

/** The address of a library on GitHub. */
export function repositoryUrl(name: string): string {
  return `https://github.com/${ORGANIZATION}/${name}`
}

/** The address of a library on Packagist. */
export function packagistUrl(name: string): string {
  return `https://packagist.org/packages/${ORGANIZATION}/${name}`
}

/** The address a file of a library is served from as it is, which is where images are read from. */
export function rawUrl(name: string, path: string): string {
  return `https://raw.githubusercontent.com/${ORGANIZATION}/${name}/${BRANCH}/${path}`
}
