precision highp float;

uniform sampler2D atlas_texture;
uniform float char_max;
uniform vec2 char_size;
varying vec2 v_char_offset_X;

void main() {

  vec2 p = gl_PointCoord;
  p *= char_size;
  p += v_char_offset_X;
  p.y = 1.0 - p.y;

  if (gl_PointCoord.x < 1.0 / char_max) {
    p.x *= char_max;
    gl_FragColor = texture2D(atlas_texture, p);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
