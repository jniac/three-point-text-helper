import * as THREE from 'https://threejs.org/build/three.module.js'
import { scene, camera } from '../three-stage.js'
import { PointTextHelper } from 'https://jniac.github.io/three-point-text-helper/dist/PointTextHelper.three.js'

camera.position.set(-1.4, 3.3, 3.5)
camera.lookAt(0, 0, 0)

// background
scene.add(new THREE.Mesh(
  new THREE.SphereBufferGeometry(10, 60, 30),
  new THREE.MeshBasicMaterial({ color:'#333', wireframe:true }),
))

// frame
scene.add(new THREE.AxesHelper())

const A = new THREE.Vector3( 0.0,  0.0,  0.0)
const B = new THREE.Vector3( 1.4, -0.2,  1.0)
const C = new THREE.Vector3( 0.5,  1.4, -1.4)
const geometry = new THREE.Geometry()
geometry.vertices.push(A, B, C)
geometry.faces.push(new THREE.Face3(0, 1, 2))
geometry.computeBoundingSphere()

const AB = new THREE.Vector3().subVectors(B, A)
const AC = new THREE.Vector3().subVectors(C, A)
const axeX = AB.clone().normalize()
const axeZ = new THREE.Vector3().crossVectors(AB, AC).normalize()
const axeY = new THREE.Vector3().crossVectors(axeZ, AB).normalize()

scene.add(new THREE.ArrowHelper(axeX, A, 1, 'magenta'))
scene.add(new THREE.ArrowHelper(axeZ, A, 1, 'yellow'))
scene.add(new THREE.ArrowHelper(axeY, A, 1, 'magenta'))

const grid = new THREE.GridHelper(1, 10, 'magenta', 'magenta')
grid.up = axeZ
grid.lookAt(axeX)
grid.position.set((axeX.x + axeY.x) / 2, (axeX.y + axeY.y) / 2, (axeX.z + axeY.z) / 2)
scene.add(grid)

const material =   new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 'white',
})

const ABC = new THREE.Mesh(geometry, material)
scene.add(ABC)

const pth = new PointTextHelper({ charMax:12 })
scene.add(pth)
pth.display({ position:A, text:'A' })
pth.display({ position:B, text:'B' })
pth.display({ position:C, text:'C' })
pth.display({ position:axeZ.clone().multiplyScalar(1.1), text:'AB × AC', color:'yellow' })

Object.assign(window, { scene, camera, THREE, W: axeY })