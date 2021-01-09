import * as fs from 'fs-extra'

const main = async () => {
  const code = await fs.readFile('dist/index.d.ts', { encoding:'utf-8' })
  await fs.outputFile('dist/index.d.ts', `import * as THREE from 'three';\n\n${code}`)
}

main()