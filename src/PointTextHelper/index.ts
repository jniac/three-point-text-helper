import { AdditiveBlending, Blending, BufferAttribute, BufferGeometry, Color, ColorRepresentation, Points, Vector3 } from 'three'
import { get_count_and_offsets } from '../atlas-utils.js'
import { PointTextHelperMaterial } from './PointTextHelperMaterial'

// CHAR_MAX_LIMIT depends from the max number of gl attributes.
const CHAR_MAX_LIMIT = 12

const defaultDisplayParams = {
  position: { x: 0, y: 0, z: 0 },
  color: 'white',
  size: 1,
  text: 'foo',
}

type DisplayParams = Partial<typeof defaultDisplayParams>

class PointTextHelper extends Points<BufferGeometry, PointTextHelperMaterial> {

  private charMax: number

  constructor({
    charMax = 4,
    blending = AdditiveBlending,
    zOffset = -0.01,
  }: {
    charMax?: number
    blending?: Blending
    zOffset?: number
  } = {}) {

    if (charMax > CHAR_MAX_LIMIT) {
      console.warn(`max chars is ${CHAR_MAX_LIMIT}`)
      charMax = CHAR_MAX_LIMIT
    }

    const geometry = new BufferGeometry()

    geometry.setAttribute('position', new BufferAttribute(new Float32Array(0), 3))
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(0), 3))
    geometry.setAttribute('size', new BufferAttribute(new Float32Array(0), 1))
    geometry.setAttribute('char_count', new BufferAttribute(new Float32Array(0), 1))
    for (let i = 0; i < charMax; i++) {
      geometry.setAttribute(`char_offset_${i}`, new BufferAttribute(new Float32Array(0), 2))
    }

    const material = new PointTextHelperMaterial(charMax, blending, zOffset)
    // const material = new PointsMaterial({ color: 0x888888 });

    super(geometry, material)

    this.charMax = charMax
  }

  private push(name: string, numbers: ArrayLike<number>) {
    const geometry = this.geometry as BufferGeometry
    const buffer = geometry.getAttribute(name)
    const array = new Float32Array(buffer.array.length + numbers.length)
    array.set(buffer.array, 0)
    array.set(numbers, buffer.array.length)
    geometry.setAttribute(name, new BufferAttribute(array, buffer.itemSize))
  }

  private pushFill(name: string, value: number, count: number) {
    const geometry = this.geometry as BufferGeometry
    const buffer = geometry.getAttribute(name)
    const array = new Float32Array(buffer.array.length + count)
    array.set(buffer.array, 0)
    array.fill(value, buffer.array.length)
    geometry.setAttribute(name, new BufferAttribute(array, buffer.itemSize))
  }

  display(params: DisplayParams | DisplayParams[] = defaultDisplayParams) {

    if (Array.isArray(params)) {
      params.forEach(p => this.display(p))
      return
    }

    params = { ...defaultDisplayParams, ...params }

    const { x, y, z } = params.position
    this.push('position', [x, y, z])

    const { r, g, b } = new Color(params.color)
    this.push('color', [r, g, b])

    this.push('size', [params.size])

    const { charMax } = this
    const { count, offsets } = get_count_and_offsets(params.text, charMax)
    this.push('char_count', [count])

    for (let i = 0; i < charMax; i++) {
      this.push(`char_offset_${i}`, offsets[i])
    }
  }

  displayVertices(vertices: Vector3[] | ArrayLike<number> | BufferGeometry, options: {
    size?: number | ((index: number) => number),
    color?: ColorRepresentation | ((index: number) => ColorRepresentation),
    format?: (index: number) => string,
  } = {}) {

    if (vertices instanceof BufferGeometry) {
      return this.displayVertices(vertices.getAttribute('position').array, options)
    }

    const {
      color = 'white',
      size = 1,
      format = undefined,
    } = options

    const isFloat32 = vertices instanceof Float32Array

    const getColor = (typeof color === 'function'
      ? (index: number) => new Color(color(index))
      : (() => {
        const c = new Color(color)
        return () => c
      })())

    const getSize = (typeof size === 'function'
      ? (index: number) => size(index)
      : () => size)

    const length = isFloat32 ? vertices.length / 3 : vertices.length
    const { charMax } = this

    const position_array = isFloat32 ? (vertices as Float32Array) : new Float32Array(length * 3)
    const color_array = new Float32Array(length * 3)
    const size_array = new Float32Array(length)
    const char_count_array = new Float32Array(length)
    const char_offset_array = new Array<Float32Array>(charMax)

    for (let i = 0; i < charMax; i++) {
      char_offset_array[i] = new Float32Array(length * 2)
    }

    if (isFloat32 === false) {
      for (let index = 0; index < length; index++) {
        const { x, y, z } = vertices[index] as Vector3
        position_array[index * 3 + 0] = x
        position_array[index * 3 + 1] = y
        position_array[index * 3 + 2] = z
      }
    }

    for (let index = 0; index < length; index++) {
      const c = getColor(index)
      color_array[index * 3 + 0] = c.r
      color_array[index * 3 + 1] = c.g
      color_array[index * 3 + 2] = c.b

      size_array[index] = getSize(index)

      const text = format?.(index) ?? index.toString(10)
      const { count, offsets } = get_count_and_offsets(text, charMax)
      char_count_array[index] = count
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

  displayFaces(geometry: BufferGeometry, {
    color = 'white',
    size = 1,
    format = undefined,
  }: {
    size?: number,
    color?: string | Color,
    format?: (index: number) => string,
  } = {}) {

    if (geometry['isBufferGeometry']) {
      geometry = geometry as BufferGeometry
      const indexes = geometry.index.array
      const position = geometry.getAttribute('position').array
      const length = indexes.length / 3
      const array = new Float32Array(length * 3)
      for (let index = 0; index < length; index++) {
        const ai = indexes[index * 3 + 0]
        const ax = position[ai * 3 + 0]
        const ay = position[ai * 3 + 1]
        const az = position[ai * 3 + 2]
        const bi = indexes[index * 3 + 1]
        const bx = position[bi * 3 + 0]
        const by = position[bi * 3 + 1]
        const bz = position[bi * 3 + 2]
        const ci = indexes[index * 3 + 2]
        const cx = position[ci * 3 + 0]
        const cy = position[ci * 3 + 1]
        const cz = position[ci * 3 + 2]
        array[index * 3 + 0] = (ax + bx + cx) / 3
        array[index * 3 + 1] = (ay + by + cy) / 3
        array[index * 3 + 2] = (az + bz + cz) / 3
      }
      this.displayVertices(array, { color, size, format })
    }
  }
}

export {
  PointTextHelper
}
