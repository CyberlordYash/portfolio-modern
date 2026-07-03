"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaJava, FaNode } from "react-icons/fa";
import {
  SiApachekafka, SiGo, SiGooglecloud, SiMongodb, SiNatsdotio,
  SiNextdotjs, SiPostgresql, SiSpringboot, SiTailwindcss, SiTypescript,
  SiPython, SiRedis, SiDocker, SiKubernetes, SiPrometheus, SiGrafana,
} from "react-icons/si";
import { PiFileCppFill } from "react-icons/pi";

/* ───────────────────────── DATA ─────────────────────────
   No proficiency percentages or invented stats — just an honest,
   organized manifest of the tools I actually work with. */

type Tech = { icon: React.ElementType; name: string; color: string; note: string };
type Domain = { id: string; label: string; color: string; techs: Tech[] };

const DOMAINS: Domain[] = [
  {
    id: "lang", label: "LANGUAGES", color: "#3B82F6",
    techs: [
      { icon: SiGo,          name: "Go",         color: "#00ADD8", note: "Primary language — trading systems, services" },
      { icon: PiFileCppFill, name: "C++",        color: "#659AD2", note: "Low-latency paths, competitive programming" },
      { icon: SiTypescript,  name: "TypeScript", color: "#3178C6", note: "Full-stack type safety" },
      { icon: FaJava,        name: "Java",       color: "#E76F00", note: "Enterprise services, Spring ecosystem" },
      { icon: SiPython,      name: "Python",     color: "#3776AB", note: "Tooling, automation, data scripts" },
    ],
  },
  {
    id: "infra", label: "INFRA & OBSERVABILITY", color: "#F59E0B",
    techs: [
      { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4", note: "Cloud-native deployments" },
      { icon: SiDocker,      name: "Docker",       color: "#2496ED", note: "Containerized builds & runtimes" },
      { icon: SiKubernetes,  name: "Kubernetes",   color: "#326CE5", note: "Service orchestration" },
      { icon: SiPrometheus,  name: "Prometheus",   color: "#E6522C", note: "Metrics & alerting" },
      { icon: SiGrafana,     name: "Grafana",      color: "#F46800", note: "Dashboards & visualization" },
    ],
  },
  {
    id: "be", label: "BACKEND", color: "#60A5FA",
    techs: [
      { icon: FaNode,        name: "Node.js",     color: "#5FA04E", note: "Real-time APIs & services" },
      { icon: SiSpringboot,  name: "Spring Boot", color: "#6DB33F", note: "JVM microservices" },
    ],
  },
  {
    id: "data", label: "DATA & STORAGE", color: "#A855F7",
    techs: [
      { icon: SiPostgresql,  name: "PostgreSQL", color: "#4169E1", note: "Relational modelling, query tuning" },
      { icon: SiMongodb,     name: "MongoDB",    color: "#47A248", note: "Document stores" },
      { icon: SiRedis,       name: "Redis",      color: "#FF4438", note: "Caching, pub/sub" },
    ],
  },
  {
    id: "msg", label: "MESSAGING & STREAMING", color: "#EC4899",
    techs: [
      { icon: SiApachekafka, name: "Kafka", color: "#9D5BD2", note: "Event streaming backbones" },
      { icon: SiNatsdotio,   name: "NATS",  color: "#27AAE1", note: "JetStream messaging" },
    ],
  },
  {
    id: "fe", label: "FRONTEND", color: "#06B6D4",
    techs: [
      { icon: FaReact,       name: "React",        color: "#61DAFB", note: "Component-driven UIs" },
      { icon: SiNextdotjs,   name: "Next.js",      color: "#9AA0A6", note: "App Router, RSC, this site" },
      { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4", note: "Design systems" },
    ],
  },
];

const TECH_COUNT = DOMAINS.reduce((n, d) => n + d.techs.length, 0);

/* Core stack — the two tools daily work actually revolves around. */
const CORE = [
  {
    icon: SiGo, name: "Go", color: "#00ADD8", label: "PRIMARY LANGUAGE",
    desc: "What I build production systems in — trading engines, real-time pipelines, distributed services. Chosen for its concurrency model and predictable latency under load.",
  },
  {
    icon: PiFileCppFill, name: "C++", color: "#659AD2", label: "SYSTEMS LANGUAGE",
    desc: "For the performance-critical paths — order books, memory-tight engines — and the language behind my competitive programming. Raw control, zero-cost abstractions.",
  },
];

/* ───────────────────────── CORE STRIP ───────────────────────── */

const CoreCard = ({ c, i }: { c: (typeof CORE)[number]; i: number }) => {
  const Icon = c.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex-1 overflow-hidden p-5 md:p-6"
      style={{ borderTop: `2px solid ${c.color}` }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${c.color}10, transparent 55%)` }}
      />
      <div className="relative z-10 flex items-start gap-5 md:gap-6">
        <Icon
          className="shrink-0 text-[64px] md:text-[84px] leading-none transition-transform duration-300 group-hover:scale-105"
          style={{ color: c.color, filter: `drop-shadow(0 0 14px ${c.color}50)` }}
        />
        <div className="min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3
              className="font-black uppercase leading-none text-black dark:text-white"
              style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.8rem, 3.2vw, 2.7rem)", letterSpacing: "-0.02em" }}
            >
              {c.name}
            </h3>
            <span
              className="font-mono text-[9px] uppercase tracking-[0.35em] px-2.5 py-1.5 border"
              style={{ color: c.color, borderColor: `${c.color}50`, backgroundColor: `${c.color}0d` }}
            >
              {c.label}
            </span>
          </div>
          <p className="font-mono text-[12px] leading-relaxed text-black/55 dark:text-white/50 mt-3 max-w-xl">
            {c.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ───────────────────────── DOMAIN PANEL ───────────────────────── */

const TechRow = ({ t }: { t: Tech }) => {
  const Icon = t.icon;
  return (
    <div className="group/row relative flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-white/[0.03]">
      {/* accent tick on hover */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] transition-all duration-200 group-hover/row:h-3/5"
        style={{ backgroundColor: t.color }}
      />
      <span
        className="grid h-12 w-12 shrink-0 place-items-center border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] transition-colors duration-200"
        style={{ color: t.color }}
      >
        <Icon className="text-[24px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[14px] font-bold tracking-[0.06em] text-black/85 dark:text-white/85 group-hover/row:text-black dark:group-hover/row:text-white transition-colors duration-200">
          {t.name}
        </div>
        <div className="font-mono text-[10.5px] leading-snug text-black/40 dark:text-white/35 truncate">
          {t.note}
        </div>
      </div>
    </div>
  );
};

const DomainPanel = ({ d, i }: { d: Domain; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    className="mb-5 break-inside-avoid border border-black/10 dark:border-white/10 bg-[#ffffff] dark:bg-black/40"
  >
    <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}90` }}
        />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-black/70 dark:text-white/70">
          {d.label}
        </span>
      </div>
      <span className="font-mono text-[9px] tabular-nums tracking-[0.2em] text-black/30 dark:text-white/25">
        {String(d.techs.length).padStart(2, "0")}
      </span>
    </div>
    <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
      {d.techs.map((t) => <TechRow key={t.name} t={t} />)}
    </div>
  </motion.div>
);

/* ───────────────────────── MAIN ───────────────────────── */

const Skills = () => (
  <div className="relative w-full bg-[#ffffff] dark:bg-black/30 border border-black/[0.12] dark:border-white/[0.12] overflow-hidden">
    {/* HEADER */}
    <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3 md:gap-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-black/50 dark:text-white/50">SYS.MANIFEST</span>
        <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
        <span className="font-mono text-[12px] md:text-[13px] font-bold uppercase tracking-[0.15em] text-black dark:text-white">TECHNICAL_STACK</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40 dark:text-white/30">{TECH_COUNT} TOOLS</span>
        <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/50">{DOMAINS.length} DOMAINS</span>
      </div>
    </div>

    {/* CORE STACK */}
    <div className="border-b border-black/10 dark:border-white/10">
      <div className="px-5 md:px-7 pt-5 pb-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/35 dark:text-white/35">[ CORE STACK ]</span>
      </div>
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10">
        {CORE.map((c, i) => <CoreCard key={c.name} c={c} i={i} />)}
      </div>
    </div>

    {/* DOMAIN GRID */}
    <div className="relative">
      {/* HUD backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5] dark:opacity-100"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(120,140,180,0.14) 1px, transparent 0)", backgroundSize: "26px 26px" }}
      />
      <div className="relative px-4 md:px-6 py-6 columns-1 md:columns-2 xl:columns-3 gap-5">
        {DOMAINS.map((d, i) => <DomainPanel key={d.id} d={d} i={i} />)}
      </div>
    </div>

    {/* FOOTER */}
    <div className="flex items-center justify-between px-5 md:px-7 py-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black dark:bg-blue-400" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/65 dark:text-white/65">
          ALL SYSTEMS NOMINAL
        </span>
      </div>
      <div className="hidden md:flex items-end gap-[2px] h-4">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-black dark:bg-blue-400/70 rounded-sm"
            animate={{ height: ["3px", `${6 + Math.sin(i) * 5}px`, "3px"] }}
            transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">{TECH_COUNT} LOADED</span>
    </div>
  </div>
);

export default Skills;
