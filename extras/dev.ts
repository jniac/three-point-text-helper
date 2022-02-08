import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import express from 'express'
import { exec } from 'child_process'
import serveIndex from 'serve-index' 
import chalk from 'chalk'

const config = {
  entry: 'src',
  outdir: 'dist',
  port: 8000,
  three: 'https://threejs.org/build/three.module.js',
}

const copy_atlas = async () => {
  await fs.ensureDir(`${config.outdir}/PointTextHelper`)
  await fs.copyFile(`${config.entry}/atlas-data.js`, `${config.outdir}/PointTextHelper/atlas-data.js`)
}

const build_three_version = async () => {
  const atlas_data = (await fs.readFile(`${config.outdir}/PointTextHelper/atlas-data.js`, 'utf-8')).slice(15).trim()
  const data = (await fs.readFile(`${config.outdir}/PointTextHelper/index.js`, 'utf-8'))
    .replace(`import atlas_data from './atlas-data.js';\n`, '')
    .replace(`from 'three';\n`, `from '${config.three}';\n\nconst atlas_data = ${atlas_data};\n`)
  await fs.outputFile(`${config.outdir}/PointTextHelper.three.js`, data)
}

const compile_ts = () => new Promise<void>(resolve => {
  const t = Date.now()
  exec('npx rollup -c', (err, stdout, stderr) => {
    if (err) {
      console.log(stderr)
      console.log(stdout)
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

  await copy_atlas()
  await compile_ts()
  await build_three_version()
})

const app = express()
app.use(express.static('.'), serveIndex('.', { icons:true }))
app.use((req, res) => res.send(req.path))
app.listen(config.port, () => console.log(chalk`{green static server listening on ${config.port}}`))

const build = async () => {

  const t = Date.now()

  await fs.remove(config.outdir)
  await fs.ensureDir(config.outdir)

  await copy_atlas()
  await compile_ts()
  await build_three_version()


  console.log(chalk`initial build done {dim ${Date.now() - t}ms}`)
}

build()

let startWebpack = false
if (startWebpack) {
  console.log(chalk`{cyan webpack (tests/examples) start...}`)
  const child = exec(`
  cd tests/examples
  webpack --watch --mode development
  `, (err, stdout, stderr) => {
    if (err) console.error(err)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}

console.log('dev started')
