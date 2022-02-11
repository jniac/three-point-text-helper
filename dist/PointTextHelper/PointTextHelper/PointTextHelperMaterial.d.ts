import { Blending, RawShaderMaterial } from 'three';
export declare class PointTextHelperMaterial extends RawShaderMaterial {
    constructor(char_max: number, blending: Blending, zOffset: number);
    get alpha(): number;
    set alpha(value: number);
    get zOffset(): number;
    set zOffset(value: number);
    get alphaDiscard(): number;
    set alphaDiscard(value: number);
}
