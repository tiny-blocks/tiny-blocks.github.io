import { describe, expect, it } from 'vitest'
import { demote, libraryMarkdown } from './markdown'

describe('the Markdown of a library', () => {
  it('opens with what the library is and how to install it, then carries its documentation', () => {
    // Given a library with its documentation
    const library = {
      name: 'time',
      title: 'Time',
      description: 'Models time as immutable value objects for PHP.',
      version: '2.7.2',
      body: '\n## Overview\n\nInstants and durations.\n',
    }

    // When its Markdown is drawn
    const markdown = libraryMarkdown(library, 'https://tiny-blocks.github.io/time/')

    // Then it names the package, its version and its page, then the documentation follows
    expect(markdown).toBe(
      [
        '# Time',
        '',
        '> Models time as immutable value objects for PHP.',
        '',
        'The Composer package `tiny-blocks/time`, at version 2.7.2, documented at https://tiny-blocks.github.io/time/.',
        '',
        'Install it with `composer require tiny-blocks/time`.',
        '',
        '## Overview',
        '',
        'Instants and durations.',
        '',
      ].join('\n'),
    )
  })
})

describe('a document moved one heading level down', () => {
  it('moves every heading down and leaves the lines of a code block alone', () => {
    // Given a document with headings and a code block whose comment opens with a hash
    const markdown = ['# Encoder', '', '## How to use', '', '```bash', '# Output: Hello', '```'].join('\n')

    // When it is moved down
    const demoted = demote(markdown)

    // Then the headings move and the comment stays
    expect(demoted).toBe(['## Encoder', '', '### How to use', '', '```bash', '# Output: Hello', '```'].join('\n'))
  })
})
