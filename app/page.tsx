"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

// Components
import Approach from "@/components/Approach";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { RevealText, RevealChars, DrawLine, FadeReveal } from "@/components/ui/ScrollReveal";
import TerminalSnake from "./TerminalSnake";
import dynamic from "next/dynamic";

const SkillsGraph = dynamic(() => import("./SkillsGraph"), { ssr: false });
const MarketWorld = dynamic(() => import("@/components/three/MarketWorld"), { ssr: false });

const links = [
  { n: "01", label: "Home",       href: "#home",       desktopOnly: false },
  { n: "02", label: "Experience", href: "#experience", desktopOnly: true  },
  { n: "03", label: "About",      href: "#skills",     desktopOnly: false },
  { n: "04", label: "Projects",   href: "#projects",   desktopOnly: false },
  { n: "05", label: "Contact",    href: "#contact",    desktopOnly: true  },
];

// Shared entrance animation for all non-hero sections.
// once:true + opacity-only — re-triggering transforms on full-screen
// sections caused scroll jank over the WebGL background.
const cardEnter = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, amount: 0.05 },
};

function TopNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const root = document.getElementById("main-scroll");
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { root, threshold: 0.3, rootMargin: "-10% 0px -10% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.href.replace("#", ""));
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <nav className="fixed top-2 right-3 xl:top-3 xl:right-8 z-50">
      <div
        id="nav-pill-box"
        className="relative flex items-center gap-0.5 rounded-full border border-white/10 bg-black/60 p-1 pl-3.5 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {/* system-online beacon */}
        <span className="relative mr-2.5 flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-50 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.9)]" />
        </span>

        {links.map((link) => {
          const id = link.href.replace("#", "");
          const isActive = active === id;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "group relative flex items-baseline gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-full font-mono uppercase text-[10px] lg:text-[10.5px] tracking-[0.14em] transition-colors duration-300 z-10 whitespace-nowrap",
                link.desktopOnly && "hidden md:flex",
                isActive ? "text-black" : "text-white/55 hover:text-white",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_10px_rgba(34,197,94,0.28)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "text-[7px] tracking-[0.05em] transition-colors duration-300",
                  isActive
                    ? "font-bold text-[#15803d]"
                    : "text-white/25 group-hover:text-[#22c55e]/80",
                )}
              >
                {link.n}
              </span>
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* Parametric border frame — computed in real pixels so corners stay perfectly
   round (no aspect distortion). Notch on the top-right (near nav) and bottom-left. */
function buildFramePath(
  w: number,
  h: number,
  pill: { left: number; bottom: number } | null,
) {
  const isMobile = w < 768;
  const m = isMobile ? 4 : 12;   // margin from edges
  const r = isMobile ? 10 : 22;  // corner radius
  const nW = isMobile ? 30 : 48; // notch diagonal horizontal span
  const left = m;
  const right = w - m;
  const topShallow = m;        // top edge y on the shallow (left) side
  // Deep top-right region wraps the measured nav pill (so the notch tucks just left of it)
  const topDeep = pill ? Math.min(pill.bottom + 12, h * 0.3) : m + 50;
  const topNotch = pill
    ? Math.max(left + r, pill.left - nW - 16)
    : Math.max(left + r, right - 560);
  const botShallow = h - m;    // bottom edge y on the shallow (right) side
  const botDeep = h - m - 34;  // bottom edge y on the deep (left) side
  const botNotch = w * 0.34;   // bottom slope rises toward the left

  return [
    `M ${left + r},${topShallow}`,                       // after top-left corner (left = shallow)
    `L ${topNotch},${topShallow}`,                       // top shallow segment
    `L ${topNotch + nW},${topDeep}`,                     // slope down to the deep right region
    `L ${right - r},${topDeep}`,                         // top deep segment (right, holds the pill)
    `Q ${right},${topDeep} ${right},${topDeep + r}`,     // top-right corner
    `L ${right},${botShallow - r}`,                      // right edge
    `Q ${right},${botShallow} ${right - r},${botShallow}`, // bottom-right corner
    `L ${botNotch + nW},${botShallow}`,                  // bottom shallow segment (right)
    `L ${botNotch},${botDeep}`,                          // slope up to the deep left region
    `L ${left + r},${botDeep}`,                          // bottom deep segment (left)
    `Q ${left},${botDeep} ${left},${botDeep - r}`,       // bottom-left corner
    `L ${left},${topShallow + r}`,                       // left edge
    `Q ${left},${topShallow} ${left + r},${topShallow}`, // top-left corner
    "Z",
  ].join(" ");
}

function LocalTime() {
  const [time, setTime] = useState("--:--");
  // Camera flight altitude — mirrors the WebGL rig's descent (y: 88 → 13)
  const [alt, setAlt] = useState(88);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata",
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      setAlt(Math.round(88 - p * 75));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-3 left-5 z-50 pointer-events-none select-none flex items-end gap-5">
      <div>
        <div className="font-mono text-[7px] tracking-[0.35em] uppercase text-black/35 dark:text-white/35">
          LOCAL TIME
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-black dark:text-white">
          IST {time}
        </div>
      </div>
      <div className="hidden md:block">
        <div className="font-mono text-[7px] tracking-[0.35em] uppercase text-black/35 dark:text-white/35">
          ALTITUDE
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-black dark:text-white">
          <span className="text-[#22c55e]">▾</span> {String(alt).padStart(3, "0")}M
        </div>
      </div>
    </div>
  );
}

function HudFrame() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pill, setPill] = useState<{ left: number; bottom: number } | null>(null);
  const progressRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const measure = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
      const el = document.getElementById("nav-pill-box");
      if (el) {
        const rect = el.getBoundingClientRect();
        setPill({ left: rect.left, bottom: rect.bottom });
      }
    };
    measure();
    // Re-measure once after layout settles (fonts/pill width) and on resize
    const t = setTimeout(measure, 150);
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Scroll progress traced along the frame itself — the green stroke fills
  // the border clockwise from the top-left corner as the journey descends.
  // Driven imperatively (no re-render per scroll frame).
  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      progressRef.current?.setAttribute("stroke-dashoffset", String(1 - p));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [size]);

  if (!size.w || !size.h) return null;

  const frame = buildFramePath(size.w, size.h, pill);
  const maskColor = "#000000";
  const strokeColor = "rgba(255,255,255,0.22)";

  return (
    <svg
      className="fixed inset-0 z-40 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
    >
      {/* Opaque mask — fills the margin OUTSIDE the frame so content can't bleed past it */}
      <path
        d={`M 0,0 H ${size.w} V ${size.h} H 0 Z ${frame}`}
        fill={maskColor}
        fillRule="evenodd"
      />
      {/* Frame stroke */}
      <path
        d={frame}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {/* Scroll progress — green trace filling the frame as you descend */}
      <path
        ref={progressRef}
        d={frame}
        pathLength={1}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        strokeOpacity="0.85"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 4px rgba(34,197,94,0.6))" }}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-slate-200 font-Quicksand selection:bg-green-500/30">

      {/* Living market world — fixed WebGL layer behind everything (dark mode) */}
      <MarketWorld />

      <TopNav />
      <HudFrame />
      <LocalTime />

      {/* Main scroll container */}
      <div
        id="main-scroll"
        className="h-screen overflow-y-auto scroll-smooth bg-white dark:bg-transparent"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px] pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="max-w-full mx-auto px-1 sm:px-2 md:px-2">

            {/* ── Card 1: Hero ── no entrance fade (landing view) */}
            <section
              id="home"
              className="md:min-h-screen pt-4"
            >
              <Hero />
            </section>

            {/* ── Card 2: Experience ── (no scale transform: would break sticky stacking) */}
            <section id="experience" className="px-2 md:px-0">
              <Experience />
            </section>

            {/* ── Card 3: Skills ── */}
            <motion.section
              id="skills"
              className="md:min-h-screen relative"
              {...cardEnter}
            >
              <div className="flex flex-col items-center mb-8 md:mb-10 pt-8">
                <FadeReveal delay={0} className="flex items-center gap-2 border border-black/15 dark:border-white/15 bg-[#ffffff] dark:bg-black/60 px-4 py-1.5 mb-5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-black dark:bg-white"
                  />
                  <RevealChars
                    text="SYSTEM_RUNTIME"
                    className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white"
                    delay={0.1}
                  />
                </FadeReveal>
                <h2
                  className="font-black uppercase leading-none text-center whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "clamp(1.6rem, 6.5vw, 5.5rem)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  <span className="text-black dark:text-white/90">
                    <RevealText text="TECHNICAL" delay={0.18} />
                  </span>{" "}
                  <span
                    className="text-black/70 dark:text-white/85"
                    style={{ WebkitTextStrokeWidth: "1.75px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))" }}
                  >
                    <RevealText text="STACK" delay={0.3} />
                  </span>
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
                  <FadeReveal delay={0.6}>
                    <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                      20 Technologies
                    </span>
                  </FadeReveal>
                  <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
                </div>
              </div>
              <div className="relative mx-auto max-w-5xl">
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

                <Skills />
                <div className="px-2 md:px-0 mt-4">
                  <TerminalSnake />
                </div>
              </div>
            </motion.section>

            {/* ── Card 5: Architecture / Grid ── */}
            <motion.section
              id="architecture"
              className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-black/40 border border-white/[0.05]"
              {...cardEnter}
            >
              <Grid />
            </motion.section>

            {/* ── Card 6: Projects ── */}
            <motion.section
              id="projects"
              className="md:min-h-screen"
              {...cardEnter}
            >
              <RecentProjects />
            </motion.section>

            {/* ── Card 7: Certificates ── */}
            <motion.section
              id="certificates"
              className="md:min-h-screen flex flex-col justify-center"
              {...cardEnter}
            >
              <Certificates />
            </motion.section>

            {/* ── Card 8: Approach ── */}
            <motion.section
              id="approach"
              className="md:min-h-screen flex flex-col justify-center pb-10"
              {...cardEnter}
            >
              <Approach />
            </motion.section>

            {/* ── Card 9: Skills Graph ── */}
            <motion.section
              id="skills-graph"
              className="md:min-h-screen flex flex-col justify-center px-4 md:px-0"
              {...cardEnter}
            >
              <SkillsGraph />
            </motion.section>

            {/* ── Footer (no snap) ── */}
            <Footer />

          </div>
        </div>
      </div>
    </main>
  );
}
