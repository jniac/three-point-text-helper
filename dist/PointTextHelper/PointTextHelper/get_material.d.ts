import { Blending, RawShaderMaterial, ShaderMaterial } from 'three';
declare class PointTextMaterial extends RawShaderMaterial {
    constructor(parameters: ConstructorParameters<typeof ShaderMaterial>[0]);
    get opacity(): number;
    set opacity(value: number);
}
export default function get_material(char_max: number, blending: Blending, zOffset: number): PointTextMaterial;
export {};
