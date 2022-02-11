import { Blending, IUniform, MultiplyBlending, NormalBlending, RawShaderMaterial, ShaderMaterial, Texture, Vector2 } from 'three'
import { char_height, char_width, data, height, width } from '../atlas.js'
import { get_shaders } from './get_shaders.js'

const img = document.createElement('img')
img.src = data

const texture = new Texture(img)
img.onload = () => texture.needsUpdate = true

export class PointTextHelperMaterial extends RawShaderMaterial {

  constructor(char_max: number, blending: Blending, zOffset: number) {

    console.log('PointTextHelperMaterial')

    const [vertexShader, fragmentShader] = get_shaders(char_max)

    const uniforms = {
      atlas_texture: { value: texture },
      opacity: { value: 1 },
      z_offset: { value: zOffset },
      char_max: { value: char_max },
      char_size: { value: new Vector2(char_width / width, char_height / height) },
      char_aspect: { value: char_width / char_height },
      blend_mode_normal_alpha_discard: { value: .5 },
    }
  
    const defines = {} as Record<string, any>
  
    if (blending === MultiplyBlending) {
      defines.BLEND_MULTIPLY = true
    }
    if (blending === NormalBlending) {
      defines.BLEND_NORMAL = true
    }

    console.log(uniforms)
    
    super({
      uniforms,
      defines,
      vertexShader,
      fragmentShader,
    
      vertexColors: true,
      depthTest: true,
      blending,
      transparent: blending === NormalBlending,
      depthWrite: blending === NormalBlending,
    })

    console.log('yoooooooo')
    console.log(this.uniforms)
  }

  get alpha() { return this.uniforms.opacity.value }
  set alpha(value: number) {
    this.uniforms.opacity.value = value
  }

  get zOffset() { return this.uniforms.z_offset.value as number }
  set zOffset(value: number) {
    if (this.uniforms.z_offset.value !== value) {
      this.uniforms.z_offset.value = value 
      this.uniformsNeedUpdate = true
    }
  }

  get alphaDiscard() { return this.uniforms.blend_mode_normal_alpha_discard.value }
  set alphaDiscard(value: number) { 
    if (this.uniforms.blend_mode_normal_alpha_discard.value !== value) {
      this.uniforms.blend_mode_normal_alpha_discard.value = value 
      this.uniformsNeedUpdate = true
    }
  }
}
