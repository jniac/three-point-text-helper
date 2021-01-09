import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(2)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5

const scene = new THREE.Scene()

let autoPauseDelay = 2
let autoPauseTimer = 0
const autoPauseReset = () => autoPauseTimer = 0

let time = 0, frame = 0, dt = 1 / 60
const loop = () => {
  requestAnimationFrame(loop)

  if (autoPauseTimer <= autoPauseDelay) {

    const update_args = { time, frame }
    scene.traverse(child => child['update']?.(update_args))

    renderer.render(scene, camera)

    autoPauseTimer += dt
    time += dt
    frame++
  }
}

loop()

window.addEventListener('pointermove', autoPauseReset, { capture:true })
window.addEventListener('wheel', autoPauseReset, { capture:true })
window.addEventListener('keydown', autoPauseReset, { capture:true })

export {
  renderer,
  scene,
  camera,
}