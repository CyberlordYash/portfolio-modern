"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { EASE, Mask, Rise } from "@/components/ui/Reveal";

// Dark ink on clay: white on #D97757 is ~3:1, too low for the mono body copy.
const PANEL = "#D97757";
const INK = "#141413";
const INK_SOFT = "rgba(20,20,19,0.72)";
const ITALIC = "#FAF9F5";
const RULE = "rgba(20,20,19,0.22)";

/* Share of the slot's run-in (viewport bottom → the reading line,
   where the spark departs) over which the chips are walked. */
const SKILL_SCROLL: [number, number] = [0.08, 0.92];

const AIEngineering = () => {
  const ref = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const live = inView && !reduce;
  const [step, setStep] = useState(0);
  const [skill, setSkill] = useState(-1);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setStep((s) => (s + 1) % WORKFLOW.length), 1600);
    return () => clearInterval(t);
  }, [live]);

  /* Scroll walks the skills while the spark is still home: it lights
     the ray belonging to the active chip (read off data-spark-skill),
     and the walk finishes exactly as the slot reaches the reading line
     at 45% — the moment the spark leaves to travel through the stack.
     Keep 0.45 in step with LINE in SparkTravel.tsx. */
  const { scrollYProgress } = useScroll({
    target: slot,
    offset: ["center end", "center 0.45"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const [a, b] = SKILL_SCROLL;
    const next = v < a ? -1 : Math.min(TOOLS.length - 1, Math.floor(((v - a) / (b - a)) * TOOLS.length));
    setSkill((s) => (s === next ? s : next));
  });

  return (
    <Rise>
      <div
        ref={ref}
        className="flow-panel flow-clay relative grid grid-cols-1 gap-x-14 gap-y-10 p-6 md:p-9 lg:grid-cols-12 lg:p-10"
        style={{ color: INK }}
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
            <ul className="mt-6 flex flex-wrap gap-x-1 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
              {TOOLS.map((t, i) => {
                const on = i === skill;
                return (
                  <li
                    key={t}
                    className="relative border px-2.5 py-1.5 transition-colors duration-500"
                    style={{ borderColor: on ? INK : RULE, color: on ? PANEL : INK }}
                  >
                    {on && (
                      <motion.span
                        layoutId="ai-skill"
                        className="absolute inset-0"
                        style={{ background: INK }}
                        transition={{ duration: 0.55, ease: EASE }}
                      />
                    )}
                    <span className="relative">{t}</span>
                  </li>
                );
              })}
            </ul>
          </Rise>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          {/* Home of the travelling spark (components/three/SparkTravel). */}
          <div
            ref={slot}
            data-spark-anchor="slot"
            data-spark-skill={skill}
            className="-mx-2 h-60 md:h-72"
            aria-hidden
          />
          <div
            className="mb-8 mt-2 flex items-baseline justify-between border-t pt-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em]"
            style={{ borderColor: RULE }}
          >
            <span style={{ color: INK_SOFT }}>
              {String(Math.max(0, skill) + 1).padStart(2, "0")} / {String(TOOLS.length).padStart(2, "0")}
            </span>
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {TOOLS[Math.max(0, skill)]}
            </motion.span>
          </div>
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
