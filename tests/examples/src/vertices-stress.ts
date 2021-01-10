import * as THREE from 'three'
import * as stage from './three-stage'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper } from '../../../dist/index'


new OrbitControls(stage.camera, stage.renderer.domElement)

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4, 60),
  new THREE.MeshBasicMaterial({ color:'cyan', wireframe:true }),
)
stage.scene.add(mesh)
// mesh['update'] = () => mesh.rotation.x += .01

const ph = new PointTextHelper(6)
mesh.add(ph)

console.log(mesh.geometry.vertices.length)
ph.displayVertices(mesh.geometry.vertices, {
  size: .1,
  color: 'cyan',
  format: i => `#${i}`,
})

