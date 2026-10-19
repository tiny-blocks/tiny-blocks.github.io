import { describe, expect, it } from 'vitest'
import { reach } from '.'

describe('what a library reaches through the graph', () => {
  it('follows the edges until nothing new is reached, each library once', () => {
    // Given a graph where time stands on collection and mapper, and collection stands on mapper
    const edges: Record<string, readonly string[]> = { time: ['collection', 'mapper'], collection: ['mapper'] }

    // When what time stands on is followed
    const reached = reach('time', (name) => edges[name] ?? [])

    // Then both are reached, mapper once
    expect(reached).toEqual(['collection', 'mapper'])
  })
})
