"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════
   STREAKS

   Thin horizontal lines that rip across the hero left to right at
   random heights and random intervals. Each is a gradient rather than
   a solid rule — transparent at the tail, full strength at the
   leading edge — so it reads as something travelling at speed instead
   of a bar sliding past.

   ── Why a pool, not a spawner ──
   A naive version appends a new element per streak and removes it on
   completion, which churns the DOM continuously and eventually
   collides with React's reconciliation under fast scrolling. This
   keeps a fixed pool of N elements alive for the page's lifetime;
   each one re-rolls its own parameters when its run finishes and
   starts again after a random pause. The DOM never changes shape —
   only transforms do, which is the cheapest thing to animate.

   ── The randomness ──
   The long, variable `delay` is what makes them arrive in bursts and
   lulls rather than on a metronome. Without it a fixed pool reads as
   N lines looping, which is exactly the thing to avoid.

   Client-only: the parameters come from Math.random(), so rendering
   this on the server guarantees a hydration mismatch.
══════════════════════════════════════════════════════════════════ */

const POOL = 7;

type Cfg = {
  run: number; // bumping this restarts the animation
  top: number; // vertical position, %
  len: number; // length, vw
  dur: number; // seconds to cross
  delay: number; // pause before this run
  opacity: number;
  thick: number; // px
  accent: boolean;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function roll(run: number): Cfg {
  return {
    run,
    top: rand(4, 94),
    len: rand(7, 34),
    // Fast — the whole point. Anything above ~1.5s reads as drifting.
    dur: rand(0.42, 1.15),
    // The wide spread is what produces bursts and gaps.
    delay: rand(0, 7),
    opacity: rand(0.1, 0.42),
    thick: Math.random() < 0.12 ? 2 : 1,
    // Occasional accent line, so the colour appears as punctuation
    // rather than decoration.
    accent: Math.random() < 0.14,
  };
}

function Streak({ seed }: { seed: number }) {
  const [cfg, setCfg] = useState<Cfg>(() => roll(seed));

  return (
    <motion.span
      // Remounting on `run` is what lets the same element replay with
      // fresh parameters.
      key={cfg.run}
      aria-hidden
      className="absolute left-0 block"
      style={{
        top: `${cfg.top}%`,
        width: `${cfg.len}vw`,
        height: cfg.thick,
        opacity: cfg.opacity,
        background: `linear-gradient(90deg, transparent, ${
          cfg.accent ? "var(--mark)" : "var(--ink)"
        })`,
        willChange: "transform",
      }}
      initial={{ x: "-40vw" }}
      animate={{ x: "140vw" }}
      transition={{ duration: cfg.dur, delay: cfg.delay, ease: "linear" }}
      onAnimationComplete={() => setCfg((c) => roll(c.run + 1))}
    />
  );
}

export default function Streaks({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Client-only (Math.random would desync hydration), and silent for
    // anyone who has asked for less motion — these are pure decoration
    // and carry no information.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
  }, []);

  if (!on) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: POOL }, (_, i) => (
        <Streak key={i} seed={i} />
      ))}
    </div>
  );
}
