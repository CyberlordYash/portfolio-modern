"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Exchange nodes floating above the terrain, connected by light routes that
   carry latency pulses, plus the giant data monoliths of the projects zone. */

export const EXCHANGES: { name: string; sub: string; pos: [number, number, number]; r: number }[] = [
  { name: "NYSE",    sub: "EQUITIES · NY4",   pos: [-62, 30, -68],  r: 7 },
  { name: "NASDAQ",  sub: "EQUITIES · CARTERET", pos: [54, 36, -112], r: 8 },
  { name: "CME",     sub: "FUTURES · AURORA", pos: [-48, 32, -158], r: 9 },
  { name: "CRYPTO",  sub: "PERPS · GLOBAL",   pos: [44, 26, -42],   r: 6 },
  { name: "LSE",     sub: "EQUITIES · LD4",   pos: [70, 42, -205],  r: 6 },
  { name: "SGX",     sub: "DERIVS · SG1",     pos: [-70, 38, -240], r: 6 },
];

/* ── canvas-texture label sprites (no external font runtime needed) ── */
function makeLabel(name: string, sub: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(160, 220, 255, 0.95)";
  ctx.font = "900 72px 'Orbitron', 'Courier New', monospace";
  ctx.fillText(name, 256, 78);
  ctx.fillStyle = "rgba(120, 180, 230, 0.55)";
  ctx.font = "400 26px 'Courier New', monospace";
  ctx.fillText(sub.split("").join("  "), 256, 126);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

const LINE_VERT = /* glsl */ `
  attribute float aT;
  varying float vT;
  varying float vDist;
  void main() {
    vT = aT;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const LINE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying float vT;
  varying float vDist;
  void main() {
    /* faint base route */
    vec3 col = vec3(0.10, 0.30, 0.55) * 0.5;
    float a = 0.22;
    /* two latency pulses racing along the route */
    float p1 = abs(fract(vT - uTime * 0.22 + uPhase) - 0.5);
    float p2 = abs(fract(vT * 0.997 - uTime * 0.09 + uPhase * 1.7) - 0.5);
    float g = smoothstep(0.045, 0.0, p1) * 1.6 + smoothstep(0.03, 0.0, p2) * 0.9;
    col += g * vec3(0.35, 0.85, 1.0);
    a += g * 0.8;
    a *= smoothstep(600.0, 140.0, vDist);
    gl_FragColor = vec4(col, a);
  }
`;

function Routes() {
  const lines = useMemo(() => {
    const out: THREE.Line[] = [];
    const pts = EXCHANGES.map((e) => new THREE.Vector3(...e.pos));
    const pairs: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [2, 1], [4, 5], [3, 4],
    ];
    pairs.forEach(([i, j], k) => {
      const a = pts[i], b = pts[j];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y += a.distanceTo(b) * 0.28;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const sampled = curve.getPoints(72);
      const geo = new THREE.BufferGeometry().setFromPoints(sampled);
      const t = new Float32Array(sampled.length);
      for (let n = 0; n < t.length; n++) t[n] = n / (t.length - 1);
      geo.setAttribute("aT", new THREE.BufferAttribute(t, 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
        uniforms: { uTime: { value: 0 }, uPhase: { value: k * 0.37 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      out.push(new THREE.Line(geo, mat));
    });
    return out;
  }, []);

  useEffect(
    () => () => lines.forEach((l) => { l.geometry.dispose(); (l.material as THREE.Material).dispose(); }),
    [lines],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lines.forEach((l) => (((l.material as THREE.ShaderMaterial).uniforms.uTime.value) = t));
  });

  return (
    <group>
      {lines.map((l, i) => <primitive key={i} object={l} />)}
    </group>
  );
}

function ExchangeNode({ name, sub, pos, r }: (typeof EXCHANGES)[number]) {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const label = useMemo(() => makeLabel(name, sub), [name, sub]);
  useEffect(() => () => label.dispose(), [label]);

  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.12;
      shell.current.rotation.x += delta * 0.04;
      shell.current.position.y = Math.sin(t * 0.4 + seed) * 1.6;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.8 + seed) * 0.12;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group position={pos}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[r, 1]} />
        <meshBasicMaterial color="#1e5a8f" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[r * 0.32, 1]} />
        <meshBasicMaterial color="#9adcff" />
      </mesh>
      <sprite position={[0, r + 6, 0]} scale={[26, 8.1, 1]}>
        <spriteMaterial map={label} transparent opacity={0.9} fog />
      </sprite>
    </group>
  );
}

/* ── giant wireframe data monoliths — the projects zone (z −180…−300) ── */
const MONOLITHS: { pos: [number, number, number]; size: [number, number, number]; spin: number }[] = [
  { pos: [-58, 34, -195], size: [22, 60, 22], spin: 0.05 },
  { pos: [62, 44, -235], size: [28, 80, 28], spin: -0.04 },
  { pos: [-70, 50, -285], size: [24, 95, 24], spin: 0.03 },
  { pos: [78, 38, -305], size: [20, 66, 20], spin: -0.06 },
  { pos: [0, 70, -265], size: [16, 40, 16], spin: 0.08 },
];

function DataMonoliths() {
  const group = useRef<THREE.Group>(null);

  const objects = useMemo(
    () =>
      MONOLITHS.map((m) => {
        const geo = new THREE.BoxGeometry(...m.size, 2, 5, 2);
        const edges = new THREE.EdgesGeometry(geo);
        geo.dispose();
        const mat = new THREE.LineBasicMaterial({
          color: new THREE.Color("#2f7fd4"),
          transparent: true,
          opacity: 0.5,
        });
        const lines = new THREE.LineSegments(edges, mat);
        lines.position.set(...m.pos);
        return { lines, spin: m.spin };
      }),
    [],
  );

  useEffect(
    () => () => objects.forEach((o) => { o.lines.geometry.dispose(); (o.lines.material as THREE.Material).dispose(); }),
    [objects],
  );

  useFrame((_, delta) => {
    objects.forEach((o) => (o.lines.rotation.y += delta * o.spin));
  });

  return (
    <group ref={group}>
      {objects.map((o, i) => <primitive key={i} object={o.lines} />)}
      {/* faint solid cores inside the monoliths */}
      {MONOLITHS.map((m, i) => (
        <mesh key={`c${i}`} position={m.pos}>
          <boxGeometry args={[m.size[0] * 0.3, m.size[1] * 0.8, m.size[2] * 0.3]} />
          <meshBasicMaterial color="#0c2444" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export default function Network() {
  return (
    <group>
      {EXCHANGES.map((e) => <ExchangeNode key={e.name} {...e} />)}
      <Routes />
      <DataMonoliths />
    </group>
  );
}
