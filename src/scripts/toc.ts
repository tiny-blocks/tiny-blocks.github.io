/**
 * Marks the heading being read in the index of a library page, and folds the index on a narrow screen,
 * where it would otherwise push the documentation down. The page is complete without it: each entry of
 * the index is a link to a heading that exists, and the index starts open.
 */
function markCurrentHeading(): void {
  const links = new Map<string, HTMLAnchorElement>()
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')) {
    const target = link.dataset.tocLink
    if (target) {
      links.set(target, link)
    }
  }
  const headings = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((heading): heading is HTMLElement => heading !== null)
  if (headings.length === 0) {
    return
  }

  let current: HTMLAnchorElement | undefined
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      const link = visible && links.get(visible.target.id)
      if (link && link !== current) {
        current?.removeAttribute('aria-current')
        link.setAttribute('aria-current', 'location')
        current = link
      }
    },
    { rootMargin: '0px 0px -75% 0px', threshold: 0 },
  )
  for (const heading of headings) {
    observer.observe(heading)
  }
}

function foldOnNarrowScreens(): void {
  const index = document.querySelector<HTMLDetailsElement>('[data-toc]')
  if (index !== null && window.matchMedia('(max-width: 63.99rem)').matches) {
    index.open = false
  }
}

foldOnNarrowScreens()
markCurrentHeading()

export {}
