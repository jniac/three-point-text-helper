import { BufferAttribute, BufferGeometry, Vector2, Vector3 } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'

/**
 * To force the merge of vertices, we need to remove the uv and normal attributes.
 */
export function forceMergeVertices(geometry: BufferGeometry): BufferGeometry {
  geometry = geometry.clone()
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  geometry = mergeVertices(geometry)
  return geometry
}

export function toIndexedGeometry(geometry: BufferGeometry, { epsilon = .0001 } = {}): BufferGeometry {
  if (geometry.index) {
    return geometry
  }

  function cantorPair(a: number, b: number): number {
    return (a + b) * (a + b + 1) / 2 + b
  }

  function hashVector3({ x, y, z }: Vector3): number {
    x = Math.round(x / epsilon)
    y = Math.round(y / epsilon)
    z = Math.round(z / epsilon)
    return cantorPair(cantorPair(x, y), z)
  }

  const oldPositionHashToIndex = new Map<number, number>()
  const oldPositionIndexes = new Array<number>()

  function retrieveOrAdd(position: Vector3, positionIndex: number): number {
    const hash = hashVector3(position)
    const index = oldPositionHashToIndex.get(hash)
    if (index !== undefined) {
      return index
    }
    const newIndex = oldPositionIndexes.length
    oldPositionHashToIndex.set(hash, newIndex)
    oldPositionIndexes.push(positionIndex)
    return newIndex
  }

  const oldPosition = geometry.getAttribute('position')
  const oldPositionArray = oldPosition.array as ArrayLike<number>
  for (let i = 0; i < oldPositionArray.length; i += 3) {
    const vector = new Vector3().fromArray(oldPositionArray, i)
    retrieveOrAdd(vector, i / 3)
  }

  // Build new geometry
  const result = new BufferGeometry()

  const v3 = new Vector3()
  const indexCount = oldPositionArray.length / 3
  const indexArray = new Uint32Array(indexCount)
  for (let i = 0; i < indexCount; i++) {
    v3.fromArray(oldPositionArray, i * 3)
    const hash = hashVector3(v3)
    indexArray[i] = oldPositionHashToIndex.get(hash)!
  }
  const index = new BufferAttribute(indexArray, 1)
  result.setIndex(index)

  const newPositionArray = new Float32Array(oldPositionIndexes.length * 3)
  for (let i = 0; i < oldPositionIndexes.length; i++) {
    const index = oldPositionIndexes[i]
    v3
      .fromArray(oldPositionArray, index * 3)
      .toArray(newPositionArray, i * 3)
  }
  result.setAttribute('position', new BufferAttribute(newPositionArray, 3))

  const oldUv = geometry.getAttribute('uv')
  if (oldUv) {
    const oldUvArray = oldUv.array as ArrayLike<number>
    const newUvArray = new Float32Array(oldPositionIndexes.length * 2)
    const v2 = new Vector2()
    for (let i = 0; i < oldPositionIndexes.length; i++) {
      const index = oldPositionIndexes[i]
      v2
        .fromArray(oldUvArray, index * 2)
        .toArray(newUvArray, i * 2)
    }
    result.setAttribute('uv', new BufferAttribute(newUvArray, 2))
  }

  return result
}
