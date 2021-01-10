precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

attribute vec3 position;

attribute float char_count;
varying float v_char_count;

attribute float size;

attribute vec3 color;
varying vec3 v_color;


// REPLACE-DECLARE:
attribute vec2 char_offset_X;
varying vec2 v_char_offset_X;
// REPLACE-END

void main() {

  v_char_count = char_count;
  v_color = color;
  
  // REPLACE-COMPUTE:
  v_char_offset_X = char_offset_X;
  // REPLACE-END
  
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
	gl_PointSize = size * 2000.0 / -mvPosition.z;
}