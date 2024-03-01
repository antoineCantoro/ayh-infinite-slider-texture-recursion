uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
float PI = 3.141592653589793238;

void main() {
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}