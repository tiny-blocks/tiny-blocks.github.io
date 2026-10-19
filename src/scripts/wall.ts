/**
 * Lights the wall of the home: pointing at a brick, or focusing it, marks it as chosen, marks what it
 * stands on and what stands on it, and dims the rest. The wall is complete without it.
 */
function init(): void {
  const wall = document.querySelector<HTMLElement>('[data-wall]')
  if (wall === null) {
    return
  }
  const bricks = [...wall.querySelectorAll<HTMLElement>('[data-brick]')]
  const clear = (): void => {
    wall.removeAttribute('data-lit')
    for (const brick of bricks) {
      brick.removeAttribute('data-state')
    }
  }
  const light = (chosen: HTMLElement): void => {
    const dependencies = new Set(chosen.dataset.dependencies?.split(' '))
    const consumers = new Set(chosen.dataset.consumers?.split(' '))
    wall.dataset.lit = ''
    for (const brick of bricks) {
      const name = brick.dataset.brick ?? ''
      const state =
        brick === chosen ? 'chosen' : dependencies.has(name) ? 'dependency' : consumers.has(name) ? 'consumer' : null
      if (state === null) {
        brick.removeAttribute('data-state')
      } else {
        brick.dataset.state = state
      }
    }
  }
  for (const brick of bricks) {
    brick.addEventListener('pointerenter', () => light(brick))
    brick.addEventListener('focus', () => light(brick))
  }
  wall.addEventListener('pointerleave', clear)
  wall.addEventListener('focusout', (event) => {
    if (!wall.contains(event.relatedTarget as Node | null)) {
      clear()
    }
  })
}

init()

export {}
