"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Modern aurora backdrop — three drifting curtains of light in the navy
   palette rise from a wavy baseline and dissolve upward, with vertical ray
   shimmer and a sparse twinkling starfield above. Rendered additively on a
   far sky plane so bright crests feed the bloom pass; kept dim overall so
   floating UI text stays legible. */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

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
    vec2 uv = vUv;
    float t = uTime * 0.06;
    vec3 col = vec3(0.0);

    /* three thin ribbons — bright core line + soft glow trailing upward,
       against an otherwise black sky (no broad wash) */
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float speed = 0.45 + fi * 0.22;
      float scale = 1.8 + fi * 1.1;

      /* wavy centerline the ribbon follows */
      float w = fbm(vec2(uv.x * scale + t * speed, fi * 13.7 + t * 0.3));
      float center = 0.22 + 0.16 * fi + 0.30 * w;
      float d = uv.y - center;

      /* thin bright core + upward-dissolving tail */
      float core = exp(-abs(d) * 22.0);
      float tail = exp(-max(d, 0.0) * 7.0) * smoothstep(0.0, 0.02, d) * 0.6;

      /* vertical ray striations — high contrast so ribbons look woven */
      float rays = pow(0.5 + 0.5 * noise(vec2(uv.x * (42.0 + fi * 16.0) + t * 3.0, fi * 5.0)), 1.8);

      /* patchiness across the width — curtains come and go, never a full band */
      float patch = smoothstep(0.15, 0.65, fbm(vec2(uv.x * 1.4 - t * (0.4 + fi * 0.15), fi * 29.1)));

      float inten = (core * 1.15 + tail) * (0.35 + 0.65 * rays) * patch * (0.85 - fi * 0.18);

      /* saturated navy ramp — icy core into deep indigo tail */
      vec3 coreC = vec3(0.62, 0.68, 1.00);
      vec3 midC  = vec3(0.30, 0.33, 0.85);
      vec3 topC  = vec3(0.09, 0.07, 0.30);
      vec3 c = mix(coreC, midC, smoothstep(0.0, 0.12, d));
      c = mix(c, topC, smoothstep(0.1, 0.45, d));

      col += inten * c;
    }

    /* sparse twinkling stars, upper sky only */
    vec2 sp = uv * vec2(220.0, 80.0);
    vec2 cell = floor(sp);
    float star = step(0.997, hash(cell));
    float tw = 0.5 + 0.5 * sin(uTime * (1.0 + hash(cell + 7.0) * 2.0) + hash(cell * 3.1) * 6.283);
    col += star * tw * vec3(0.50, 0.55, 0.80) * 0.30 * smoothstep(0.35, 0.9, uv.y);

    /* fade everything out at the plane's edges so it never shows a seam */
    col *= smoothstep(0.0, 0.08, uv.y) * (1.0 - smoothstep(0.92, 1.0, uv.y));
    col *= smoothstep(0.0, 0.05, uv.x) * (1.0 - smoothstep(0.95, 1.0, uv.x));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Aurora({ quality }: { quality: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(2400, 320), []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, 150, -640]}
      frustumCulled={false}
    />
  );
}
