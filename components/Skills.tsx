"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaJava, FaNode } from "react-icons/fa";
import {
  SiApachekafka, SiGo, SiGooglecloud, SiMongodb, SiNatsdotio,
  SiNextdotjs, SiPostgresql, SiSpringboot, SiTailwindcss, SiTypescript,
  SiPython, SiRedis, SiDocker, SiKubernetes, SiPrometheus, SiGrafana,
} from "react-icons/si";
import { PiFileCppFill } from "react-icons/pi";

/* ───────────────────────── DATA ───────────────────────── */

type CatId = "lang" | "fe" | "be" | "data" | "infra" | "msg";

const CATEGORIES: { id: CatId; label: string; color: string }[] = [
  { id: "lang",  label: "LANGUAGES",  color: "#3B82F6" },
  { id: "fe",    label: "FRONTEND",   color: "#06B6D4" },
  { id: "be",    label: "BACKEND",    color: "#22C55E" },
  { id: "data",  label: "DATA",       color: "#A855F7" },
  { id: "infra", label: "INFRA",      color: "#F59E0B" },
  { id: "msg",   label: "MESSAGING",  color: "#EC4899" },
];
const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CatId, (typeof CATEGORIES)[number]>;

type Tech = { key: string; icon: React.ElementType; name: string; color: string; cat: CatId; level: number; note: string };

const TECHS: Tech[] = [
  { key: "go",      icon: SiGo,          name: "GO",         color: "#00ADD8", cat: "lang",  level: 95, note: "HFT-grade systems" },
  { key: "cpp",     icon: PiFileCppFill, name: "C++",        color: "#659AD2", cat: "lang",  level: 85, note: "Low-latency · DSA" },
  { key: "ts",      icon: SiTypescript,  name: "TS",         color: "#3178C6", cat: "lang",  level: 90, note: "Type-safe stack" },
  { key: "java",    icon: FaJava,        name: "JAVA",       color: "#E76F00", cat: "lang",  level: 80, note: "Enterprise OOP" },
  { key: "python",  icon: SiPython,      name: "PY",         color: "#3776AB", cat: "lang",  level: 78, note: "Automation · data" },
  { key: "react",   icon: FaReact,       name: "REACT",      color: "#61DAFB", cat: "fe",    level: 92, note: "Component UIs" },
  { key: "next",    icon: SiNextdotjs,   name: "NEXT",       color: "#9AA0A6", cat: "fe",    level: 90, note: "App Router · RSC" },
  { key: "tw",      icon: SiTailwindcss, name: "TW",         color: "#06B6D4", cat: "fe",    level: 93, note: "Design systems" },
  { key: "node",    icon: FaNode,        name: "NODE",       color: "#5FA04E", cat: "be",    level: 88, note: "Real-time APIs" },
  { key: "spring",  icon: SiSpringboot,  name: "SPRING",     color: "#6DB33F", cat: "be",    level: 80, note: "JVM services" },
  { key: "pg",      icon: SiPostgresql,  name: "PG",         color: "#4169E1", cat: "data",  level: 87, note: "Query tuning" },
  { key: "mongo",   icon: SiMongodb,     name: "MONGO",      color: "#47A248", cat: "data",  level: 82, note: "Document stores" },
  { key: "redis",   icon: SiRedis,       name: "REDIS",      color: "#FF4438", cat: "data",  level: 80, note: "Cache · pub/sub" },
  { key: "gcp",     icon: SiGooglecloud, name: "GCP",        color: "#4285F4", cat: "infra", level: 80, note: "Cloud-native" },
  { key: "docker",  icon: SiDocker,      name: "DOCKER",     color: "#2496ED", cat: "infra", level: 86, note: "Containers" },
  { key: "k8s",     icon: SiKubernetes,  name: "K8S",        color: "#326CE5", cat: "infra", level: 76, note: "Orchestration" },
  { key: "prom",    icon: SiPrometheus,  name: "PROM",       color: "#E6522C", cat: "infra", level: 74, note: "Metrics · alerts" },
  { key: "grafana", icon: SiGrafana,     name: "GRAFANA",    color: "#F46800", cat: "infra", level: 74, note: "Dashboards" },
  { key: "kafka",   icon: SiApachekafka, name: "KAFKA",      color: "#9D5BD2", cat: "msg",   level: 85, note: "Streaming" },
  { key: "nats",    icon: SiNatsdotio,   name: "NATS",       color: "#27AAE1", cat: "msg",   level: 83, note: "JetStream MQ" },
];

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/* ───────────────────────── HEX NODE ───────────────────────── */

const HexNode = ({ tech, index, dimmed }: { tech: Tech; index: number; dimmed: boolean }) => {
  const Icon = tech.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group relative shrink-0"
      style={{ width: "var(--hex)", height: "calc(var(--hex) * 1.1547)" }}
    >
      <motion.div
        animate={{ opacity: dimmed ? 0.16 : 1, scale: dimmed ? 0.92 : 1, filter: dimmed ? "grayscale(1)" : "grayscale(0)" }}
        whileHover={dimmed ? undefined : { scale: 1.08, y: -2 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 0 transparent)` }}
      >
        {/* outer neon rim */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            clipPath: HEX,
            background: `linear-gradient(150deg, ${tech.color}, ${tech.color}55)`,
            filter: `drop-shadow(0 0 6px ${tech.color}55)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ clipPath: HEX, background: tech.color, filter: `drop-shadow(0 0 16px ${tech.color})` }}
        />

        {/* inner face */}
        <div
          className="absolute inset-[1.5px] flex flex-col items-center justify-center gap-1 bg-[#f7f9fc] dark:bg-black/60 overflow-hidden"
          style={{ clipPath: HEX }}
        >
          {/* glow wash */}
          <div
            className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 38%, ${tech.color}26, transparent 62%)` }}
          />
          <Icon className="relative z-10 transition-transform duration-300 group-hover:scale-110"
            style={{ color: tech.color, fontSize: "clamp(22px, calc(var(--hex) * 0.3), 52px)" }} />
          <span className="relative z-10 font-mono font-bold uppercase tracking-[0.12em] text-black dark:text-white leading-none"
            style={{ fontSize: "clamp(8px, calc(var(--hex) * 0.085), 13px)" }}>
            {tech.name}
          </span>
          {/* descriptor */}
          <span className="relative z-10 font-mono leading-none text-center px-1 text-black/55 dark:text-white/55"
            style={{ fontSize: "clamp(6px, calc(var(--hex) * 0.062), 10px)" }}>
            {tech.note}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ───────────────────────── HONEYCOMB ───────────────────────── */

const GAP = 6; // px between hexes

const Honeycomb = ({ activeCat }: { activeCat: CatId | "all" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(10);
  const [hex, setHex] = useState(150);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      // column count tuned so hexes span the full width edge-to-edge
      const c = w >= 1100 ? 10 : w >= 760 ? 7 : w >= 520 ? 5 : w >= 380 ? 4 : 3;
      // widest (offset) row must equal container width → solve for hex size
      const h = Math.floor((w - (c - 1) * GAP - GAP / 2) / (c + 0.5));
      setCols(c);
      setHex(h);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => {
    const out: Tech[][] = [];
    for (let i = 0; i < TECHS.length; i += cols) out.push(TECHS.slice(i, i + cols));
    return out;
  }, [cols]);

  return (
    <div className="relative py-6 md:py-8 px-3 md:px-5">
      <div ref={ref} className="w-full" style={{ ["--hex" as any]: `${hex}px` }}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex"
            style={{
              gap: `${GAP}px`,
              marginTop: ri === 0 ? 0 : "calc(var(--hex) * -0.2885)",
              marginLeft: ri % 2 === 1 ? `calc((var(--hex) + ${GAP}px) / 2)` : 0,
            }}
          >
            {row.map((tech, ci) => (
              <HexNode
                key={tech.key}
                tech={tech}
                index={ri * cols + ci}
                dimmed={activeCat !== "all" && activeCat !== tech.cat}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────────── FEATURED PANEL + RADIAL GAUGE ───────────────── */

const TierRing = ({ tier, color, size = 130 }: { tier: string; color: string; size?: number }) => {
  const R = 52, C = 2 * Math.PI * R;
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" className="shrink-0">
      <circle cx="65" cy="65" r={R} fill="none" stroke="currentColor" className="text-black/10 dark:text-white/10" strokeWidth="5" />
      <motion.circle
        cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={C} transform="rotate(-90 65 65)"
        initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} style={{ filter: `drop-shadow(0 0 6px ${color}90)` }} />
      <text x="65" y="61" textAnchor="middle" className="fill-black dark:fill-white font-black uppercase"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: tier.length > 6 ? "12px" : "15px", letterSpacing: "0.5px" }}>{tier}</text>
      <text x="65" y="79" textAnchor="middle" className="fill-black/40 dark:fill-white/35"
        style={{ fontFamily: "monospace", fontSize: "7px", letterSpacing: "3px" }}>TIER</text>
    </svg>
  );
};

type Feature = {
  icon: React.ElementType; name: string; color: string; gradTo: string;
  label: string; tagline: string; desc: string; tier: string;
  stats: { v: string; l: string }[];
};

const FEATURES: Feature[] = [
  {
    icon: SiGo, name: "GOLANG", color: "#00ADD8", gradTo: "#1A8A62",
    label: "PRIMARY RUNTIME", tagline: "High-Throughput · Distributed · HFT Grade",
    desc: "My primary tool for production systems — trading engines, real-time pipelines, and distributed micro-services. Built on its goroutine model and predictable latency under load.",
    tier: "EXPERT", stats: [{ v: "50K+", l: "MSG/SEC" }, { v: "<1ms", l: "LATENCY" }, { v: "3 YRS", l: "IN PROD" }],
  },
  {
    icon: PiFileCppFill, name: "C++", color: "#00599C", gradTo: "#659AD2",
    label: "SYSTEMS LANGUAGE", tagline: "Low-Latency · Zero-Cost · DSA",
    desc: "My weapon for performance-critical paths — order books, memory-tight engines, and competitive problem solving. Chosen for raw control and zero-cost abstractions.",
    tier: "ADVANCED", stats: [{ v: "ZERO", l: "GC PAUSE" }, { v: "<1µs", l: "HOT PATH" }, { v: "5 YRS", l: "EXPERIENCE" }],
  },
];

const FeaturedHalf = ({ f }: { f: Feature }) => {
  const Icon = f.icon;
  return (
    <div className="relative flex-1 overflow-hidden p-6 md:p-7" style={{ borderTop: `3px solid ${f.color}` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${f.color}12, transparent 55%)` }} />
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${f.color}14` }} />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center gap-4 md:gap-5 flex-wrap">
          {/* icon */}
          <motion.div
            animate={{ filter: [`drop-shadow(0 0 8px ${f.color}70)`, `drop-shadow(0 0 20px ${f.color}B0)`, `drop-shadow(0 0 8px ${f.color}70)`] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[58px] md:text-[74px] leading-none shrink-0" style={{ color: f.color }}>
            <Icon />
          </motion.div>
          {/* identity */}
          <div className="min-w-0">
            <div className="font-mono text-[7px] uppercase tracking-[0.4em] mb-1.5" style={{ color: f.color }}>{f.label}</div>
            <h3 className="font-black uppercase leading-none"
              style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.7rem, 3.4vw, 2.9rem)", letterSpacing: "-0.02em",
                background: `linear-gradient(135deg, ${f.color}, ${f.gradTo})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {f.name}
            </h3>
            <p className="font-mono text-[8.5px] text-black/40 dark:text-white/35 mt-2 uppercase tracking-[0.15em]">{f.tagline}</p>
          </div>
          {/* gauge + stats */}
          <div className="sm:ml-auto flex items-center gap-4 md:gap-5 shrink-0">
            <TierRing tier={f.tier} color={f.color} size={104} />
            <div className="flex flex-col gap-px bg-black/[0.09] dark:bg-white/[0.09]">
              {f.stats.map(({ v, l }) => (
                <div key={l} className="flex items-baseline justify-between gap-4 px-3.5 py-2 bg-[#ffffff] dark:bg-black/60 min-w-[118px]">
                  <span className="font-black leading-none" style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.92rem", color: f.color }}>{v}</span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-black/40 dark:text-white/30">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="font-mono text-[10px] leading-relaxed text-black/55 dark:text-white/45 max-w-2xl">{f.desc}</p>
      </div>
    </div>
  );
};

const FeaturedPanel = ({ dimmed }: { dimmed: boolean }) => (
  <motion.div animate={{ opacity: dimmed ? 0.25 : 1 }} transition={{ duration: 0.35 }}
    className="relative overflow-hidden bg-[#ffffff] dark:bg-transparent">
    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10">
      {FEATURES.map((f) => <FeaturedHalf key={f.name} f={f} />)}
    </div>
  </motion.div>
);

/* ───────────────────────── FILTER CHIP ───────────────────────── */

const FilterChip = ({ label, color, count, selected, onClick }: {
  label: string; color: string; count: number; selected: boolean; onClick: () => void;
}) => (
  <button onClick={onClick}
    className="group relative flex items-center gap-2 px-3 py-1.5 shrink-0 border transition-colors duration-200"
    style={{ borderColor: selected ? color : "transparent", backgroundColor: selected ? `${color}14` : "transparent" }}>
    <span className="w-1.5 h-1.5 rounded-full transition-all duration-200"
      style={{ backgroundColor: color, boxShadow: selected ? `0 0 6px ${color}` : "none", opacity: selected ? 1 : 0.5 }} />
    <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.18em]" style={{ color: selected ? color : undefined }}>
      <span className={selected ? "" : "text-black/50 dark:text-white/45 group-hover:text-black dark:group-hover:text-white"}>{label}</span>
    </span>
    <span className="font-mono text-[7px] tabular-nums text-black/30 dark:text-white/25">{count}</span>
  </button>
);

/* ───────────────────────── MAIN ───────────────────────── */

const Skills = () => {
  const [active, setActive] = useState<CatId | "all">("all");
  const avg = useMemo(() => Math.round(TECHS.reduce((s, t) => s + t.level, 0) / TECHS.length), []);

  return (
    <div className="relative w-full bg-[#ffffff] dark:bg-black/30 border border-black/[0.12] dark:border-white/[0.12] overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 md:px-7 py-3.5 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3 md:gap-5">
          <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-black/50 dark:text-white/50">SYS.MATRIX</span>
          <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
          <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black dark:text-white">CAPABILITY_MATRIX</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/40 dark:text-white/30">AVG</span>
          <span className="font-mono text-[10px] font-bold tabular-nums text-green-600 dark:text-green-400">{avg}%</span>
          <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50">{TECHS.length} NODES</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-5 md:px-7 py-3 border-b border-black/10 dark:border-white/10">
        <FilterChip label="ALL" color="#64748B" count={TECHS.length} selected={active === "all"} onClick={() => setActive("all")} />
        {CATEGORIES.map((c) => (
          <FilterChip key={c.id} label={c.label} color={c.color} count={TECHS.filter((t) => t.cat === c.id).length}
            selected={active === c.id} onClick={() => setActive(active === c.id ? "all" : c.id)} />
        ))}
      </div>

      {/* FEATURED */}
      <div className="border-b border-black/10 dark:border-white/10">
        <FeaturedPanel dimmed={active !== "all" && active !== "lang"} />
      </div>

      {/* HONEYCOMB */}
      <div className="relative">
        {/* HUD backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.5] dark:opacity-100"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(120,140,180,0.18) 1px, transparent 0)", backgroundSize: "26px 26px" }} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#ffffff] dark:to-[#000000]" />
        <Honeycomb activeCat={active} />
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-5 md:px-7 py-3 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black dark:bg-green-400" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/65 dark:text-white/65">
            {active === "all" ? "ALL NODES ONLINE" : `${CAT_MAP[active].label} ISOLATED`}
          </span>
        </div>
        <div className="hidden md:flex items-end gap-[2px] h-4">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="w-[3px] bg-black dark:bg-green-400/70 rounded-sm"
              animate={{ height: ["3px", `${6 + Math.sin(i) * 5}px`, "3px"] }}
              transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }} />
          ))}
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">{TECHS.length} LOADED</span>
      </div>
    </div>
  );
};

export default Skills;
