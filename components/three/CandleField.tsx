"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Distant candlestick "cities" — instanced boxes whose heights breathe like a
   living order book. Height animation runs fully in the vertex shader. */

const VERT = /* glsl */ `
  attribute vec3 aOffset;   /* world-ish position of the candle base */
  attribute vec3 aDims;     /* width, base height, depth */
  attribute vec3 aSeed;     /* phase, speed, up(1)/down(0) */
  uniform float uTime;
  varying float vUp;
  varying float vY;
  varying float vDist;

  void main() {
    /* unit box is centered: shift so it grows from the ground */
    vec3 p = position;
    float grow = 0.55 + 0.45 * sin(uTime * aSeed.y + aSeed.x * 6.2831);
    float h = aDims.y * (0.35 + 0.65 * grow);
    p.x *= aDims.x;
    p.z *= aDims.z;
    p.y = (p.y + 0.5) * h;
    p += aOffset;

    vUp = aSeed.z;
    vY = (position.y + 0.5);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying float vUp;
  varying float vY;
  varying float vDist;

  void main() {
    vec3 up = vec3(1.0);     /* monochrome: bright = up, dim = down */
    vec3 dn = vec3(0.42);
    vec3 col = mix(dn, up, vUp);
    /* brighter toward the top — glowing candle caps */
    col *= 0.25 + vY * 1.15;
    float a = smoothstep(640.0, 160.0, vDist);
    gl_FragColor = vec4(col, a * 0.85);
    if (a < 0.02) discard;
  }
`;

/* candle clusters flanking the corridor like distant skylines */
const CLUSTERS: { center: [number, number]; spread: number; n: number }[] = [
  { center: [-170, -60], spread: 60, n: 90 },
  { center: [180, -120], spread: 70, n: 100 },
  { center: [-210, -260], spread: 80, n: 110 },
  { center: [220, -330], spread: 75, n: 100 },
  { center: [-150, -430], spread: 55, n: 70 },
  { center: [160, -470], spread: 55, n: 70 },
];

export default function CandleField({ density }: { density: number }) {
  const { geometry, material, count } = useMemo(() => {
    const all: { x: number; z: number }[] = [];
    CLUSTERS.forEach((c) => {
      const n = Math.floor(c.n * density);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * c.spread;
        all.push({ x: c.center[0] + Math.cos(a) * r, z: c.center[1] + Math.sin(a) * r });
      }
    });

    const count = all.length;
    const offset = new Float32Array(count * 3);
    const dims = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    all.forEach((p, i) => {
      offset.set([p.x, 0, p.z], i * 3);
      dims.set([1.6 + Math.random() * 2.2, 14 + Math.random() * 46, 1.6 + Math.random() * 2.2], i * 3);
      seed.set([Math.random(), 0.15 + Math.random() * 0.5, Math.random() > 0.45 ? 1 : 0], i * 3);
    });

    const box = new THREE.BoxGeometry(1, 1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.attributes.position = box.attributes.position;
    geo.attributes.uv = box.attributes.uv;
    geo.instanceCount = count;
    geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offset, 3));
    geo.setAttribute("aDims", new THREE.InstancedBufferAttribute(dims, 3));
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 30, -250), 800);

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: true,
    });

    return { geometry: geo, material: mat, count };
  }, [density]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (count === 0) return null;
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
