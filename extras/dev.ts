import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import * as Path from 'path'
import * as express from 'express'
import { exec } from 'child_process'
import * as serveIndex from 'serve-index' 

const config = {
  entry: 'src',
  output: 'dist',
  port: 8000,
}

const copy_atlas = async () => {
  await fs.copyFile(`${config.entry}/atlas.js`, `${config.output}/atlas.js`)
  await fs.outputFile(`${config.output}/atlas.d.ts`, `
export declare const chars:string;
export declare const width:number;
export declare const height:number;
export declare const grid_width:number;
export declare const grid_height:number;
export declare const char_width:number;
export declare const char_height:number;
export declare const data:string;
  `)
}

const export_glsl = async (path:string) => {
  const data = await fs.readFile(path, { encoding:'utf-8' })
  const output = Path.resolve(config.output, Path.relative(config.entry, path))
  await fs.outputFile(`${output}.js`, `export default /* glsl */\`\n${data}\n\``)
  await fs.outputFile(`${output}.d.ts`, `declare const _default: string;\nexport default _default;\n`)
  console.log(`export glsl from ${path}.`)
}

const compile_ts = () => {
  const t = Date.now()
  exec('tsc', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`compiled ts ${Date.now() - t}ms`)
    }
  })
}

chokidar.watch(`${config.entry}/**/*`)
.on('change', async path => {
 
  console.log(`${path} has changed`)

  if (/\.(frag|vert)$/.test(path)) {
    export_glsl(path)
  }

  else if (/\.ts$/.test(path)) {
    compile_ts()
  }

  copy_atlas()
})

const app = express()
app.use(express.static('.'), serveIndex('.', { icons:true }))
app.use((req, res) => res.send(req.path))
app.listen(config.port, () => console.log(`static server listening on ${config.port}`))

console.log('dev started')
