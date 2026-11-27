import { useEffect, useState } from "react";
import * as THREE from "three";

/* Shared voxel vocabulary for the orthographic, unlit 3D marks
   (Tribar3D, AgentSwarm3D). */

/** Piecewise-linear sample of `stops` → `values`, clamped at both ends. */
export function track(p: number, stops: number[], values: number[]) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + (values[i] - values[i - 1]) * t;
    }
  }
  return values[values.length - 1];
}

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function usePrefersReducedMotion() {
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
   value; under a camera on the (1,1,1) axis they are never drawn. */
export function shadedCube(px: number, py: number, pz: number) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const perFace = [px, px, py, py, pz, pz];
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
