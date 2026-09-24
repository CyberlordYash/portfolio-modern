"use client";

import React from "react";
import { Mask, Rise } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   METHOD

   Four phases as four numbered blocks on one hairline grid.

   The previous version rendered each phase as a card running a WebGL
   canvas-reveal shader on hover, behind an encrypted-text scramble
   animation, with a per-phase accent colour and a pulsing LED. Four
   shader canvases to communicate four sentences.

   The phases are sequential, so the strongest thing to show is the
   sequence: large numerals, one per column, reading left to right.
══════════════════════════════════════════════════════════════════ */

const Approach = () => (
  <ol className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
    {PHASES.map((p, i) => (
      <li key={p.title} className="border-t border-rule pt-6">
        <Rise delay={i * 0.06}>
          <span className="micro num">Phase {p.n}</span>
        </Rise>

        {/* The numeral is the graphic. Set large and light so a row of
            four reads as a sequence rather than four headings. */}
        <p
          className="display mt-4 leading-none text-ink3"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
          aria-hidden
        >
          {p.n}
        </p>

        <h3 className="h3 mt-5">
          <Mask delay={i * 0.06}>{p.title}</Mask>
        </h3>

        <Rise delay={0.1 + i * 0.06}>
          <p className="copy mt-3 text-sm">{p.description}</p>
        </Rise>
      </li>
    ))}
  </ol>
);

const PHASES = [
  {
    n: "01",
    title: "Architecture",
    description:
      "Scalable system design, database selection, and low-latency architectural planning before a line of it gets written.",
  },
  {
    n: "02",
    title: "Development",
    description:
      "High-performance gRPC and REST APIs, cloud infrastructure, and distributed service integration.",
  },
  {
    n: "03",
    title: "Optimisation",
    description:
      "Latency reduction, memory profiling, and stress testing for reliability at peak traffic.",
  },
  {
    n: "04",
    title: "Deployment",
    description:
      "CI/CD automation, Kubernetes orchestration, and monitoring that catches problems before users do.",
  },
];

export default Approach;
