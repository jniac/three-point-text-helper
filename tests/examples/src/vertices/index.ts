import * as THREE from 'three'
import * as stage from '../three-stage'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointTextHelper } from '../../../../dist/index'


new OrbitControls(stage.camera, stage.renderer.domElement)

const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshBasicMaterial({ color:'cyan', wireframe:true }),
)
stage.scene.add(mesh)
// mesh['update'] = () => mesh.rotation.x += .01

{
  const ph = new PointTextHelper(20)
  stage.scene.add(ph)
  
  ph.display({
    text: 'foo'
  })
  
  ph.display({
    text: 'hello ABC 0123',
    position: new THREE.Vector3(0, 1.3, 0),
    color: '#06f',
  })
  
  ph.display({
    text: 'Bottom',
    position: new THREE.Vector3(0, -1.3, 0),
    color: '#f1db73',
    size: .5,
  })
  
  ph.display({
    text: 'Right',
    position: new THREE.Vector3(1.3, 0, 0),
    color: '#f1db73',
    size: .5,
  })

  Object.assign(window, {ph})
}

{
  const ph = new PointTextHelper(6)
  stage.scene.add(ph)
  console.log(mesh.geometry.vertices.length)
  ph.displayVertices(mesh.geometry.vertices, {
    size: .3,
    color: 'cyan',
    format: i => `#${i}`,
  })
}
