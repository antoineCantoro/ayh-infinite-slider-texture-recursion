uniform float uTime;
uniform float uProgress;
uniform float uSpeed;
uniform float uDirection;
uniform vec2 uResolution;
uniform sampler2D uTexture; 
uniform sampler2D uDisp; 
varying vec2 vUv;
varying vec3 vPositions;
float PI = 3.141592653589793238;

void main() {
  vec4 d = texture2D(
    uDisp, 
    (vUv - vec2(0.5)) * (1.0 + uSpeed) + vec2(0.5)
  );
  
  float force = pow(length(vUv.x) + 0.5, abs(uSpeed));
  vec2 newuv = vUv * cos(1.0 - force);
  
  // gl_FragColor = 0.8 * texture2D(uTexture, newuv + d.xy * 0.02 + vec2(0.0, -0.05));
  gl_FragColor = 0.8 * texture2D(uTexture, newuv + d.xy * 0.02 + vec2(0.0, -0.03));
}