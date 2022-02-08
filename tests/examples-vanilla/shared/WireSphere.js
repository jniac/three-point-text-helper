import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from 'three'

export class WireSphere extends Mesh {
  constructor({
    radius = 10,
    segments = 30,
    widthSegments = segments * 2,
    heightSegments = segments,
    color = '#333',
  } = {}) {
    super(
      new SphereBufferGeometry(radius, widthSegments, heightSegments),
      new MeshBasicMaterial({ color, wireframe: true }),
    )
  }
}
