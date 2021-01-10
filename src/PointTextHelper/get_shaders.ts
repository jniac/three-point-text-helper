import vertexShaderSource from './point.vert'
import fragmentShaderSource from './point.frag'

const get_numbers = (max:number) => {
  const array = new Array<number>(max)
  for (let i = 0; i < max; i++) {
    array[i] = i
  }
  return array
}

const tab = '  '

const map_vert_declare = (i:number) => `
attribute vec2 char_offset_${i};
varying vec2 v_char_offset_${i};
`.slice(1)

const map_vert_compute = (i:number) => `
${tab}v_char_offset_${i} = char_offset_${i};
`.slice(1)

const map_frag_declare = (i:number) => `
varying vec2 v_char_offset_${i};
`.slice(1)

const get_shaders = (char_max:number) => {

  const vert_declare = get_numbers(char_max).map(map_vert_declare).join('')
  const vert_compute = get_numbers(char_max).map(map_vert_compute).join('')

  const vertexShader = vertexShaderSource
    .replace(/ *\/\/ REPLACE-DECLARE[\s\S]*?REPLACE-END/, vert_declare)
    .replace(/ *\/\/ REPLACE-COMPUTE[\s\S]*?REPLACE-END/, vert_compute)

  const frag_declare = get_numbers(char_max).map(map_frag_declare).join('')
  const array = new Array<string>()
  for (let i = 0; i < char_max; i++) {
    array.push(i === 0 ? tab : `${tab}} else `)
    array.push(i < char_max - 1 ? `if (position.x < ${i + 1}.0 / char_max) ` : '')
    array.push(`{\n`)
    array.push(`${tab}${tab}gl_FragColor = get_texel(position, v_char_offset_${i}, ${i}.0);\n`)
  }
  array.push(`${tab}}\n`)
  const frag_compute = array.join('')

  const fragmentShader = fragmentShaderSource
    .replace(/ *\/\/ REPLACE-DECLARE[\s\S]*?REPLACE-END/, frag_declare)
    .replace(/ *\/\/ REPLACE-COMPUTE[\s\S]*?REPLACE-END/, frag_compute)
  
  return [vertexShader, fragmentShader]
}

export {
  get_shaders,
}
