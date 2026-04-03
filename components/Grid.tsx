"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
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

/** Generic animated bento cell */
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
    whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
    viewport={{ once: true, margin: "-40px" }}
    className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.07] transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 ${className}`}
  >
    {children}
  </motion.div>
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
      className="w-full py-16 md:py-24 bg-white dark:bg-[#020617]"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-[3px] w-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Who I Am
            </span>
          </div>
          <h2 className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-4xl font-bold tracking-tighter text-transparent dark:from-white dark:via-slate-200 dark:to-slate-500 md:text-6xl">
            About Me
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {/* ── Card 1: Bio — hero card ── */}
          <Cell
            delay={0.05}
            className="min-h-[320px] bg-gradient-to-br from-indigo-500/10 via-purple-500/[0.06] to-transparent dark:from-indigo-500/[0.13] dark:via-purple-500/[0.07] dark:to-transparent md:col-span-4 md:row-span-2"
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-violet-500/10 blur-[60px]" />
            {/* Subtle dot grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

            <div className="relative z-10 flex h-full flex-col p-7 md:p-9">
              {/* Status */}
              <div className="mb-6 flex items-center gap-2 self-start rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Open to senior backend roles
                </span>
              </div>

              {/* Name */}
              <h3 className="mb-1 text-3xl font-extrabold tracking-tight md:text-4xl">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400">
                  Hey, I'm Yash
                </span>
              </h3>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                Systems Engineer · Backend Architect · HFT Specialist
              </p>

              {/* Bio */}
              <p className="mb-6 max-w-lg text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 md:text-[15px]">
                I build software that handles serious scale — trading engines,
                distributed pipelines, real-time infrastructure. I care deeply
                about{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  performance
                </span>
                ,{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  correctness
                </span>
                , and clean architecture. When I'm not profiling Go binaries,
                I'm in the gym or grinding algorithms.
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 font-mono text-[10px] text-slate-600 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400"
                  >
                    {icon}
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Cell>

          {/* ── Card 2: Stats ── */}
          <Cell
            delay={0.1}
            className="bg-gradient-to-br from-violet-500/10 via-fuchsia-500/[0.04] to-transparent dark:from-violet-500/[0.11] dark:via-fuchsia-500/[0.05] dark:to-transparent md:col-span-2"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-fuchsia-500/5 to-transparent" />

            <div className="relative z-10 flex h-full items-center justify-around p-6">
              {[
                { value: "1+", label: "Yrs Exp" },
                { value: "50K+", label: "msg/sec" },
                { value: "800+", label: "Problems" },
              ].map(({ value, label }, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="bg-gradient-to-b from-indigo-500 to-violet-500 bg-clip-text text-2xl font-extrabold tabular-nums text-transparent md:text-3xl">
                      {value}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-500">
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-white/10" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Cell>

          {/* ── Card 3: Currently Building ── */}
          <Cell
            delay={0.15}
            className="bg-gradient-to-br from-blue-500/8 via-cyan-500/[0.04] to-transparent dark:from-blue-500/[0.1] dark:via-cyan-500/[0.04] dark:to-transparent md:col-span-2"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 rounded-full bg-blue-500/10 blur-[30px]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-blue-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-500/80">
                  Currently Building
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-snug text-slate-800 dark:text-slate-200">
                  High-performance order execution &amp; trading infrastructure
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                  @ Zanskar Securities
                </p>
              </div>
            </div>
          </Cell>

          {/* ── Card 4: Education ── */}
          <Cell
            delay={0.2}
            className="bg-gradient-to-br from-emerald-500/8 via-teal-500/[0.04] to-transparent dark:from-emerald-500/[0.1] dark:via-teal-500/[0.04] dark:to-transparent md:col-span-2"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rounded-full bg-emerald-500/10 blur-[30px]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <GraduationCap size={13} className="text-emerald-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/80">
                  Education
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                  B.Tech Computer Science and Engineering
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600 dark:text-slate-400">
                  IIIT Sonepat, Haryana
                </p>
              </div>
            </div>
          </Cell>

          {/* ── Card 5: Philosophy ── */}
          <Cell
            delay={0.25}
            className="bg-gradient-to-br from-amber-500/8 via-orange-500/[0.04] to-transparent dark:from-amber-500/[0.1] dark:via-orange-500/[0.04] dark:to-transparent md:col-span-2"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            {/* Big quote mark */}
            <div className="pointer-events-none absolute -bottom-3 right-4 font-serif text-8xl font-bold leading-none text-amber-500/10 select-none">
              "
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-amber-500" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70">
                  Philosophy
                </span>
              </div>
              <p className="text-[13px] font-medium italic leading-relaxed text-slate-700 dark:text-slate-300">
                "Performance is a feature, not an afterthought. Great software
                is invisible; it just works."
              </p>
            </div>
          </Cell>

          {/* ── Card 6: Beyond Code ── */}
          <Cell
            delay={0.3}
            className="bg-gradient-to-br from-red-500/8 via-rose-500/[0.04] to-transparent dark:from-red-500/[0.1] dark:via-rose-500/[0.04] dark:to-transparent md:col-span-2"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-red-500/8 blur-[30px]" />

            <div className="relative z-10 flex h-full flex-col gap-4 p-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-500/70">
                  Beyond Code
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    icon: <Dumbbell size={12} className="text-red-400" />,
                    label: "Daily gym & nutrition tracking",
                  },
                  {
                    icon: <Trophy size={12} className="text-amber-400" />,
                    label: "Competitive programming",
                  },
                  {
                    icon: (
                      <BrainCircuit size={12} className="text-violet-400" />
                    ),
                    label: "Systems design deep dives",
                  },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400"
                  >
                    {icon}
                    <span className="text-[12px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Cell>

          {/* ── Card 7: Contact CTA — full width ── */}
          <Cell
            delay={0.35}
            className="min-h-[140px] bg-gradient-to-br from-indigo-600/10 via-violet-500/8 to-purple-500/10 dark:from-indigo-500/[0.14] dark:via-violet-500/[0.09] dark:to-purple-500/[0.12] md:col-span-6"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-64 rounded-full bg-indigo-500/8 blur-[60px]" />
            {/* Dot grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[length:20px_20px]" />

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
                <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-indigo-500/70 dark:text-indigo-400/60">
                  Let's Collaborate
                </p>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">
                  Want to build something{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                    impactful
                  </span>
                  ?
                </h3>
                <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  yashsachan321@gmail.com
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-indigo-500/40 active:scale-[0.98]"
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
