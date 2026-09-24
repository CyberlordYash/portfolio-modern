"use client";

import React from "react";
import { Mask, Rise } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   ABOUT

   One flood-colour panel holding the whole section — identity,
   statement, background, facts and education. Nothing sits outside
   it.

   The panel is the only place on the site where the accent is used as
   a *surface* rather than as a mark. That is deliberate and it only
   works once: after a long monochrome page, a single saturated field
   lands hard. Used twice it would just read as a brand colour.

   ── The contrast decision ──
   The obvious pairing is a near-black roman line against a white
   italic one. Over a light saturated field that works. Over this
   accent it does not: #1A32FF is a dark blue, and near-black display
   type on it lands around 1.4:1 — below even the 3:1 that large text
   is allowed.

   So the pairing is inverted: white roman, pale-blue italic (~6:1).
   Same two-voice device, same hierarchy, without shipping a heading
   that can't be read. Everything else on the panel is white or a
   white alpha, for the same reason.

   This replaces a bento grid whose cells held a WebGL globe with
   animated arcs, a Lottie confetti burst, a copy-to-clipboard button
   and a glowing border — roughly 450 lines for a section whose job is
   to say who this person is.
══════════════════════════════════════════════════════════════════ */

const PANEL = "#1A32FF";
const INK = "#FFFFFF";
const INK_SOFT = "rgba(255,255,255,0.74)";
const ITALIC = "#A9B6FF";
const RULE = "rgba(255,255,255,0.22)";

const Grid = () => (
  <Rise>
    <div
      className="grid grid-cols-1 gap-x-14 gap-y-14 p-7 md:p-12 lg:grid-cols-12 lg:p-16"
      style={{ background: PANEL, color: INK }}
    >
      {/* ══ Left: who, and what ═══════════════════════════════════ */}
      <div className="flex flex-col lg:col-span-7">
        <div className="flex items-center gap-3">
          <span
            className="border px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
            style={{ borderColor: INK }}
          >
            YS®
          </span>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
            Open to work
          </span>
        </div>

        <h3
          className="display mt-10"
          style={{ fontSize: "clamp(2.1rem, 5vw, 4.25rem)" }}
        >
          <Mask>I build the parts</Mask>
          <Mask delay={0.08}>
            <span className="ink-italic" style={{ color: ITALIC }}>
              nobody sees.
            </span>
          </Mask>
        </h3>

        <Rise delay={0.16}>
          <p className="mt-9 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.95] tracking-[0.01em]">
            Order execution, event pipelines, the storage underneath — the
            machinery that only gets noticed when it stops. Most of my time
            goes to making things faster without making them wrong, which is
            a harder trade than it sounds.
          </p>
        </Rise>

        <Rise delay={0.2}>
          <p
            className="mt-6 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.95] tracking-[0.01em]"
            style={{ color: INK_SOFT }}
          >
            I&apos;m from Greater Noida, now based in Bengaluru. I studied
            Computer Science at IIIT Sonepat, and spent most of those evenings
            on competitive programming — it still shows in how I approach a
            problem: work out the bound first, then write the code. Outside
            work I lift, and I write up what I learn.
          </p>
        </Rise>

        <Rise delay={0.26}>
          <p className="mt-11 font-mono text-[0.6875rem] uppercase tracking-[0.16em]">
            {TOOLS.join("  ·  ")}
          </p>
        </Rise>

        {/* mt-auto pins this to the foot of the column on tall
            viewports, so the panel's two columns end level. */}
        <Rise delay={0.32} className="mt-auto pt-12">
          <a
            href="mailto:yashsachan321@gmail.com"
            className="group inline-flex items-center gap-3 px-7 py-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-transform duration-500 ease-out hover:-translate-y-0.5"
            style={{ background: "#0B0B0C", color: INK }}
          >
            Email me
            <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </Rise>
      </div>

      {/* ══ Right: the record ═════════════════════════════════════ */}
      <div className="lg:col-span-4 lg:col-start-9">
        <Rise delay={0.12}>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
            At a glance
          </span>
        </Rise>

        <dl className="mt-4 border-t" style={{ borderColor: INK }}>
          {FACTS.map((f, i) => (
            <Rise key={f.k} delay={0.16 + i * 0.04}>
              <div
                className="flex items-baseline justify-between gap-4 border-b py-3"
                style={{ borderColor: RULE }}
              >
                <dt
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]"
                  style={{ color: INK_SOFT }}
                >
                  {f.k}
                </dt>
                <dd className="num text-right text-sm">{f.v}</dd>
              </div>
            </Rise>
          ))}
        </dl>

        <Rise delay={0.4}>
          <span className="mt-12 block font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
            Education
          </span>
        </Rise>

        <Rise delay={0.44}>
          <div className="mt-4 border-t pt-4" style={{ borderColor: INK }}>
            <span
              className="num font-mono text-[0.6875rem] uppercase tracking-[0.14em]"
              style={{ color: INK_SOFT }}
            >
              2021 — 2025
            </span>
            <h4 className="h3 mt-2 leading-snug">
              Indian Institute of Information Technology, Sonepat
            </h4>
            <p
              className="mt-2 font-mono text-[0.75rem] leading-relaxed tracking-[0.02em]"
              style={{ color: INK_SOFT }}
            >
              B.Tech, Computer Science &amp; Engineering
              <br />
              Sonepat, Haryana
            </p>
          </div>
        </Rise>
      </div>
    </div>
  </Rise>
);

const TOOLS = ["Go", "Kafka", "NATS", "Redis", "PostgreSQL", "Kubernetes"];

const FACTS = [
  { k: "Based", v: "Bengaluru, IN" },
  { k: "From", v: "Greater Noida, UP" },
  { k: "Timezone", v: "IST · UTC+5:30" },
  { k: "Focus", v: "Backend · HFT" },
  { k: "Writing in", v: "Go" },
  { k: "Status", v: "Open to work" },
];

export default Grid;
