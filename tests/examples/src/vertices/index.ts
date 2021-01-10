import * as THREE from 'three'
import * as stage from './three-stage'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper } from '../../../../dist/index'


new OrbitControls(stage.camera, stage.renderer.domElement)

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshBasicMaterial({ color:'cyan', wireframe:true }),
)
stage.scene.add(mesh)
// mesh['update'] = () => mesh.rotation.x += .01

const ph = new PointTextHelper(20)
// ph.displayVertices(mesh.geometry.vertices)
ph.display({
  text: 'foo'
})
ph.display({
  text: 'hello ABC 0123',
  position: new THREE.Vector3(0, 1, 0),
  color: 'yellow',
})
stage.scene.add(ph)

Object.assign(window, {ph})