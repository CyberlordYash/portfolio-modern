"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easeInOut, shadedCube, usePrefersReducedMotion } from "./voxel";

/* ══════════════════════════════════════════════════════════════════
   SPARK, TRAVELLING — the AI panel's starburst, carried by scroll

   The spark is one 3D object on a fixed, full-viewport, click-through
   canvas. Where it sits is decided by the page, not by the scene:
   any element marked `data-spark-anchor` is a stop, in DOM order.

     slot   — the spark's home in the AI panel. It sits centred there,
              full size, and rides with the page like normal content.
     (else) — a skill. The spark shrinks and parks at the element's
              right edge (or its `[data-spark-point]` child's), lead
              ray pointing back at the text.

   ── Travel ──
   A reading line sits at 45% of the viewport. Between two stops whose
   centres straddle that line, the spark eases from one to the next, so
   it holds on a skill, then glides to the next as you scroll — the
   same "scroll is the timeline" idea as the hero mark. Before the
   first stop reaches the line it stays home; past the last it stays
   on the last and scrolls away with it.

   ── Highlight ──
   The stop the spark is nearer gets `data-spark-active`; CSS in
   globals.css does the highlighting. Set straight on the DOM from the
   render loop, so travelling never re-renders React.
══════════════════════════════════════════════════════════════════ */

const RAYS = 12;
const LONG = 2.2;
const SHORT = 1.6;
const THICK = 0.38;
const CORE = 0.12;
const EXTENT = 8.2; // spark span in its own units, at rest

const LINE = 0.45; // reading line, share of viewport height
const SKILL_SIZE_WIDE = 104; // px, while parked on a skill
const SKILL_SIZE_NARROW = 68;

const INK = "#141413";
const LIT_HOME = "#FAF9F5"; // cream on the clay panel
const LIT_AWAY = "#1A32FF"; // the site accent on the light ground

const FACE_FRONT = 1;
const FACE_SIDE_X = 2.2;
const FACE_SIDE_Y = 3.0;

type Stop = { x: number; y: number; size: number; el: HTMLElement; home: boolean };

function readStops(w: number): Stop[] {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-spark-anchor]"));
  return els.map((el) => {
    const home = el.dataset.sparkAnchor === "slot";
    const r = el.getBoundingClientRect();
    if (home) {
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, size: Math.min(r.width, r.height), el, home };
    }
    const size = w >= 768 ? SKILL_SIZE_WIDE : SKILL_SIZE_NARROW;
    const pt = el.querySelector<HTMLElement>("[data-spark-point]")?.getBoundingClientRect() ?? r;
    return { x: pt.right - size * 0.55, y: pt.top + pt.height / 2, size, el, home };
  });
}

function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    // Straight on, one unit per pixel: scene coordinates are screen pixels.
    cam.position.set(0, 0, 500);
    cam.lookAt(0, 0, 0);
    cam.zoom = 1;
    cam.near = 0.1;
    cam.far = 2000;
    cam.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Burst() {
  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const reduced = usePrefersReducedMotion();
  const { size } = useThree();

  const lit = useRef(Array.from({ length: RAYS }, () => 0));
  const spin = useRef(0);
  const activeEl = useRef<HTMLElement | null>(null);

  const geometry = useMemo(() => shadedCube(FACE_SIDE_X, FACE_SIDE_Y, FACE_FRONT), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true }), []);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      activeEl.current?.removeAttribute("data-spark-active");
    },
    [geometry, material],
  );

  const tmp = useMemo(
    () => ({
      o: new THREE.Object3D(),
      ink: new THREE.Color(INK),
      home: new THREE.Color(LIT_HOME),
      away: new THREE.Color(LIT_AWAY),
      litC: new THREE.Color(),
      c: new THREE.Color(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    const g = outer.current;
    const sp = spinner.current;
    if (!m || !g || !sp) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const { o, ink, home, away, litC, c } = tmp;

    /* ── Where: interpolate between the stops around the line ── */
    const stops = readStops(size.width);
    if (!stops.length) {
      g.visible = false;
      return;
    }
    g.visible = true;
    const line = size.height * LINE;
    let x: number, y: number, px: number, travel: number, activeIdx: number, skillEl: HTMLElement | null;
    const last = stops.length - 1;
    if (line <= stops[0].y) {
      ({ x, y, size: px } = stops[0]);
      travel = 0;
      activeIdx = 0;
    } else if (line >= stops[last].y) {
      ({ x, y, size: px } = stops[last]);
      travel = 1;
      activeIdx = last;
    } else {
      let i = 0;
      while (i < last - 1 && stops[i + 1].y <= line) i++;
      const a = stops[i];
      const b = stops[i + 1];
      const raw = (line - a.y) / Math.max(1, b.y - a.y);
      // Hold on each stop, then glide: the middle of the gap does the moving.
      const e = easeInOut(Math.min(1, Math.max(0, (raw - 0.2) / 0.6)));
      x = a.x + (b.x - a.x) * e;
      y = a.y + (b.y - a.y) * e;
      px = a.size + (b.size - a.size) * e;
      travel = i === 0 ? e : 1;
      activeIdx = raw < 0.5 ? i : i + 1;
    }
    skillEl = stops[activeIdx].home ? null : stops[activeIdx].el;

    if (activeEl.current !== skillEl) {
      activeEl.current?.removeAttribute("data-spark-active");
      skillEl?.setAttribute("data-spark-active", "");
      activeEl.current = skillEl;
    }

    g.position.set(x - size.width / 2, size.height / 2 - y, 0);
    g.scale.setScalar(px / EXTENT);
    // Fixed three-quarter tilt, so the extrusion reads on two sides.
    g.rotation.set(0.35, -0.4, 0);

    /* ── Which ray is lit ──
       At home the panel says which skill is active (its chip index,
       mirrored onto the slot as data-spark-skill) and that skill's long
       ray lights. Away, ray 0 leads and points back at the text. */
    const homeSkill = Number(stops[0].home ? stops[0].el.dataset.sparkSkill ?? -1 : -1);
    const leadRay = travel > 0.5 ? 0 : homeSkill >= 0 ? homeSkill * 2 : -1;
    litC.copy(home).lerp(away, travel);

    const k = Math.min(1, delta * 7);
    for (let i = 0; i < RAYS; i++) {
      lit.current[i] += ((i === leadRay ? 1 : 0) - lit.current[i]) * k;
      const l = lit.current[i];
      const breathe = reduced
        ? 1
        : 1 - 0.55 * (0.5 - 0.5 * Math.cos(((t - i * 0.15) / 1.8) * Math.PI * 2));
      const base = i % 2 === 0 ? LONG : SHORT;
      const len = Math.max(1e-3, base * (breathe + (1 - breathe) * l) * (1 + 0.6 * l));
      const ang = (i * Math.PI * 2) / RAYS;
      const reach = CORE + len / 2 + 0.25 * l;
      o.position.set(Math.sin(ang) * reach, Math.cos(ang) * reach, 0.18 * l);
      o.rotation.set(0, 0, -ang);
      o.scale.set(THICK * (1 + 0.15 * l), len, THICK);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      c.copy(ink).lerp(litC, l);
      m.setColorAt(i, c);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    /* ── Spin ──
       At home it drifts and turns with scroll. Away it swings round so
       ray 0 (straight up at rest) points left, at the skill, with a
       slight sway so it never looks frozen. */
    const drift = -window.scrollY * 0.004 - t * 0.12;
    const aim = Math.PI / 2 + Math.sin(t * 1.4) * 0.12;
    const target = drift + (aim - drift) * travel;
    spin.current = reduced ? target : spin.current + (target - spin.current) * Math.min(1, delta * 6);
    sp.rotation.z = spin.current;
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>
        <instancedMesh ref={mesh} args={[geometry, material, RAYS]} frustumCulled={false} />
      </group>
    </group>
  );
}

/** The fixed overlay. Mounted by Skills only while its region is near
    the viewport, and loaded lazily so three.js stays out of the main
    bundle. */
export default function SparkTravel() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
      <Canvas
        className="!h-full !w-full"
        orthographic
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Rig />
        <Burst />
      </Canvas>
    </div>
  );
}
