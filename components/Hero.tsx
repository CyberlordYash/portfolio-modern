"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── small "+" grid cross ─── */
const Cross = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="absolute pointer-events-none text-black dark:text-white opacity-20"
    style={style}
  >
    <div className="relative w-5 h-5">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
    </div>
  </div>
);

/* ─── Gemini-style animated gradient YS monogram ─── */
const GeminiYS = ({ size = 280 }: { size?: number }) => (
  <div
    className="relative flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <style>{`
      @keyframes gm-text {
        0%,100% { background-position:0% 50%;   }
        50%     { background-position:100% 50%; }
      }
      @keyframes gm-glow {
        0%,100% { filter:drop-shadow(0 0 18px rgba(30,64,175,0.8)); }
        50%     { filter:drop-shadow(0 0 26px rgba(37,99,235,0.7)); }
      }
    `}</style>

    {/* monogram */}
    <div className="relative z-10 flex flex-col items-center justify-center">
      <div className="font-mono text-[7px] uppercase tracking-[0.5em] text-black/40 dark:text-white/40 mb-1">
        BE_DEV
      </div>

      {/* light mode */}
      <div
        className="dark:hidden"
        style={{
          fontFamily: "var(--font-orbitron)",
          fontSize: `${Math.round(size * 0.18)}px`,
          letterSpacing: "-0.04em",
          fontWeight: 900,
          lineHeight: 1,
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #1e40af 100%)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "gm-text 8s ease-in-out infinite",
        }}
      >
        YS
      </div>

      {/* dark mode */}
      <div
        className="hidden dark:block"
        style={{
          fontFamily: "var(--font-orbitron)",
          fontSize: `${Math.round(size * 0.18)}px`,
          letterSpacing: "-0.04em",
          fontWeight: 900,
          lineHeight: 1,
          background: "linear-gradient(135deg, #ffffff 0%, #bfdbfe 30%, #93c5fd 55%, #bfdbfe 80%, #ffffff 100%)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "gm-text 8s ease-in-out infinite, gm-glow 8s ease-in-out infinite",
        }}
      >
        YS
      </div>

      <div className="font-mono text-[7px] uppercase tracking-[0.4em] text-black/40 dark:text-white/40 mt-1.5">
        IST · 2026
      </div>
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

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
const Hero = () => {
  const [time, setTime] = useState("--:--");
  const [mobileOrbSize, setMobileOrbSize] = useState(200);

  useEffect(() => {
    const updateOrbSize = () => {
      const vw = window.innerWidth;
      setMobileOrbSize(Math.min(240, Math.max(160, Math.round(vw * 0.62))));
    };
    updateOrbSize();
    window.addEventListener("resize", updateOrbSize);
    return () => window.removeEventListener("resize", updateOrbSize);
  }, []);

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
      className="relative w-full min-h-screen bg-[#ffffff] dark:bg-transparent text-black dark:text-white overflow-hidden"
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
          81%,85% { box-shadow:inset 0 0 0 1px rgba(0,220,255,.9); }
          86%,89% { box-shadow:inset 0 0 0 1px rgba(255,20,120,.8); }
          90%,94% { box-shadow:none; }
        }
        .glitch-box { position:relative; overflow:hidden; }
        .glitch-slice-1,.glitch-slice-2 {
          display:block; position:absolute; inset:0; pointer-events:none; opacity:0; z-index:20;
          will-change:transform,opacity,clip-path;
        }
        .glitch-slice-1 { background:rgba(0,220,255,.22); }
        .glitch-slice-2 { background:rgba(255,20,120,.18); }
        .glitch-box:hover {
          animation:glitch-jitter 1.1s steps(1) infinite,glitch-border-kf 1.1s steps(1) infinite;
          transition:none !important;
        }
        .glitch-box:hover .glitch-slice-1 { animation:glitch-slice-1-kf 1.1s steps(1) infinite; }
        .glitch-box:hover .glitch-slice-2 { animation:glitch-slice-2-kf 1.1s steps(1) infinite .07s; }
      `}</style>
      {/* ── TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 py-4 border-b border-black/10 dark:border-white/10">
        <span className="font-sans text-[13px] md:text-[15px] font-semibold tracking-[0.25em] uppercase">
          YASH<span className="hidden md:inline"> SACHAN</span>
        </span>


      </header>

      {/* ══════════════════════
          MOBILE LAYOUT
      ══════════════════════ */}
      <div className="lg:hidden flex flex-col items-center pt-24 px-5 pb-12 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full font-black uppercase leading-[1.05] text-center mb-8 text-black heading-gradient-dark"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2rem, 11vw, 5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          SYSTEMS,
          <br />
          BY DESIGN.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <GeminiYS size={mobileOrbSize} />
        </motion.div>

        {/* Core threads (mobile) */}
        <div className="w-full mt-10">
          <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
            [ CORE THREADS ]
          </div>
          <div className="space-y-2">
            {threads.map((t) => (
              <div key={t.n} className="flex items-center gap-3">
                <span className="font-mono text-[7px] text-black/25 dark:text-white/25">
                  {t.n}.////
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About (mobile) */}
        <div className="glitch-box w-full mt-8 border border-black/15 dark:border-white/15 p-4">
          <GlitchOverlay />
          <div className="font-mono text-[7px] uppercase tracking-[0.3em] font-bold mb-2">
            NOT A STUDIO — JUST ME
          </div>
          <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
          <p className="font-mono text-[8px] leading-relaxed text-black/65 dark:text-white/65 mb-3">
            I&apos;m Yash Sachan — backend developer at Zanskar. I build
            high-throughput distributed infrastructure and enjoy competitive
            programming.
          </p>
          <div className="flex flex-col gap-1.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-150 ${s.color} ${s.border} ${s.bg}`}
              >
                <span className={`w-1.5 h-1.5 shrink-0 ${s.dot}`} />
                <span className="flex-1">{s.label}</span>
                <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-[10px]">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links (mobile) */}
        <div className="w-full mt-6 flex flex-wrap gap-1.5">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`glitch-box border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.18em] transition-colors ${l.cls}`}
            >
              <GlitchOverlay />
              {l.label}
            </Link>
          ))}
        </div>
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
          className="absolute top-[80px] left-8 z-20 font-black uppercase leading-[1.05] text-black heading-gradient-dark"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
            letterSpacing: "-0.02em",
            maxWidth: "45vw",
          }}
        >
          SYSTEMS,
          <br />
          BY DESIGN.
        </motion.h1>

        {/* ── CENTER ORB ── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
          >
            <GeminiYS />
          </motion.div>
        </div>

        {/* ── ANNOTATION: top-right area ── */}
        <div className="absolute z-20" style={{ top: "24%", right: "30%" }}>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/55 dark:text-white/55 text-right">
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
            <div className="w-2 h-2 border border-black/35 dark:border-white/35 bg-[#ffffff] dark:bg-[#060d1a]" />
          </div>
        </div>

        {/* ── ANNOTATION: left mid ── */}
        <div
          className="absolute z-20 max-w-[150px]"
          style={{ top: "50%", left: "5%", transform: "translateY(-50%)" }}
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/50 dark:text-white/50">
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
            <div className="w-2 h-2 border border-black/30 dark:border-white/30 bg-[#ffffff] dark:bg-[#060d1a]" />
            <div
              className="w-px bg-black/18 dark:bg-white/18"
              style={{ height: 36 }}
            />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/50 dark:text-white/50">
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
          <div className="glitch-box border border-black/15 dark:border-white/15 p-4 xl:p-5">
            <GlitchOverlay />
            <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
              SPECIALIZATION
            </div>
            <div className="space-y-0.5 mb-4">
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                DISTRIBUTED
              </div>
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                + SYSTEMS
              </div>
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                + PERFORMANCE
              </div>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
            <div className="font-mono text-[8px] tracking-[0.14em] leading-relaxed text-black/55 dark:text-white/55">
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
                <span className="font-mono text-[7px] text-black/25 dark:text-white/25 w-12">
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
          style={{ width: 270 }}
        >
          <div className="glitch-box border border-black/15 dark:border-white/15 p-4">
            <GlitchOverlay />
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[7px] uppercase tracking-[0.3em] font-bold">
                NOT A STUDIO — JUST ME
              </span>
              <div className="w-3.5 h-3.5 border border-black/25 dark:border-white/25 flex items-center justify-center font-mono text-[9px] text-black/35 dark:text-white/35">
                ×
              </div>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
            <p className="font-mono text-[8px] leading-relaxed text-black/62 dark:text-white/62 mb-3">
              I&apos;m Yash Sachan — backend developer at Zanskar. I build
              high-throughput distributed infrastructure and mentor aspiring
              engineers on the side.
            </p>
            <div className="grid grid-cols-2 gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-150 ${s.color} ${s.border} ${s.bg}`}
                >
                  <span className={`w-1 h-1 shrink-0 ${s.dot}`} />
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[9px]">↗</span>
                </a>
              ))}
            </div>
          </div>
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

const socials = [
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/yashsachan321/",
    color: "text-[#0a66c2] dark:text-blue-400",
    dot: "bg-[#0a66c2] dark:bg-blue-400",
    border: "border-blue-500/30 dark:border-blue-400/25",
    bg: "hover:bg-blue-500/[0.07] dark:hover:bg-blue-400/[0.07]",
  },
  {
    label: "GITHUB",
    href: "https://github.com/cyberlordyash",
    color: "text-black/75 dark:text-white/75",
    dot: "bg-black/50 dark:bg-white/50",
    border: "border-black/20 dark:border-white/20",
    bg: "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]",
  },
  {
    label: "LEETCODE",
    href: "https://leetcode.com/u/yashsachan/",
    color: "text-orange-500 dark:text-orange-400",
    dot: "bg-orange-500 dark:bg-orange-400",
    border: "border-orange-500/30 dark:border-orange-400/25",
    bg: "hover:bg-orange-500/[0.07] dark:hover:bg-orange-400/[0.07]",
  },
  {
    label: "CODECHEF",
    href: "https://www.codechef.com/users/cyberlordyash",
    color: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-600 dark:bg-yellow-400",
    border: "border-yellow-600/30 dark:border-yellow-400/25",
    bg: "hover:bg-yellow-500/[0.07] dark:hover:bg-yellow-400/[0.07]",
  },
];

const quickLinks = [
  {
    label: "WORKLOG",
    href: "/worklog",
    cls: "border-black/20 dark:border-white/20 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white",
  },
  {
    label: "BLOGS",
    href: "/blogs",
    cls: "border-black/20 dark:border-white/20 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white",
  },
  {
    label: "GYM",
    href: "/gym",
    cls: "border-black/20 dark:border-white/20 text-black/60 dark:text-white/60 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white",
  },
];

export default Hero;
