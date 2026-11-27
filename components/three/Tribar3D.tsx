"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════
   IMPOSSIBLE TRIBAR — assembled from cubes, disassembled by scroll

   ── The construction ──
   Sixteen unit cubes on an integer lattice, in three arms:

       arm X : (0,0,0) … (5,0,0)
       arm Y : (5,1,0) … (5,5,0)
       arm Z : (5,5,1) … (5,5,5)

   In 3D this is an open staircase — the ends are nowhere near each
   other. It reads as a closed triangle because the last cube (5,5,5)
   differs from the first (0,0,0) by (5,5,5), which is exactly
   parallel to the view direction (1,1,1). Under *orthographic*
   projection, points separated along the view axis land on the same
   pixel, so the far end covers the near one — and being closer to the
   camera, it draws in front.

   The illusion is therefore a property of the geometry and the
   projection. Nothing is faked, depth-sorted by hand, or drawn in a
   special order. Perspective would separate those two ends instantly,
   which is the real reason the camera must be orthographic.

   Cubes rather than three long beams: the stepped silhouette is the
   whole character of the object, and it is what makes the break-apart
   legible — you can see the individual blocks pull out of line.

   ── The scroll timeline ──
     0.00 → 0.12  the impossible triangle, turning about the view axis.
     0.12 → 0.45  every block flies a staggered arc and the cluster
                  stacks itself bottom-up: three server racks (plinth,
                  recessed frame, rack units with drive bays and status
                  LEDs, lid) fed by an overhead cable tray. The liar cube
                  lands as the blue 2U core in the centre rack.
     0.45 → 0.62  the cluster is live: LEDs flicker with disk activity,
                  packets run the tray and drop into each rack, and
                  hovering (or tapping) a rack lifts it, lights its LEDs
                  solid and slides one server out on its rails. Until the
                  visitor touches it, the focus walks the racks on its own.
     0.62 → 0.97  data floods in and the servers fill with light, then
                  fracture into their blocks, which scatter and fade.

   ── Why the faces are painted, not lit ──
   A previous pass used MeshStandardMaterial and a light rig. Every
   face resolved within a few percent of the same near-black and the
   object read as a blob. Face values are now written into the cube
   geometry as vertex colours and multiplied by a per-instance tint,
   giving three flat, deliberately chosen values and no shading work.
══════════════════════════════════════════════════════════════════ */

const N = 6; // cubes per arm
const GAP = 1; // lattice spacing (cube size is 1, so arms are solid)

const BASE_ANGLE = -0.42;
const TURN = Math.PI * 1.15; // travel about the view axis across the track
const TILT_MAX = 0.2; // slight tilt off the iso axis once the architecture forms
const YAW = 0; // the architecture is asymmetric, so it lands unturned

const MORPH = [0.12, 0.45]; // scroll window for triangle → architecture
const STAGGER = 0.45; // share of the window spent staggering block starts
const LIVE = [MORPH[1] - 0.02, MORPH[1] + 0.02, 0.62, 0.65]; // interactive window

/* The ending, all scroll-driven:
     RECEIVE  packets flood in and each server fills with light, bottom up
     CRACK    the full servers fracture — every block pulls away from its
              neighbours with a little tumble
     SCATTER  the blocks fly apart, accelerating, and fade */
const RECEIVE = [0.62, 0.75];
const CRACK = [0.74, 0.82];
const SCATTER = [0.8, 0.97];
const ARCH_SCALE = 0.7; // lattice → mesh units, so the cluster reads at the tribar's size

const ACCENT_ON_LIGHT = "#1A32FF";
const ACCENT_ON_DARK = "#687CFF";
const PACKET_SPEED = 5.5; // lattice units per second
const AUTO_STEP = 2.2; // seconds per rack in the idle walk

/* ── The server cluster ────────────────────────────────────────────
   Three racks in a row along Z, fronts facing +X so the LED faces sit
   on the mid-tone plane the camera sees squarely. The centre rack is
   taller and carries the core: a 2U unit that the liar cube becomes.
   The overhead trunk enters from far off along −Z — which projects
   up and to the right — so it arrives out of the top-right corner of
   the frame, runs over the row and drops into each rack. It is left
   out of the centring so the racks, not the cable, sit mid-frame. */
const NODE_COUNT = 3;
const FEED_Z = -42; // far end of the trunk, well past the viewport corner
const ROUTE_START_Z = -30; // packets appear already off-screen
const RACK_Z = [-2.7, 0, 2.7];
const RACK_UNITS = [7, 10, 7];
const UH = 0.44; // rack-unit pitch
const UGAP = 0.07; // seam between units — shows the recessed frame
const RD = 2.2; // rack depth (X)
const RW = 2.0; // rack width (Z)
const PLINTH = 0.26;
const CAP = 0.16;
const CORE_UNIT = 5; // centre rack, first unit of the 2U core
const SLED_UNIT = [3, 2, 3]; // the unit that slides out when a rack is focused
const TRAY_Y = PLINTH + RACK_UNITS[1] * UH + CAP + 0.95;
const TRAY_END_Z = RACK_Z[2] + 0.55;
const rackTop = (r: number) => PLINTH + RACK_UNITS[r] * UH + CAP;

/* One request path per rack: in along the trunk from off-screen, then
   down the drop into the rack's lid. Lattice coordinates. */
const ROUTES: [number, number, number][][] = RACK_Z.map((z, r) => [
  [0, TRAY_Y, ROUTE_START_Z],
  [0, TRAY_Y, z],
  [0, rackTop(r), z],
]);
const PACKETS_PER_ROUTE = 6;

/* ── Face values ───────────────────────────────────────────────────
   Relative shades multiplied by the per-instance tint. +Y (top) full,
   +X mid, +Z darkest.

   These were 1.0 / 0.62 / 0.34 over a #1A1A1D tint, which resolved to
   #1A1A1D, #101012 and #090909 — three shades inside a six-point
   range, all of them essentially black. The object had no readable
   form at rest and looked like a flat silhouette.

   The fix is both halves of the equation: lift the tint so the top
   face is an actual charcoal rather than near-black, and widen the
   spread so the other two planes fall clearly away from it. Now
   roughly #3A3A41 / #1D1D20 / #0F0F10 — still a dark object, but one
   with three distinguishable planes. */
const FACE_PX = 0.5;
const FACE_PY = 1.0;
const FACE_PZ = 0.26;

const INK_ON_LIGHT = "#3A3A41";
const INK_ON_DARK = "#FFFFFF";

/** Piecewise-linear sample of `stops` → `values`, clamped at both ends. */
function track(p: number, stops: number[], values: number[]) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + (values[i] - values[i - 1]) * t;
    }
  }
  return values[values.length - 1];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* BoxGeometry emits faces in a fixed order — +X, −X, +Y, −Y, +Z, −Z,
   four vertices each — so a value can be written per face by index
   without inspecting normals. Hidden faces take their opposite's
   value; they are never rasterised. */
function shadedCube() {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const perFace = [FACE_PX, FACE_PX, FACE_PY, FACE_PY, FACE_PZ, FACE_PZ];
  const colors = new Float32Array(24 * 3);
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = (f * 4 + v) * 3;
      colors[i] = colors[i + 1] = colors[i + 2] = perFace[f];
    }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

/* The accent cube's skin: the same grainy blue mesh as .flow-panel
   in globals.css, painted once into a canvas. Soft pools of the one
   accent family, then per-pixel grain — the grain is what hides the
   gradient banding and makes it read as light rather than CSS. Face
   shading still applies on top through the vertex colours. */
function flowTexture() {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1A32FF";
  g.fillRect(0, 0, S, S);
  const pools: [number, number, number, string][] = [
    [0.05, 0.0, 0.75, "40,22,170"],
    [0.95, 0.1, 0.6, "130,150,255"],
    [0.8, 0.75, 0.6, "80,56,240"],
    [0.3, 1.05, 0.8, "30,130,255"],
  ];
  for (const [x, y, r, rgb] of pools) {
    const grad = g.createRadialGradient(x * S, y * S, 0, x * S, y * S, r * S);
    grad.addColorStop(0, `rgba(${rgb},0.95)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
  }
  const img = g.getImageData(0, 0, S, S);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 34;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** The sixteen lattice cells, with the arm axis each one travels along
    when the figure comes apart. */
function buildCells() {
  const cells: { pos: THREE.Vector3; dir: THREE.Vector3; step: number }[] = [];
  const last = N - 1;

  for (let i = 0; i < N; i++)
    cells.push({
      pos: new THREE.Vector3(i, 0, 0),
      dir: new THREE.Vector3(1, 0, 0),
      step: i,
    });
  for (let j = 1; j < N; j++)
    cells.push({
      pos: new THREE.Vector3(last, j, 0),
      dir: new THREE.Vector3(0, 1, 0),
      step: j,
    });
  for (let k = 1; k < N; k++)
    cells.push({
      pos: new THREE.Vector3(last, last, k),
      dir: new THREE.Vector3(0, 0, 1),
      step: k,
    });

  return cells;
}

type ArchKind = "core" | "unit" | "frame" | "led" | "bay" | "pipe";
type ArchCell = {
  pos: THREE.Vector3;
  size: THREE.Vector3;
  kind: ArchKind;
  node: number; // rack index, -1 for cabling
  links: number[]; // racks a pipe feeds
  sled: boolean; // slides out of the rack when focused
  feed?: boolean; // the off-screen run of the trunk, ignored when centring
  phase: number; // LED blink phase
  rate: number; // LED blink rate
};

/* Base shade per part, multiplied into the ink tint, so chassis, frame,
   drive bays and cabling read as distinct materials. */
const SHADE: Record<ArchKind, number> = {
  core: 1,
  unit: 1,
  frame: 0.4,
  led: 1,
  bay: 0.55,
  pipe: 0.5,
};

/** The cluster's cells in lattice units. Index 0 is the core, which the
    liar flies to. */
function buildArchCells(raw = false): ArchCell[] {
  const out: ArchCell[] = [];
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  let seed = 0;
  const hash = () => Math.abs(Math.sin(++seed * 91.3458) * 47453.5453) % 1;
  const add = (
    pos: THREE.Vector3,
    size: THREE.Vector3,
    kind: ArchKind,
    node: number,
    extra: Partial<Pick<ArchCell, "links" | "sled">> = {},
  ) =>
    out.push({
      pos,
      size,
      kind,
      node,
      links: extra.links ?? [],
      sled: extra.sled ?? false,
      phase: hash() * Math.PI * 2,
      rate: 1.4 + hash() * 5,
    });
  const unitY0 = (u: number) => PLINTH + u * UH + UGAP / 2;

  // The core — 2U, flow-textured, standing proud of the rack. Must be first.
  const coreH = 2 * UH - UGAP;
  add(v(0.06, unitY0(CORE_UNIT) + coreH / 2, RACK_Z[1]), v(RD + 0.12, coreH, RW), "core", 1);

  // Axis-aligned cable from a to b, split into short cells.
  const pipe = (links: number[], a: THREE.Vector3, b: THREE.Vector3, w = 0.16, step = 0.8) => {
    const d = b.clone().sub(a);
    const len = d.length();
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const size = v(
        Math.abs(d.x) > 1e-6 ? len / n : w,
        Math.abs(d.y) > 1e-6 ? len / n : w * 0.7,
        Math.abs(d.z) > 1e-6 ? len / n : w,
      );
      add(a.clone().lerp(b, t), size, "pipe", -1, { links });
    }
  };

  RACK_Z.forEach((rz, r) => {
    const n = RACK_UNITS[r];
    const body = n * UH;
    // Plinth, recessed frame (shows through the seams), lid.
    add(v(0, PLINTH / 2, rz), v(RD + 0.22, PLINTH, RW + 0.22), "frame", r);
    add(v(-0.18, PLINTH + body / 2, rz), v(RD - 0.36, body, RW - 0.3), "frame", r);
    add(v(0, PLINTH + body + CAP / 2, rz), v(RD + 0.12, CAP, RW + 0.12), "unit", r);

    for (let u = 0; u < n; u++) {
      if (r === 1 && (u === CORE_UNIT || u === CORE_UNIT + 1)) continue;
      const sled = u === SLED_UNIT[r];
      const h = UH - UGAP;
      const y = unitY0(u) + h / 2;
      add(v(0, y, rz), v(RD, h, RW), "unit", r, { sled });
      // Drive-bay strip and two status LEDs on the front face.
      const fx = RD / 2;
      add(v(fx + 0.02, y, rz + 0.3), v(0.05, h * 0.5, RW * 0.48), "bay", r, { sled });
      add(v(fx + 0.04, y, rz - RW / 2 + 0.28), v(0.08, h * 0.32, 0.16), "led", r, { sled });
      add(v(fx + 0.04, y, rz - RW / 2 + 0.52), v(0.08, h * 0.32, 0.16), "led", r, { sled });
    }

    // Drop from the tray into this rack's lid.
    pipe([r], v(0, TRAY_Y, rz), v(0, rackTop(r), rz));
  });

  // Overhead trunk over the row, capped past the last rack.
  const trayStart = RACK_Z[0] - RW / 2 - 0.4;
  pipe([], v(0, TRAY_Y, trayStart), v(0, TRAY_Y, TRAY_END_Z), 0.24);
  add(v(0, TRAY_Y, TRAY_END_Z + 0.06), v(0.34, 0.24, 0.12), "pipe", -1);
  // Its run in from the corner: few long cells, excluded from centring.
  const inStart = out.length;
  pipe([], v(0, TRAY_Y, FEED_Z), v(0, TRAY_Y, trayStart), 0.24, 3);
  for (let i = inStart; i < out.length; i++) out[i].feed = true;

  if (raw) return out;
  // Centre on the bounding box and bring down to mesh units.
  const box = new THREE.Box3();
  out.forEach((c) => !c.feed && box.expandByPoint(c.pos));
  const centre = box.getCenter(new THREE.Vector3());
  out.forEach((c) => c.pos.sub(centre).multiplyScalar(ARCH_SCALE));
  return out;
}

/** Centre of the uncentred lattice, for route waypoints. */
function archCentre() {
  const box = new THREE.Box3();
  buildArchCells(true).forEach((c) => !c.feed && box.expandByPoint(c.pos));
  return box.getCenter(new THREE.Vector3());
}

type Flight = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  size: THREE.Vector3; // landed scale, lattice units
  kind: ArchKind;
  node: number;
  links: number[];
  sled: boolean;
  phase: number;
  rate: number;
  arc: THREE.Vector3; // outward bulge of the flight path
  delay: number; // 0..1 share of STAGGER
  spin: THREE.Vector3; // wobble axis
  out: THREE.Vector3; // burst direction at the end of the hero
};

/* Pairs every architecture cell with a tribar cell. The liar is pinned
   to the gateway; every other tribar cube claims its nearest unique
   target (greedy over all pairs, shortest first) so paths don't cross,
   and the remaining cells split off the nearest tribar cube. The liar's
   flight is moved last so it stays the separately textured mesh. */
function buildFlights(src: THREE.Vector3[], liarIdx: number): Flight[] {
  const D = buildArchCells();
  const sc = src.reduce((a, v) => a.add(v), new THREE.Vector3()).divideScalar(src.length);
  const S = src.map((v) => v.clone().sub(sc));

  const owner = new Array<number>(D.length).fill(-1);
  owner[0] = liarIdx;
  const srcUsed = new Set<number>([liarIdx]);
  const pairs: [number, number, number][] = [];
  S.forEach((a, i) => D.forEach((b, j) => pairs.push([a.distanceToSquared(b.pos), i, j])));
  pairs.sort((a, b) => a[0] - b[0]);
  for (const [, i, j] of pairs) {
    if (srcUsed.has(i) || owner[j] !== -1) continue;
    owner[j] = i;
    srcUsed.add(i);
  }
  D.forEach((b, j) => {
    if (owner[j] !== -1) return;
    let best = 0;
    S.forEach((a, i) => {
      if (a.distanceToSquared(b.pos) < S[best].distanceToSquared(b.pos)) best = i;
    });
    owner[j] = best;
  });

  const ys = D.map((c) => c.pos.y);
  const minY = Math.min(...ys);
  const spanY = Math.max(...ys) - minY || 1;
  const flights: Flight[] = D.map((cell, j) => {
    const from = S[owner[j]];
    const to = cell.pos;
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const arc =
      mid.lengthSq() > 1e-4 ? mid.normalize().multiplyScalar(1.6) : new THREE.Vector3(0, 1.6, 0);
    // Racks stack bottom-up, unit by unit, with a little hash so a
    // layer doesn't land as one slab.
    const h = Math.abs(Math.sin(j * 12.9898) * 43758.5453) % 1;
    const delay = Math.min(1, ((to.y - minY) / spanY) * 0.8 + h * 0.2);
    const spin = new THREE.Vector3(h - 0.5, 1, 0.5 - h).normalize();
    const out = to.lengthSq() > 1e-4 ? to.clone().normalize() : new THREE.Vector3(0, 1, 0);
    return {
      from,
      to,
      size: cell.size,
      kind: cell.kind,
      node: cell.node,
      links: cell.links,
      sled: cell.sled,
      phase: cell.phase,
      rate: cell.rate,
      arc,
      delay,
      spin,
      out,
    };
  });
  const [liar] = flights.splice(0, 1);
  flights.push(liar);
  return flights;
}

/** Route polylines in mesh units, with cumulative lengths for sampling. */
function buildRoutes() {
  const c = archCentre();
  return ROUTES.map((r) => {
    const pts = r.map(([x, y, z]) => new THREE.Vector3(x, y, z).sub(c).multiplyScalar(ARCH_SCALE));
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    return { pts, cum, len: cum[cum.length - 1] };
  });
}

function sampleRoute(r: ReturnType<typeof buildRoutes>[number], d: number, out: THREE.Vector3) {
  let i = 1;
  while (i < r.cum.length - 1 && r.cum[i] < d) i++;
  const seg = r.cum[i] - r.cum[i - 1] || 1;
  return out.copy(r.pts[i - 1]).lerp(r.pts[i], (d - r.cum[i - 1]) / seg);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    // Direction is what matters for the projection; distance only has
    // to clear the bounding sphere.
    cam.position.set(1, 1, 1).normalize().multiplyScalar(80);
    cam.lookAt(0, 0, 0);
    /* The figure spans ~10 world units projected, so zoom is just the
       target pixel size over ten.

       ── Desktop: sized off the type, not the viewport ──
       A flat cap (470px) held the mark still while the name kept
       growing with vw, so their relationship drifted — correct on a
       laptop, and by 2560 the object was burying whole letters.

       Deriving it from the same clamp the h1 uses locks the ratio:
       2.30 × the face size is exactly the proportion that works on a
       laptop, and it now holds at every width. The constants mirror
       `clamp(2.4rem, 13.5vw, 18rem)` in Hero.tsx — if that changes,
       change these with it.

       ── Narrow: sized off the viewport ──
       Below lg the name stacks and the mark sits between the two
       lines. 0.72 of the width made it nearly as wide as "SACHAN"
       itself, so it swamped the type rather than punctuating it —
       0.58 leaves both names legible either side of it. */
    const wide = size.width >= 1024;
    const facePx = Math.min(Math.max(38.4, size.width * 0.135), 288);
    const target = wide
      ? facePx * 2.3
      : Math.min(size.width * 0.58, 380);
    cam.zoom = Math.max(20, target / 10);
    cam.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

function Voxels({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const reduced = usePrefersReducedMotion();
  const angle = useRef(BASE_ANGLE);
  const { camera, size, gl } = useThree();

  const cells = useMemo(buildCells, []);
  const flights = useMemo(
    () => buildFlights(cells.map((c) => c.pos), cells.length - 1),
    [cells],
  );
  const routes = useMemo(buildRoutes, []);

  /* Interaction state lives in refs — it is read every frame. */
  const hovered = useRef<number | null>(null);
  const touched = useRef(false); // stops the idle walk once the visitor engages
  const live = useRef(false);
  const lift = useRef(Array.from({ length: NODE_COUNT }, () => 0));

  /* Per-component data for the exploded-view burst: each component
     leaves as one rigid unit from its own centre, in its own direction,
     on its own beat. */
  const parts = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, (_, n) => {
        const own = flights.filter((f) => f.node === n);
        const c = new THREE.Vector3();
        let base = Infinity;
        let top = -Infinity;
        own.forEach((f) => {
          c.add(f.to);
          base = Math.min(base, f.to.y - (f.size.y * ARCH_SCALE) / 2);
          top = Math.max(top, f.to.y + (f.size.y * ARCH_SCALE) / 2);
        });
        c.divideScalar(own.length || 1);
        const dir = new THREE.Vector3(c.x, 0, c.z);
        if (dir.lengthSq() < 1e-2) dir.set(1, 0, 0); // the centre rack bursts toward the viewer
        dir.normalize();
        dir.y = 0.45;
        const h = Math.abs(Math.sin((n + 1) * 78.233) * 43758.5453) % 1;
        return { c, base, height: Math.max(1e-3, top - base), dir, delay: h };
      }),
    [flights],
  );
  const qTumble = useMemo(() => new THREE.Quaternion(), []);
  const away = useMemo(() => new THREE.Vector3(), []);
  const qWobble = useMemo(() => new THREE.Quaternion(), []);

  const packets = useRef<THREE.InstancedMesh>(null);
  const packetCount = ROUTES.length * PACKETS_PER_ROUTE;
  const packetMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true }),
    [],
  );
  const packetPos = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(shadedCube, []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true }),
    [],
  );

  /* The accent cube is drawn on its own so it can carry the flow
     texture; the instanced mesh renders every cube but the last. */
  const liar = useRef<THREE.Mesh>(null);
  const liarMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: flowTexture(),
        vertexColors: true,
        transparent: true,
      }),
    [],
  );

  const viewAxis = useMemo(() => new THREE.Vector3(1, 1, 1).normalize(), []);
  // Any axis perpendicular to the view direction will open the figure;
  // this one keeps the separation broadly horizontal on screen.
  const tiltAxis = useMemo(
    () => new THREE.Vector3().crossVectors(viewAxis, new THREE.Vector3(0, 1, 0)).normalize(),
    [viewAxis],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const qView = useMemo(() => new THREE.Quaternion(), []);
  const qTilt = useMemo(() => new THREE.Quaternion(), []);
  const qYaw = useMemo(() => new THREE.Quaternion(), []);
  const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  // Screen-right for a camera on the (1,1,1) axis looking at the origin.
  const screenRight = useMemo(() => new THREE.Vector3(1, 0, -1).normalize(), []);

  const inkLight = useMemo(() => new THREE.Color(INK_ON_LIGHT), []);
  const inkDark = useMemo(() => new THREE.Color(INK_ON_DARK), []);

  const tint = useMemo(() => new THREE.Color(), []);
  const accentLight = useMemo(() => new THREE.Color(ACCENT_ON_LIGHT), []);
  const accentDark = useMemo(() => new THREE.Color(ACCENT_ON_DARK), []);
  const accent = useMemo(() => new THREE.Color(), []);
  const accentHot = useMemo(() => new THREE.Color(), []);
  const scaleTmp = useMemo(() => new THREE.Vector3(), []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      liarMaterial.map?.dispose();
      liarMaterial.dispose();
      packetMaterial.dispose();
    },
    [geometry, material, liarMaterial, packetMaterial],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;

    const p = progress ? progress.get() : 0;

    /* ── Interaction window ────────────────────────────────────
       Only while the architecture is fully formed and before the burst.
       Until the visitor hovers something, the highlight walks the
       components on its own so it is obvious they can be explored. */
    const liveAmt = track(p, LIVE, [0, 1, 1, 0]);
    const receive = track(p, RECEIVE, [0, 1]);
    const crack = easeInOut(track(p, CRACK, [0, 1]));
    const scatter = track(p, SCATTER, [0, 1]);
    live.current = liveAmt > 0.5;
    let focus: number | null = null;
    if (live.current) {
      if (hovered.current !== null) focus = hovered.current;
      else if (!touched.current && !reduced)
        focus = Math.floor(state.clock.elapsedTime / AUTO_STEP) % NODE_COUNT;
    }

    /* ── Tone + highlight ──────────────────────────────────────
       ~100 instances, so tints are simply repainted every frame. Per-part
       shades blend in with the morph so the tribar stays one flat ink. */
    const tone = track(p, [0.28, 0.72], [0, 1]);
    const partMix = track(p, MORPH, [0, 1]);
    accent.copy(accentLight).lerp(accentDark, tone);
    const k = Math.min(1, delta * 10);
    for (let n = 0; n < NODE_COUNT; n++)
      lift.current[n] += ((focus === n ? 1 : 0) - lift.current[n]) * k;

    /* LEDs sit on the +X face, which the vertex shading halves, so
       they are driven past 1 to land at full accent there — and their
       tops clip toward white, which is what makes them read as lit. */
    accentHot.copy(accent).multiplyScalar(1 / FACE_PX);
    const now = state.clock.elapsedTime;

    // The last instance is the liar — the separate flow-textured mesh.
    for (let i = 0; i < flights.length - 1; i++) {
      const f = flights[i];
      tint.copy(inkLight).lerp(inkDark, tone);
      tint.multiplyScalar(1 + (SHADE[f.kind] - 1) * partMix);
      let glow: number;
      if (f.node >= 0) {
        const part = parts[f.node];
        const lit = lift.current[f.node];
        // Fills bottom-up as data arrives; the fracture flashes it.
        const level = (f.to.y - part.base) / part.height;
        const fill = Math.min(1, Math.max(0, (receive * 1.25 - level) * 4));
        if (f.kind === "led") {
          // Disk-activity flicker; a focused rack goes solid; full racks blaze.
          const blink = reduced ? 1 : Math.sin(now * f.rate + f.phase) > -0.3 ? 1 : 0.18;
          glow = partMix * Math.max(blink, lit, fill);
          if (glow > 0.001) tint.lerp(accentHot, Math.min(1, glow));
          m.setColorAt(i, tint);
          continue;
        }
        glow = Math.max(lit * 0.32, fill * 0.6 + crack * (1 - crack) * 1.2);
      } else {
        // Cables light for the rack they feed, and run hot while receiving.
        const feed = f.links.length ? Math.max(...f.links.map((n) => lift.current[n])) : 0;
        glow = Math.max(feed * 0.9, receive * 0.85);
      }
      if (glow > 0.001) tint.lerp(accent, Math.min(1, glow));
      m.setColorAt(i, tint);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    // Fades as it bursts.
    material.opacity = track(p, [0, 0.86, 0.97], [1, 1, 0]);
    liarMaterial.opacity = material.opacity;
    m.visible = material.opacity > 0.001;

    /* ── Morph: triangle → architecture ──────────────────────
       Each block eases along an outward arc on its own staggered clock,
       dips in scale and wobbles mid-flight, then lands axis-aligned (so
       the painted face values read correctly) at its cell size. A
       focused component lifts off the ground. */
    const morph = track(p, MORPH, [0, 1]);
    // Pipes retract as the servers crack.
    const retract = easeInOut(track(p, [RECEIVE[1] - 0.02, CRACK[1]], [0, 1]));
    for (let i = 0; i < flights.length; i++) {
      const f = flights[i];
      const local = Math.min(1, Math.max(0, (morph - f.delay * STAGGER) / (1 - STAGGER)));
      const t = easeInOut(local);
      const bump = Math.sin(Math.PI * t);
      dummy.position.copy(f.from).lerp(f.to, t).addScaledVector(f.arc, bump);
      qWobble.setFromAxisAngle(f.spin, bump * 0.9);
      dummy.quaternion.copy(qWobble);
      scaleTmp.set(1, 1, 1).lerp(f.size, t).multiplyScalar(1 + (ARCH_SCALE - 1) * t);
      dummy.scale.copy(scaleTmp).multiplyScalar(1 - 0.28 * bump);

      if (f.node >= 0) {
        const part = parts[f.node];
        const lit = easeInOut(lift.current[f.node]);
        dummy.position.y += lit * 0.3 * ARCH_SCALE;
        // A focused rack slides one server out on its rails.
        if (f.sled) dummy.position.x += lit * 1.1 * ARCH_SCALE;
        if (crack > 0) {
          // Each block's own way out: away from its component's centre,
          // biased along the component's direction from the middle.
          away.copy(f.to).sub(part.c);
          away.y += (f.to.y - part.base) * 0.6;
          const spread = away.length();
          away.multiplyScalar(spread > 1e-4 ? 1 / spread : 0).addScaledVector(part.dir, 0.9).normalize();

          // Fracture: blocks pull apart from their neighbours and tumble a little.
          dummy.position.addScaledVector(away, crack * 0.32);
          dummy.position.y += (f.to.y - part.base) * crack * 0.5;
          const fly = Math.min(1, Math.max(0, (scatter - f.delay * 0.25 - part.delay * 0.1) / 0.65));
          qTumble.setFromAxisAngle(f.spin, crack * 0.35 + fly * fly * 2.6);
          dummy.quaternion.premultiply(qTumble);

          // Scatter: accelerating outward, shrinking slightly as it goes.
          dummy.position.addScaledVector(away, fly * fly * 7);
          dummy.scale.multiplyScalar(1 - fly * 0.35);
        }
      } else if (retract > 0) {
        // Pipes shrink back to nothing before the components move.
        dummy.scale.multiplyScalar(1 - retract);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (i === flights.length - 1) liar.current?.matrix.copy(dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    // Instances move every frame, so the raycast bounds must follow.
    if (live.current) m.computeBoundingSphere();

    /* ── Packets ───────────────────────────────────────────────
       Requests flowing along the pipes while the architecture is live.
       Children of the main mesh, so they share its turn, tilt and scale. */
    const pk = packets.current;
    if (pk) {
      packetMaterial.opacity =
        track(p, [LIVE[0], LIVE[1], RECEIVE[1] - 0.01, RECEIVE[1] + 0.02], [0, 1, 1, 0]) * material.opacity;
      pk.visible = packetMaterial.opacity > 0.01;
      if (pk.visible) {
        // Scrolling through RECEIVE pushes the packets in faster.
        const clock =
          (reduced ? 0 : state.clock.elapsedTime * PACKET_SPEED * ARCH_SCALE) + receive * 3;
        for (let r = 0; r < routes.length; r++)
          for (let j = 0; j < PACKETS_PER_ROUTE; j++) {
            const route = routes[r];
            const d = (clock + (j / PACKETS_PER_ROUTE) * route.len + r * 0.37 * route.len) % route.len;
            sampleRoute(route, d, packetPos);
            dummy.position.copy(packetPos);
            dummy.quaternion.identity();
            dummy.scale.setScalar(0.3 * ARCH_SCALE);
            dummy.updateMatrix();
            const i = r * PACKETS_PER_ROUTE + j;
            pk.setMatrixAt(i, dummy.matrix);
            pk.setColorAt(i, accent);
          }
        pk.instanceMatrix.needsUpdate = true;
        if (pk.instanceColor) pk.instanceColor.needsUpdate = true;
      }
    }

    /* ── Orientation ───────────────────────────────────────────
       Rotation is scroll position, not elapsed time — an idle spin is
       a loading spinner. Damped follow rather than direct assignment:
       even with Lenis smoothing the page, a trackpad flick arrives in
       coarse steps, and easing absorbs them so the mark glides. */
    const targetAngle = BASE_ANGLE + p * TURN;
    if (reduced) {
      angle.current = targetAngle;
    } else {
      angle.current += (targetAngle - angle.current) * Math.min(1, delta * 6);
    }

    // The in-plane turn unwinds as the chip forms so it lands squarely
    // isometric instead of rotated on screen.
    const settle = easeInOut(track(p, MORPH, [0, 1]));
    qView.setFromAxisAngle(viewAxis, angle.current * (1 - settle));
    qTilt.setFromAxisAngle(tiltAxis, settle * TILT_MAX);
    qYaw.setFromAxisAngle(worldUp, easeInOut(track(p, [MORPH[0], 0.72], [0, 1])) * YAW);
    m.quaternion.copy(qTilt).multiply(qYaw).multiply(qView);

    m.scale.setScalar(track(p, [0, 0.62, 1], [1, 2.1, 2.5]));

    /* ── Vertical alignment ────────────────────────────────────
       The canvas covers the whole sticky stage, so its centre sits
       midway down a column that also holds the statement and the
       status bar. The name is above that midpoint, which is why the
       mark was drifting low and clipping the descender line instead
       of sitting on the seam between the two words.

       Lift it by a fraction of canvas height, converted to world
       units through the current zoom so the offset stays constant in
       pixels at every viewport and through the scroll-driven scale. */
    const zoom = (camera as THREE.OrthographicCamera).zoom || 1;
    /* Both framing corrections belong to the tribar sitting in the
       name — the lift here and `.mark-offset`'s leftward shift on
       desktop. The cluster stands alone in the frame, so they ease out
       as it forms and it lands dead centre of the viewport. The CSS
       shift can't be animated from here, so it is cancelled by moving
       the object the same pixels right along the camera's screen axis. */
    const centred = easeInOut(track(p, MORPH, [0, 1]));
    const cssShift =
      size.width >= 1024 ? Math.min(Math.max(38.4, size.width * 0.135), 288) * 0.6 : 0;
    m.position
      .set(0, ((size.height * 0.11) / zoom) * (1 - centred), 0)
      .addScaledVector(screenRight, (cssShift * centred) / zoom);
  });

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, flights.length]}
        count={flights.length - 1}
        frustumCulled={false}
        onPointerMove={(e) => {
          if (!live.current || e.instanceId === undefined) return;
          e.stopPropagation();
          const n = flights[e.instanceId]?.node ?? -1;
          hovered.current = n >= 0 ? n : (flights[e.instanceId]?.links[0] ?? null);
          touched.current = true;
          gl.domElement.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hovered.current = null;
          gl.domElement.style.cursor = "";
        }}
      >
        {/* Child of the instanced mesh, so it inherits the group's
            turn, tilt and scale; its local matrix is the last
            instance's, written each frame. */}
        <mesh
          ref={liar}
          geometry={geometry}
          material={liarMaterial}
          matrixAutoUpdate={false}
          frustumCulled={false}
          onPointerMove={(e) => {
            if (!live.current) return;
            e.stopPropagation();
            hovered.current = 1;
            touched.current = true;
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hovered.current = null;
            gl.domElement.style.cursor = "";
          }}
        />
        <instancedMesh
          ref={packets}
          args={[geometry, packetMaterial, packetCount]}
          frustumCulled={false}
          raycast={() => null}
        />
      </instancedMesh>
    </>
  );
}

export default function Tribar3D({
  className,
  progress,
}: {
  className?: string;
  progress?: MotionValue<number>;
}) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ pointerEvents: "auto" }}>
      <Canvas
        className="!h-full !w-full"
        orthographic
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Rig />
        {/* No lights — the material is unlit and its face values are
            painted into the geometry. See the header note. */}
        <Voxels progress={progress} />
      </Canvas>
    </div>
  );
}
