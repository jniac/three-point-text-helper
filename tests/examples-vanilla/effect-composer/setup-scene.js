import { Mesh, MeshBasicMaterial, TorusKnotGeometry } from 'three'
import { PointTextHelper } from '../../../dist/PointTextHelper.three.js'
import { scene } from '../shared/three-stage.js'
import { WireSphere } from '../shared/three-utils.js'



// scene:
const sphere = new WireSphere()
scene.add(sphere)
const torus = new Mesh(
  new TorusKnotGeometry(1.2, .5, 200, 32),
  new MeshBasicMaterial({ color: '#6cf', wireframe: true })
)
scene.add(torus)



// texts:
const pth = new PointTextHelper()
scene.add(pth)

pth.displayVertices(sphere.geometry.getAttribute('position').array, {
  color: '#fc9',
  size: .3,
  format: index => `v${index}`,
})

pth.displayFaces(sphere.geometry, {
  color: '#6cf',
  size: .3,
  format: index => `f${index}`,
})

pth.displayVertices(torus.geometry.getAttribute('position').array, {
  color: '#6cf',
  size: .1,
})
