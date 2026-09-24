"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════
   REVEAL VOCABULARY

   Five primitives, one easing curve, one set of timings. Every
   entrance on the site is composed from these, which is what keeps a
   heavily-animated page feeling like one object rather than a pile of
   separately-tuned effects.

   The shared curve is a strong ease-out: fast departure, long settle.
   That asymmetry is most of what separates motion that reads as
   expensive from motion that reads as a CSS transition.

   Everything is `once: true`. Elements that re-animate every time
   they cross the viewport make a long page exhausting to scroll back
   through, and re-triggering transforms on full-height sections was
   the original source of scroll jank in this build.
══════════════════════════════════════════════════════════════════ */

export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/* ── Rise ─────────────────────────────────────────────────────
   The default: fade up a short distance. Short — 16px, not 60 — so
   that a column of them reads as one surface lifting rather than
   individual cards flying in. */
export function Rise({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "p";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/* ── Mask ─────────────────────────────────────────────────────
   Type rises out of a clipped band. Reserved for headings: the
   overflow clip is what makes it read as typesetting rather than a
   fade, and it only works when the child is a single line of text.

   The padding/negative-margin pair gives descenders room inside the
   clip without adding space to the layout. */
export function Mask({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        display: "block",
        overflow: "hidden",
        paddingBottom: "0.14em",
        marginBottom: "-0.14em",
      }}
    >
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "108%" }}
        whileInView={{ y: "0%" }}
        viewport={VIEWPORT}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ── Curtain ──────────────────────────────────────────────────
   For imagery. The frame scales up from 88% height while the image
   inside scales *down* from 1.12 — the two moves cancel, so the photo
   appears to hold still while its window opens over it. Costs one
   extra element and is the single most effective thing here.

   `willChange` is set explicitly: without it Safari rasterises the
   image at the scaled-up size and it lands soft. */
export function Curtain({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden", willChange: "clip-path" }}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.3, delay, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.5, delay, ease: EASE }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Draw ─────────────────────────────────────────────────────
   Hairlines wipe in from the left. Same curve, longer duration — a
   rule that draws faster than the type above it reads as a separate
   event instead of part of the same gesture. */
export function Draw({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`h-px w-full bg-rule ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 1.25, delay, ease: EASE }}
    />
  );
}

/* ── Stagger ──────────────────────────────────────────────────
   Parent/child pair for lists. Using variants rather than computed
   per-item delays means a list can change length without anyone
   having to re-derive the timings. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.ul
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.ul>
  );
}
