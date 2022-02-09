import { createCanvas } from 'canvas'
import { next_power_of_two } from './utils'

const get_grid_size = (chars_length:number, canvas_width:number, char_width:number) => {
  const width = Math.floor(canvas_width / char_width)
  const height = Math.ceil(chars_length / width)
  return [width, height]
}

const default_args = {
  width: 4096,
  char_width: 64,
  char_height: 120,
  char_offset_x: -0.5,
  char_offset_y: -14,
  color: 'white',
  font: '105px "Roboto Mono" monospace',
  debug: false,
}

type Args = { chars:string } & Partial<typeof default_args>

export default function texture_generator(args:Args) {

  const { 
    chars,
    width,
    char_width,
    char_height,
    char_offset_x,
    char_offset_y,
    color,
    font,
    debug,
  } = { ...default_args, ...args }

  const [grid_width, grid_height] = get_grid_size(chars.length, width, char_width)
  const height = next_power_of_two(grid_height * char_height)
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = color
  ctx.font = font
  ctx.textBaseline = 'top'

  const fill_rect = (color:string, x:number, y:number, width:number, height:number) => {
    const beforeFillStyle = ctx.fillStyle
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    ctx.fillStyle = beforeFillStyle
  }

  const fill_cell = (color:string, x:number, y:number) => {
      fill_rect(color, x * char_width, y * char_height, char_width, char_height)
  }

  if (debug) {
    fill_rect('magenta', 0, 0, width, height)
  }

  let y = 0
  while (y < grid_height) {
    
    const start = y * grid_width
    const stop = Math.min((y + 1) * grid_width, chars.length)

    let x = 0
    for (let index = start; index < stop; index++) {

      if (debug) {
        if ((x + y) % 2 === 0) {
          fill_cell('red', x, y)
        } else {
            fill_cell('blue', x, y)
        }
      }

      const symbol = chars[index]
      const symbol_x = x * char_width + char_offset_x
      const symbol_y = y * char_height + char_offset_y
      ctx.fillText(symbol, symbol_x, symbol_y)
      x++
    }
    y++
  }

  return {
    width,
    height,
    char_width,
    char_height,
    grid_width,
    grid_height,
    canvas,
  }
}
