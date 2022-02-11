import { AdditiveBlending, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MultiplyBlending, NormalBlending, OctahedronGeometry, RawShaderMaterial, SphereGeometry, Vector3 } from 'three'
import { PointTextHelper } from '../../../dist/PointTextHelper.three.js'
import { camera, orbitControls, renderer, scene } from '../shared/three-stage.js'
import { LightRig1, WireSphere } from '../shared/three-utils.js'
import './UI.js'

const getBlending = () => {
  const hash = window.location.hash.substring(1)
  if (hash === 'NormalBlending') return NormalBlending
  if (hash === 'AdditiveBlending') return AdditiveBlending
  return MultiplyBlending
}

renderer.setClearColor(getBlending() !== AdditiveBlending ? 'white' : '#333')

camera.position.set(5, 0.5, -0.5)
orbitControls.update()

scene.add(new LightRig1())

const wireSphere = new WireSphere()
scene.add(wireSphere)

const sphere = new Mesh(
  new SphereGeometry(),
  new MeshBasicMaterial({
    color: '#999',
    wireframe: true,
    opacity: getBlending() !== AdditiveBlending ? 1 : .3,
    transparent: true,
    blending: getBlending(),
  })
)
scene.add(sphere)

const octahedron = new Mesh(
  new OctahedronGeometry(),
  new MeshPhysicalMaterial({
    color: '#ccc',
  })
)
scene.add(octahedron)

export const pth = new PointTextHelper({
  charMax: 10,
  blending: getBlending(),
  zOffset: 0,
})
scene.add(pth)

const size = 4
const d = 1.1
const red = '#933'
const green = '#33f'
const blue = '#396'

pth.display([
  {
    position: new Vector3(d, 0, 0),
    text: 'Right',
    color: red,
    size,
  },
  {
    position: new Vector3(-d, 0, 0),
    text: 'Left',
    color: red,
    size,
  },
  {
    position: new Vector3(0, 0, d),
    text: 'Front',
    color: green,
    size,
  },
  {
    position: new Vector3(0, 0, -d),
    text: 'Back',
    color: green,
    size,
  },
  {
    position: new Vector3(0, d, 0),
    text: 'Top',
    color: blue,
    size,
  },
  {
    position: new Vector3(0, -d, 0),
    text: 'Bottom',
    color: blue,
    size,
  },
])

pth.displayFaces(sphere.geometry, {
  color: index => [red, green, blue][index % 3],
  size: .2,
})

pth.displayFaces(wireSphere.geometry, {
  color: '#999',
  size: .5,
})

