# Point Text Helper
"Point Text" Helper for ThreeJS

Thousand of tiny texts (labels) in one draw call. 

<a href="https://jniac.github.io/three-point-text-helper/tests/examples-vanilla/stress/">
<p align="center">
  <img src="screenshots/vanilla-stress-2.jpg">
<p>
<p align="center">
  Stress test with "vanilla" js (module).
  31 436 texts.
</p>
</a>

## Demos
- [triangle](https://jniac.github.io/three-point-text-helper/tests/examples-vanilla/triangle/)
- [stress](https://jniac.github.io/three-point-text-helper/tests/examples-vanilla/stress/)
- [effect-composer](https://jniac.github.io/three-point-text-helper/tests/examples-vanilla/effect-composer/)
- [blending](https://jniac.github.io/three-point-text-helper/tests/examples-vanilla/blending/)

## Install

NPM:
```
npm i @jniac/three-point-text-helper
```

Or plain JS, using github pages hosting:
```javascript
import { PointTextHelper } from 'https://jniac.github.io/three-point-text-helper/dist/PointTextHelper.three.js'
```


## Usage

```javascript
import * as THREE from 'three'
import { PointTextHelper } from '@jniac/three-point-text-helper'

//- snip -//

const pth = new PointTextHelper({ charMax:10 })
mesh.add(pth)

// display some text
pth.display({ text:'hello!',  color:'cyan' })
pth.display({ text:'top',     color:'cyan', size:.5, position:new THREE.Vector3(0, 1, 0) })
pth.display({ text:'bottom',  color:'cyan', size:.5, position:{ x:0, y:-1, z:0 } })

// or, from a mesh...
const mesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshBasicMaterial({ color:'cyan', wireframe:true }),
)
scene.add(mesh)

// ...display an array of vertices:
pth.displayVertices(mesh.geometry.vertices)

// ...or a "position" buffer:
// (be aware that in buffer geometries, vertices are most often duplicated)
const geometry = new THREE.SphereBufferGeometry(1.4, 12, 24)
pth.displayVertices(geometry.getAttribute('position').array, {
  color: '#fc9',
  size: .3,
  format: index => `#${index}`,
})
```

## "dev" mode & examples
from a local repository, 2 process:
- run the library itself + static server
```shell
npm run dev
```
It will watch over any changes into the src folder, and re-build if any.
http://localhost:8000

For the "vanilla" js examples, this is enough:
http://localhost:8000/tests/examples-vanilla/triangle/

- but for the webpack examples, one may start the webpack service:
```shell
npm run examples-webpack
```

## Build
```shell
npx rollup -c
```

