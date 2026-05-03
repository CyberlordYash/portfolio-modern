"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaJava, FaNode } from "react-icons/fa";
import {
  SiApachekafka, SiGo, SiGooglecloud, SiMongodb,
  SiNatsdotio, SiNextdotjs, SiPostgresql, SiSpringboot,
  SiTailwindcss, SiTypescript,
} from "react-icons/si";
import { PiFileCppFill } from "react-icons/pi";
import { InfiniteMovingCards } from "./ui/infiniteMovingCards";
import { testimonials } from "@/data";

/* ── Tech registry with brand colors ── */
const techData: Record<string, {
  icon: React.ElementType;
  name: string;
  color: string;
}> = {
  go:       { icon: SiGo,          name: "GOLANG",      color: "#00ADD8" },
  cpp:      { icon: PiFileCppFill, name: "C++",         color: "#659BD3" },
  node:     { icon: FaNode,        name: "NODE.JS",     color: "#5FA04E" },
  java:     { icon: FaJava,        name: "JAVA",        color: "#ED8B00" },
  spring:   { icon: SiSpringboot,  name: "SPRING BOOT", color: "#77BC1F" },
  gcp:      { icon: SiGooglecloud, name: "GCP",         color: "#4285F4" },
  kafka:    { icon: SiApachekafka, name: "KAFKA",       color: "#A855F7" },
  nats:     { icon: SiNatsdotio,   name: "NATS",        color: "#34A0DC" },
  pg:       { icon: SiPostgresql,  name: "POSTGRESQL",  color: "#4169E1" },
  mongo:    { icon: SiMongodb,     name: "MONGODB",     color: "#47A248" },
  next:     { icon: SiNextdotjs,   name: "NEXT.JS",     color: "#999999" },
  react:    { icon: FaReact,       name: "REACT",       color: "#61DAFB" },
  ts:       { icon: SiTypescript,  name: "TYPESCRIPT",  color: "#3178C6" },
  tailwind: { icon: SiTailwindcss, name: "TAILWIND",    color: "#06B6D4" },
};

const categoryRows = [
  {
    index: "01",
    label: "BACKEND",
    color: "#3B82F6",
    techs: ["cpp", "node", "java", "spring"],
  },
  {
    index: "02",
    label: "INFRASTRUCTURE",
    color: "#A855F7",
    techs: ["gcp", "kafka", "nats", "pg", "mongo"],
  },
  {
    index: "03",
    label: "FRONTEND",
    color: "#06B6D4",
    techs: ["next", "react", "ts", "tailwind"],
  },
];

/* ── Single tech card ── */
const TechCard = ({ techKey, delay = 0 }: { techKey: string; delay?: number }) => {
  const tech = techData[techKey];
  const Icon = tech.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="relative group flex flex-col gap-3 p-5 bg-[#ffffff] dark:bg-[#111111] cursor-default overflow-hidden"
      style={{ borderTop: `2px solid ${tech.color}` }}
    >
      {/* hover bg glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${tech.color}18, transparent 70%)` }}
      />

      {/* LED corner dot */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5"
        style={{ backgroundColor: tech.color, boxShadow: `0 0 6px ${tech.color}` }}
      />

      {/* Icon */}
      <div className="text-[38px] leading-none relative z-10" style={{ color: tech.color }}>
        <Icon />
      </div>

      {/* Name */}
      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-black dark:text-white font-bold relative z-10">
        {tech.name}
      </span>
    </motion.div>
  );
};

/* ── Main section ── */
const Skills = () => (
  <div
    id="skills"
    className="relative w-full bg-[#ffffff] dark:bg-[#090909] border border-black/[0.12] dark:border-white/[0.12] overflow-hidden"
  >
    {/* HEADER BAR */}
    <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3 md:gap-5">
        <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-black/50 dark:text-white/50">SYS.REGISTRY</span>
        <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
        <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black dark:text-white">
          TECHNICAL_STACK
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-end gap-[2px] h-3">
          {[0.4, 0.6, 0.8, 1].map((h, i) => (
            <div key={i} className="w-[3px] bg-black dark:bg-white rounded-sm"
              style={{ height: `${h * 100}%`, opacity: 0.35 + i * 0.15 }} />
          ))}
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50">14 ENTRIES</span>
      </div>
    </div>

    {/* FEATURED: GOLANG */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden border-b border-black/10 dark:border-white/10"
      style={{ borderTop: "3px solid #00ADD8" }}
    >
      {/* ambient bg */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.08] via-teal-500/[0.04] to-transparent pointer-events-none" />
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-cyan-400/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-teal-400/[0.05] blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 p-7 md:p-9">
        {/* icon + name */}
        <div className="flex items-center gap-5 shrink-0">
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 8px #00ADD870)",
                "drop-shadow(0 0 22px #00ADD8B0)",
                "drop-shadow(0 0 8px #00ADD870)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[76px] md:text-[96px] leading-none"
            style={{ color: "#00ADD8" }}
          >
            <SiGo />
          </motion.div>
          <div>
            <div className="font-mono text-[7px] uppercase tracking-[0.45em] text-cyan-500/70 dark:text-cyan-400/60 mb-2">
              PRIMARY RUNTIME
            </div>
            <h3
              className="font-black uppercase leading-none text-black dark:text-white"
              style={{
                fontFamily: "var(--font-orbitron)",
                fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              GOLANG
            </h3>
            <p className="font-mono text-[9px] text-black/40 dark:text-white/35 mt-2 uppercase tracking-[0.15em]">
              High-Throughput · Distributed · HFT Grade
            </p>
          </div>
        </div>

        {/* divider */}
        <div className="hidden lg:block h-20 w-px bg-black/10 dark:bg-white/10 shrink-0" />

        {/* description */}
        <p className="font-mono text-[10px] leading-relaxed text-black/55 dark:text-white/45 max-w-sm">
          My primary tool for production systems — trading engines, real-time data pipelines,
          and distributed micro-services. Chosen for its goroutine model, zero-cost abstractions,
          and predictable latency under load.
        </p>

        {/* stats */}
        <div className="lg:ml-auto flex items-stretch gap-px bg-black/[0.09] dark:bg-white/[0.09] shrink-0">
          {[
            { v: "50K+", l: "MSG/SEC" },
            { v: "<1ms",  l: "LATENCY" },
            { v: "HFT",   l: "GRADE"   },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center justify-center px-5 py-4 bg-[#ffffff] dark:bg-[#111111] min-w-[80px]">
              <div
                className="font-black leading-none mb-0.5"
                style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.2rem", color: "#00ADD8" }}
              >{v}</div>
              <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-black/40 dark:text-white/30">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* CATEGORY ROWS */}
    <div className="flex flex-col gap-px bg-black/[0.09] dark:bg-white/[0.09]">
      {categoryRows.map((row, ri) => (
        <div
          key={row.index}
          className="flex flex-col lg:flex-row gap-px bg-black/[0.09] dark:bg-white/[0.09]"
        >
          {/* Category label */}
          <div
            className="relative overflow-hidden bg-[#ffffff] dark:bg-[#111111] p-5 lg:p-6 flex lg:flex-col justify-between items-start gap-4 lg:gap-0"
            style={{ minWidth: 170, borderLeft: `3px solid ${row.color}` }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${row.color}12, transparent 60%)` }}
            />
            <div className="relative z-10">
              <div
                className="font-mono text-[7px] uppercase tracking-[0.4em] mb-1.5"
                style={{ color: row.color }}
              >
                {row.index}. CATEGORY
              </div>
              <div
                className="font-black uppercase leading-tight text-black dark:text-white"
                style={{
                  fontFamily: "var(--font-orbitron)",
                  fontSize: "clamp(0.8rem, 1.4vw, 1.05rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                {row.label}
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-1.5 lg:mt-auto">
              <div className="w-1.5 h-1.5" style={{ backgroundColor: row.color, boxShadow: `0 0 4px ${row.color}` }} />
              <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-black/40 dark:text-white/30">
                {row.techs.length} TOOLS
              </span>
            </div>
          </div>

          {/* Tech cards */}
          <div
            className="flex-1 grid gap-px bg-black/[0.09] dark:bg-white/[0.09]"
            style={{ gridTemplateColumns: `repeat(${row.techs.length}, minmax(0, 1fr))` }}
          >
            {row.techs.map((techKey, ti) => (
              <TechCard key={techKey} techKey={techKey} delay={ri * 0.06 + ti * 0.05} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* ALSO WORKING WITH — horizontal colored pill row */}
    <div className="border-t border-black/10 dark:border-white/10 px-5 md:px-7 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-black/35 dark:text-white/30 shrink-0">
        ALSO WORKING WITH →
      </span>
      {[
        { label: "DOCKER",     color: "#2496ED" },
        { label: "KUBERNETES", color: "#326CE5" },
        { label: "REDIS",      color: "#DC382D" },
        { label: "GRPC",       color: "#244C5A" },
        { label: "PROMETHEUS", color: "#E6522C" },
        { label: "GRAFANA",    color: "#F46800" },
        { label: "LINUX",      color: "#FCC624" },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="w-1 h-1" style={{ backgroundColor: color }} />
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-black/55 dark:text-white/45">{label}</span>
        </div>
      ))}
    </div>

    {/* TICKER */}
    <div className="relative border-t border-black/10 dark:border-white/10 overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 z-10 bg-gradient-to-r from-[#ffffff] to-transparent dark:from-[#090909]" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-10 bg-gradient-to-l from-[#ffffff] to-transparent dark:from-[#090909]" />
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>

    {/* FOOTER BAR */}
    <div className="flex items-center justify-between px-5 md:px-7 py-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping bg-black/40 dark:bg-white/40" />
          <span className="relative inline-flex h-1.5 w-1.5 bg-black dark:bg-white" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/65 dark:text-white/65">RUNTIME ACTIVE</span>
      </div>
      <div className="hidden md:flex items-end gap-[2px] h-4">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-black dark:bg-white rounded-sm"
            animate={{ height: ["3px", `${6 + Math.sin(i) * 5}px`, "3px"] }}
            transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">14 LOADED</span>
    </div>
  </div>
);

export default Skills;
