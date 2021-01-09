import * as atlas from './atlas.js'
import * as THREE from 'three'
import vertexShader from './point.vert'
import fragmentShader from './point.frag'

const img = document.createElement('img')
img.src = atlas.data

const texture = new THREE.Texture(img)

const uniforms = {
  atlas_texture: { value:texture },
  char_size: { value:new THREE.Vector2(atlas.char_width / atlas.width, atlas.char_height / atlas.height) },
}

console.log(uniforms.char_size)

const material = new THREE.RawShaderMaterial({

  uniforms,
  vertexShader,
  fragmentShader,

  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  vertexColors: true,
  flatShading: true,
})

img.onload = () => {
  texture.needsUpdate = true
  material.needsUpdate = true
}

const getCountAndValues = (s:string|number, max:number = 4) => {

  if (typeof s === 'number') {
      s = Math.floor(s).toString(10)
  }

  if (s.length > max) {
      s = s.slice(-max)
  }
  
  const count = s.length

  if (s.length < max) {
      s = s.padEnd(max, '×')
  }

  const values = [...s].map(char => atlas.chars.indexOf(char))

  return { count, values }
}

export class PointTextHelper extends THREE.Points {

  constructor() {
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1).setUsage(THREE.DynamicDrawUsage))
    // const material = new THREE.PointsMaterial({ color: 0x888888 });

    super(geometry, material)
  }

  private updateAttributes(position:number[], color:number[], size:number[], digit_count:number[], digit_values:number[]) {

      const geometry = this.geometry as THREE.BufferGeometry
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3))
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage))

      geometry.setAttribute('digit_values_0', new THREE.Float32BufferAttribute(size.map(x => 1), 1).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute('digit_values_1', new THREE.Float32BufferAttribute(size.map(x => 2), 1).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute('digit_values_2', new THREE.Float32BufferAttribute(size.map(x => 3), 1).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute('digit_values_3', new THREE.Float32BufferAttribute(size.map(x => 4), 1).setUsage(THREE.DynamicDrawUsage))

      geometry.setAttribute('digit_count', new THREE.Float32BufferAttribute(digit_count, 1, false).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute('digit_values', new THREE.Float32BufferAttribute(digit_values, 4, false).setUsage(THREE.DynamicDrawUsage))
  }

  displayVertices(vertices:THREE.Vector3[], { size = 0.1 } = {}) {

    const positions = []
    const colors = []
    const sizes = []
    const digit_count = []
    const digit_values = []

    for (const [i, v] of vertices.entries()) {
      positions.push(v.x, v.y, v.z)
      colors.push(1, 1, 1)
      sizes.push(size)
      
      const {count, values} = getCountAndValues(1000 + i)
      digit_count.push(count)
      digit_values.push(values)
    }

    this.updateAttributes(positions, colors, sizes, digit_count, digit_values)
  }
}

export const foo = 'bar'
