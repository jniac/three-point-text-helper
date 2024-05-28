import { Blending, BufferGeometry, Color, ColorRepresentation, Points, Vector3 } from 'three';
import { PointTextHelperMaterial } from './PointTextHelperMaterial';
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
type DisplayParams = Partial<typeof defaultDisplayParams>;
declare class PointTextHelper extends Points<BufferGeometry, PointTextHelperMaterial> {
    private charMax;
    constructor({ charMax, blending, zOffset, }?: {
        charMax?: number;
        blending?: Blending;
        zOffset?: number;
    });
    private push;
    private pushFill;
    display(params?: DisplayParams | DisplayParams[]): void;
    displayVertices(vertices: Vector3[] | ArrayLike<number> | BufferGeometry, options?: {
        size?: number | ((index: number) => number);
        color?: ColorRepresentation | ((index: number) => ColorRepresentation);
        format?: (index: number) => string;
    }): any;
    displayFaces(geometry: BufferGeometry, { color, size, format, }?: {
        size?: number;
        color?: string | Color;
        format?: (index: number) => string;
    }): void;
}
export { PointTextHelper };
