export declare const get_char_offset: (char: string | number) => number[];
export declare const get_char_index: (char: string) => number;
export declare const get_count_and_offsets: (s: string | number, max?: number) => {
    count: number;
    offsets: number[][];
};
