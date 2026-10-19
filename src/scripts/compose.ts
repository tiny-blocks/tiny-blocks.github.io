/**
 * Starts the picture of the home over once it is built, so it keeps playing: the built picture holds for
 * a moment, fades, and plays again from the first line. Under reduced motion it is left standing.
 */
const HOLD = 2800
const FADE = 600

function init(): void {
  const picture = document.querySelector<HTMLElement>('[data-compose]')
  if (picture === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  const cycle = Number(picture.dataset.cycle) + HOLD
  const restart = (): void => {
    picture.classList.add('is-clearing')
    setTimeout(() => {
      picture.classList.remove('is-playing', 'is-clearing')
      void picture.offsetWidth
      picture.classList.add('is-playing')
      setTimeout(restart, cycle)
    }, FADE)
  }
  setTimeout(restart, cycle)
}

init()

export {}
