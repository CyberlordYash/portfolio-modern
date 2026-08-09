"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── small "+" grid cross ─── */
const Cross = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="absolute pointer-events-none text-black dark:text-[#D8D8DC] opacity-20 dark:opacity-30"
    style={style}
  >
    <div className="relative w-5 h-5">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
    </div>
  </div>
);

/* ─── Glitch overlay slices ─── */
const GlitchOverlay = () => (
  <>
    <span className="glitch-slice-1" aria-hidden="true" />
    <span className="glitch-slice-2" aria-hidden="true" />
  </>
);

/* ─── brand glyphs (inline so nothing is fetched at runtime) ─── */
type Glyph = (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;

const IconLinkedIn: Glyph = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconGitHub: Glyph = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const IconLeetCode: Glyph = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

/* Chef's hat, built from primitives — the official mark is a detailed
   illustration that turns to mud at 19px. */
const IconCodeChef: Glyph = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="7.1" cy="8.7" r="3.7" />
    <circle cx="12" cy="7.3" r="4.5" />
    <circle cx="16.9" cy="8.7" r="3.7" />
    <rect x="6.5" y="9.5" width="11" height="4.6" />
    <rect x="6.1" y="15.4" width="11.8" height="4.5" rx="0.7" />
  </svg>
);

/* ══════════════════════════════════════════
   IDENTITY CARD
   Shared by the mobile and desktop layouts.
   The header strip carries a live IST clock so the
   card reads as an instrument readout, not a bio box.
══════════════════════════════════════════ */
const IdentityCard = ({ time }: { time: string }) => (
  <div className="glitch-box hud-corners navy-glass border border-black/15 dark:border-[#91919A]/25">
    <GlitchOverlay />

    {/* ── header strip ── */}
    <div className="id-strip flex items-center justify-between gap-2 border-b border-black/10 px-3 py-2 dark:border-white/10">
      <span className="whitespace-nowrap font-mono text-[8px] font-bold uppercase tracking-[0.26em]">
        NOT A STUDIO
        <span className="text-black/30 dark:text-white/30"> — </span>
        JUST ME
      </span>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[8px] tabular-nums tracking-[0.1em] text-black/45 dark:text-white/45">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-[5px] w-[5px] bg-emerald-500 dark:bg-emerald-400"
          style={{ boxShadow: "0 0 6px currentColor" }}
        />
        {time}
        <span className="text-black/25 dark:text-white/25">IST</span>
      </span>
    </div>

    {/* ── body ── */}
    <div className="px-3 pb-3 pt-3">
      <p className="font-mono text-[11px] leading-relaxed text-black/65 dark:text-white/65">
        I&apos;m Yash, a backend developer. I build high-throughput distributed
        infrastructure and mentor aspiring engineers on the side.
      </p>
    </div>

    {/* ── link rail ── */}
    <div className="grid grid-cols-4 border-t border-black/10 dark:border-white/10">
      {socials.map((s, i) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={`group relative flex items-center justify-center py-3 transition-colors duration-200 ${
            i > 0 ? "border-l border-black/10 dark:border-white/10" : ""
          } ${s.color} ${s.wash}`}
        >
          <span
            className={`absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100 ${s.bar}`}
          />
          <s.Icon className="h-[19px] w-[19px] opacity-[0.85] transition-all duration-200 group-hover:-translate-y-px group-hover:opacity-100" />
        </a>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
const Hero = () => {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      id="home"
      className="relative w-full min-h-[100dvh] bg-[#ffffff] dark:bg-transparent text-black dark:text-white overflow-hidden"
    >
      <style>{`
        @keyframes glitch-jitter {
          0%,83%,100% { transform:translate(0,0) skewX(0deg); }
          84% { transform:translate(-3px,1px) skewX(-0.4deg); }
          86% { transform:translate(3px,-1px) skewX(0.4deg); }
          88% { transform:translate(-2px,2px); }
          90% { transform:translate(2px,-1px); }
          92% { transform:translate(-1px,0); }
        }
        @keyframes glitch-slice-1-kf {
          0%,80%,100% { opacity:0; clip-path:inset(100% 0 0 0); transform:translateX(0); }
          81% { opacity:1; clip-path:inset(14% 0 63% 0); transform:translateX(-6px); }
          84% { opacity:1; clip-path:inset(56% 0 11% 0); transform:translateX(6px); }
          87% { opacity:.65; clip-path:inset(35% 0 43% 0); transform:translateX(-3px); }
          90% { opacity:0; clip-path:inset(100% 0 0 0); }
        }
        @keyframes glitch-slice-2-kf {
          0%,76%,100% { opacity:0; clip-path:inset(100% 0 0 0); transform:translateX(0); }
          77% { opacity:1; clip-path:inset(7% 0 74% 0); transform:translateX(5px); }
          80% { opacity:1; clip-path:inset(66% 0 13% 0); transform:translateX(-5px); }
          83% { opacity:.55; clip-path:inset(41% 0 33% 0); transform:translateX(3px); }
          86% { opacity:0; clip-path:inset(100% 0 0 0); }
        }
        @keyframes glitch-border-kf {
          0%,80%,100% { box-shadow:none; }
          81%,85% { box-shadow:inset 0 0 0 1px rgba(255,255,255,.9); }
          86%,89% { box-shadow:inset 0 0 0 1px rgba(255,255,255,.7); }
          90%,94% { box-shadow:none; }
        }
        .glitch-box { position:relative; overflow:hidden; }
        .glitch-slice-1,.glitch-slice-2 {
          display:block; position:absolute; inset:0; pointer-events:none; opacity:0; z-index:20;
          will-change:transform,opacity,clip-path;
        }
        .glitch-slice-1 { background:rgba(255,255,255,.22); }
        .glitch-slice-2 { background:rgba(255,255,255,.16); }
        .glitch-box:hover {
          animation:glitch-jitter 1.1s steps(1) infinite,glitch-border-kf 1.1s steps(1) infinite;
          transition:none !important;
        }
        .glitch-box:hover .glitch-slice-1 { animation:glitch-slice-1-kf 1.1s steps(1) infinite; }
        .glitch-box:hover .glitch-slice-2 { animation:glitch-slice-2-kf 1.1s steps(1) infinite .07s; }
        .id-strip {
          background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.05) 0 1px,transparent 1px 5px);
        }
        .dark .id-strip {
          background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.045) 0 1px,transparent 1px 5px);
        }
      `}</style>
      {/* Ambient glow blobs removed — see the note in app/page.tsx. */}
      {/* ── TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 py-4 border-b border-black/10 dark:border-[#91919A]/15">
        <span className="flex items-center gap-2 select-none text-black/55 dark:text-white/55">
          <span className="grid h-5 w-5 place-items-center border border-black/25 dark:border-[#91919A]/50 dark:bg-[#29292E]/30 dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="font-black text-[9px] leading-none dark:text-[#D8D8DC]" style={{ fontFamily: "var(--font-orbitron)" }}>S</span>
          </span>
          <span
            className="font-black uppercase leading-none tracking-[0.18em] text-[9px] md:text-[10px]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            SYSTEMS<span className="text-black/30 dark:text-white/30"> BY </span>DESIGN
          </span>
        </span>


      </header>

      {/* ══════════════════════
          MOBILE LAYOUT
      ══════════════════════ */}
      <div className="lg:hidden relative z-10 flex flex-col items-center pt-20 px-4 sm:px-5 pb-14 min-h-[100dvh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full font-black uppercase leading-[1.05] text-center"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2rem, 11vw, 5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            className="text-black/70 dark:text-white"
            style={{ WebkitTextStrokeWidth: "1.75px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))" }}
          >
            YASH
          </span>
          <br />
          <span className="text-black dark:text-white heading-gradient-dark">SACHAN</span>
          <span
            className="mx-auto mt-4 mb-1 block h-[3px] w-24 bg-[#6D6D76] dark:bg-[#91919A]"
            style={{ boxShadow: "0 0 14px rgba(255,255,255,0.55)" }}
          />
          {/* 0.45em of tracking on a 15px face overflowed a 360px screen once
              the container padding was counted — sized off the viewport now. */}
          <span className="mt-3 block font-mono text-[clamp(10px,3.1vw,14px)] font-medium uppercase tracking-[0.4em] text-black/75 dark:text-white/85">
            Software Engineer
          </span>
        </motion.h1>

        {/* Specialization (mobile) — this panel was desktop-only, so the one
            line that actually says what I do never reached a phone. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mt-9 hud-corners navy-glass relative border border-black/15 dark:border-[#91919A]/25 p-4"
        >
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
            SPECIALIZATION
          </div>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mb-3.5">
            {["DISTRIBUTED", "+ SYSTEMS", "+ PERFORMANCE"].map((s) => (
              <span key={s} className="font-mono text-[12px] font-bold tracking-[0.06em] uppercase">
                {s}
              </span>
            ))}
          </div>
          <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
          <div className="font-mono text-[10.5px] tracking-[0.1em] leading-relaxed text-black/80 dark:text-white/80">
            → HIGH-THROUGHPUT
            <br />→ INFRA ENGINEERING
          </div>
        </motion.div>

        {/* Core threads (mobile) */}
        <div className="w-full mt-8">
          <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-black/40 dark:text-white/40 mb-3">
            [ CORE THREADS ]
          </div>
          <div className="space-y-2.5">
            {threads.map((t) => (
              <div key={t.n} className="flex items-center gap-3">
                <span className="font-mono text-[8px] shrink-0 text-black/30 dark:text-[#91919A]/70">
                  {t.n}.////
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About (mobile) */}
        <div className="w-full mt-8">
          <IdentityCard time={time} />
        </div>

        {/* Quick links (mobile) — 7px text in a 1-unit-tall box was both
            unreadable and well under any usable tap target. */}
        <div className="w-full mt-6 grid grid-cols-3 gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`glitch-box flex min-h-[40px] items-center justify-center border px-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${l.cls}`}
            >
              <GlitchOverlay />
              {l.label}
            </Link>
          ))}
        </div>

        {/* Scroll cue — the desktop layout has one, mobile had nothing telling
            you the page continues past a full-height hero. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-auto pt-10 flex flex-col items-center gap-1.5 pointer-events-none select-none"
        >
          <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-black/35 dark:text-white/35">
            Scroll to descend
          </span>
          <motion.span
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="block h-5 w-px origin-top bg-gradient-to-b from-[#91919A] to-transparent"
          />
        </motion.div>
      </div>

      {/* ══════════════════════
          DESKTOP LAYOUT
      ══════════════════════ */}
      <div className="hidden lg:block absolute inset-0 pt-[64px]">
        {/* ── HEADLINE ── */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[80px] left-8 z-20 font-black uppercase leading-[1.05]"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
            letterSpacing: "-0.02em",
            maxWidth: "45vw",
          }}
        >
          <span
            className="text-black/70 dark:text-white"
            style={{ WebkitTextStrokeWidth: "1.75px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))" }}
          >
            YASH
          </span>
          <br />
          <span className="text-black dark:text-white heading-gradient-dark">SACHAN</span>
          <span
            className="mt-4 mb-1 block h-[3px] w-28 bg-[#6D6D76] dark:bg-[#91919A]"
            style={{ boxShadow: "0 0 14px rgba(255,255,255,0.55)" }}
          />
          <span className="mt-3 block font-mono text-[16px] font-medium uppercase tracking-[0.5em] text-black/75 dark:text-white/85">
            Software Engineer
          </span>
        </motion.h1>


        {/* ── ANNOTATION: top-right area ── */}
        <div className="absolute z-20" style={{ top: "24%", right: "30%" }}>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/80 dark:text-white/80 text-right">
            WHERE ENGINEERING
            <br />
            MEETS PRECISION —<br />
            INFRASTRUCTURE OF
            <br />
            ENDLESS SCALE
          </p>
          {/* vertical leader line ↓ */}
          <div className="absolute bottom-0 right-4 translate-y-full flex flex-col items-center">
            <div
              className="w-px bg-black/20 dark:bg-white/20"
              style={{ height: 40 }}
            />
            <div className="w-2 h-2 border border-black/35 dark:border-white/35 bg-[#ffffff] dark:bg-[#000000]" />
          </div>
        </div>

        {/* ── ANNOTATION: left mid ── */}
        <div
          className="absolute z-20 max-w-[150px]"
          style={{ top: "50%", left: "5%", transform: "translateY(-50%)" }}
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/75 dark:text-white/75">
            FROM DEEP ROOTS,
            <br />
            PERFORMANCE
            <br />
            DRAWS ITS
            <br />
            STRENGTH
          </p>
          {/* horizontal leader → */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full flex items-center">
            <div
              className="bg-black/20 dark:bg-white/20 h-px"
              style={{ width: 48 }}
            />
          </div>
        </div>

        {/* ── ANNOTATION: bottom of orb ── */}
        <div className="absolute z-20" style={{ bottom: "23%", left: "56%" }}>
          <div className="flex flex-col items-center mb-2">
            <div className="w-2 h-2 border border-black/30 dark:border-white/30 bg-[#ffffff] dark:bg-[#000000]" />
            <div
              className="w-px bg-black/18 dark:bg-white/18"
              style={{ height: 36 }}
            />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/75 dark:text-white/75">
            FOUNDATION
            <br />
            DESIGNED FOR
            <br />
            GROWTH
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20"
          style={{
            right: "2.5%",
            top: "38%",
            transform: "translateY(-50%)",
            width: 210,
          }}
        >
          <div className="glitch-box hud-corners navy-glass border border-black/15 dark:border-[#91919A]/25 p-4 xl:p-5">
            <GlitchOverlay />
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
              SPECIALIZATION
            </div>
            <div className="space-y-0.5 mb-4">
              <div className="font-mono text-[13px] font-bold tracking-[0.08em] uppercase">
                DISTRIBUTED
              </div>
              <div className="font-mono text-[13px] font-bold tracking-[0.08em] uppercase">
                + SYSTEMS
              </div>
              <div className="font-mono text-[13px] font-bold tracking-[0.08em] uppercase">
                + PERFORMANCE
              </div>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
            <div className="font-mono text-[11px] tracking-[0.14em] leading-relaxed text-black/80 dark:text-white/80">
              → HIGH-THROUGHPUT
              <br />→ INFRA ENGINEERING
            </div>
          </div>
        </motion.div>

        {/* ── CORE THREADS (bottom-left) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20 bottom-8 left-8"
        >
          <div className="font-mono text-[7px] tracking-[0.42em] uppercase text-black/32 dark:text-white/32 mb-3">
            [ CORE THREADS OF MY WORK ]
          </div>
          <div className="space-y-2">
            {threads.map((t) => (
              <div key={t.n} className="flex items-center gap-3">
                <span className="font-mono text-[7px] text-black/25 dark:text-[#91919A]/60 w-12">
                  {t.n}.////
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── ABOUT CARD (bottom-right) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20 bottom-8 right-8"
          style={{ width: 284 }}
        >
          <IdentityCard time={time} />
        </motion.div>

        {/* ── SCROLL CUE (above quick nav) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute z-20 bottom-[4.6rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none"
        >
          <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-black/35 dark:text-white/35">
            Scroll to descend
          </span>
          <motion.span
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="block h-5 w-px origin-top bg-gradient-to-b from-[#91919A] to-transparent"
          />
        </motion.div>

        {/* ── QUICK NAV (bottom-center) ── */}
        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`glitch-box border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.25em] transition-colors ${l.cls}`}
            >
              <GlitchOverlay />
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── GRID CROSS MARKERS ── */}
        <Cross style={{ top: "28%", right: "39%", transform: "none" }} />
        <Cross style={{ top: "63%", left: "36%" }} />
        <Cross style={{ top: "38%", left: "20%" }} />
        <Cross style={{ bottom: "28%", right: "22%" }} />
      </div>
    </div>
  );
};

/* ─── shared data ─── */
const threads = [
  { n: "01", label: "DISTRIBUTED SYSTEMS" },
  { n: "02", label: "PERFORMANCE ENGINEERING" },
  { n: "03", label: "CLOUD NATIVE INFRA" },
  { n: "04", label: "BACKEND ARCHITECTURE" },
];

/* `color` sets the cell's currentColor, which the glyph fills with. */
const socials = [
  {
    label: "LINKEDIN",
    Icon: IconLinkedIn,
    href: "https://www.linkedin.com/in/yashsachan321/",
    color: "text-[#0a66c2] dark:text-[#4da3ff]",
    wash: "hover:bg-blue-500/[0.08] dark:hover:bg-blue-400/[0.1]",
    bar: "bg-[#0a66c2] dark:bg-[#4da3ff]",
  },
  {
    label: "GITHUB",
    Icon: IconGitHub,
    href: "https://github.com/cyberlordyash",
    color: "text-black/80 dark:text-white/85",
    wash: "hover:bg-black/[0.06] dark:hover:bg-white/[0.07]",
    bar: "bg-black/70 dark:bg-white/70",
  },
  {
    label: "LEETCODE",
    Icon: IconLeetCode,
    href: "https://leetcode.com/u/yashsachan/",
    color: "text-[#f89f1b] dark:text-[#ffa116]",
    wash: "hover:bg-orange-500/[0.09] dark:hover:bg-orange-400/[0.1]",
    bar: "bg-[#f89f1b] dark:bg-[#ffa116]",
  },
  {
    label: "CODECHEF",
    Icon: IconCodeChef,
    href: "https://www.codechef.com/users/cyberlordyash",
    color: "text-[#a86a3d] dark:text-[#d9a06a]",
    wash: "hover:bg-amber-700/[0.08] dark:hover:bg-amber-500/[0.1]",
    bar: "bg-[#a86a3d] dark:bg-[#d9a06a]",
  },
];

const quickLinks = [
  {
    label: "WORKLOG",
    href: "/worklog",
    cls: "border-black/20 dark:border-[#91919A]/25 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-[#91919A]/60 hover:text-black dark:hover:text-white dark:hover:bg-[#0E0E11]/60 dark:hover:shadow-[0_0_14px_rgba(255,255,255,0.25)]",
  },
  {
    label: "BLOGS",
    href: "/blogs",
    cls: "border-black/20 dark:border-[#91919A]/25 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-[#91919A]/60 hover:text-black dark:hover:text-white dark:hover:bg-[#0E0E11]/60 dark:hover:shadow-[0_0_14px_rgba(255,255,255,0.25)]",
  },
  {
    label: "GYM",
    href: "/gym",
    cls: "border-black/20 dark:border-[#91919A]/25 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-[#91919A]/60 hover:text-black dark:hover:text-white dark:hover:bg-[#0E0E11]/60 dark:hover:shadow-[0_0_14px_rgba(255,255,255,0.25)]",
  },
];

export default Hero;
