import { describe, expect, it } from 'vitest'
import { documentation } from './readme'

const README = [
  '# Collection',
  '',
  '[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/tiny-blocks/collection/blob/main/LICENSE)',
  '',
  '* [Overview](#overview)',
  '* [Installation](#installation)',
  '',
  "<div id='overview'></div>",
  '',
  '## Overview',
  '',
  'Built on [mapper](https://github.com/tiny-blocks/mapper) and [PHP](https://www.php.net).',
  '',
  '## Installation',
  '',
  '```',
  'composer require tiny-blocks/collection',
  '```',
  '',
  '## How to use',
  '',
  'See [the example](examples/basic.php) and ![diagram](doc/diagram.png).',
  '',
  '```php',
  '## not a heading',
  '```',
  '',
  '## License',
  '',
  'MIT.',
  '',
  '## Contributing',
  '',
  'Please follow the guidelines.',
].join('\n')

describe('the documentation of a library', () => {
  const page = documentation('collection', README, new Set(['collection', 'mapper']))

  it('leaves out the title, the badge, the table of contents and the anchors', () => {
    // Given the README of a library

    // When it becomes the documentation of its page

    // Then it opens at the Overview
    expect(page.startsWith('## Overview')).toBe(true)
  })

  it('leaves out the sections the page draws on its own', () => {
    // Given the README of a library

    // When it becomes the documentation of its page
    const headings = page.split('\n').filter((line) => line.startsWith('## '))

    // Then only the sections of the library itself are left, a heading inside code included as code
    expect(headings).toEqual(['## Overview', '## How to use', '## not a heading'])
  })

  it('links another library of the catalog to its page and keeps outside links', () => {
    // Given a README that links a sibling library and an outside site

    // When it becomes the documentation of its page

    // Then the sibling leads to its page and the outside link stays
    expect(page).toContain('[mapper](/mapper/)')
    expect(page).toContain('[PHP](https://www.php.net)')
  })

  it('makes links and images relative to the repository absolute', () => {
    // Given a README that links a file and shows an image of its repository

    // When it becomes the documentation of its page

    // Then the link leads to the file on GitHub and the image is read as it is served
    expect(page).toContain('[the example](https://github.com/tiny-blocks/collection/blob/main/examples/basic.php)')
    expect(page).toContain('![diagram](https://raw.githubusercontent.com/tiny-blocks/collection/main/doc/diagram.png)')
  })
})
