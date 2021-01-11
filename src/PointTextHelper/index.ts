import * as THREE from 'three'
import get_material from './get_material.js'
import { get_count_and_offsets } from '../atlas-utils.js'

const CHAR_MAX_LIMIT = 12

const defaultDisplayParams = {
  position: { x:0, y:0, z:0 }, 
  color: 'white', 
  size: 1,
  text: 'foo',
}

class PointTextHelper extends THREE.Points {

  private charMax:number

  constructor({ 
    charMax = 4,
  }:{
    charMax?:number,
  } = {}) {

    if (charMax > CHAR_MAX_LIMIT) {
      console.warn(`max chars is ${CHAR_MAX_LIMIT}`)
      charMax = CHAR_MAX_LIMIT
    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(0), 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(0), 1))
    geometry.setAttribute('char_count', new THREE.BufferAttribute(new Float32Array(0), 1))
    for (let i = 0; i < charMax; i++) {
      geometry.setAttribute(`char_offset_${i}`, new THREE.BufferAttribute(new Float32Array(0), 2))
    }
    
    const material = get_material(charMax)
    // const material = new THREE.PointsMaterial({ color: 0x888888 });

    super(geometry, material)

    this.charMax = charMax
  }

  private push(name:string, numbers:ArrayLike<number>) {
    const geometry = this.geometry as THREE.BufferGeometry
    const buffer = geometry.getAttribute(name)
    const array = new Float32Array(buffer.array.length + numbers.length)
    array.set(buffer.array, 0)
    array.set(numbers, buffer.array.length)
    geometry.setAttribute(name, new THREE.BufferAttribute(array, buffer.itemSize))
  }

  private pushFill(name:string, value:number, count:number) {
    const geometry = this.geometry as THREE.BufferGeometry
    const buffer = geometry.getAttribute(name)
    const array = new Float32Array(buffer.array.length + count)
    array.set(buffer.array, 0)
    array.fill(value, buffer.array.length)
    geometry.setAttribute(name, new THREE.BufferAttribute(array, buffer.itemSize))
  }

  display(params:Partial<typeof defaultDisplayParams> = defaultDisplayParams) {

    params = { ...defaultDisplayParams,  ...params }

    const { x, y, z } = params.position
    this.push('position', [x, y, z])
    
    const { r, g, b } = new THREE.Color(params.color)
    this.push('color', [r, g, b])
    
    this.push('size', [params.size])

    const { charMax } = this
    const { count, offsets } = get_count_and_offsets(params.text, charMax)
    this.push('char_count', [count])

    for (let i = 0; i < charMax; i++) {
      this.push(`char_offset_${i}`, offsets[i])
    }
  }

  displayVertices(vertices:THREE.Vector3[]|ArrayLike<number>, {
    color = 'white',
    size = 1,
    format = undefined,
  }:{
    size?: number,
    color?: string | THREE.Color,
    format?: (index:number) => string,
  } = {}) {

    const isFloat32 = vertices instanceof Float32Array
    
    const { r, g, b } = new THREE.Color(color)

    const length = isFloat32 ? vertices.length / 3 : vertices.length
    const { charMax } = this
    console.log({ isFloat32, length })
    
    const position_array = isFloat32 ? (vertices as Float32Array) : new Float32Array(length * 3)
    const color_array = new Float32Array(length * 3)
    const size_array = new Float32Array(length)
    const char_count_array = new Float32Array(length)
    const char_offset_array = new Array<Float32Array>(charMax)
    for (let i = 0; i < charMax; i++) {
      char_offset_array[i] = new Float32Array(length * 2)
    }

    for (let index = 0; index < length; index++) {

      if (isFloat32 === false) {
        const { x, y, z } =  vertices[index] as THREE.Vector3
        position_array[index * 3 + 0] = x
        position_array[index * 3 + 1] = y
        position_array[index * 3 + 2] = z
      }

      color_array[index * 3 + 0] = r
      color_array[index * 3 + 1] = g
      color_array[index * 3 + 2] = b

      size_array[index] = size

      const text = format?.(index) ?? index.toString(10)
      const { count, offsets } = get_count_and_offsets(text, charMax)
      char_count_array[index] = count;
      for (let i = 0; i < charMax; i++) {
        const [x, y] = offsets[i]
        char_offset_array[i][index * 2 + 0] = x
        char_offset_array[i][index * 2 + 1] = y
      }
    }

    this.push('position', position_array)
    this.push('color', color_array)
    this.push('size', size_array)
    this.push('char_count', char_count_array)
    for (let i = 0; i < charMax; i++) {
      this.push(`char_offset_${i}`, char_offset_array[i])
    }
  }

  get z_offset() { return this.material['uniforms'].z_offset.value as number }
  set z_offset(value:number) { this.material['uniforms'].z_offset.value = value }

  get opacity() { return this.material['uniforms'].opacity.value as number }
  set opacity(value:number) { this.material['uniforms'].opacity.value = value }
}

export {
  PointTextHelper,
}