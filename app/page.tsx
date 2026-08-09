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

// `short` is only for the mobile bar, where each cell is ~1/5 of the screen —
// "Experience" doesn't fit at any legible size, the rest do.
const links = [
  { n: "01", label: "Home",       short: "Home",     href: "#home"       },
  { n: "02", label: "Experience", short: "Work",     href: "#experience" },
  { n: "03", label: "About",      short: "About",    href: "#skills"     },
  { n: "04", label: "Projects",   short: "Projects", href: "#projects"   },
  { n: "05", label: "Contact",    short: "Contact",  href: "#contact"    },
];

// Mobile nav sits on the bottom edge. If this changes, update the matching
// `pb-[calc(56px+…)]` on the scroll content below so the footer still clears it.
const MOBILE_NAV_H = 56;

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

    // Track the section crossing the viewport's vertical center — works for
    // sections taller than the screen (threshold-based detection never fires
    // for those, since 30% of a 3-screen section is never visible at once).
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { root, threshold: 0, rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.href.replace("#", ""));
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Desktop: floating top-right rail ──
          No plate behind the links — the nav sits directly on the black
          ground. The old radial wash existed to blend a navy tint that no
          longer exists, and any fill here just reads as a floating grey box. */}
      <nav className="hidden md:block fixed top-2 right-3 xl:top-3 xl:right-8 z-50">
        <div
          id="nav-pill-box"
          className="relative flex items-center gap-0.5 px-1.5 py-1"
        >
          {links.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                onClick={go(id)}
                className={cn(
                  "relative grid min-h-[40px] place-items-center px-3 lg:px-3.5 font-mono uppercase text-[10px] lg:text-[10.5px] tracking-[0.16em] transition-colors duration-200 whitespace-nowrap",
                  isActive ? "text-white" : "text-white/40 hover:text-white/85",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-desktop"
                    className="absolute inset-x-2.5 bottom-1 h-px bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ── Mobile: bottom bar ──
          The top-right rail collided with the Hero's own header strip and was
          out of thumb reach, so two of the five sections were simply dropped
          from it. Down here all five fit, nothing overlaps, and the targets
          are full-height rather than 10px of text. */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.14] bg-black/90 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5" style={{ height: MOBILE_NAV_H }}>
          {links.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                onClick={go(id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                  isActive ? "text-white" : "text-white/40",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-mobile"
                    className="absolute inset-x-3 top-0 h-px bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="font-mono text-[7px] tracking-[0.22em] text-current opacity-45">
                  {link.n}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] whitespace-nowrap">
                  {link.short}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* Parametric border frame — computed in real pixels so corners stay perfectly
   round (no aspect distortion). Notch on the top-right (near nav) and bottom-left.
   Desktop only: below md the frame's deep top-right region ate ~68px of a phone
   screen to wrap a nav that no longer lives there. */
function buildFramePath(
  w: number,
  h: number,
  pill: { left: number; bottom: number } | null,
) {
  const m = 12;   // margin from edges
  const r = 22;   // corner radius
  const nW = 48;  // notch diagonal horizontal span
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
    // Hidden on mobile — it sat exactly where the bottom nav now lives, and
    // the frame notch that used to carve room for it is desktop-only too.
    <div className="hidden md:flex fixed bottom-3 left-5 z-50 pointer-events-none select-none items-end gap-5">
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
          <span className="text-[#91919A]">▾</span> {String(alt).padStart(3, "0")}M
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

  // Desktop-only chrome (see buildFramePath).
  if (!size.w || !size.h || size.w < 768) return null;

  const frame = buildFramePath(size.w, size.h, pill);
  const maskColor = "#000000";
  const strokeColor = "rgba(255,255,255,0.26)";

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
        stroke="#91919A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        strokeOpacity="0.85"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))" }}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-slate-200 font-Quicksand selection:bg-blue-500/30">

      {/* Living market world — fixed WebGL layer behind everything (dark mode) */}
      <MarketWorld />

      {/* The three navy aurora blobs that sat here are gone. On a black ground
          they were near-invisible yet each forced a full-viewport 150px blur
          composite every frame — cost with no image. Depth now comes from the
          WebGL layer and the surface steps instead. */}

      <TopNav />
      <HudFrame />
      <LocalTime />

      {/* Main scroll container.
          dvh, not vh: on mobile browsers 100vh is the *expanded* viewport, so
          with the URL bar showing the last ~60px of every screen was cut off.
          overflow-x-hidden stops any wide child from producing a sideways pan. */}
      <div
        id="main-scroll"
        className="h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth bg-white dark:bg-transparent"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#9ea5e40c_1px,transparent_1px),linear-gradient(to_bottom,#9ea5e40c_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px] pointer-events-none" />

        <div className="relative z-10 w-full">
          {/* Bottom padding clears the mobile nav bar; desktop keeps none. */}
          <div className="max-w-full mx-auto px-2 sm:px-3 md:px-2 pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">

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
                <FadeReveal delay={0} className="hud-corners relative flex items-center gap-2 border border-black/15 dark:border-[#91919A]/30 bg-[#ffffff] dark:bg-[#08080A]/70 dark:shadow-[0_0_20px_rgba(255,255,255,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] px-4 py-1.5 mb-5 backdrop-blur-sm">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-black dark:bg-[#D8D8DC] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]"
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
                  <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-gradient-to-r dark:from-transparent dark:to-[#91919A]/60" />
                  <FadeReveal delay={0.6}>
                    <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-[#D8D8DC]/70">
                      19 Tools · 6 Domains
                    </span>
                  </FadeReveal>
                  <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-gradient-to-l dark:from-transparent dark:to-[#91919A]/60" />
                </div>
              </div>
              <div className="relative mx-auto max-w-5xl">
                {/* Side rails — frame the centered module, let the living background breathe */}
                <div className="pointer-events-none absolute inset-y-0 -left-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
                  <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-[#91919A]/50" />
                  <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-[#91919A]/30" />
                  <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-[#91919A]/50" />
                </div>
                <div className="pointer-events-none absolute inset-y-0 -right-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
                  <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-[#91919A]/50" />
                  <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-[#91919A]/30" />
                  <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-[#91919A]/50" />
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
              className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-gradient-to-b from-[#0B0B0E]/60 to-black/50 border border-[#91919A]/15 shadow-[0_0_60px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]"
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
