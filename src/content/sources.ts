/**
 * What the site reads about each library when it is built: the README and the `composer.json` from
 * its repository, and the latest release and the downloads from Packagist. A failed request fails the
 * build, so the site never publishes a library with half of its page missing.
 */
import { ORGANIZATION, rawUrl } from './catalog'
import type { Manifest } from './graph'

interface ComposerFile extends Manifest {
  readonly description?: string
  readonly license?: string | readonly string[]
}

export interface Release {
  readonly version: string
  /** When the version was published, as an ISO 8601 instant. */
  readonly time: string
}

export interface Downloads {
  readonly total: number
  readonly monthly: number
}

async function fetchOk(url: string): Promise<Response> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Reading ${url} answered ${response.status}.`)
  }
  return response
}

export async function readme(name: string): Promise<string> {
  return (await fetchOk(rawUrl(name, 'README.md'))).text()
}

export async function composerFile(name: string): Promise<ComposerFile> {
  return (await fetchOk(rawUrl(name, 'composer.json'))).json() as Promise<ComposerFile>
}

/** Answers the latest tagged release of a package, which Packagist lists first. */
export async function latestRelease(name: string): Promise<Release> {
  const body = (await (await fetchOk(`https://repo.packagist.org/p2/${ORGANIZATION}/${name}.json`)).json()) as {
    packages: Record<string, readonly Release[]>
  }
  const release = body.packages[`${ORGANIZATION}/${name}`]?.[0]
  if (release === undefined) {
    throw new Error(`Packagist lists no release of ${ORGANIZATION}/${name}.`)
  }
  return { version: release.version, time: release.time }
}

export async function downloads(name: string): Promise<Downloads> {
  const body = (await (await fetchOk(`https://packagist.org/packages/${ORGANIZATION}/${name}/stats.json`)).json()) as {
    downloads: Downloads
  }
  return { total: body.downloads.total, monthly: body.downloads.monthly }
}
