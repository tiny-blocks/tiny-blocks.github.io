/**
 * The words of the site around the documentation of the libraries: the bar, the home and the labels of a
 * library page. The site is in English, like the libraries.
 */
import { ORGANIZATION } from './catalog'

export const SITE = {
  name: 'Tiny Blocks',
  github: `https://github.com/${ORGANIZATION}`,
  packagist: `https://packagist.org/packages/${ORGANIZATION}/`,
  meta: {
    title: 'Tiny Blocks · Small, focused PHP libraries',
    description:
      'Small, focused, framework-agnostic PHP libraries for collections, time, HTTP, object mapping, logging, identifiers and Domain Driven Design.',
  },
} as const

/** The id of the main landmark, which the skip link jumps to. */
export const MAIN_ID = 'content'

export const TEXT = {
  skipLink: 'Skip to content',
  theme: { label: 'Theme', light: 'Light theme', dark: 'Dark theme' },
  nav: {
    home: 'Home',
    search: 'Search',
    libraries: 'Libraries',
    toTop: 'Back to top',
    source: 'Tiny Blocks on GitHub',
    packagist: 'Tiny Blocks on Packagist',
  },
  home: {
    lede: 'Small, focused PHP libraries. Each one solves a single problem and can be adopted on its own, without pulling in the rest.',
    browse: 'All libraries',
    github: 'GitHub',
    graphTitle: 'How the blocks fit together',
    graphLede:
      'Every library is a block, and every block stands on the blocks below it. Point at one, or focus it, to see what it stands on and what stands on it.',
    chosen: 'Chosen',
    dependency: 'Stands on',
    consumer: 'Stood on by',
    promise: [
      { title: 'One problem each', text: 'Install only what you need. Nothing pulls in the rest.' },
      { title: 'Framework agnostic', text: 'Plain PHP 8.5 and PSR interfaces, no framework required.' },
      { title: 'Strictly analyzed', text: 'PSR-12 and PHPStan at its highest level on every change.' },
      { title: 'Fully mutation tested', text: 'Every test suite kills every mutant Infection produces.' },
    ],
  },
  library: {
    copy: 'Copy',
    copied: 'Copied',
    version: 'Version',
    released: 'released',
    php: 'PHP',
    license: 'License',
    source: 'Source',
    packagist: 'Packagist',
    dependsOn: 'Stands on',
    usedBy: 'Used by',
    testedWith: 'Used in the tests of',
    standalone: 'Nothing. It depends on no other library of Tiny Blocks.',
    unused: 'No other library of Tiny Blocks yet.',
    onThisPage: 'On this page',
    /** The title of a library page for search engines and link previews. */
    headline: (title: string) => `${title} for PHP`,
    /** What closes the description of a library page when the summary of the library is short. */
    pitch: 'A small, framework-agnostic PHP library from Tiny Blocks.',
  },
  search: {
    title: 'Search the libraries',
    lede: 'Look up a class, a method, a pattern or a problem to solve.',
    label: 'Search term',
    placeholder: 'E.g. Collection, Instant, correlation id',
    idle: 'Type at least two letters.',
    loading: 'Searching...',
    empty: 'Nothing found. Try another word.',
    unavailable: 'Search only works on the site produced by the build.',
    count: 'Results: {count}',
  },
  notFound: { title: 'Page not found', lede: 'This address does not exist or has moved.', back: 'Back to home' },
} as const

/** The day a release was published, from its ISO 8601 instant, as the site shows it: Oct 24, 2026. */
export function releaseDate(instant: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(instant))
}
