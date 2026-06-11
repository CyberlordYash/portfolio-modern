"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldState } from "./worldState";

/* Cinematic flight path through the market world. One keyframe per portfolio
   section — hero flies high above the ecosystem, footer arrives at the core. */

const POSITIONS: [number, number, number][] = [
  [0, 88, 165],     // hero        — flying above the trading ecosystem
  [0, 44, 72],      // skills      — descending into the infrastructure layer
  [-34, 21, -8],    // experience  — travelling between network pathways
  [26, 17, -100],   // architecture— inside the structures
  [0, 27, -182],    // projects    — giant data monoliths
  [-28, 24, -252],  // certificates
  [0, 35, -322],    // approach    — above the energy corridor
  [16, 20, -382],   // skills graph
  [0, 13, -448],    // footer      — approaching the core control center
];

const TARGETS: [number, number, number][] = [
  [0, 16, -60],
  [0, 13, -90],
  [18, 15, -130],
  [-12, 22, -210],
  [0, 30, -290],
  [12, 20, -350],
  [0, 15, -430],
  [0, 12, -470],
  [0, 11, -525],    // the core
];

export default function CameraRig() {
  const posCurve = useMemo(
    () => new THREE.CatmullRomCurve3(POSITIONS.map((p) => new THREE.Vector3(...p)), false, "centripetal"),
    [],
  );
  const lookCurve = useMemo(
    () => new THREE.CatmullRomCurve3(TARGETS.map((p) => new THREE.Vector3(...p)), false, "centripetal"),
    [],
  );

  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    /* heavy damping → slow, cinematic scrub (never abrupt) */
    const k = 1 - Math.exp(-2.2 * dt);
    worldState.scroll += (worldState.scrollTarget - worldState.scroll) * k;
    const p = THREE.MathUtils.clamp(worldState.scroll, 0, 1);

    /* damped pointer parallax */
    const km = 1 - Math.exp(-3 * dt);
    mouse.current.x += (worldState.pointerX - mouse.current.x) * km;
    mouse.current.y += (worldState.pointerY - mouse.current.y) * km;

    posCurve.getPoint(p, pos.current);
    lookCurve.getPoint(p, look.current);

    const t = state.clock.elapsedTime;
    /* idle drift — the world feels alive even when not scrolling */
    const bobY = Math.sin(t * 0.28) * 0.9;
    const bobX = Math.sin(t * 0.17) * 0.7;

    state.camera.position.set(
      pos.current.x + bobX + mouse.current.x * 3.2,
      pos.current.y + bobY + mouse.current.y * -1.6,
      pos.current.z,
    );
    look.current.x += mouse.current.x * 6;
    look.current.y += mouse.current.y * -3;
    state.camera.lookAt(look.current);
  });

  return null;
}
