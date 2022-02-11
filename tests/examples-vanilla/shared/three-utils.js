import { AmbientLight, DirectionalLight, Group, Mesh, MeshBasicMaterial, SphereBufferGeometry } from 'three'

export class WireSphere extends Mesh {
  constructor({
    radius = 10,
    segments = 30,
    widthSegments = segments * 2,
    heightSegments = segments,
    color = '#555',
  } = {}) {
    super(
      new SphereBufferGeometry(radius, widthSegments, heightSegments),
      new MeshBasicMaterial({ color, wireframe: true }),
    )
  }
}

export class LightRig1 extends Group {
  constructor() {
    super()

    this.name = 'light-rig-1'

    const sun = new DirectionalLight('#fff', 0.4)
    sun.position.set(3, 5, 2)
    this.add(sun)
  
    const ground = new DirectionalLight('#fff', 0.1)
    ground.position.set(-3, -5, 1)
    this.add(ground)
  
    const ambient = new AmbientLight('#fff', 0.6)
    this.add(ambient)
  }
}