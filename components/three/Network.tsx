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

/* ── aurora-lit structure palette ──
   The towers were pure #ffffff wireframes over opaque #0d0d0d cores. Against
   the old contour terrain that read fine, but once the background became an
   aurora nothing in them picked up the field's light, so they sat on top of
   the scene as a separate visual language instead of standing in it.

   These get baked into a colour attribute, which needs the manual sRGB→linear
   conversion three applies automatically to material.color but NOT to vertex
   colours (r152+ colour management). */
const STRUCT_BASE = new THREE.Color("#0f6f66").convertSRGBToLinear(); // teal at the field
const STRUCT_TOP = new THREE.Color("#dff7ec").convertSRGBToLinear(); // pale mint at altitude

/* Vertical gradient baked into a geometry's colour attribute, so the built-in
   line material can carry the gradient — and keep its fog — without needing a
   custom shader. */
function applyHeightGradient(
  geo: THREE.BufferGeometry,
  y0: number,
  y1: number,
) {
  const pos = geo.getAttribute("position");
  const out = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const g = THREE.MathUtils.clamp((pos.getY(i) - y0) / (y1 - y0), 0, 1);
    /* squared so the mint stays up near the crown rather than washing the
       whole tower pale */
    c.copy(STRUCT_BASE).lerp(STRUCT_TOP, g * g);
    out[i * 3] = c.r;
    out[i * 3 + 1] = c.g;
    out[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(out, 3));
  return geo;
}

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
    /* faint base route, tinted teal so the idle routes belong to the aurora */
    vec3 col = vec3(0.09, 0.17, 0.16);
    float a = 0.20;
    /* two latency pulses racing along the route */
    float p1 = abs(fract(vT - uTime * 0.22 + uPhase) - 0.5);
    float p2 = abs(fract(vT * 0.997 - uTime * 0.09 + uPhase * 1.7) - 0.5);
    float g = smoothstep(0.045, 0.0, p1) * 1.6 + smoothstep(0.03, 0.0, p2) * 0.9;
    /* pulses run mint instead of royal blue — the blue was the one hue on
       screen with no relationship to the aurora behind it */
    col += g * vec3(0.32, 0.95, 0.80);
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

  /* Modelled on Phiroze Jeejeebhoy Towers, the BSE building on Dalal Street:
     a slender, heavily banded shaft standing on a wide curved podium, capped
     by a broader mechanical crown. Reads far more like an exchange than the
     plain banded box that was here before. */
  const w = r * 1.25;
  const h = pos[1] + 8;
  const spireH = r * 0.55;

  /* the drum the shaft stands on */
  const rPod = w * 1.2;
  const hPod = h * 0.2;

  const edges = useMemo(() => {
    const segs: number[] = [];
    const push = (
      x1: number, y1: number, z1: number,
      x2: number, y2: number, z2: number,
    ) => segs.push(x1, y1, z1, x2, y2, z2);

    /* ── podium: the curved drum, the building's most recognisable feature ── */
    const SIDES = 26;
    const podRings = 4;
    for (let i = 0; i <= podRings; i++) {
      const y = (hPod * i) / podRings;
      for (let s = 0; s < SIDES; s++) {
        const a1 = (s / SIDES) * Math.PI * 2;
        const a2 = ((s + 1) / SIDES) * Math.PI * 2;
        push(
          Math.cos(a1) * rPod, y, Math.sin(a1) * rPod,
          Math.cos(a2) * rPod, y, Math.sin(a2) * rPod,
        );
      }
    }
    /* every other side gets a mullion — all 26 would read as a solid wall */
    for (let s = 0; s < SIDES; s += 2) {
      const a = (s / SIDES) * Math.PI * 2;
      push(
        Math.cos(a) * rPod, 0, Math.sin(a) * rPod,
        Math.cos(a) * rPod, hPod, Math.sin(a) * rPod,
      );
    }

    /* ── shaft: dense horizontal banding is the signature ── */
    const hw = w / 2;
    const corners: [number, number][] = [[-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw]];
    const bands = Math.max(8, Math.round((h - hPod) / 2.6));
    for (let i = 0; i <= bands; i++) {
      const y = hPod + ((h - hPod) * i) / bands;
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = corners[c];
        const [x2, z2] = corners[(c + 1) % 4];
        push(x1, y, z1, x2, y, z2);
      }
    }
    /* corner posts plus one mullion mid-face */
    for (let c = 0; c < 4; c++) {
      const [x1, z1] = corners[c];
      const [x2, z2] = corners[(c + 1) % 4];
      for (let p = 0; p < 2; p++) {
        const tt = p / 2;
        const x = x1 + (x2 - x1) * tt;
        const z = z1 + (z2 - z1) * tt;
        push(x, hPod, z, x, h, z);
      }
    }

    /* ── crown: the broader band capping the shaft ── */
    const rc = hw * 1.22;
    const crown: [number, number][] = [[-rc, -rc], [rc, -rc], [rc, rc], [-rc, rc]];
    const crownBase = h - Math.min(3.0, h * 0.07);
    for (const y of [crownBase, h]) {
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = crown[c];
        const [x2, z2] = crown[(c + 1) % 4];
        push(x1, y, z1, x2, y, z2);
      }
    }
    for (const [x, z] of crown) push(x, crownBase, z, x, h, z);

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs), 3));
    return applyHeightGradient(g, 0, h);
  }, [w, h, rPod, hPod]);

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
      {/* Smoked-glass mass in two parts matching the wireframe's massing —
          deep teal rather than neutral black, so the body reads as dark glass
          standing in the aurora rather than a hole cut in it. Slightly inset
          from the wireframe so the lines stay crisp on top of it. */}
      <mesh position={[0, hPod / 2, 0]}>
        <cylinderGeometry args={[rPod * 0.98, rPod * 0.98, hPod, 26]} />
        <meshBasicMaterial color="#03100f" transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, (hPod + h) / 2, 0]}>
        <boxGeometry args={[w * 0.98, h - hPod, w * 0.98]} />
        <meshBasicMaterial color="#03100f" transparent opacity={0.6} />
      </mesh>
      {/* frosted sheen over the shaft, tinted to the field's own light */}
      <mesh position={[0, (hPod + h) / 2, 0]}>
        <boxGeometry args={[w * 0.97, h - hPod, w * 0.97]} />
        <meshBasicMaterial color="#a8f0dc" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* wireframe facade — teal at the base easing to mint at the crown */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial vertexColors transparent opacity={0.72} />
      </lineSegments>
      {/* rooftop spire */}
      <mesh position={[0, h + spireH / 2, 0]}>
        <boxGeometry args={[0.5, spireH, 0.5]} />
        <meshBasicMaterial color="#dff7ec" transparent opacity={0.85} />
      </mesh>
      {/* blinking rooftop beacon — aurora mint, was a dull neutral grey */}
      <mesh ref={light} position={[0, h + spireH, 0]}>
        <sphereGeometry args={[1.1, 10, 10]} />
        <meshBasicMaterial color="#48e3c4" transparent />
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
        /* box geometry is centred, so the gradient spans ±height/2 */
        applyHeightGradient(edges, -m.size[1] / 2, m.size[1] / 2);
        const mat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.46,
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
          <meshBasicMaterial color="#04100f" transparent opacity={0.5} />
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
