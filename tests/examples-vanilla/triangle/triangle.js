import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from 'three'

export const A = new Vector3(0.0, 0.0, 0.0)
export const B = new Vector3(1.4, -0.2, 1.0)
export const C = new Vector3(0.5, 1.4, -1.4)

const geometry = new BufferGeometry()
const vertices = new Float32Array([
  ...A.toArray(),
  ...B.toArray(),
  ...C.toArray(),
])
geometry.setAttribute('position', new BufferAttribute(vertices, 3))
geometry.computeBoundingSphere()

export const triangle = new Object3D()
triangle.add(new Mesh(geometry, new MeshBasicMaterial({ wireframe: true })))
triangle.add(new Mesh(geometry, new MeshBasicMaterial({ opacity:.08, transparent: true, depthWrite: false })))
