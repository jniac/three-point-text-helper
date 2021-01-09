import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import * as Path from 'path'
import express from 'express'
import { exec } from 'child_process'
import serveIndex from 'serve-index' 
import chalk from 'chalk'

const config = {
  entry: 'src',
  outdir: 'dist',
  port: 8000,
}

const is = {
  glsl: (path:string) => /\.(frag|vert)$/.test(path),
  ts: (path:string) => /\.ts$/.test(path),
}

async function* walk(dir:string) {
  for await (const d of await fs.opendir(dir)) {
    const entry = Path.join(dir, d.name)
    if (d.isDirectory()) {
      yield* walk(entry)
    }
    else if (d.isFile()) {
      yield entry
    }
  }
}

const copy_atlas = async () => {
  await fs.copyFile(`${config.entry}/atlas.js`, `${config.outdir}/atlas.js`)
  await fs.copyFile(`${config.entry}/atlas.d.ts`, `${config.outdir}/atlas.d.ts`)
}

const export_glsl = async (path:string) => {
  const data = await fs.readFile(path, { encoding:'utf-8' })
  const output = Path.resolve(config.outdir, Path.relative(config.entry, path))
  await fs.outputFile(`${output}.js`, `export default /* glsl */\`\n${data}\n\``)
  await fs.outputFile(`${output}.d.ts`, `declare const _default: string;\nexport default _default;\n`)
  console.log(chalk`{cyan export glsl from ${path}}`)
}

const compile_ts = () => new Promise<void>(resolve => {
  const t = Date.now()
  exec('tsc', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
    } else {
      console.log(chalk`{cyan compiled ts {dim ${Date.now() - t}ms}}`)
    }
    resolve()
  })
})

chokidar.watch(`${config.entry}/**/*`)
.on('change', async path => {
 
  console.log(`${path} has changed`)

  if (is.glsl(path)) {
    export_glsl(path)
  }

  else if (is.ts(path)) {
    compile_ts()
  }

  copy_atlas()
})

const app = express()
app.use(express.static('.'), serveIndex('.', { icons:true }))
app.use((req, res) => res.send(req.path))
app.listen(config.port, () => console.log(chalk`{green static server listening on ${config.port}}`))

const build = async () => {

  const t = Date.now()

  await fs.remove(config.outdir)
  await fs.ensureDir(config.outdir)

  for await (const file of walk(config.entry)) {
    if (is.glsl(file)) {
      export_glsl(file)
    }
  }
  
  await copy_atlas()
  await compile_ts()

  console.log(chalk`initial build done {dim ${Date.now() - t}ms}`)
}

build()

console.log('dev started')
