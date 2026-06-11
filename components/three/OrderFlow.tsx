"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EXCHANGES } from "./Network";

/* Order flow — thousands of glowing particles travelling along quadratic
   bezier routes between exchanges and across the landscape. Entirely
   GPU-animated; occasional "data storms" model volatility bursts. */

const VERT = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aCtrl;
  attribute vec3 aEnd;
  attribute vec4 aSeed;   /* offset, speed, size, hue */
  uniform float uTime;
  uniform float uStorm;
  varying float vHue;
  varying float vFade;

  void main() {
    float t = fract(aSeed.x + uTime * aSeed.y * (1.0 + uStorm * 1.6));
    vec3 p = mix(mix(aStart, aCtrl, t), mix(aCtrl, aEnd, t), t);

    /* slight turbulence, amplified during storms */
    p.x += sin(t * 31.4 + aSeed.x * 80.0) * (0.4 + uStorm * 2.4);
    p.y += cos(t * 25.1 + aSeed.x * 60.0) * (0.3 + uStorm * 1.8);

    vHue = aSeed.w;
    /* fade in/out at route ends */
    vFade = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.92, 1.0, t));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    /* distance attenuation replaces fog for additive points */
    vFade *= smoothstep(620.0, 120.0, -mv.z);
    gl_PointSize = aSeed.z * (1.0 + uStorm * 0.8) * (220.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uStorm;
  varying float vHue;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vFade;
    if (a < 0.01) discard;
    vec3 cyan = vec3(0.30, 0.85, 1.00);
    vec3 blue = vec3(0.25, 0.45, 1.00);
    vec3 green = vec3(0.20, 1.00, 0.70);
    vec3 col = vHue < 0.5 ? mix(cyan, blue, vHue * 2.0) : mix(blue, green, vHue * 2.0 - 1.0);
    col += uStorm * 0.3;
    gl_FragColor = vec4(col, a * 0.85);
  }
`;

function buildRoutes() {
  const routes: { a: THREE.Vector3; c: THREE.Vector3; b: THREE.Vector3 }[] = [];
  const nodes = EXCHANGES.map((e) => new THREE.Vector3(...e.pos));

  /* exchange ↔ exchange */
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const c = a.clone().add(b).multiplyScalar(0.5);
      c.y += a.distanceTo(b) * 0.25;
      routes.push({ a, c, b });
    }
  }
  /* long-haul streams crossing the world toward the core */
  for (let i = 0; i < 14; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const a = new THREE.Vector3(side * (140 + Math.random() * 160), 6 + Math.random() * 30, 180 - Math.random() * 120);
    const b = new THREE.Vector3((Math.random() - 0.5) * 60, 10 + Math.random() * 18, -460 - Math.random() * 60);
    const c = new THREE.Vector3(side * 60, 40 + Math.random() * 50, -150 - Math.random() * 150);
    routes.push({ a, c, b });
  }
  return routes;
}

export default function OrderFlow({ count }: { count: number }) {
  const storm = useRef({ start: -100, next: 14 });

  const { geometry, material } = useMemo(() => {
    const routes = buildRoutes();
    const start = new Float32Array(count * 3);
    const ctrl = new Float32Array(count * 3);
    const end = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const r = routes[i % routes.length];
      const j = 8;
      start.set([r.a.x + (Math.random() - 0.5) * 3, r.a.y + (Math.random() - 0.5) * 3, r.a.z + (Math.random() - 0.5) * 3], i * 3);
      ctrl.set([r.c.x + (Math.random() - 0.5) * j * 2, r.c.y + (Math.random() - 0.5) * j, r.c.z + (Math.random() - 0.5) * j * 2], i * 3);
      end.set([r.b.x + (Math.random() - 0.5) * 3, r.b.y + (Math.random() - 0.5) * 3, r.b.z + (Math.random() - 0.5) * 3], i * 3);
      seed.set([Math.random(), 0.02 + Math.random() * 0.06, 1.4 + Math.random() * 2.6, Math.random()], i * 4);
    }

    const geo = new THREE.BufferGeometry();
    /* position attr required by three even though the shader ignores it */
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aCtrl", new THREE.BufferAttribute(ctrl, 3));
    geo.setAttribute("aEnd", new THREE.BufferAttribute(end, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 30, -200), 700);

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 }, uStorm: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;

    /* volatility storms — a slow swell every ~20-35s */
    const s = storm.current;
    if (t > s.next) {
      s.start = t;
      s.next = t + 20 + Math.random() * 15;
    }
    const e = t - s.start;
    material.uniforms.uStorm.value = e < 4 ? Math.sin(Math.min(e / 4, 1) * Math.PI) : 0;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
