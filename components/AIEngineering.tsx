"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE, Mask, Rise } from "@/components/ui/Reveal";

// Dark ink on clay: white on #D97757 is ~3:1, too low for the mono body copy.
const PANEL = "#D97757";
const INK = "#141413";
const INK_SOFT = "rgba(20,20,19,0.72)";
const ITALIC = "#FAF9F5";
const RULE = "rgba(20,20,19,0.22)";

const RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  len: i % 2 === 0 ? 44 : 32,
}));

function Spark({ live }: { live: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-16 w-16 shrink-0 md:h-20 md:w-20"
      aria-hidden
      animate={live ? { rotate: 360 } : { rotate: 0 }}
      transition={live ? { duration: 36, repeat: Infinity, ease: "linear" } : { duration: 0 }}
    >
      {RAYS.map((r, i) => (
        <g key={r.angle} transform={`rotate(${r.angle} 50 50)`}>
          <motion.line
            x1={50}
            y1={50}
            x2={50}
            y2={50 - r.len}
            stroke={INK}
            strokeWidth={7}
            strokeLinecap="round"
            style={{ originX: 0.5, originY: 1 }}
            animate={live ? { scaleY: [1, 0.45, 1] } : { scaleY: 1 }}
            transition={
              live
                ? { duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: EASE }
                : { duration: 0 }
            }
          />
        </g>
      ))}
    </motion.svg>
  );
}

const AIEngineering = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const live = inView && !reduce;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setStep((s) => (s + 1) % WORKFLOW.length), 1600);
    return () => clearInterval(t);
  }, [live]);

  return (
    <Rise>
      <div
        ref={ref}
        className="grid grid-cols-1 gap-x-14 gap-y-10 p-6 md:p-9 lg:grid-cols-12 lg:p-10"
        style={{ background: PANEL, color: INK }}
      >
        <div className="flex flex-col lg:col-span-7">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <span
                className="border px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
                style={{ borderColor: INK }}
              >
                AI
              </span>
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                Agentic engineering
              </span>
            </div>
            <Spark live={live} />
          </div>

          <h3
            className="display mt-2"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.25rem)" }}
          >
            <Mask>I ship with agents,</Mask>
            <Mask delay={0.08}>
              <span className="ink-italic" style={{ color: ITALIC }}>
                not autocomplete.
              </span>
            </Mask>
          </h3>

          <Rise delay={0.16}>
            <p className="mt-6 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.8] tracking-[0.01em]">
              I run Claude Code as a harness: parallel sub-agents explore, plan
              and build, while I own the architecture and review every diff.
            </p>
          </Rise>

          <Rise delay={0.22}>
            <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
              {TOOLS.join("  ·  ")}
            </p>
          </Rise>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Rise delay={0.12}>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
              The workflow
            </span>
          </Rise>

          <dl className="mt-4 border-t" style={{ borderColor: INK }}>
            {WORKFLOW.map((f, i) => {
              const active = live && i === step;
              return (
                <Rise key={f.k} delay={0.16 + i * 0.04}>
                  <div
                    className="relative flex items-baseline justify-between gap-4 border-b px-2 py-2 transition-colors duration-500"
                    style={{ borderColor: RULE, color: active ? PANEL : INK }}
                  >
                    {active && (
                      <motion.span
                        key={step}
                        className="absolute inset-0 -z-0"
                        style={{ background: INK, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, ease: EASE }}
                      />
                    )}
                    <dt
                      className="relative font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-500"
                      style={{ color: active ? PANEL : INK_SOFT }}
                    >
                      {f.k}
                    </dt>
                    <dd className="relative text-right text-sm">{f.v}</dd>
                  </div>
                </Rise>
              );
            })}
          </dl>
        </div>
      </div>
    </Rise>
  );
};

const TOOLS = ["Claude Code", "Sub-agents", "MCP", "Skills", "Hooks", "RAG"];

const WORKFLOW = [
  { k: "01 · Spec", v: "Plan before code" },
  { k: "02 · Delegate", v: "Parallel sub-agents" },
  { k: "03 · Ground", v: "Context, MCP, skills" },
  { k: "04 · Verify", v: "Tests · benchmarks" },
  { k: "05 · Review", v: "Every diff, by me" },
];

export default AIEngineering;
