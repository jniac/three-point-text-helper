import { initUI } from '../shared/UI.js'
import { pth } from './index.js'

initUI()

const hash = window.location.hash.substring(1)

document.querySelector('.UI').classList.toggle('light', hash !== 'AdditiveBlending')

const select = document.querySelector('.UI select')
select.value = hash || 'MultiplyBlending'
select.onchange = () => {
  const { value } = select
  window.location.hash = value
  window.location.reload()
}

const alphaDiscard = document.querySelector('.UI input#alphaDiscard')
alphaDiscard.oninput = () => {
  pth.material.alphaDiscard = parseFloat(alphaDiscard.value)
}

const zOffset = document.querySelector('.UI input#zOffset')
zOffset.oninput = () => {
  pth.zOffset = parseFloat(zOffset.value)
}
