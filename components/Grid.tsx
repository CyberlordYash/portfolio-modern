"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import { RevealText, RevealChars, DrawLine, FadeReveal } from "@/components/ui/ScrollReveal";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import animationData from "@/data/confetti.json";
import {
  MapPin,
  GraduationCap,
  Dumbbell,
  Code2,
  Cpu,
  Mail,
  CheckCheck,
  Zap,
  BrainCircuit,
  Trophy,
  Sparkles,
  GitBranch,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

function useCountUp(target: number, duration = 1400, trigger: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.floor(t * target));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [trigger, target, duration]);
  return value;
}

const Cross = ({ className = "" }: { className?: string }) => (
  <svg
    className={`w-3 h-3 ${className}`}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <line x1="6" y1="0" x2="6" y2="12" />
    <line x1="0" y1="6" x2="12" y2="6" />
  </svg>
);

const Cell = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    className={`group relative overflow-hidden bg-[#ffffff] dark:bg-[#111111] ${className}`}
  >
    {children}
  </motion.div>
);

const StatItem = ({ target, suffix, label }: { target: number; suffix: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCountUp(target, 1400, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1 text-center"
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span
        className="text-2xl font-black tabular-nums md:text-3xl"
        style={{ fontFamily: "var(--font-orbitron)", color: "#a78bfa" }}
      >
        {triggered ? `${count}${suffix}` : `0${suffix}`}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-widest text-black/40 dark:text-white/35">
        {label}
      </span>
    </motion.div>
  );
};

const StatsCard = () => (
  <div className="relative z-10 flex h-full items-center justify-around p-6 pt-10">
    {[
      { target: 1, suffix: "+", label: "Yrs Exp" },
      { target: 50, suffix: "K+", label: "msg/sec" },
      { target: 800, suffix: "+", label: "Problems" },
    ].map(({ target, suffix, label }, i) => (
      <React.Fragment key={label}>
        <StatItem target={target} suffix={suffix} label={label} />
        {i < 2 && <div className="h-8 w-px bg-black/10 dark:bg-white/10" />}
      </React.Fragment>
    ))}
  </div>
);

const Grid = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("yashsachan321@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="about"
      className="w-full py-16 md:py-24 bg-[#ffffff] dark:bg-transparent transition-colors duration-500"
    >
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">

        {/* Side rails — thin accent guides that frame the centered module and
            let the living background breathe on either flank */}
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

        {/* Section header */}
        <div className="flex flex-col items-center mb-12">
          <FadeReveal delay={0} className="flex items-center gap-2 border border-black/15 dark:border-white/15 bg-[#ffffff] dark:bg-black/60 px-4 py-1.5 mb-5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-black dark:bg-white"
            />
            <RevealChars
              text="UNIT_YS // BIO_MODULE"
              className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white"
              delay={0.1}
            />
          </FadeReveal>
          <h2
            className="font-black uppercase leading-none text-center whitespace-nowrap"
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(2.2rem, 9vw, 5.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            <span className="text-black dark:text-white/90">
              <RevealText text="ABOUT" delay={0.2} />
            </span>{" "}
            <span
              className="text-black/70 dark:text-white/85"
              style={{ WebkitTextStrokeWidth: "1.75px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))" }}
            >
              <RevealText text="ME" delay={0.32} />
            </span>
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
            <FadeReveal delay={0.6}>
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                System Profile
              </span>
            </FadeReveal>
            <DrawLine delay={0.55} className="h-px w-12 bg-black/20 dark:bg-white/20" />
          </div>
        </div>

        {/* Bento grid — gap-px hairline separators */}
        <div className="grid auto-rows-[minmax(118px,auto)] grid-cols-1 gap-px md:grid-cols-6 bg-black/[0.09] dark:bg-white/[0.09]">

          {/* ── Card 1: Bio ── */}
          <Cell delay={0.05} className="min-h-[268px] md:col-span-4 md:row-span-2">
            {/* Cyan top strip */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400 z-10" />
            {/* Corner crosses */}
            <Cross className="absolute top-3 right-3 text-black/15 dark:text-white/15" />
            <Cross className="absolute bottom-3 right-3 text-black/15 dark:text-white/15" />
            <GlowingEffect spread={40} proximity={80} disabled={false} borderWidth={1} />

            <div className="relative z-10 flex h-full flex-col p-7 md:p-9">
              {/* Module label */}
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-cyan-500 dark:text-cyan-400 mb-4">
                BIO // CORE_IDENTITY
              </span>

              {/* Status */}
              <div className="mb-5 flex items-center gap-2 self-start border border-emerald-500/25 bg-emerald-500/[0.07] dark:bg-emerald-500/[0.05] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse bg-emerald-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Open to senior backend roles
                </span>
              </div>

              {/* Name */}
              <h3
                className="mb-1 font-black uppercase leading-none text-black dark:text-white"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Hey, I&apos;m Yash
              </h3>
              <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.22em] text-black/40 dark:text-white/35">
                Backend Developer · Distributed Systems · HFT Specialist
              </p>

              {/* Bio */}
              <p className="mb-6 max-w-lg text-[13px] leading-relaxed text-black/60 dark:text-white/50 md:text-[14px]">
                I build software that handles serious scale — trading engines,
                distributed pipelines, real-time infrastructure. I care deeply
                about{" "}
                <span className="font-semibold text-black dark:text-white">
                  performance
                </span>
                ,{" "}
                <span className="font-semibold text-black dark:text-white">
                  correctness
                </span>
                , and clean architecture. When I&apos;m not profiling Go
                binaries, I&apos;m in the gym or grinding algorithms.
              </p>

              {/* Tags */}
              <div className="mt-auto flex flex-wrap gap-2">
                {[
                  { icon: <MapPin size={11} />, label: "India" },
                  { icon: <GraduationCap size={11} />, label: "IIIT Sonepat" },
                  { icon: <Cpu size={11} />, label: "HFT Systems" },
                  { icon: <Code2 size={11} />, label: "Go · Distributed" },
                  { icon: <GitBranch size={11} />, label: "Open Source" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 border border-black/10 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-black/60 dark:text-white/40"
                  >
                    {icon}
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Cell>

          {/* ── Card 2: Stats ── */}
          <Cell delay={0.1} className="md:col-span-2">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-violet-400 z-10" />
            <span className="absolute top-3 left-3 font-mono text-[8px] uppercase tracking-[0.4em] text-violet-500 dark:text-violet-400">
              METRICS
            </span>
            <GlowingEffect spread={30} proximity={60} disabled={false} borderWidth={1} />

            <StatsCard />
          </Cell>

          {/* ── Card 3: Currently Building ── */}
          <Cell delay={0.15} className="md:col-span-2">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400 z-10" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-cyan-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/80">
                  Currently Building
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-snug text-black dark:text-white">
                  High-performance order execution &amp; trading infrastructure
                </p>
                <p className="mt-1 font-mono text-[10px] text-black/40 dark:text-white/30">
                  @ Zanskar Securities
                </p>
              </div>
            </div>
          </Cell>

          {/* ── Card 4: Education ── */}
          <Cell delay={0.2} className="md:col-span-2">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-emerald-400 z-10" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <GraduationCap size={13} className="text-emerald-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/80">
                  Education // DEGREE
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-black dark:text-white">
                  B.Tech Computer Science and Engineering
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-black/50 dark:text-white/40">
                  IIIT Sonepat, Haryana
                </p>
              </div>
            </div>
          </Cell>

          {/* ── Card 5: Philosophy ── */}
          <Cell delay={0.25} className="md:col-span-2">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-amber-400 z-10" />
            <Cross className="absolute bottom-3 right-3 text-black/15 dark:text-white/15" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-amber-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500/80">
                  CORE_PHILOSOPHY
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-black/60 dark:text-white/50 italic">
                {`"Performance is a feature, not an afterthought. Great software is invisible — it just works."`}
              </p>
            </div>
          </Cell>

          {/* ── Card 6: Beyond Code ── */}
          <Cell delay={0.3} className="md:col-span-2">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-rose-400 z-10" />

            <div className="relative z-10 flex h-full flex-col gap-4 p-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-rose-500/70">
                BEYOND_CODE
              </span>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    icon: <Dumbbell size={12} className="text-rose-400" />,
                    label: "Daily gym & nutrition tracking",
                  },
                  {
                    icon: <Trophy size={12} className="text-amber-400" />,
                    label: "Competitive programming",
                  },
                  {
                    icon: <BrainCircuit size={12} className="text-violet-400" />,
                    label: "Systems design deep dives",
                  },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 text-black/60 dark:text-white/50"
                  >
                    {icon}
                    <span className="font-mono text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Cell>

          {/* ── Card 7: Contact CTA — full width ── */}
          <Cell delay={0.35} className="min-h-[140px] md:col-span-6">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 z-10" />
            <Cross className="absolute top-3 left-3 text-black/15 dark:text-white/15" />
            <Cross className="absolute top-3 right-3 text-black/15 dark:text-white/15" />
            <Cross className="absolute bottom-3 left-3 text-black/15 dark:text-white/15" />
            <Cross className="absolute bottom-3 right-3 text-black/15 dark:text-white/15" />

            {/* Confetti */}
            {copied && (
              <div className="absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-1/2">
                <Lottie
                  options={{ loop: false, autoplay: true, animationData }}
                  height={160}
                  width={280}
                />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 px-8 py-9 text-center md:flex-row md:text-left">
              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.4em] text-black/35 dark:text-white/30">
                  COLLAB_REQUEST // OPEN
                </p>
                <h3
                  className="font-black uppercase leading-none text-black dark:text-white mb-2"
                  style={{
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Want to build something impactful?
                </h3>
                <p className="font-mono text-[10px] text-black/40 dark:text-white/30">
                  yashsachan321@gmail.com
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-2.5 border border-black dark:border-white
                  bg-black dark:bg-white text-white dark:text-black
                  px-7 py-3.5 font-mono text-[10px] font-bold uppercase tracking-widest
                  hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white
                  transition-all duration-200 active:scale-[0.98]"
              >
                {copied ? <CheckCheck size={14} /> : <Mail size={14} />}
                {copied ? "Email Copied!" : "Copy Email"}
              </button>
            </div>
          </Cell>
        </div>
      </div>
    </section>
  );
};

export default Grid;
