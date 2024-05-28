import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { PointTextHelper } from '../../../dist/PointTextHelper'
import { camera, renderer, scene } from './three-stage'
import { forceMergeVertices } from './utils'

new OrbitControls(camera, renderer.domElement)

const mesh = new THREE.Mesh(
  forceMergeVertices(new THREE.IcosahedronGeometry(1, 0)),
  // toIndexedGeometry(new THREE.IcosahedronGeometry(1, 0)),
  new THREE.MeshBasicMaterial({ color: 'cyan', wireframe: true }),
)
scene.add(mesh)

const pth = new PointTextHelper({ charMax: 10 })
mesh.add(pth)

// display some text
pth.display({ text: 'hello!', color: 'cyan' })
pth.display({ text: 'top', color: 'cyan', size: .5, position: new THREE.Vector3(0, 1, 0) })
pth.display({ text: 'bottom', color: 'cyan', size: .5, position: { x: 0, y: -1, z: 0 } })

// // display vertice from an of vertices...
pth.displayVertices(mesh.geometry.getAttribute('position').array)

// or from a buffer (be aware that in buffer geometries vertices are most often duplicated)
const geometry = new THREE.SphereGeometry(1.4, 12, 24)
pth.displayVertices(geometry.getAttribute('position').array, {
  color: '#fc9',
  size: .3,
})
