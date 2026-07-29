"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import CameraRig from "./CameraRig";
import Aurora from "./Aurora";
import Network from "./Network";
import CoreStation from "./CoreStation";
import SectionMarkers from "./SectionMarkers";
import { attachWorldTrackers } from "./worldState";

/* The living market world — a fixed WebGL layer behind all sections. */

function useWorldEnabled() {
  const [state, setState] = useState<{ on: boolean; quality: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState({ on: false, quality: 0 });
      return;
    }
    const small = window.matchMedia("(max-width: 768px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    setState({ on: true, quality: small || weak ? 0 : 1 });
  }, []);

  return state;
}

function WorldSideEffects() {
  useEffect(() => attachWorldTrackers(), []);
  return null;
}

export default function MarketWorld() {
  const env = useWorldEnabled();
  if (!env || !env.on) return null;

  const q = env.quality;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <WorldSideEffects />
      <Canvas
        dpr={q > 0 ? [1, 1.5] : [1, 1.2]}
        camera={{ fov: 58, near: 0.5, far: 900, position: [0, 88, 165] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ pointerEvents: "none" }}
      >
        {/* near-black with a whisper of teal — gives the fog depth a subtle
            atmosphere instead of dead #000 while staying invisible under UI,
            and sits in the aurora's own hue family rather than fighting it */}
        <color attach="background" args={["#01070A"]} />
        <fogExp2 attach="fog" args={["#01070A", 0.0040]} />
        <Suspense fallback={null}>
          <CameraRig />
          <Aurora quality={q} />
          <Network />
          <CoreStation />
          <SectionMarkers />
          {q > 0 && (
            <EffectComposer multisampling={0}>
              {/* Threshold dropped from 0.56 so the aurora's brightest ribbon
                  cores glow — they peak near 0.3 and would otherwise never
                  reach the bloom pass. Intensity and radius stay low: haze
                  comes from blooming large bright areas, and a thin sparse
                  ribbon is exactly what tolerates a glow without fogging the
                  frame or eating into the UI's contrast. */}
              <Bloom
                mipmapBlur
                intensity={0.36}
                luminanceThreshold={0.26}
                luminanceSmoothing={0.3}
                radius={0.6}
              />
              <Vignette eskil={false} offset={0.16} darkness={0.94} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
