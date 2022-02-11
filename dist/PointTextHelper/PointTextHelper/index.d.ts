import * as THREE from 'three';
import { ColorRepresentation } from 'three';
declare const defaultDisplayParams: {
    position: {
        x: number;
        y: number;
        z: number;
    };
    color: string;
    size: number;
    text: string;
};
declare type DisplayParams = Partial<typeof defaultDisplayParams>;
declare class PointTextHelper extends THREE.Points {
    private charMax;
    constructor({ charMax, blending, zOffset, }?: {
        charMax?: number;
        blending?: THREE.Blending;
        zOffset?: number;
    });
    private push;
    private pushFill;
    display(params?: DisplayParams | DisplayParams[]): void;
    displayVertices(vertices: THREE.Vector3[] | ArrayLike<number> | THREE.BufferGeometry, options?: {
        size?: number | ((index: number) => number);
        color?: ColorRepresentation | ((index: number) => ColorRepresentation);
        format?: (index: number) => string;
    }): any;
    displayFaces(geometry: THREE.BufferGeometry, { color, size, format, }?: {
        size?: number;
        color?: string | THREE.Color;
        format?: (index: number) => string;
    }): void;
    get zOffset(): number;
    set zOffset(value: number);
    get z_offset(): number;
    set z_offset(value: number);
    get opacity(): number;
    set opacity(value: number);
}
export { PointTextHelper, };
