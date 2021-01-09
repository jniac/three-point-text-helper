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
const bundle = atlas_generator({ chars, debug:true })
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
  fs.outputFile('src/atlas.js', `
export const chars = '${chars}';
export const width = ${bundle.width};
export const height = ${bundle.height};
export const grid_width = ${bundle.grid_width};
export const grid_height = ${bundle.grid_height};
export const char_width = ${bundle.char_width};
export const char_height = ${bundle.char_height};
export const data = 'data:image/png;base64,${str}';
`)
  fs.outputFile('src/atlas.d.ts', `
export declare const chars:string;
export declare const width:number;
export declare const height:number;
export declare const grid_width:number;
export declare const grid_height:number;
export declare const char_width:number;
export declare const char_height:number;
export declare const data:string;
  `)
  console.timeEnd('make src/atlas.js')
})
