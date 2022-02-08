import { Vector2 } from 'three'
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js'
import { HalftonePass } from 'https://threejs.org/examples/jsm/postprocessing/HalftonePass.js'
import { camera, onRender, renderer, scene, setStageOptions } from '../shared/three-stage.js'
import './setup-scene.js'

const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.3, 1, 0.5)
const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, {
  shape: 1,
  radius: 16,
  rotateR: Math.PI / 12,
  rotateB: Math.PI / 12 * 2,
  rotateG: Math.PI / 12 * 3,
  scatter: 0,
  blending: 1,
  blendingMode: 1,
  greyscale: false,
  disable: false,
})

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)
composer.addPass(halftonePass)

setStageOptions({ skipRender: true })

onRender(() => {
  composer.render()
})



document.querySelector('input#bloom').onchange = e => bloomPass.enabled = e.target.checked
document.querySelector('input#half-tones').onchange = e => halftonePass.enabled = e.target.checked