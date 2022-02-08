import { AxesHelper } from 'three'
import { PointTextHelper } from '../../../dist/PointTextHelper.three.js'
import { scene, camera, orbitControls } from '../shared/three-stage.js'
import { WireSphere } from '../shared/WireSphere.js'
import { A, B, C, triangle } from './triangle.js'
import { axeX, axeY, axeZ, gridCenter, grid } from './grid.js'

camera.position.set(0.5, 0.6, 4.5)
orbitControls.target.set(0.5, 0.5, -0.2)
orbitControls.update()

scene.add(new WireSphere()) // background
scene.add(new AxesHelper()) // axis
scene.add(triangle) // triangle
scene.add(grid) // grid

const pth = new PointTextHelper({ charMax: 12 })
scene.add(pth)

pth.display({ position: A, text: 'A' })
pth.display({ position: B, text: 'B' })
pth.display({ position: C, text: 'C' })
pth.display({ position: axeX.clone().multiplyScalar(1.1), text: 'axe X', color: 'magenta', size:.5 })
pth.display({ position: axeY.clone().multiplyScalar(1.1), text: 'axe Y', color: 'magenta', size:.5 })
pth.display({ position: axeZ.clone().multiplyScalar(1.1), text: 'AB×AC', color: 'yellow' })
pth.display({ position: gridCenter, text: 'local frame', color: 'magenta', size:.5 })
