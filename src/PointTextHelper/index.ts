import * as atlas from '../atlas.js'
import * as THREE from 'three'
import vertexShader from './point.vert'
import fragmentShader from './point.frag'
import get_material from './get-material.js'
import { get_char_offset, get_count_and_offsets } from '../atlas-utils.js'

const CHAR_MAX_LIMIT = 14

const defaultDisplay = {
  position: { x:0, y:0, z:0 }, 
  color: 'white', 
  size: 1,
  text: 'foo',
}

class PointTextHelper extends THREE.Points {

  private charMax:number

  constructor(charMax:number = 4) {

    if (charMax > CHAR_MAX_LIMIT) {
      console.warn(`max chars is ${CHAR_MAX_LIMIT}`)
      charMax = CHAR_MAX_LIMIT
    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1))
    geometry.setAttribute('char_count', new THREE.Float32BufferAttribute([], 1))
    for (let i = 0; i < charMax; i++) {
      geometry.setAttribute(`char_offset_${i}`, new THREE.Float32BufferAttribute([], 2))
    }
    
    const material = get_material(charMax)
    // const material = new THREE.PointsMaterial({ color: 0x888888 });

    super(geometry, material)

    this.charMax = charMax
  }

  private updateAttributes(position:number[], color:number[], size:number[]) {

      const geometry = this.geometry as THREE.BufferGeometry
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3))
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 1))
      geometry.setAttribute('char_offset_X', new THREE.Float32BufferAttribute(size.flatMap((v, i) => get_char_offset(i)), 2).setUsage(THREE.DynamicDrawUsage))
  }

  display(params:Partial<typeof defaultDisplay> = defaultDisplay) {

    params = { ...defaultDisplay,  ...params }

    const push = (name:string, ...numbers:number[]) => {
      const geometry = this.geometry as THREE.BufferGeometry
      const buffer = geometry.getAttribute(name)
      const array = [...buffer.array as Float32Array]
      array.push(...numbers)
      geometry.setAttribute(name, new THREE.Float32BufferAttribute(array, buffer.itemSize))
    }

    const { x, y, z } = params.position
    push('position', x, y, z)
    
    const { r, g, b } = new THREE.Color(params.color)
    push('color', r, g, b)
    
    push('size', params.size)

    const { charMax } = this
    const { count, offsets } = get_count_and_offsets(params.text, charMax)
    push('char_count', count)

    for (let i = 0; i < charMax; i++) {
      push(`char_offset_${i}`, ...offsets[i])
    }
  }

  // displayVertices(vertices:THREE.Vector3[]) {

  //   const position = []
  //   const color = []
  //   const size = []

  //   const char_count:number[] = []
  //   const char_offset:number[][] = []

  //   const { charMax } = this

  //   for (let i = 0; i < charMax; i++) {
  //     char_offset[i] = []
  //   }

  //   for (const [i, v] of vertices.entries()) {
  //     position.push(v.x, v.y, v.z)
  //     color.push(1, 1, 1)
  //     size.push(1)
      
  //     const { count, indexes } = get_count_and_indexes(i, charMax)
  //     char_count.push(count)
  //     for (let i = 0; i < charMax; i++) {
  //       const index = indexes[i]
  //       const [x, y] = get_char_offset(index)
  //       char_offset[i].push(x, y)
  //     }
  //   }

  //   const geometry = this.geometry as THREE.BufferGeometry
  //   geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  //   geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3))
  //   geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 1))

  //   for (let i = 0; i < charMax; i++) {
  //     geometry.setAttribute(`char_offset_${i}`, new THREE.Float32BufferAttribute(char_offset[i], 2))
  //   }
  // }
}

export {
  PointTextHelper,
}