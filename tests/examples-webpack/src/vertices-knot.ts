import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper, atlas } from '../../../dist/PointTextHelper'
import * as stage from './three-stage'

Object.assign(window, { PointTextHelper, atlas })

new OrbitControls(stage.camera, stage.renderer.domElement)

{
  const background = new THREE.Mesh(
    new THREE.SphereGeometry(10, 60, 30),
    new THREE.MeshBasicMaterial({
      color: '#333',
      wireframe: true,
    }),
  )
  stage.scene.add(background)
  const ph = new PointTextHelper({ charMax: 6 })
  background.add(ph)
  ph.displayVertices(background.geometry.attributes['position'].array as Float32Array, {
    size: .4,
    color: '#fff',
    format: i => `{${i}}`,
  })
  ph.displayFaces(background.geometry, {
    size: .2,
    color: '#fff',
    format: i => `-${i}-`,
  })
  ph.material['opacity'] = .5
  Object.assign(window, { background })
}


{
  const light = new THREE.AmbientLight()
  light.intensity = .2
  stage.scene.add(light)
}

{
  const light = new THREE.PointLight()
  light.position.set(14, 4, 2)
  stage.scene.add(light)
}

const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, .4, 128 * 1.5, 8),
  new THREE.MeshPhysicalMaterial({
    color: '#0c9',
    // wireframe:true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.3,
  }),
)
stage.scene.add(mesh)

mesh.add(new THREE.Mesh(
  mesh.geometry,
  new THREE.MeshBasicMaterial({
    color: '#000',
    opacity: .5,
    transparent: true,
    wireframe: true,
  })
))

{
  const ph = new PointTextHelper({ charMax: 6 })
  mesh.add(ph)
  ph.displayVertices(mesh.geometry.getAttribute('position').array, {
    size: .2,
    color: '#fff',
    format: i => `v${i}`,
  })

  ph.displayFaces(mesh.geometry, {
    size: .1,
    color: 'cyan',
    format: i => `f${i}`,
  })
  Object.assign(window, { ph })

  window.addEventListener('z_offset_0', () => ph.material.zOffset = 0)
  window.addEventListener('z_offset_default', () => ph.material.zOffset = -.01)
  window.addEventListener('z_offset_big', () => ph.material.zOffset = -.05)
  window.addEventListener('z_offset_max', () => ph.material.zOffset = -1)
}
