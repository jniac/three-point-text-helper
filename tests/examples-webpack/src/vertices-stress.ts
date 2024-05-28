import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper } from '../../../dist/PointTextHelper'
import * as stage from './three-stage'


new OrbitControls(stage.camera, stage.renderer.domElement)

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4, 60),
  new THREE.MeshBasicMaterial({ color: 'cyan', wireframe: true }),
)
stage.scene.add(mesh)
// mesh['update'] = () => mesh.rotation.x += .01

const ph = new PointTextHelper({ charMax: 6 })
mesh.add(ph)

ph.displayVertices(mesh.geometry.getAttribute('position').array, {
  size: .1,
  color: 'cyan',
  format: i => `#${i}`,
})

