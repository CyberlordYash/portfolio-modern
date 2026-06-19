"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Topographic contour terrain — crisp white elevation isolines on pure black,
   like a survey map of a mountain range. Lines trace constant height (not a
   grid); index contours every 5th level read bolder. The whole field drifts
   slowly upward for a calm, editorial parallax. Minimal: no particles. */

const VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vH;
  varying float vEdge;
  #include <fog_pars_vertex>

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.04 + 11.3;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 pos = position;
    /* local xy = ground plane (mesh is rotated -90° on X) */
    float ridged = 1.0 - abs(fbm(pos.xy * 0.013) * 2.0 - 1.0);
    float h = pow(ridged, 1.7) * fbm(pos.xy * 0.006 + 4.7) * 2.0;

    /* carve the flight corridor along x ≈ 0 */
    float corridor = smoothstep(24.0, 130.0, abs(pos.x));
    h *= mix(0.03, 1.0, corridor);
    h *= 50.0;

    pos.z += h;
    vH = h;
    vEdge = corridor;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vH;
  varying float vEdge;
  #include <fog_pars_fragment>

  /* anti-aliased isoline at every "spacing" of elevation h;
     "thick" scales line width in screen pixels (derivative-based). */
  float contour(float h, float spacing, float thick) {
    float f = h / spacing;
    float d = abs(fract(f - 0.5) - 0.5);
    return 1.0 - smoothstep(0.0, thick * fwidth(f), d);
  }

  void main() {
    /* slow upward drift of the elevation field — calm editorial motion */
    float h = vH + uTime * 0.7;

    /* fine contours + bolder index contours (every 5th line) */
    float minor = contour(h, 3.2, 1.0);
    float major = contour(h, 16.0, 1.4);

    float hN = clamp(vH / 50.0, 0.0, 1.0);
    /* index lines fully white; intermediate lines softer; black between */
    float intensity = minor * 0.45 + major * (0.7 + hN * 0.3);

    /* a whisper of light along the flight corridor floor */
    float river = (1.0 - smoothstep(2.0, 16.0, abs(vWorld.x))) * (1.0 - vEdge);
    intensity += river * 0.18;

    gl_FragColor = vec4(vec3(intensity), 1.0);
    #include <fog_fragment>
  }
`;

export default function Terrain({ quality }: { quality: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          { uTime: { value: 0 } },
        ]),
        fog: true,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const seg = quality > 0 ? [300, 200] : [160, 100];
    return new THREE.PlaneGeometry(1500, 1000, seg[0], seg[1]);
  }, [quality]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, -220]}
      frustumCulled={false}
    />
  );
}
