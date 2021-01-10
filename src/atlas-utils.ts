import { chars, grid_width } from './atlas'

export const get_char_offset = (char:string|number) => {

  if (typeof char === 'number') {
    char = char.toString(10)[0]
  }
  
  const index = chars.indexOf(char)
  if (index === -1) {
    return [0, 0]
  }

  const x = index % grid_width
  const y = Math.floor(index / grid_width)
  return [x, y]
}

export const get_char_index = (char:string) => {
  const index = chars.indexOf(char)
  return index === -1 ? chars.indexOf(' ') : index
}


export const get_count_and_offsets = (s:string|number, max:number = 4) => {

  if (typeof s === 'number') {
    s = Math.floor(s).toString(10)
  }

  if (s.length > max) {
    s = s.slice(0, max)
  }
  
  const count = s.length

  if (s.length < max) {
    s = s.padEnd(max, ' ')
  }

  const offsets = [...s]
    .map(get_char_offset)

  return { count, offsets }
}

Object.assign(window, { get_char_index, get_char_offset, get_count_and_offsets })
