"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import CameraRig from "./CameraRig";
import Terrain from "./Terrain";
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
        <color attach="background" args={["#000000"]} />
        <fogExp2 attach="fog" args={["#000000", 0.0040]} />
        <Suspense fallback={null}>
          <CameraRig />
          <Terrain quality={q} />
          <Network />
          <CoreStation />
          <SectionMarkers />
          {q > 0 && (
            <EffectComposer multisampling={0}>
              <Bloom
                mipmapBlur
                intensity={0.3}
                luminanceThreshold={0.62}
                luminanceSmoothing={0.3}
                radius={0.55}
              />
              <Vignette eskil={false} offset={0.16} darkness={0.94} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
