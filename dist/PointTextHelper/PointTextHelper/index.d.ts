import * as THREE from 'three';
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
declare class PointTextHelper extends THREE.Points {
    private charMax;
    constructor({ charMax, }?: {
        charMax?: number;
    });
    private push;
    private pushFill;
    display(params?: Partial<typeof defaultDisplayParams>): void;
    displayVertices(vertices: THREE.Vector3[] | ArrayLike<number> | THREE.BufferGeometry, options?: {
        size?: number;
        color?: string | THREE.Color;
        format?: (index: number) => string;
    }): any;
    displayFaces(geometry: THREE.Geometry | THREE.BufferGeometry, { color, size, format, }?: {
        size?: number;
        color?: string | THREE.Color;
        format?: (index: number) => string;
    }): void;
    get z_offset(): number;
    set z_offset(value: number);
    get opacity(): number;
    set opacity(value: number);
}
export { PointTextHelper, };
