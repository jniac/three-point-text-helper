import atlas_data from './atlas-data.js';
import { Texture, Vector2, RawShaderMaterial, NormalBlending, MultiplyBlending, Points, AdditiveBlending, BufferGeometry, BufferAttribute, Color } from 'three';

const get_char_offset = (char) => {
    if (typeof char === 'number') {
        char = char.toString(10)[0];
    }
    const index = chars.indexOf(char);
    if (index === -1) {
        return [0, 0];
    }
    const x = index % grid_width;
    const y = Math.floor(index / grid_width);
    return [x, y];
};
const get_char_index = (char) => {
    const index = chars.indexOf(char);
    return index === -1 ? chars.indexOf(' ') : index;
};
const get_count_and_offsets = (s, max = 4) => {
    if (typeof s === 'number') {
        s = Math.floor(s).toString(10);
    }
    if (s.length > max) {
        s = s.slice(0, max);
    }
    const count = s.length;
    if (s.length < max) {
        s = s.padEnd(max, ' ');
    }
    const offsets = [...s]
        .map(get_char_offset);
    return { count, offsets };
};

var atlasUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get_char_offset: get_char_offset,
    get_char_index: get_char_index,
    get_count_and_offsets: get_count_and_offsets
});

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz #@&$%?!+-_=*/\\|[](){}<>.;:,×';
const width = 4096;
const height = 256;
const grid_width = 64;
const grid_height = 2;
const char_width = 64;
const char_height = 120;
const data = atlas_data;

var atlas = /*#__PURE__*/Object.freeze({
    __proto__: null,
    chars: chars,
    width: width,
    height: height,
    grid_width: grid_width,
    grid_height: grid_height,
    char_width: char_width,
    char_height: char_height,
    data: data,
    utils: atlasUtils
});

var vertexShaderSource = "precision highp float;\n#define GLSLIFY 1\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float z_offset;\n\nattribute vec3 position;\n\nattribute float char_count;\nvarying float v_char_count;\n\nattribute float size;\n\nattribute vec3 color;\nvarying vec3 v_color;\n\n// REPLACE-DECLARE:\nattribute vec2 char_offset_X;\nvarying vec2 v_char_offset_X;\n// REPLACE-END\n\nvoid main() {\n\n  v_char_count = char_count;\n  v_color = color;\n  \n  // REPLACE-COMPUTE:\n  v_char_offset_X = char_offset_X;\n  // REPLACE-END\n  \n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n  gl_Position.z += z_offset;\n\tgl_PointSize = size * 2000.0 / -mvPosition.z;\n}"; // eslint-disable-line

var fragmentShaderSource = "precision highp float;\n#define GLSLIFY 1\n\n// #define MULTIPLY\n\nuniform sampler2D atlas_texture;\nuniform float char_max;\nuniform vec2 char_size;\nuniform float char_aspect;\nuniform float opacity;\n\nvarying float v_char_count;\nvarying vec3 v_color;\n\n// REPLACE-DECLARE:\nvarying vec2 v_char_offset_X;\n// REPLACE-END\n\nvec2 get_uv_coords(in vec2 position, in vec2 offset, float index) {\n  float x = \n    (position.x * char_max \n    + offset.x \n    - index) * char_size.x;\n  float y = 1.0 - (\n    position.y \n    + offset.y\n    ) * char_size.y;\n  return vec2(x, y);\n}\n\nvec4 get_texel(in vec2 position, in vec2 offset, float index) {\n#ifdef MULTIPLY\n  float a = texture2D(atlas_texture, get_uv_coords(position, offset, index)).a;\n  return vec4(mix(vec3(1.0), v_color, opacity * a), 1.0);\n#else\n  return vec4(v_color, opacity * texture2D(atlas_texture, get_uv_coords(position, offset, index)).a);\n#endif\n}\n\nvoid main() {\n\n  vec2 position = gl_PointCoord;\n\n  position.x += -(char_max - v_char_count) / char_max / 2.0;\n\n  position.y *= char_max * char_aspect;\n  position.y += (1.0 - char_max * char_aspect) / 2.0;\n\n  bool x_out = position.x < 0.0 || position.x > v_char_count / char_max;\n  bool y_out = position.y < 0.0 || position.y > 1.0;\n\n  if (x_out || y_out) {\n    // gl_FragColor = vec4(1.0);\n    // return;\n    discard;\n  }\n\n  // REPLACE-COMPUTE:\n  if (position.x < 1.0 / char_max) {\n    gl_FragColor = get_texel(position, v_char_offset_X, 0.0);\n  } else if (position.x < 2.0 / char_max) {\n    gl_FragColor = get_texel(position, v_char_offset_X, 1.0);\n  } else {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n  }\n  // REPLACE-END\n}\n"; // eslint-disable-line

const get_numbers = (max) => {
    const array = new Array(max);
    for (let i = 0; i < max; i++) {
        array[i] = i;
    }
    return array;
};
const tab = '  ';
const map_vert_declare = (i) => `
attribute vec2 char_offset_${i};
varying vec2 v_char_offset_${i};
`.slice(1);
const map_vert_compute = (i) => `
${tab}v_char_offset_${i} = char_offset_${i};
`.slice(1);
const map_frag_declare = (i) => `
varying vec2 v_char_offset_${i};
`.slice(1);
const get_shaders = (char_max) => {
    const vert_declare = get_numbers(char_max).map(map_vert_declare).join('');
    const vert_compute = get_numbers(char_max).map(map_vert_compute).join('');
    const vertexShader = vertexShaderSource
        .replace(/ *\/\/ REPLACE-DECLARE[\s\S]*?REPLACE-END/, vert_declare)
        .replace(/ *\/\/ REPLACE-COMPUTE[\s\S]*?REPLACE-END/, vert_compute);
    const frag_declare = get_numbers(char_max).map(map_frag_declare).join('');
    const array = new Array();
    for (let i = 0; i < char_max; i++) {
        array.push(i === 0 ? tab : `${tab}} else `);
        array.push(i < char_max - 1 ? `if (position.x < ${i + 1}.0 / char_max) ` : '');
        array.push(`{\n`);
        array.push(`${tab}${tab}gl_FragColor = get_texel(position, v_char_offset_${i}, ${i}.0);\n`);
    }
    array.push(`${tab}}\n`);
    const frag_compute = array.join('');
    const fragmentShader = fragmentShaderSource
        .replace(/ *\/\/ REPLACE-DECLARE[\s\S]*?REPLACE-END/, frag_declare)
        .replace(/ *\/\/ REPLACE-COMPUTE[\s\S]*?REPLACE-END/, frag_compute);
    return [vertexShader, fragmentShader];
};

const img = document.createElement('img');
img.src = data;
const texture = new Texture(img);
img.onload = () => texture.needsUpdate = true;
function get_material(char_max, blending, zOffset) {
    const [vertexShader, fragmentShader] = get_shaders(char_max);
    const uniforms = {
        atlas_texture: { value: texture },
        opacity: { value: 1 },
        z_offset: { value: zOffset },
        char_max: { value: char_max },
        char_size: { value: new Vector2(char_width / width, char_height / height) },
        char_aspect: { value: char_width / char_height },
    };
    const defines = {};
    if (blending === MultiplyBlending) {
        defines.MULTIPLY = true;
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
    });
    Object.defineProperty(material, 'opacity', {
        get: () => material.uniforms.opacity.value,
        set: (value) => material.uniforms.opacity.value = value,
    });
    return material;
}

// CHAR_MAX_LIMIT depends from the max number of gl attributes.
const CHAR_MAX_LIMIT = 12;
const defaultDisplayParams = {
    position: { x: 0, y: 0, z: 0 },
    color: 'white',
    size: 1,
    text: 'foo',
};
class PointTextHelper extends Points {
    constructor({ charMax = 4, blending = AdditiveBlending, zOffset = -0.01, } = {}) {
        if (charMax > CHAR_MAX_LIMIT) {
            console.warn(`max chars is ${CHAR_MAX_LIMIT}`);
            charMax = CHAR_MAX_LIMIT;
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(0), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(0), 3));
        geometry.setAttribute('size', new BufferAttribute(new Float32Array(0), 1));
        geometry.setAttribute('char_count', new BufferAttribute(new Float32Array(0), 1));
        for (let i = 0; i < charMax; i++) {
            geometry.setAttribute(`char_offset_${i}`, new BufferAttribute(new Float32Array(0), 2));
        }
        const material = get_material(charMax, blending, zOffset);
        // const material = new THREE.PointsMaterial({ color: 0x888888 });
        super(geometry, material);
        this.charMax = charMax;
    }
    push(name, numbers) {
        const geometry = this.geometry;
        const buffer = geometry.getAttribute(name);
        const array = new Float32Array(buffer.array.length + numbers.length);
        array.set(buffer.array, 0);
        array.set(numbers, buffer.array.length);
        geometry.setAttribute(name, new BufferAttribute(array, buffer.itemSize));
    }
    pushFill(name, value, count) {
        const geometry = this.geometry;
        const buffer = geometry.getAttribute(name);
        const array = new Float32Array(buffer.array.length + count);
        array.set(buffer.array, 0);
        array.fill(value, buffer.array.length);
        geometry.setAttribute(name, new BufferAttribute(array, buffer.itemSize));
    }
    display(params = defaultDisplayParams) {
        if (Array.isArray(params)) {
            params.forEach(p => this.display(p));
            return;
        }
        params = Object.assign(Object.assign({}, defaultDisplayParams), params);
        const { x, y, z } = params.position;
        this.push('position', [x, y, z]);
        const { r, g, b } = new Color(params.color);
        this.push('color', [r, g, b]);
        this.push('size', [params.size]);
        const { charMax } = this;
        const { count, offsets } = get_count_and_offsets(params.text, charMax);
        this.push('char_count', [count]);
        for (let i = 0; i < charMax; i++) {
            this.push(`char_offset_${i}`, offsets[i]);
        }
    }
    displayVertices(vertices, options = {}) {
        var _a;
        if (vertices instanceof BufferGeometry) {
            return this.displayVertices(vertices.getAttribute('position').array, options);
        }
        const { color = 'white', size = 1, format = undefined, } = options;
        const isFloat32 = vertices instanceof Float32Array;
        const getColor = (typeof color === 'function'
            ? (index) => new Color(color(index))
            : (() => {
                const c = new Color(color);
                return () => c;
            })());
        const getSize = (typeof size === 'function'
            ? (index) => size(index)
            : () => size);
        const length = isFloat32 ? vertices.length / 3 : vertices.length;
        const { charMax } = this;
        const position_array = isFloat32 ? vertices : new Float32Array(length * 3);
        const color_array = new Float32Array(length * 3);
        const size_array = new Float32Array(length);
        const char_count_array = new Float32Array(length);
        const char_offset_array = new Array(charMax);
        for (let i = 0; i < charMax; i++) {
            char_offset_array[i] = new Float32Array(length * 2);
        }
        if (isFloat32 === false) {
            for (let index = 0; index < length; index++) {
                const { x, y, z } = vertices[index];
                position_array[index * 3 + 0] = x;
                position_array[index * 3 + 1] = y;
                position_array[index * 3 + 2] = z;
            }
        }
        for (let index = 0; index < length; index++) {
            const c = getColor(index);
            color_array[index * 3 + 0] = c.r;
            color_array[index * 3 + 1] = c.g;
            color_array[index * 3 + 2] = c.b;
            size_array[index] = getSize(index);
            const text = (_a = format === null || format === void 0 ? void 0 : format(index)) !== null && _a !== void 0 ? _a : index.toString(10);
            const { count, offsets } = get_count_and_offsets(text, charMax);
            char_count_array[index] = count;
            for (let i = 0; i < charMax; i++) {
                const [x, y] = offsets[i];
                char_offset_array[i][index * 2 + 0] = x;
                char_offset_array[i][index * 2 + 1] = y;
            }
        }
        this.push('position', position_array);
        this.push('color', color_array);
        this.push('size', size_array);
        this.push('char_count', char_count_array);
        for (let i = 0; i < charMax; i++) {
            this.push(`char_offset_${i}`, char_offset_array[i]);
        }
    }
    displayFaces(geometry, { color = 'white', size = 1, format = undefined, } = {}) {
        if (geometry['isBufferGeometry']) {
            geometry = geometry;
            const indexes = geometry.index.array;
            const position = geometry.getAttribute('position').array;
            const length = indexes.length / 3;
            const array = new Float32Array(length * 3);
            for (let index = 0; index < length; index++) {
                const ai = indexes[index * 3 + 0];
                const ax = position[ai * 3 + 0];
                const ay = position[ai * 3 + 1];
                const az = position[ai * 3 + 2];
                const bi = indexes[index * 3 + 1];
                const bx = position[bi * 3 + 0];
                const by = position[bi * 3 + 1];
                const bz = position[bi * 3 + 2];
                const ci = indexes[index * 3 + 2];
                const cx = position[ci * 3 + 0];
                const cy = position[ci * 3 + 1];
                const cz = position[ci * 3 + 2];
                array[index * 3 + 0] = (ax + bx + cx) / 3;
                array[index * 3 + 1] = (ay + by + cy) / 3;
                array[index * 3 + 2] = (az + bz + cz) / 3;
            }
            this.displayVertices(array, { color, size, format });
        }
    }
    get zOffset() { return this.material.uniforms.z_offset.value; }
    set zOffset(value) {
        const material = this.material;
        if (material.uniforms.z_offset.value !== value) {
            material.uniforms.z_offset.value = value;
            material.uniformsNeedUpdate = true;
        }
    }
    get z_offset() { return this.zOffset; }
    set z_offset(value) { this.zOffset = value; }
    get opacity() { return this.material.opacity; }
    set opacity(value) { this.material.opacity = value; }
}

export { PointTextHelper, atlas };
