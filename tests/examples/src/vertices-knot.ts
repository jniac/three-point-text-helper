import * as THREE from 'three'
import * as stage from './three-stage'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper, atlas } from '../../../dist/index'
import { threadId } from 'worker_threads'

Object.assign(window, { PointTextHelper, atlas })

new OrbitControls(stage.camera, stage.renderer.domElement)

{
  const background = new THREE.Mesh(
    new THREE.SphereBufferGeometry(10, 60, 30),
    new THREE.MeshBasicMaterial({ 
      color:'#333', 
      wireframe:true,
    }),
  )
  stage.scene.add(background)
  const ph = new PointTextHelper(6)
  background.add(ph)
  ph.displayVertices(background.geometry.attributes['position'].array as Float32Array, {
    size: .4,
    color: '#fff',
    format: i => `{${i}}`,
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
    color:'#0c9', 
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
  const ph = new PointTextHelper(6)
  mesh.add(ph)
  console.log(mesh.geometry.vertices.length)
  ph.displayVertices(mesh.geometry.vertices, {
    size: .2,
    color: '#fff',
    format: i => `#${i}`,
  })
  Object.assign(window, { ph })

  window.addEventListener('z_offset_0', () => ph.z_offset = 0)
  window.addEventListener('z_offset_default', () => ph.z_offset = -.01)
  window.addEventListener('z_offset_big', () => ph.z_offset = -.05)
  window.addEventListener('z_offset_max', () => ph.z_offset = -1)
}
