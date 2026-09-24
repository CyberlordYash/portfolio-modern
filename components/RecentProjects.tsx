"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data";
import { Curtain, Mask, Rise, EASE } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   SELECTED WORK

   An index on the right, a preview on the left. Hovering a title
   swaps the image.

   ── Why not a card grid ──
   The previous version put each screenshot directly above its own
   title, six times down the page. That is the obvious layout and it
   is the wrong one here: it forces the reader to scroll past six
   large images to find out what the six projects *are*, and the
   titles — the actual information — end up subordinate to
   screenshots that are illegible at card size anyway.

   Splitting them fixes both. The list is scannable in a couple of
   seconds at heading scale, and the image becomes something you pull
   up on demand rather than something you wade through. It also means
   only one screenshot is on screen at a time, so each gets the space
   to be worth looking at.

   ── Hover is an enhancement, not the mechanism ──
   Hover does not exist on touch, and a list that only works with a
   pointer is broken on half the traffic a portfolio gets. The split
   layout is desktop-only; below lg the same data renders as a plain
   stacked list where every project shows its own image. Same content,
   two honest shapes — not one shape with a broken interaction.
══════════════════════════════════════════════════════════════════ */

function Head() {
  return (
    <>
      <Rise>
        <div className="flex items-center gap-3">
          <span className="sec-num">02</span>
          <span className="micro">— Selected work</span>
        </div>
      </Rise>

      <h2 className="display mt-7" style={{ fontSize: "var(--t-h1)" }}>
        <Mask delay={0.05}>Things I built</Mask>
        <Mask delay={0.14}>
          <span className="ink-italic">and shipped.</span>
        </Mask>
      </h2>
    </>
  );
}

const RecentProjects = () => {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <div>
      {/* ══ Desktop: preview | index ═══════════════════════════════ */}
      <div className="hidden grid-cols-12 gap-x-12 lg:grid">
        {/* ── Preview, pinned while the list scrolls ────────────── */}
        <div className="col-span-5">
          <div className="sticky top-28">
            <Head />

            {/* Framed, with the screenshot inset rather than bleeding
                to the border. Project shots are all different shapes
                and tints; matting them inside a shared frame makes
                six mismatched images read as one set, the same
                reasoning as the certificate grid. */}
            <div className="mt-12 border border-rule bg-paper2 p-6 xl:p-8">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* Crossfade. Overlapping the two absolutely lets one
                    dissolve into the other; unmounting the outgoing
                    image first would flash the empty frame. */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <Image
                      src={current.img}
                      alt={`${current.title} — screenshot`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover"
                      priority={active === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Caption tracks the preview, so the image is never
                unlabelled while the pointer is elsewhere. */}
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="micro">{current.tag}</span>
              <span className="micro num">{current.year}</span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {current.tech.map((t) => (
                <li key={t} className="micro opacity-70">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Index ─────────────────────────────────────────────── */}
        <div className="col-span-6 col-start-7">
          <ul className="blist">
            {projects.map((p, i) => {
              const isActive = i === active;
              const row = (
                <div
                  className="blist__row group"
                  /* onFocus as well as hover: the preview has to follow
                     keyboard navigation too, or tabbing through the
                     list shows the wrong image. */
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {/* The number alone carries the active state. Dimming
                      the titles instead made five of six hard to read
                      at any moment, which defeats the point of an
                      index — a single accent mark says the same thing
                      without costing legibility. */}
                  <span
                    className="blist__num transition-colors duration-300"
                    style={{ color: isActive ? "var(--mark)" : undefined }}
                  >
                    {String(i + 1).padStart(2, "0")}/
                  </span>

                  <h3 className="blist__title">
                    <Mask delay={i * 0.04}>{p.title}</Mask>
                  </h3>

                  <span
                    className="micro hidden shrink-0 text-right transition-opacity duration-300 xl:block"
                    style={{ opacity: isActive ? 1 : 0.45 }}
                  >
                    {p.tag}
                    <span className="px-2 opacity-40">·</span>
                    <span className="num">{p.year}</span>
                  </span>

                  <span
                    aria-hidden
                    className={`shrink-0 text-sm transition-all duration-500 ease-out ${
                      p.link
                        ? "text-ink3 group-hover:translate-x-1 group-hover:text-ink"
                        : "opacity-0"
                    }`}
                  >
                    ↗
                  </span>
                </div>
              );

              return (
                <li key={p.id}>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>

          {/* Closing rail. Gives the index a bottom edge so it doesn't
              just stop, and the domain list does a job the titles
              can't: it says what kind of work this is at a glance,
              without the reader having to infer it from six names. */}
          <Rise delay={0.1}>
            <div className="mt-8 flex items-baseline justify-between gap-6">
              <span className="micro">{DOMAINS.join("  ·  ")}</span>
              <span className="micro">( selected, and shipped )</span>
            </div>
          </Rise>
        </div>
      </div>

      {/* ══ Mobile: plain stacked list ═════════════════════════════
          No hover to drive a preview, so each project simply carries
          its own image. */}
      <div className="lg:hidden">
        <Head />

        <ul className="mt-12 flex flex-col gap-16">
          {projects.map((p, i) => {
            const body = (
              <>
                {/* Title first, image under it. The image led before,
                    which meant scrolling past six screenshots to find
                    out what any of them were — the same mistake the
                    desktop card grid made. Naming the thing before
                    showing it lets the list be skimmed. */}
                <Rise>
                  <div className="flex items-baseline gap-4 border-t border-rule pt-5">
                    <span className="micro num shrink-0 text-mark">
                      {String(i + 1).padStart(2, "0")}/
                    </span>
                    <h3 className="blist__title min-w-0 flex-1">{p.title}</h3>
                    <span className="micro hidden shrink-0 text-right sm:block">
                      {p.tag}
                      <span className="px-2 opacity-40">·</span>
                      <span className="num">{p.year}</span>
                    </span>
                  </div>

                  {/* Below the title on the narrowest screens, where it
                      will not fit beside it. */}
                  <p className="micro mt-2 sm:hidden">
                    {p.tag}
                    <span className="px-2 opacity-40">·</span>
                    <span className="num">{p.year}</span>
                  </p>
                </Rise>

                <Curtain delay={0.06} className="media media-hover mt-5">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={p.img}
                      alt={`${p.title} — screenshot`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                </Curtain>

                <Rise delay={0.08}>
                  <p className="copy mt-4 text-sm">{p.des}</p>

                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {p.tech.map((t) => (
                      <li key={t} className="micro">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Rise>
              </>
            );

            return (
              <li key={p.id}>
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="group">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* Derived from the data rather than hand-listed, so it can't drift
   out of sync when a project is added or its tag changes. */
const DOMAINS = Array.from(new Set(projects.map((p) => p.tag)));

export default RecentProjects;
