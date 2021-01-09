precision highp float;

uniform sampler2D atlas_texture;
uniform vec2 char_size;

void main() {
  
  vec2 p = gl_PointCoord;
  p *= char_size;
  // p.x += char_size.x;
  p.y = 1.0 - p.y;
  gl_FragColor = texture2D(atlas_texture, p);
}
