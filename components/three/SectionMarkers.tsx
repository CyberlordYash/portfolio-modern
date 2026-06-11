"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/* Environmental storytelling — giant holographic captions floating in the
   world. They emerge from the fog as the camera approaches (SpriteMaterial
   participates in scene fog). */

const MARKERS: { text: string; sub: string; pos: [number, number, number]; scale: number }[] = [
  { text: "DISTRIBUTED SYSTEMS", sub: "01 //// NETWORK LAYER",      pos: [-58, 58, -140], scale: 64 },
  { text: "DATA STRUCTURES",     sub: "02 //// PROJECT ARCHIVES",   pos: [52, 86, -250],  scale: 70 },
  { text: "PERFORMANCE",         sub: "03 //// LOW-LATENCY PATH",   pos: [-48, 62, -345], scale: 60 },
  { text: "ORDER FLOW",          sub: "04 //// EXECUTION CORE",     pos: [40, 48, -440],  scale: 54 },
];

function makeMarkerTexture(text: string, sub: string) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.textAlign = "center";

  ctx.fillStyle = "rgba(130, 200, 255, 0.16)";
  ctx.font = "900 110px 'Orbitron', 'Courier New', monospace";
  ctx.fillText(text, 512, 140);
  /* bright core pass for a holographic double-exposure feel */
  ctx.fillStyle = "rgba(170, 225, 255, 0.42)";
  ctx.font = "900 108px 'Orbitron', 'Courier New', monospace";
  ctx.fillText(text, 512, 138);

  ctx.fillStyle = "rgba(110, 170, 220, 0.5)";
  ctx.font = "400 30px 'Courier New', monospace";
  ctx.fillText(sub.split("").join(" "), 512, 200);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

export default function SectionMarkers() {
  const textures = useMemo(() => MARKERS.map((m) => makeMarkerTexture(m.text, m.sub)), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <group>
      {MARKERS.map((m, i) => (
        <sprite key={m.text} position={m.pos} scale={[m.scale, m.scale / 4, 1]}>
          <spriteMaterial map={textures[i]} transparent depthWrite={false} fog />
        </sprite>
      ))}
    </group>
  );
}
