
import { Mesh, MeshBasicMaterial, TorusKnotGeometry } from 'three'
import { PointTextHelper } from '../../../dist/PointTextHelper.three.js'
import { scene } from '../shared/three-stage.js'
import { WireSphere } from '../shared/WireSphere.js'



// scene:

const sphere = new WireSphere()
scene.add(sphere)

const knot = new Mesh(
  new TorusKnotGeometry(1.2, .5, 400, 64),
  new MeshBasicMaterial({ color: '#6cf', wireframe: true }),
)
scene.add(knot)



// texts:

const pth = new PointTextHelper({ charMax: 12 })
scene.add(pth)

pth.displayVertices(sphere.geometry, {
  color: '#fc9',
  size: .8,
  format: index => `v${index}`,
})

pth.displayFaces(sphere.geometry, {
  color: '#6cf',
  size: .8,
  format: index => `f${index}`,
})

pth.displayVertices(knot.geometry, {
  color: '#6cf',
  size: .14,
})

const { count } = pth.geometry.getAttribute('position')

pth.display({
  color: '#fc9',
  size: 2,
  text: `${count + 1} texts`,
})



// h1:
document.querySelector('h1').innerHTML = `Texts count: ${count + 1}`
