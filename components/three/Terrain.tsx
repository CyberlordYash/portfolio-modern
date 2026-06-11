"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Procedural data-grid terrain — market-depth mountain ranges with a flight
   corridor carved along x≈0 and glowing "data rivers" flowing through it.
   All displacement + glow runs on the GPU. */

const VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying float vH;
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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.04 + 11.3;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 pos = position;
    /* local xy = ground plane (mesh is rotated -90° on X) */
    float ridged = 1.0 - abs(fbm(pos.xy * 0.014) * 2.0 - 1.0);
    float h = pow(ridged, 1.6) * fbm(pos.xy * 0.006 + 4.7) * 2.0;

    /* carve the flight corridor along x ≈ 0 */
    float corridor = smoothstep(26.0, 120.0, abs(pos.x));
    h *= mix(0.04, 1.0, corridor);
    h *= 46.0;

    /* terraced steps — market-depth ledger levels */
    h = mix(h, floor(h / 5.0) * 5.0, 0.38);

    pos.z += h;
    vH = h;

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
  #include <fog_pars_fragment>

  void main() {
    /* glowing data grid */
    vec2 cell = vWorld.xz / 8.0;
    vec2 g = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    float hN = clamp(vH / 46.0, 0.0, 1.0);

    vec3 base = mix(vec3(0.012, 0.025, 0.060), vec3(0.030, 0.085, 0.190), hN);
    vec3 lineCol = mix(vec3(0.05, 0.30, 0.55), vec3(0.25, 0.85, 1.00), hN);
    vec3 col = base + line * lineCol * (0.35 + hN * 0.9);

    /* data rivers — light flowing down the corridor toward the core */
    float river = 1.0 - smoothstep(4.0, 22.0, abs(vWorld.x));
    float flow = smoothstep(0.86, 1.0, sin(vWorld.z * 0.22 + uTime * 4.0) * 0.5 + 0.5);
    col += river * flow * vec3(0.10, 0.55, 0.85) * 0.85;

    /* faint side rivers in the valleys */
    float valley = 1.0 - smoothstep(0.0, 0.12, hN);
    float sflow = smoothstep(0.9, 1.0, sin(vWorld.x * 0.3 + vWorld.z * 0.12 - uTime * 2.0) * 0.5 + 0.5);
    col += valley * sflow * vec3(0.04, 0.20, 0.35) * 0.5;

    gl_FragColor = vec4(col, 1.0);
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
    const seg = quality > 0 ? [240, 150] : [130, 80];
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
