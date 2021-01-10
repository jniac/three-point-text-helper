import * as THREE from 'three'
import { char_height, char_width, data, height, width } from '../atlas.js'
import { get_shaders } from './get_shaders.js'

const img = document.createElement('img')
img.src = data

const texture = new THREE.Texture(img)
img.onload = () => texture.needsUpdate = true

export default function get_material(char_max:number) {
  
  const [vertexShader, fragmentShader] = get_shaders(char_max)

  const uniforms = {
    atlas_texture: { value:texture },
    char_max: { value:char_max },
    char_size: { value:new THREE.Vector2(char_width / width, char_height / height) },
    char_aspect: { value:char_width / char_height },
  }
  
  const material = new THREE.RawShaderMaterial({
  
    uniforms,
    vertexShader,
    fragmentShader,
  
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true,
    flatShading: true,
  })
  
  return material
}