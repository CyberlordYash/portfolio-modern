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
     0.00 → 0.18  assembled, turning about the view axis — the figure
                  stays impossible while its silhouette moves.
     0.18 → 0.60  settles to a clean isometric view while every block
                  flies a staggered arc into a microchip — die, raised
                  core, pins on all four sides. The liar cube lands as
                  the core.
     0.60 → 1.00  the chip holds with a signal pulse running from the
                  core out along the pins, then scales up and dissolves
                  into the dark ground the page has converted to.

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
const TILT_MAX = 0.25; // slight tilt off the iso axis once the chip forms
const YAW = Math.PI * 0.5; // quarter turn about world up while morphing (chip is 4-fold symmetric)

const MORPH = [0.18, 0.6]; // scroll window for triangle → chip
const STAGGER = 0.45; // share of the window spent staggering block starts

/* Microchip, in lattice units (drawn at CHIP_SCALE so it reads at the
   tribar's size):
     body   DIE×DIE package, one cube tall
     lid    (DIE-2)² heat spreader, a thin plate stepped in one cell
     core   one flat slab of silicon on the lid — the liar cube, so it
            carries the blue flow texture
     mark   pin-1 dot on the lid corner
     traces hairlines on the body's exposed rim, one per pin
     pins   solid flat legs on every lattice column but the corners */
const DIE = 7;
const PIN_LEN = 2;
const CHIP_SCALE = 0.68;
const LID_H = 0.32;
const CORE_W = 2.6;
const CORE_H = 0.22;
const PIN_W = 0.42;
const PIN_H = 0.16;

const ACCENT_ON_LIGHT = "#1A32FF";
const ACCENT_ON_DARK = "#687CFF";
const PULSE_PERIOD = 1.8; // seconds per core → pin-tip sweep

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

/* Contact shadow. Not a real light — a flat offset copy of the
   geometry, which is all an orthographic scene with no lighting can
   honestly do. */
const SHADOW_ON_LIGHT = "#C9C9CE";
const SHADOW_ON_DARK = "#202124";

/* The page grounds, so the shadow can be rendered fully opaque and
   still fade: instead of dropping alpha, its colour is lerped toward
   the ground it sits on. See the material note for why opacity is off
   the table. */
const GROUND_LIGHT = "#F2F2F3";
const GROUND_DARK = "#0C0C0D";


/* The shadow is a Y — the initial — laid flat on the ground.

   ── Why a Y falls out of this geometry for free ──
   With the camera on the (1,1,1) axis, the ground plane's own axes
   project to screen as:

       −X  →  up-left        −Z  →  up-right
       +X  →  down-right     +Z  →  down-left

   so +X+Z together point straight down. Two arms along −X and −Z
   plus a stem along the +X+Z diagonal is therefore a Y on screen,
   built from three of the object's own lattice directions. It is the
   same cube vocabulary as the tribar, not a foreign shape dropped
   underneath it.

   ── How it moves ──
   It turns on world Y with the same scroll-driven angle as the tribar
   above, so it sweeps the floor as the object spins — which is what
   makes it read as that object's shadow rather than a separate mark
   parked underneath.

   Only world Y, never the object's full rotation: a shadow stays flat
   on the ground. The letterform is therefore cleanest near the
   resting angle and reads as three swept arms further round, which is
   the right trade for the motion. */
const SHADOW_SCALE = 0.52;

const Y_ARM = 5; // cubes per upper arm
const Y_STEM = 10; // steps down the diagonal stem
/* The stem runs at 45° to the lattice, so a full-unit step would leave
   the axis-aligned cubes touching only at their corners. Half-steps
   overlap them into a solid bar. */
const Y_STEM_STEP = 0.5;

/* Screen displacement. Screen-left is (-1,0,1)/√2 for a camera on the
   (1,1,1) axis and world −Y projects to screen-down, so this throws
   the shadow down and to the left — a key light from the upper right.

   Magnitude matters more than direction here. At 3.4 the shadow
   cleared the object entirely and read as a second figure standing
   beside it; a cast shadow should stay in contact with the thing
   casting it and be mostly hidden behind it. 1.9 on a ~6-unit object
   leaves roughly a third of it showing at the lower left, which is
   what the reference does. */
/* Mostly downward, so the shadow pools beneath the object rather than
   standing beside it. The Y component lands it near the base of the
   figure — with the squash above, the shadow has almost no height of
   its own, so its centre needs to sit where the object's floor is. */
/* Where the ground sits relative to the object's centre, plus a lean
   down-left for a key light from the upper right. The Y component
   places the plane at the base of the figure — the lattice is six
   units tall and centred, so roughly three below. */
const SHADOW_OFFSET = new THREE.Vector3(-1.1, -3.3, 1.1);

/* Pure depth displacement, away from the camera along the view axis.
   Under orthographic projection this moves nothing on screen — it
   exists only so the shadow sits definitively behind the object in
   the depth buffer, which is what lets it write depth (see below). */
const SHADOW_DEPTH_PUSH = new THREE.Vector3(-1, -1, -1)
  .normalize()
  .multiplyScalar(7);

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

/** Cube centres forming a Y in the ground plane. See the note on
    SHADOW_SCALE for why these three directions read as a letter. */
function buildYCells() {
  const cells: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
  for (let i = 1; i <= Y_ARM; i++) {
    cells.push(new THREE.Vector3(-i, 0, 0)); // up-left on screen
    cells.push(new THREE.Vector3(0, 0, -i)); // up-right on screen
  }
  for (let i = 1; i <= Y_STEM; i++) {
    const d = i * Y_STEM_STEP;
    cells.push(new THREE.Vector3(d, 0, d)); // straight down on screen
  }
  return cells;
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

type ChipKind = "core" | "body" | "lid" | "mark" | "trace" | "pin";
type ChipCell = {
  pos: THREE.Vector3;
  size: THREE.Vector3;
  kind: ChipKind;
  ring: number; // lattice distance from the centre, drives the pulse
};

/* Base shade per part, multiplied into the ink tint, so the package
   reads as distinct materials rather than one grey mass. */
const SHADE: Record<ChipKind, number> = {
  core: 1,
  body: 0.72,
  lid: 1,
  mark: 1,
  trace: 0.5,
  pin: 0.9,
};
const PULSE_WEIGHT: Record<ChipKind, number> = {
  core: 0,
  body: 0.12,
  lid: 0.18,
  mark: 0,
  trace: 1,
  pin: 1,
};

/** The microchip's cells, centred on the origin. Index 0 is the core slab,
    which the liar flies to. */
function buildChipCells(): ChipCell[] {
  const out: ChipCell[] = [];
  const h = (DIE - 1) / 2;
  const one = new THREE.Vector3(1, 1, 1);
  const ring = (x: number, z: number) => Math.max(Math.abs(x), Math.abs(z));
  const top = 0.5; // body top face
  const lidTop = top + LID_H;
  const add = (x: number, y: number, z: number, size: THREE.Vector3, kind: ChipKind) =>
    out.push({ pos: new THREE.Vector3(x, y, z), size, kind, ring: ring(x, z) });

  add(0, lidTop + CORE_H / 2, 0, new THREE.Vector3(CORE_W, CORE_H, CORE_W), "core");

  for (let x = -h; x <= h; x++) for (let z = -h; z <= h; z++) add(x, 0, z, one, "body");

  const lidCell = new THREE.Vector3(1, LID_H, 1);
  for (let x = -h + 1; x <= h - 1; x++)
    for (let z = -h + 1; z <= h - 1; z++) add(x, top + LID_H / 2, z, lidCell, "lid");

  const m = h - 1.35;
  add(-m, lidTop + 0.03, -m, new THREE.Vector3(0.34, 0.06, 0.34), "mark");

  // Pins on every column but the corners; a trace on the rim feeds each.
  const alongX = new THREE.Vector3(1, PIN_H, PIN_W);
  const alongZ = new THREE.Vector3(PIN_W, PIN_H, 1);
  const traceX = new THREE.Vector3(1, 0.04, 0.16);
  const traceZ = new THREE.Vector3(0.16, 0.04, 1);
  for (let o = -h + 1; o <= h - 1; o++) {
    add(h, top + 0.02, o, traceX, "trace");
    add(-h, top + 0.02, o, traceX, "trace");
    add(o, top + 0.02, h, traceZ, "trace");
    add(o, top + 0.02, -h, traceZ, "trace");
    for (let k = 1; k <= PIN_LEN; k++) {
      const d = h + k;
      const y = -0.18;
      add(d, y, o, alongX, "pin");
      add(-d, y, o, alongX, "pin");
      add(o, y, d, alongZ, "pin");
      add(o, y, -d, alongZ, "pin");
    }
  }

  out.forEach((v) => {
    v.pos.y -= 0.25;
    v.pos.multiplyScalar(CHIP_SCALE);
  });
  return out;
}

type Flight = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  size: THREE.Vector3; // landed scale
  kind: ChipKind;
  ring: number;
  arc: THREE.Vector3; // outward bulge of the flight path
  delay: number; // 0..1 share of STAGGER
  spin: THREE.Vector3; // wobble axis
};

/* Pairs every chip cell with a tribar cell. The liar is pinned to the core
   centre; every other tribar cube claims its nearest unique target
   (greedy over all pairs, shortest first) so paths don't cross, and the
   remaining chip cells split off the nearest tribar cube. The liar's
   flight is moved last so it stays the separately textured mesh. */
function buildFlights(src: THREE.Vector3[], liarIdx: number): Flight[] {
  const D = buildChipCells();
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

  const maxRing = (DIE - 1) / 2 + PIN_LEN;
  const flights: Flight[] = D.map((cell, j) => {
    const from = S[owner[j]];
    const to = cell.pos;
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const arc =
      mid.lengthSq() > 1e-4 ? mid.normalize().multiplyScalar(1.6) : new THREE.Vector3(0, 1.6, 0);
    // Assembles inside-out — core, then package, then pins — with a little
    // hash so a ring doesn't move as one slab.
    const h = Math.abs(Math.sin(j * 12.9898) * 43758.5453) % 1;
    const delay = Math.min(1, (cell.ring / maxRing) * 0.75 + h * 0.25);
    const spin = new THREE.Vector3(h - 0.5, 1, 0.5 - h).normalize();
    return { from, to, size: cell.size, kind: cell.kind, ring: cell.ring, arc, delay, spin };
  });
  const [liar] = flights.splice(0, 1);
  flights.push(liar);
  return flights;
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

function Voxels({ progress }: { progress?: MotionValue<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const shadow = useRef<THREE.InstancedMesh>(null);
  const reduced = usePrefersReducedMotion();
  const angle = useRef(BASE_ANGLE);
  const { camera, size } = useThree();

  const cells = useMemo(buildCells, []);
  const flights = useMemo(
    () => buildFlights(cells.map((c) => c.pos), cells.length - 1),
    [cells],
  );
  const yCells = useMemo(buildYCells, []);
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

  /* The shadow shares the cube geometry but ignores its vertex colours
     — it is one flat silhouette, not a shaded solid.

     Fully opaque, which is the fix for the voxel seams showing
     through it. Any translucent value lets sixteen overlapping cubes
     blend against each other, so alpha compounds wherever they cross
     and the internal cube boundaries print through the silhouette —
     the clearest tell that it was a copy of the object rather than a
     shadow of it. Adding depthWrite helped but could not fix the
     coplanar faces where cubes meet exactly.

     Opaque removes the problem at the source: no blending, so no
     compounding, and the silhouette fills flat. It still fades — by
     lerping its colour toward the page ground rather than by dropping
     alpha, which is indistinguishable on screen and has no failure
     mode.

     Safe to write depth only because SHADOW_DEPTH_PUSH puts the whole
     thing behind the object, where it can never win a depth test. */
  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: false,
        transparent: false,
        depthWrite: true,
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

  const inkLight = useMemo(() => new THREE.Color(INK_ON_LIGHT), []);
  const inkDark = useMemo(() => new THREE.Color(INK_ON_DARK), []);
  const shadowLight = useMemo(() => new THREE.Color(SHADOW_ON_LIGHT), []);
  const shadowDark = useMemo(() => new THREE.Color(SHADOW_ON_DARK), []);
  const groundLight = useMemo(() => new THREE.Color(GROUND_LIGHT), []);
  const groundDark = useMemo(() => new THREE.Color(GROUND_DARK), []);
  const groundMix = useMemo(() => new THREE.Color(), []);

  const tint = useMemo(() => new THREE.Color(), []);
  const accentLight = useMemo(() => new THREE.Color(ACCENT_ON_LIGHT), []);
  const accentDark = useMemo(() => new THREE.Color(ACCENT_ON_DARK), []);
  const accent = useMemo(() => new THREE.Color(), []);
  const scaleTmp = useMemo(() => new THREE.Vector3(), []);
  const lastTone = useRef(-1);

  /* The Y's cubes never move relative to one another, so their
     matrices are written once on mount rather than every frame — only
     the mesh-level position and scale change after this. */
  useEffect(() => {
    const sh = shadow.current;
    if (!sh) return;
    const centre = new THREE.Vector3();
    yCells.forEach((c) => centre.add(c));
    centre.divideScalar(yCells.length);

    const tmp = new THREE.Object3D();
    yCells.forEach((c, i) => {
      tmp.position.copy(c).sub(centre);
      tmp.updateMatrix();
      sh.setMatrixAt(i, tmp.matrix);
    });
    sh.instanceMatrix.needsUpdate = true;
  }, [yCells]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      shadowMaterial.dispose();
      liarMaterial.map?.dispose();
      liarMaterial.dispose();
    },
    [geometry, material, shadowMaterial, liarMaterial],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;

    const p = progress ? progress.get() : 0;

    /* ── Tone ──────────────────────────────────────────────────
       Repainting instance tints is cheap but pointless when nothing has
       moved, so it is gated on tone, part-shading and pulse. Per-part
       shades blend in with the morph so the tribar stays one flat ink. */
    const tone = track(p, [0.28, 0.72], [0, 1]);
    const partMix = track(p, MORPH, [0, 1]);
    /* Signal pulse: once the chip has landed, a band of accent runs from
       the core out along the traces and pins, on a loop. */
    const formed = reduced ? 0 : track(p, [MORPH[1] - 0.04, MORPH[1] + 0.02, 0.8], [0, 1, 0]);
    const paintKey = tone + partMix * 10;
    if (formed > 0.001 || Math.abs(paintKey - lastTone.current) > 0.002) {
      lastTone.current = formed > 0.001 ? -1 : paintKey;
      const maxRing = (DIE - 1) / 2 + PIN_LEN;
      const wave = ((state.clock.elapsedTime % PULSE_PERIOD) / PULSE_PERIOD) * (maxRing + 2) - 1;
      accent.copy(accentLight).lerp(accentDark, tone);
      // The last instance is the liar — the separate flow-textured mesh.
      for (let i = 0; i < flights.length - 1; i++) {
        const f = flights[i];
        tint.copy(inkLight).lerp(inkDark, tone);
        if (f.kind === "mark") {
          tint.lerp(accent, partMix);
        } else {
          tint.multiplyScalar(1 + (SHADE[f.kind] - 1) * partMix);
          if (formed > 0.001) {
            const band = Math.max(0, 1 - Math.abs(f.ring - wave) / 1.1);
            tint.lerp(accent, band * PULSE_WEIGHT[f.kind] * formed);
          }
        }
        m.setColorAt(i, tint);
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }

    material.opacity = track(p, [0, 0.68, 0.92], [1, 1, 0]);
    liarMaterial.opacity = material.opacity;
    m.visible = material.opacity > 0.001;

    /* ── Morph: triangle → microchip ─────────────────────────
       Each block eases along an outward arc on its own staggered clock,
       dips in scale and wobbles mid-flight, then lands axis-aligned (so
       the painted face values read correctly) at its chip-cell size. */
    const morph = track(p, MORPH, [0, 1]);
    for (let i = 0; i < flights.length; i++) {
      const f = flights[i];
      const local = Math.min(1, Math.max(0, (morph - f.delay * STAGGER) / (1 - STAGGER)));
      const t = easeInOut(local);
      const bump = Math.sin(Math.PI * t);
      dummy.position.copy(f.from).lerp(f.to, t).addScaledVector(f.arc, bump);
      dummy.quaternion.setFromAxisAngle(f.spin, bump * 0.9);
      scaleTmp.set(1, 1, 1).lerp(f.size, t).multiplyScalar(1 + (CHIP_SCALE - 1) * t);
      dummy.scale.copy(scaleTmp).multiplyScalar(1 - 0.28 * bump);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (i === flights.length - 1) liar.current?.matrix.copy(dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

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

    m.scale.setScalar(track(p, [0, 0.62, 1], [1, 2.1, 6.5]));

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
    m.position.y = (size.height * 0.11) / zoom;

    /* ── Shadow ────────────────────────────────────────────────
       A flat offset copy: same per-instance matrices, same rotation
       and scale, displaced down-left in world space. With no lights
       in the scene this is the only honest way to cast one, and it is
       what keeps the object from floating against the ground.

       The offset scales with the object so the apparent light
       direction stays fixed as the mark grows through the scroll —
       a constant offset would have the shadow slide under the object
       and vanish. It fades out ahead of the object, since a shadow
       outliving the thing casting it reads as a bug. */
    const sh = shadow.current;
    if (sh) {
      const s = m.scale.x;

      /* Turns with the object, on the same scroll-driven angle, so it
         sweeps the ground as the tribar spins above it — the thing
         that sells it as a cast shadow rather than a mark that
         happens to sit underneath.

         World Y only, not the object's full quaternion: a shadow
         stays flat on the floor. Copying the tilt as well would stand
         it up into a second solid, which is what an earlier version
         did wrong.

         The trade is that the Y is only a clean letterform near its
         resting angle and reads as three swept arms elsewhere — worth
         it for the motion. */
      sh.position.set(
        m.position.x + SHADOW_OFFSET.x * s + SHADOW_DEPTH_PUSH.x,
        m.position.y + SHADOW_OFFSET.y * s + SHADOW_DEPTH_PUSH.y,
        m.position.z + SHADOW_OFFSET.z * s + SHADOW_DEPTH_PUSH.z,
      );
      /* Relative to the resting angle, not absolute. The object starts
         at BASE_ANGLE so that the tribar presents well; feeding that
         same angle to the shadow rotated the Y about 16° off upright
         before a single pixel had been scrolled, which tipped the stem
         off vertical. Subtracting it zeroes the shadow at rest — a
         true Y on load — while it still tracks every degree the
         object turns afterwards. */
      sh.rotation.set(0, angle.current - BASE_ANGLE, 0);
      sh.scale.setScalar(s * SHADOW_SCALE);

      /* Faded by colour, not alpha — the material is opaque. Lerping
         the shadow tone toward the page ground dissolves it with no
         blending, so no seams can appear. */
      const strength = track(p, [0, MORPH[0], MORPH[0] + 0.2], [1, 1, 0]);
      groundMix.copy(groundLight).lerp(groundDark, tone);
      shadowMaterial.color
        .copy(shadowLight)
        .lerp(shadowDark, tone)
        .lerp(groundMix, 1 - strength);
      sh.visible = strength > 0.01;
    }
  });

  return (
    <>
      {/* Drawn first and explicitly ordered behind. A single flat mesh
          now, not an instanced copy of the object. */}
      <instancedMesh
        ref={shadow}
        args={[geometry, shadowMaterial, yCells.length]}
        frustumCulled={false}
        renderOrder={-1}
      />
      <instancedMesh
        ref={mesh}
        args={[geometry, material, flights.length]}
        count={flights.length - 1}
        frustumCulled={false}
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
    <Canvas
      className={className}
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
  );
}
