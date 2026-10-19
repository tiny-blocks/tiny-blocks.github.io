/**
 * The control that copies the install command of a library. It is drawn only once this script marks the
 * root, so a page whose script never ran shows the command alone, still selectable by hand.
 */
function init(): void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('button[data-copy]')]
  if (buttons.length === 0 || navigator.clipboard === undefined) {
    return
  }
  document.documentElement.dataset.copy = 'on'
  for (const button of buttons) {
    const label = button.textContent ?? ''
    button.addEventListener('click', () => {
      void navigator.clipboard.writeText(button.dataset.copy ?? '').then(() => {
        button.textContent = button.dataset.copied ?? label
        setTimeout(() => {
          button.textContent = label
        }, 1600)
      })
    })
  }
}

init()

export {}
