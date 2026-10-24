import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('the link-preview cards of the catalog', () => {
  it('has a card drawn for every library, so make og-image ran after the last one was added', () => {
    // Given every library of the catalog, read the way tools/og-image.py reads it
    const catalog = readFileSync('src/content/catalog.ts', 'utf8')
    const names = [...catalog.matchAll(/\{ name: '([\w-]+)', area:/g)].map((match) => match[1])

    // When the cards in public/og are looked up
    const missing = names.filter((name) => !existsSync(`public/og/${name}.png`))

    // Then the catalog is read and none is missing
    expect(names.length).toBeGreaterThan(0)
    expect(missing).toEqual([])
  })
})
