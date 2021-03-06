import glslify from 'rollup-plugin-glslify'
import typescript from '@rollup/plugin-typescript'

// https://github.com/glslify/rollup-plugin-glslify#options
const glslify_options = {
  compress: false,
}
export default {
  input: 'src/index.ts',
  external: ['three', /atlas-data\.js/],
  output: {
    dir: 'dist/PointTextHelper',
    format: 'module',
  },
  plugins: [glslify(glslify_options), typescript()],
}