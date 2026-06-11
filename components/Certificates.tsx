"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RevealText, RevealChars, DrawLine, FadeReveal } from "@/components/ui/ScrollReveal";
import { IconExternalLink, IconChevronLeft, IconChevronRight, IconCheck } from "@tabler/icons-react";

import Certificate1 from "../public/go.jpg";
import Certificate2 from "../public/web.jpg";
import Certificate3 from "../public/dsa.jpg";
import Certificate4 from "../public/node.jpg";
import Certificate5 from "../public/aws.jpg";

const certs = [
  { num: "01", title: "Multithreading with Go (Golang)", platform: "Udemy", link: "https://www.udemy.com/certificate/UC-711ced98-8cc0-4890-b170-370d51230530/", image: Certificate1, accent: "#14b8a6", accentRgb: "20,184,166" },
  { num: "02", title: "Web Development Bootcamp",        platform: "Udemy", link: "https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/",  image: Certificate2, accent: "#8b5cf6", accentRgb: "139,92,246"  },
  { num: "03", title: "Data Structures & Algorithms",    platform: "Udemy", link: "https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/",  image: Certificate3, accent: "#06b6d4", accentRgb: "6,182,212"   },
  { num: "04", title: "Backend Engineering with Node.js", platform: "Udemy", link: "https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/", image: Certificate4, accent: "#10b981", accentRgb: "16,185,129"  },
  { num: "05", title: "AWS Cloud Practitioner",          platform: "AWS Credly", link: "https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq", image: Certificate5, accent: "#f59e0b", accentRgb: "245,158,11" },
];

const N = certs.length;
const GAP = 16; // px gap between cards

// Infinite-scroll clone ring:
//  index: [ 0         | 1..N (real) | N+1        N+2       ]
//  cert:  [ certs[N-1]| certs[0..4] | certs[0]   certs[1]  ]
const extended = [certs[N - 1], ...certs, certs[0], certs[1]];

export default function Certificates() {
  const [pos, setPos] = useState(1);   // 1 = real cert[0] on first load
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const snapping = useRef(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  // ── measure ──────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setCardW(w < 600 ? w : (w - GAP) / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
    const id = setInterval(advance, 3200);
    return () => clearInterval(id);
  }, [paused, cardW, advance]);

  const trackX = cardW > 0 ? -(pos * (cardW + GAP)) : 0;
  const activeDot = ((pos - 1) % N + N) % N;

  return (
    <section
      id="certificates"
      className="relative w-full overflow-hidden py-16 bg-[#ffffff] dark:bg-transparent transition-colors duration-500 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-[90vw] px-4 2xl:max-w-[1400px]">

        {/* ── Section Header ─────────────────────────────────── */}
        <div className="mb-10 flex flex-col items-center">
          <FadeReveal delay={0} className="flex items-center gap-2 border border-black/15 dark:border-white/15 bg-[#ffffff] dark:bg-black/60 px-4 py-1.5 mb-5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-black dark:bg-white"
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
            <span className="text-black dark:text-white">
              <RevealText text="VERIFIED" delay={0.18} />
            </span>{" "}
            <span
              className="text-black/25 dark:text-white/25"
              style={{ WebkitTextStrokeWidth: "1.5px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent" }}
            >
              <RevealText text="CERTIFICATES" delay={0.3} />
            </span>
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
            <FadeReveal delay={0.6}>
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                5 Verified Records
              </span>
            </FadeReveal>
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
          </div>
        </div>

        {/* ── Carousel track ─────────────────────────────────── */}
        <div ref={containerRef} className="overflow-hidden">
          {cardW > 0 && (
            <motion.div
              className="flex"
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
                  <div
                    className="relative overflow-hidden rounded-lg border bg-white dark:bg-black/65 transition-shadow duration-300"
                    style={{
                      borderColor: `rgba(${cert.accentRgb},0.28)`,
                      boxShadow: `0 0 28px rgba(${cert.accentRgb},0.08)`,
                    }}
                  >
                    {/* accent top line */}
                    <div className="absolute inset-x-0 top-0 h-[2px] z-10" style={{ background: cert.accent }} />

                    {/* certificate image — full, no crop */}
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      width={900}
                      height={640}
                      className="w-full h-auto object-cover"
                      draggable={false}
                    />

                    {/* meta row */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div
                            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center"
                            style={{ background: cert.accent }}
                          >
                            <IconCheck size={8} className="text-white" stroke={3} />
                          </div>
                          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-black/45 dark:text-white/40">
                            {cert.platform}
                          </span>
                        </div>
                        <p
                          className="font-bold uppercase leading-snug text-black dark:text-white truncate"
                          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.6rem, 1.1vw, 0.78rem)", letterSpacing: "-0.01em" }}
                        >
                          {cert.title}
                        </p>
                      </div>

                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white hover:opacity-90 transition-opacity"
                        style={{ background: cert.accent }}
                      >
                        <IconExternalLink size={10} />
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Controls ───────────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-between">
          {/* dot indicators */}
          <div className="flex items-center gap-2">
            {certs.map((c, i) => (
              <button
                key={i}
                onClick={() => { if (!snapping.current) setPos(i + 1); }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === activeDot ? 24 : 6,
                  background: i === activeDot ? certs[activeDot].accent : "rgba(128,128,128,0.28)",
                }}
                aria-label={`Go to certificate ${i + 1}`}
              />
            ))}
          </div>

          {/* arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={retreat}
              className="flex items-center justify-center w-8 h-8 border border-black/15 dark:border-white/15 text-black/55 dark:text-white/55 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white transition-all duration-200"
              aria-label="Previous"
            >
              <IconChevronLeft size={14} />
            </button>
            <button
              onClick={advance}
              className="flex items-center justify-center w-8 h-8 border border-black/15 dark:border-white/15 text-black/55 dark:text-white/55 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white transition-all duration-200"
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
