"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RevealText, RevealChars, DrawLine, FadeReveal } from "@/components/ui/ScrollReveal";
import { IconChevronLeft, IconChevronRight, IconCheck } from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";

import Certificate1 from "../public/go.jpg";
import Certificate2 from "../public/web.jpg";
import Certificate3 from "../public/dsa.jpg";
import Certificate4 from "../public/node.jpg";
import Certificate5 from "../public/aws.jpg";

/* ── small "+" cross marker (shared with Hero / RecentProjects) ── */
const Cross = ({ style }: { style?: React.CSSProperties }) => (
  <div className="absolute pointer-events-none text-black dark:text-white opacity-15" style={style}>
    <div className="relative w-5 h-5">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
    </div>
  </div>
);

/* ══════════════════════════════════════
   CREDENTIALS — monochrome
   Each card used to carry its own accent hex (and an accentRgb that didn't
   even match it), which filled the CTA and the check chip with solid colour
   and made the row read as five unrelated badges. Category is now carried by
   the label alone; every card shares the same graphite surface as the project
   grid, so the carousel reads as one record set.
══════════════════════════════════════ */
const certs = [
  {
    num: "01",
    title: "Multithreading with Go (Golang)",
    platform: "Udemy",
    category: "CONCURRENCY",
    ref: "UC-711CED98",
    link: "https://www.udemy.com/certificate/UC-711ced98-8cc0-4890-b170-370d51230530/",
    image: Certificate1,
  },
  {
    num: "02",
    title: "Web Development Bootcamp",
    platform: "Udemy",
    category: "FULLSTACK",
    ref: "UC-AA9D5A25",
    link: "https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/",
    image: Certificate2,
  },
  {
    num: "03",
    title: "Data Structures & Algorithms",
    platform: "Udemy",
    category: "ALGORITHMS",
    ref: "UC-4E3ACD8C",
    link: "https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/",
    image: Certificate3,
  },
  {
    num: "04",
    title: "Backend Engineering with Node.js",
    platform: "Udemy",
    category: "BACKEND",
    ref: "UC-E1548ADE",
    link: "https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/",
    image: Certificate4,
  },
  {
    num: "05",
    title: "AWS Cloud Practitioner",
    platform: "AWS Credly",
    category: "CLOUD",
    ref: "CREDLY-6886E2D2",
    link: "https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq",
    image: Certificate5,
  },
];

const N = certs.length;
const GAP = 16;      // px gap between cards
const DWELL = 3600;  // ms per slide

// Infinite-scroll clone ring:
//  index: [ 0         | 1..N (real) | N+1        N+2       ]
//  cert:  [ certs[N-1]| certs[0..4] | certs[0]   certs[1]  ]
const extended = [certs[N - 1], ...certs, certs[0], certs[1]];

/* ── one credential card ── */
const CertCard = ({ cert }: { cert: (typeof certs)[0] }) => (
  <a
    href={cert.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex h-full flex-col overflow-hidden border border-black/[0.12] dark:border-white/[0.12]
      bg-white/85 dark:bg-[#0B0B0E]/80 transition-colors duration-500
      hover:border-black/25 dark:hover:border-white/25"
  >
    {/* hairline top strip — same treatment as the project cards */}
    <div className="absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/15 z-20" />

    {/* ── meta bar ── */}
    <div className="relative z-20 flex items-center gap-3 border-b border-black/[0.08] dark:border-white/[0.08] px-4 py-2.5">
      <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/55 dark:text-white/55">
        {cert.num}./
      </span>
      <span className="border border-black/[0.12] dark:border-white/[0.12] px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.25em] text-black/55 dark:text-white/55">
        {cert.category}
      </span>
      <span className="ml-auto flex items-center gap-1.5 border border-black/[0.12] dark:border-white/[0.12] px-2.5 py-1 font-mono text-[7px] uppercase tracking-widest text-black/45 dark:text-white/45">
        <IconCheck size={9} stroke={3} />
        VERIFIED
      </span>
    </div>

    {/* ── image frame — fixed ratio so the track never jumps between slides ── */}
    <div className="relative aspect-[16/11] overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
      {/* number watermark */}
      <div
        className="absolute -bottom-6 -left-3 z-0 font-black leading-none select-none pointer-events-none text-black/[0.05] dark:text-white/[0.06]"
        style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "8rem", letterSpacing: "-0.05em" }}
      >
        {cert.num}
      </div>

      {/* blurred backdrop + contained scan of the certificate */}
      <Image
        src={cert.image}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 600px) 90vw, 45vw"
        className="object-cover scale-110 blur-2xl opacity-25 dark:opacity-15 transition-transform duration-700 group-hover:scale-125"
        draggable={false}
      />
      <Image
        src={cert.image}
        alt={cert.title}
        fill
        sizes="(max-width: 600px) 90vw, 45vw"
        className="relative z-10 object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
        draggable={false}
      />

      {/* corner ticks — HUD framing on the scan */}
      <span className="pointer-events-none absolute left-3 top-3 z-20 h-2.5 w-2.5 border-l border-t border-black/20 dark:border-white/25" />
      <span className="pointer-events-none absolute right-3 top-3 z-20 h-2.5 w-2.5 border-r border-t border-black/20 dark:border-white/25" />
      <span className="pointer-events-none absolute left-3 bottom-3 z-20 h-2.5 w-2.5 border-b border-l border-black/20 dark:border-white/25" />
      <span className="pointer-events-none absolute right-3 bottom-3 z-20 h-2.5 w-2.5 border-b border-r border-black/20 dark:border-white/25" />
    </div>

    {/* ── content ── */}
    <div className="relative z-10 flex flex-1 flex-col justify-between p-5">
      <Cross style={{ top: 8, right: 8 }} />

      <div>
        <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">
          {cert.platform}
        </span>
        <h3
          className="mt-2 mb-2.5 font-semibold uppercase leading-tight text-black dark:text-white"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.75rem,1.3vw,0.95rem)", letterSpacing: "0.02em" }}
        >
          {cert.title}
        </h3>
        <div className="h-px bg-black/8 dark:bg-white/8" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="truncate font-mono text-[8px] uppercase tracking-[0.3em] text-black/25 dark:text-white/25">
          {cert.ref}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 border border-black/20 bg-black/[0.04] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black/80 transition-colors duration-200 group-hover:bg-black/[0.09] dark:border-white/25 dark:bg-white/[0.06] dark:text-white/90 dark:group-hover:bg-white/[0.14] dark:group-hover:border-white/45">
          View
          <ArrowUpRight size={10} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  </a>
);

export default function Certificates() {
  const [pos, setPos] = useState(1);   // 1 = real cert[0] on first load
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const snapping = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  // ── measure (ResizeObserver so we catch the element gaining width,
  //    not just window resizes — fixes empty track when width is 0 at mount) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setCardW(w < 600 ? w : (w - GAP) / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── snap back into real range after clone zone ───────────
  const snapIfNeeded = useCallback(() => {
    if (snapping.current) return;
    const p = posRef.current;
    // pos===0 → we slid left of the ring; pos===N+1 → past the right end
    if (p === 0 || p === N + 1) {
      snapping.current = true;
      setInstant(true);
      setPos(p === 0 ? N : 1);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setInstant(false);
          snapping.current = false;
        })
      );
    }
  }, []);

  const advance = useCallback(() => {
    if (snapping.current) return;
    setPos(p => p + 1);
  }, []);

  const retreat = useCallback(() => {
    if (snapping.current) return;
    setPos(p => p - 1);
  }, []);

  // ── auto-advance ──────────────────────────────────────────
  useEffect(() => {
    if (paused || cardW === 0) return;
    const id = setInterval(advance, DWELL);
    return () => clearInterval(id);
  }, [paused, cardW, advance]);

  const trackX = cardW > 0 ? -(pos * (cardW + GAP)) : 0;
  const activeDot = ((pos - 1) % N + N) % N;

  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24 bg-transparent transition-colors duration-500"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* spotlight — dark mode accent */}
      <Spotlight className="-top-20 right-0 md:-right-10 md:-top-10 opacity-30 dark:opacity-50" fill="#91919A" />

      {/* subtle grid lines matching hero / projects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* corner crosses */}
      <Cross style={{ top: 24, left: 24 }} />
      <Cross style={{ top: 24, right: 24 }} />
      <Cross style={{ bottom: 24, left: 24 }} />
      <Cross style={{ bottom: 24, right: 24 }} />

      <div className="relative mx-auto w-full max-w-5xl px-4 md:px-0">

        {/* Side rails — frame the centered module, let the living background breathe */}
        <div className="pointer-events-none absolute inset-y-0 -left-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
          <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-white/15" />
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 -right-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
          <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-white/15" />
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
        </div>

        {/* ── Section Header ─────────────────────────────────── */}
        <div className="mb-10 flex flex-col items-center">
          <FadeReveal
            delay={0}
            className="hud-corners relative flex items-center gap-2 border border-black/15 dark:border-[#91919A]/30 bg-white/75 dark:bg-[#08080A]/70 dark:shadow-[0_0_20px_rgba(255,255,255,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] px-4 py-1.5 mb-5 backdrop-blur-sm"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-black dark:bg-[#D8D8DC] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            <RevealChars
              text="CREDENTIALS_VAULT"
              className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white"
              delay={0.1}
            />
          </FadeReveal>

          <h2
            className="font-black uppercase leading-none text-center whitespace-nowrap"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.3rem, 5vw, 5rem)", letterSpacing: "-0.025em" }}
          >
            <span className="text-black dark:text-white/90">
              <RevealText text="VERIFIED" delay={0.18} />
            </span>{" "}
            <span
              className="text-black dark:text-white/85"
              style={{ WebkitTextStrokeWidth: "var(--heading-stroke-w)", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent" }}
            >
              <RevealText text="CERTIFICATES" delay={0.3} />
            </span>
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-gradient-to-r dark:from-transparent dark:to-[#91919A]/60" />
            <FadeReveal delay={0.6}>
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-[#D8D8DC]/70">
                {N} Verified Records
              </span>
            </FadeReveal>
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-gradient-to-l dark:from-transparent dark:to-[#91919A]/60" />
          </div>
        </div>

        {/* ── Carousel track ─────────────────────────────────── */}
        <div ref={containerRef} className="overflow-hidden">
          {cardW > 0 && (
            <motion.div
              className="flex items-stretch"
              style={{ gap: GAP }}
              animate={{ x: trackX }}
              transition={
                instant
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 36 }
              }
              onAnimationComplete={snapIfNeeded}
            >
              {extended.map((cert, i) => (
                <div key={i} style={{ width: cardW, flexShrink: 0 }}>
                  <CertCard cert={cert} />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Controls ───────────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-between gap-4">
          {/* index readout + segment ticks */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 tabular-nums">
              {certs[activeDot].num} <span className="opacity-40">/</span> {String(N).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {certs.map((c, i) => (
                <button
                  key={c.num}
                  onClick={() => { if (!snapping.current) setPos(i + 1); }}
                  className={`h-px transition-all duration-300 ${
                    i === activeDot
                      ? "w-8 bg-black dark:bg-white"
                      : "w-4 bg-black/20 hover:bg-black/45 dark:bg-white/20 dark:hover:bg-white/45"
                  }`}
                  aria-label={`Go to certificate ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* autoplay state + arrows */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[8px] uppercase tracking-[0.3em] text-black/25 dark:text-white/25">
              {paused ? "PAUSED" : "AUTO"}
            </span>
            <button
              onClick={retreat}
              className="flex h-8 w-8 items-center justify-center border border-black/[0.12] dark:border-white/[0.12] text-black/55 dark:text-white/55 transition-colors duration-200 hover:border-black/30 hover:text-black dark:hover:border-white/30 dark:hover:text-white"
              aria-label="Previous"
            >
              <IconChevronLeft size={14} />
            </button>
            <button
              onClick={advance}
              className="flex h-8 w-8 items-center justify-center border border-black/[0.12] dark:border-white/[0.12] text-black/55 dark:text-white/55 transition-colors duration-200 hover:border-black/30 hover:text-black dark:hover:border-white/30 dark:hover:text-white"
              aria-label="Next"
            >
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
