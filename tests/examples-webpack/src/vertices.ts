import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper } from '../../../dist/PointTextHelper'
import * as stage from './three-stage'


new OrbitControls(stage.camera, stage.renderer.domElement)

stage.scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(10, 60, 30),
  new THREE.MeshBasicMaterial({ color: '#333', wireframe: true }),
))

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshBasicMaterial({ color: 'cyan', wireframe: true }),
)
stage.scene.add(mesh)
// mesh['update'] = () => mesh.rotation.x += .01

{
  const ph = new PointTextHelper({ charMax: 20 })
  mesh.add(ph)

  ph.display({
    text: 'foo',
    size: 2,
  })

  ph.display({
    text: 'Top! ABC 0123',
    position: new THREE.Vector3(0, 1.1, 0),
    color: '#06f',
  })

  ph.display({
    text: 'Bottom',
    position: new THREE.Vector3(0, -1.1, 0),
    color: '#06f',
  })

  ph.display({
    text: 'Right',
    position: new THREE.Vector3(1.1, 0, 0),
    color: '#f1db73',
    size: .5,
  })

  ph.display({
    text: 'Left',
    position: new THREE.Vector3(-1.1, 0, 0),
    color: '#f1db73',
    size: .5,
  })

  Object.assign(window, { ph })
}

{
  const ph = new PointTextHelper({ charMax: 6 })
  mesh.add(ph)
  ph.displayVertices(mesh.geometry.getAttribute('position').array, {
    size: .5,
    color: 'cyan',
    format: i => `#${i}`,
  })
}
