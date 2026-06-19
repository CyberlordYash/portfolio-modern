"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Exchange nodes floating above the terrain, connected by light routes that
   carry latency pulses, plus the giant data monoliths of the projects zone. */

export const EXCHANGES: { name: string; sub: string; pos: [number, number, number]; r: number }[] = [
  { name: "NSE",    sub: "EQUITIES · MUMBAI",    pos: [-58, 30, -52],  r: 7 },
  { name: "BSE",    sub: "EQUITIES · DALAL ST",  pos: [56, 36, -78],   r: 8 },
  { name: "NIFTY",  sub: "INDEX · NSE",          pos: [-48, 32, -158], r: 9 },
  { name: "MCX",    sub: "COMMODITIES · MUMBAI", pos: [46, 26, -128],  r: 6 },
  { name: "SENSEX", sub: "INDEX · BSE",          pos: [70, 42, -205],  r: 6 },
  { name: "NCDEX",  sub: "AGRI DERIVS · IN",     pos: [-70, 38, -240], r: 6 },
];

/* ── canvas-texture label sprites (no external font runtime needed) ── */
function makeLabel(name: string, sub: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(235, 235, 235, 0.95)";
  ctx.font = "900 72px 'Orbitron', 'Courier New', monospace";
  ctx.fillText(name, 256, 78);
  ctx.fillStyle = "rgba(170, 170, 170, 0.55)";
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
    vec3 col = vec3(0.30) * 0.5;
    float a = 0.20;
    /* two latency pulses racing along the route */
    float p1 = abs(fract(vT - uTime * 0.22 + uPhase) - 0.5);
    float p2 = abs(fract(vT * 0.997 - uTime * 0.09 + uPhase * 1.7) - 0.5);
    float g = smoothstep(0.045, 0.0, p1) * 1.6 + smoothstep(0.03, 0.0, p2) * 0.9;
    col += g * vec3(0.92);
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
  const light = useRef<THREE.Mesh>(null);
  const label = useMemo(() => makeLabel(name, sub), [name, sub]);
  useEffect(() => () => label.dispose(), [label]);

  const seed = useMemo(() => Math.random() * 10, []);

  /* slender skyscraper rising from the ground to just above the node point */
  const w = r * 1.25;
  const h = pos[1] + 8;
  const floors = Math.max(4, Math.round(h / 6));
  const spireH = r * 0.9;

  /* wireframe structure: 4 corner verticals + a square ring per floor */
  const edges = useMemo(() => {
    const hw = w / 2;
    const corners: [number, number][] = [[-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw]];
    const segs: number[] = [];
    /* vertical mullions — corner posts plus panels down each face (curtain wall) */
    const panels = 3;
    for (let c = 0; c < 4; c++) {
      const [x1, z1] = corners[c];
      const [x2, z2] = corners[(c + 1) % 4];
      for (let p = 0; p < panels; p++) {
        const tt = p / panels;
        const x = x1 + (x2 - x1) * tt;
        const z = z1 + (z2 - z1) * tt;
        segs.push(x, 0, z, x, h, z);
      }
    }
    /* floor rings */
    for (let i = 0; i <= floors; i++) {
      const y = (h * i) / floors;
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = corners[c];
        const [x2, z2] = corners[(c + 1) % 4];
        segs.push(x1, y, z1, x2, y, z2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs), 3));
    return g;
  }, [w, h, floors]);

  useEffect(() => () => edges.dispose(), [edges]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light.current) {
      const b = 0.5 + 0.5 * Math.sin(t * 2.0 + seed);
      light.current.scale.setScalar(0.6 + b * 0.9);
      (light.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + b * 0.65;
    }
  });

  return (
    <group position={[pos[0], 0, pos[2]]}>
      {/* dark core so the tower reads as solid against the terrain */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, w]} />
        <meshBasicMaterial color="#0d0d0d" transparent opacity={0.68} />
      </mesh>
      {/* frosted-glass sheen — modern white glow over the body */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w * 0.99, h, w * 0.99]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* bright white wireframe facade */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.88} />
      </lineSegments>
      {/* rooftop spire */}
      <mesh position={[0, h + spireH / 2, 0]}>
        <boxGeometry args={[0.5, spireH, 0.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.92} />
      </mesh>
      {/* blinking rooftop beacon */}
      <mesh ref={light} position={[0, h + spireH, 0]}>
        <sphereGeometry args={[1.1, 10, 10]} />
        <meshBasicMaterial color="#ffffff" transparent />
      </mesh>
      {/* label */}
      <sprite position={[0, h + spireH + 7, 0]} scale={[26, 8.1, 1]}>
        <spriteMaterial map={label} transparent opacity={0.95} fog />
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
          color: new THREE.Color("#c4c4c4"),
          transparent: true,
          opacity: 0.55,
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
          <meshBasicMaterial color="#161616" transparent opacity={0.55} />
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
