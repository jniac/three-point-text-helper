precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

attribute vec3 position;

attribute vec2 char_offset_X;
varying vec2 v_char_offset_X;

void main() {
  
  v_char_offset_X = char_offset_X;
  
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
	gl_PointSize = 1000.0 / -mvPosition.z;
}