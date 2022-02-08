import { ArrowHelper, GridHelper, Object3D, Vector3 } from 'three'
import { A, B, C } from './triangle.js'

const AB = new Vector3().subVectors(B, A)
const AC = new Vector3().subVectors(C, A)

export const axeX = AB.clone().normalize()
export const axeZ = new Vector3().crossVectors(AB, AC).normalize()
export const axeY = new Vector3().crossVectors(axeZ, AB).normalize()

export const grid = new Object3D()

grid.add(new ArrowHelper(axeX, A, 1, 'magenta'))
grid.add(new ArrowHelper(axeZ, A, 1, 'yellow'))
grid.add(new ArrowHelper(axeY, A, 1, 'magenta'))

export const gridCenter = new Vector3(
  (axeX.x + axeY.x) / 2, 
  (axeX.y + axeY.y) / 2, 
  (axeX.z + axeY.z) / 2,
)

const gridHelper = new GridHelper(1, 10, 'magenta', 'magenta')
gridHelper.up = axeZ
gridHelper.lookAt(axeX)
gridHelper.position.copy(gridCenter)
grid.add(gridHelper)
