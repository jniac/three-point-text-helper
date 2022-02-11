
const formatNumber = (x, digits, displaySign) => {
  const n = parseInt(digits ?? '1') + 2
  const sign = displaySign !== undefined && String(displaySign) !== 'false'
  let str = parseFloat(x).toFixed(n)
  if (sign && str.startsWith('-') === false) {
    str = '+' + str
  }
  return str.slice(0, n)
}

export const initUI = () => {
  for (const div of document.querySelectorAll('.UI .slider')) {
    const label = div.querySelector('label')
    const labelStr = label.innerText
    const input = div.querySelector('input')
    const update = () => {
      label.innerText = `${labelStr} (${formatNumber(input.value, label.dataset.digits, label.dataset.sign)})`
    }
    input.addEventListener('input', update)
    update()
  }
}