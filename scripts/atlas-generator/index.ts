import atlas_generator from './atlas-generator'
import * as fs from 'fs-extra'

const chars = [
  '0123456789', 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  ' #@&$%?!',
  '+-_=*/\\|[](){}<>',
  '.;:,',
  '×',
].join('')

const debug = false

// canvas
console.time('create canvas')
const bundle = atlas_generator({ chars, debug })
console.timeEnd('create canvas')



// png
console.time('make src/atlas.png')
const png = fs.createWriteStream('src/atlas.png')
bundle.canvas.createPNGStream()
.pipe(png)
.on('close', () => console.timeEnd('make src/atlas.png'))



// base64
console.time('make src/atlas.js')
const chunks = []
fs.createReadStream('src/atlas.png')
.on('data', data => chunks.push(data))
.on('end', () => {

  const result = Buffer.concat(chunks)
  const str = result.toString('base64')

  fs.outputFile('src/atlas-data.js', `
export default 'data:image/png;base64,${str}'
`.slice(1))

  fs.outputFile('src/atlas-data.d.ts', `
declare const _default: string;
export default _default;
`.slice(1))

  fs.outputFile('src/atlas.ts', `
import atlas_data from './atlas-data'
import * as utils from './atlas-utils'

export const chars = '${chars.replace(/(\\)/, '\\$1')}'
export const width = ${bundle.width}
export const height = ${bundle.height}
export const grid_width = ${bundle.grid_width}
export const grid_height = ${bundle.grid_height}
export const char_width = ${bundle.char_width}
export const char_height = ${bundle.char_height}
export const data = atlas_data
export { utils } 
`.slice(1))

  console.timeEnd('make src/atlas.js')
})
