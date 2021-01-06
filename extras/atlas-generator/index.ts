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



// canvas
console.time('create canvas')
const canvas = atlas_generator({ chars, debug:true })
console.timeEnd('create canvas')



// png
console.time('make src/atlas.png')
const png = fs.createWriteStream('src/atlas.png')
canvas.createPNGStream()
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
  fs.outputFile('src/atlas.js', `export default 'data:image/png;base64,${str}'`)
  console.timeEnd('make src/atlas.js')
})