"use client";

import React from "react";
import { Mask, Rise } from "@/components/ui/Reveal";

// Dark ink on clay: white on #D97757 is ~3:1, too low for the mono body copy.
const PANEL = "#D97757";
const INK = "#141413";
const INK_SOFT = "rgba(20,20,19,0.72)";
const ITALIC = "#FAF9F5";
const RULE = "rgba(20,20,19,0.22)";

const AIEngineering = () => (
  <Rise>
    <div
      className="grid grid-cols-1 gap-x-14 gap-y-10 p-6 md:p-9 lg:grid-cols-12 lg:p-10"
      style={{ background: PANEL, color: INK }}
    >
      <div className="flex flex-col lg:col-span-7">
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

        <h3
          className="display mt-6"
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
          {WORKFLOW.map((f, i) => (
            <Rise key={f.k} delay={0.16 + i * 0.04}>
              <div
                className="flex items-baseline justify-between gap-4 border-b py-2"
                style={{ borderColor: RULE }}
              >
                <dt
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]"
                  style={{ color: INK_SOFT }}
                >
                  {f.k}
                </dt>
                <dd className="text-right text-sm">{f.v}</dd>
              </div>
            </Rise>
          ))}
        </dl>
      </div>
    </div>
  </Rise>
);

const TOOLS = ["Claude Code", "Sub-agents", "MCP", "Skills", "Hooks", "RAG"];

const WORKFLOW = [
  { k: "01 · Spec", v: "Plan before code" },
  { k: "02 · Delegate", v: "Parallel sub-agents" },
  { k: "03 · Ground", v: "Context, MCP, skills" },
  { k: "04 · Verify", v: "Tests · benchmarks" },
  { k: "05 · Review", v: "Every diff, by me" },
];

export default AIEngineering;
