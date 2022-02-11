import { pth } from './index.js'

const hash = window.location.hash.substring(1)

document.querySelector('.UI').classList.toggle('light', hash !== 'AdditiveBlending')

const select = document.querySelector('.UI select')
select.value = hash
select.onchange = () => {
  const { value } = select
  window.location.hash = value
  window.location.reload()
}

const opacity = document.querySelector('.UI input#opacity')
opacity.oninput = () => {
  pth.opacity = parseFloat(opacity.value)
}