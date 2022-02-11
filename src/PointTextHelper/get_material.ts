import { Blending, MultiplyBlending, NormalBlending, RawShaderMaterial, Texture, Vector2 } from 'three'
import { char_height, char_width, data, height, width } from '../atlas.js'
import { get_shaders } from './get_shaders.js'

const img = document.createElement('img')
img.src = data

const texture = new Texture(img)
img.onload = () => texture.needsUpdate = true

export default function get_material(char_max: number, blending: Blending, zOffset: number) {
  
  const [vertexShader, fragmentShader] = get_shaders(char_max)

  const uniforms = {
    atlas_texture: { value: texture },
    opacity: { value: 1 },
    z_offset: { value: zOffset },
    char_max: { value: char_max },
    char_size: { value: new Vector2(char_width / width, char_height / height) },
    char_aspect: { value: char_width / char_height },
  }

  const defines = {} as Record<string, any>

  if (blending === MultiplyBlending) {
    defines.MULTIPLY = true
  }
  
  const material = new RawShaderMaterial({
  
    uniforms,
    defines,
    vertexShader,
    fragmentShader,
  
    blending,
    // depthTest: false,
    transparent: blending === NormalBlending,
    vertexColors: true,
    depthWrite: false,
  })

  Object.defineProperty(material, 'opacity', {
    get: () => material.uniforms.opacity.value,
    set: (value: number) => material.uniforms.opacity.value = value,
  })
  
  return material
}