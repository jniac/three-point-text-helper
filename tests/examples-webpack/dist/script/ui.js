
for (const button of document.querySelectorAll('button')) {

  button.addEventListener('click', (e) => {
    const type = button.dataset.buttonType
    window.dispatchEvent(new CustomEvent(type))
    window.dispatchEvent(new CustomEvent('auto_pause_reset'))

    const parent = e.currentTarget.parentElement
    if (parent.classList.contains('toggle')) {
      for (const child of parent.children) {
        child.classList.toggle('selected', child === e.currentTarget)
      }
    }
  })
}

window.addEventListener('keydown', e => {
  if (e.key === 'u') {
    document.querySelector('#UI').classList.toggle('hidden')
  }
})

