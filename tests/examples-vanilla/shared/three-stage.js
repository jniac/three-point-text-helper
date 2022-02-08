import './cheat.js'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js'

/** @typedef { time: number, frame: number } UpdateInfo */
/** @typedef { skipRender: boolean } StageOptions */

const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5

const scene = new Scene()

const orbitControls = new OrbitControls(camera, renderer.domElement)

let autoPauseDelay = 10
let autoPauseTimer = 0
const setAutoPauseDelay = value => autoPauseDelay = (parseFloat(value) || 0)
const autoPauseReset = () => autoPauseTimer = 0

let skipRender = false

/**
 * Set stage options
 * @param {Partial<StageOptions>} options 
 */
export const setStageOptions = (options) => {
  skipRender = options?.skipRender ?? skipRender
}

const onRenderCallbacks = new Set()
/**
 * @param {(info: UpdateInfo) => void} callback 
 */
export const onRender = (callback) => {
  onRenderCallbacks.add(callback)
  const destroy = () => onRenderCallbacks.delete(callback)
  return { destroy }
}

let time = 0, frame = 0, dt = 1 / 60
const loop = () => {
  
  requestAnimationFrame(loop)

  const paused = autoPauseTimer > autoPauseDelay
  renderer.domElement.classList.toggle('paused', paused)

  if (paused === false) {

    const info = { time, frame }
    scene.traverse(child => child.update?.(info))

    for(const cb of onRenderCallbacks) {
      cb(info)
    }

    if (skipRender === false) {
      renderer.render(scene, camera)
    }

    autoPauseTimer += dt
    time += dt
    frame++
  }
}

loop()

window.addEventListener('pointermove', autoPauseReset, { capture:true })
window.addEventListener('pointerdown', autoPauseReset, { capture:true })
window.addEventListener('pointerup', autoPauseReset, { capture:true })
window.addEventListener('wheel', autoPauseReset, { capture:true })
window.addEventListener('keydown', autoPauseReset, { capture:true })

export {
  scene,
  camera,
  renderer,
  setAutoPauseDelay,
  autoPauseReset,
  orbitControls,
}
