"use client";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";
import { IconExternalLink } from "@tabler/icons-react";

/* ─── colour config per company ─── */
type Accent = "indigo" | "cyan" | "emerald" | "amber";

const accentMap: Record<Accent, {
  border: string; text: string; tag: string; dot: string; badge: string;
}> = {
  indigo:  {
    border: "border-l-indigo-500",
    text:   "text-indigo-500",
    tag:    "border-indigo-500/30 bg-indigo-500/[0.06] text-indigo-600 dark:text-indigo-400",
    dot:    "bg-indigo-500",
    badge:  "border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  },
  cyan: {
    border: "border-l-cyan-500",
    text:   "text-cyan-500",
    tag:    "border-cyan-500/30 bg-cyan-500/[0.06] text-cyan-600 dark:text-cyan-400",
    dot:    "bg-cyan-500",
    badge:  "border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  },
  emerald: {
    border: "border-l-emerald-500",
    text:   "text-emerald-500",
    tag:    "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-600 dark:text-emerald-400",
    dot:    "bg-emerald-500",
    badge:  "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    border: "border-l-amber-500",
    text:   "text-amber-500",
    tag:    "border-amber-500/30 bg-amber-500/[0.06] text-amber-600 dark:text-amber-400",
    dot:    "bg-amber-500",
    badge:  "border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
};

/* ─── shared sub-components ─── */
const Point = ({
  text, link,
}: { text: string; link?: { label: string; href: string } }) => (
  <div className="flex items-start gap-2.5 group/pt">
    <span className="font-mono text-[10px] text-black/30 dark:text-white/30 mt-[3px] shrink-0 group-hover/pt:text-black/60 dark:group-hover/pt:text-white/60 transition-colors">
      →
    </span>
    <p className="font-mono text-[11px] md:text-[12px] leading-relaxed text-black/65 dark:text-white/65 group-hover/pt:text-black/80 dark:group-hover/pt:text-white/80 transition-colors">
      {text}
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 inline-flex items-center gap-0.5 font-bold underline underline-offset-2 decoration-dotted text-black dark:text-white hover:opacity-60 transition-opacity"
        >
          {link.label}
          <IconExternalLink size={10} />
        </a>
      )}
    </p>
  </div>
);

const TechTag = ({ label, accent }: { label: string; accent: Accent }) => (
  <span className={`border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] ${accentMap[accent].tag}`}>
    {label}
  </span>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="border border-black/10 dark:border-white/10 px-3 py-2 text-center">
    <div
      className="font-bold leading-none text-black dark:text-white mb-0.5"
      style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.1rem", letterSpacing: "-0.02em" }}
    >
      {value}
    </div>
    <div className="font-mono text-[7px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
      {label}
    </div>
  </div>
);

/* ─── role card shell ─── */
const RoleCard = ({
  accent, status, role, company, period, stats, points, tech, image,
}: {
  accent: Accent;
  status: "ACTIVE" | "COMPLETED";
  role: string;
  company: string;
  period: string;
  stats?: { value: string; label: string }[];
  points: { text: string; link?: { label: string; href: string } }[];
  tech: string[];
  image?: { src: string; alt: string };
}) => {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative bg-[#ffffff] dark:bg-[#090909] border border-black/10 dark:border-white/10 border-l-[3px] ${a.border} overflow-hidden`}
    >
      {/* watermark */}
      <div
        className="absolute -bottom-4 -right-3 font-black leading-none select-none pointer-events-none text-black/[0.04] dark:text-white/[0.04]"
        style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "7rem", letterSpacing: "-0.05em" }}
      >
        {company.split(" ")[0].slice(0, 3).toUpperCase()}
      </div>

      <div className="relative z-10 p-5 md:p-7">
        {/* header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            {/* status dot */}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              {status === "ACTIVE" && (
                <span className={`absolute inline-flex h-full w-full animate-ping ${a.dot} opacity-60`} />
              )}
              <span className={`relative inline-flex h-1.5 w-1.5 ${a.dot}`} />
            </span>
            <span className={`font-mono text-[8px] uppercase tracking-[0.35em] border px-2 py-0.5 ${a.badge}`}>
              {status}
            </span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/40 dark:text-white/40">
            {period}
          </span>
        </div>

        {/* role title */}
        <div
          className="font-bold uppercase leading-tight text-black dark:text-white mb-2"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.85rem,1.8vw,1.2rem)", letterSpacing: "0.02em" }}
        >
          {role}
        </div>

        {/* company */}
        <div className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] mb-5 ${a.text}`}>
          @ {company}
        </div>

        {/* stats row */}
        {stats && (
          <div className={`grid gap-px mb-5 bg-black/[0.06] dark:bg-white/[0.06]`}
            style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}
          >
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        )}

        {/* divider */}
        <div className="h-px bg-black/[0.07] dark:bg-white/[0.07] mb-5" />

        {/* points */}
        <div className="space-y-2.5 mb-5">
          {points.map((p, i) => <Point key={i} {...p} />)}
        </div>

        {/* divider */}
        <div className="h-px bg-black/[0.07] dark:bg-white/[0.07] mb-4" />

        {/* tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tech.map((t) => <TechTag key={t} label={t} accent={accent} />)}
        </div>

        {/* image */}
        {image && (
          <div className="relative w-full h-36 md:h-52 border border-black/10 dark:border-white/10 overflow-hidden group bg-black/[0.03] dark:bg-white/[0.03]">
            {/* blurry background copy */}
            <img
              src={image.src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-40 dark:opacity-25 transition-transform duration-700 group-hover:scale-125"
            />
            {/* centered foreground */}
            <img
              src={image.src}
              alt={image.alt}
              className="relative z-10 h-full w-full object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* corner label */}
            <div className="absolute bottom-2.5 left-3 z-20 font-mono text-[7px] uppercase tracking-[0.3em] text-white/60 border border-white/15 bg-black/20 px-2 py-0.5">
              {image.alt}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── achievement card ─── */
const AchievementBlock = ({
  accent, title, badge, points, images,
}: {
  accent: Accent;
  title: string;
  badge?: string;
  points: string[];
  images?: { src: string; alt: string; className?: string }[];
}) => {
  const a = accentMap[accent];
  return (
    <div className={`border border-black/10 dark:border-white/10 border-l-[3px] ${a.border} bg-[#ffffff] dark:bg-[#090909] p-5`}>
      <div className="flex items-center gap-3 mb-4">
        {badge && (
          <span className={`font-mono text-[8px] uppercase tracking-[0.3em] border px-2 py-0.5 ${a.badge}`}>
            {badge}
          </span>
        )}
        <span
          className="font-semibold uppercase leading-none text-black dark:text-white"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.85rem", letterSpacing: "0.03em" }}
        >
          {title}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        {points.map((p, i) => <Point key={i} text={p} />)}
      </div>
      {images && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => (
            <div key={img.alt} className="relative border border-black/10 dark:border-white/10 overflow-hidden h-28 md:h-36 group bg-black/[0.03] dark:bg-white/[0.03]">
              {/* blurry bg */}
              <img src={img.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-35 dark:opacity-20 transition-transform duration-700 group-hover:scale-125" />
              {/* centered */}
              <img src={img.src} alt={img.alt} className={`relative z-10 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${img.className ?? ""}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── timeline data ─── */
const data = [
  {
    title: "JUL 2025 — PRESENT",
    content: (
      <RoleCard
        accent="indigo"
        status="ACTIVE"
        role="ANALYST SOFTWARE ENGINEER"
        company="ZANSKAR SECURITIES"
        period="JUL 2025 – PRESENT"
        stats={[
          { value: "50K+", label: "MSG/SEC" },
          { value: "35%", label: "P99 DROP" },
          { value: "40%", label: "GC SAVED" },
          { value: "<1MS", label: "LATENCY" },
        ]}
        points={[
          { text: "Building sub-millisecond order execution pipelines in Go for high-frequency trading" },
          { text: "Designed event-driven microservices on NATS JetStream processing 50K+ messages/sec with guaranteed delivery" },
          { text: "Architected distributed order book using custom ring-buffer data structures, cutting GC pressure by ~40%" },
          { text: "Implemented real-time risk management middleware — circuit breakers, rate limiting, distributed tracing with OpenTelemetry" },
          { text: "Profiled hot paths with Go pprof, reducing P99 latency by 35% on order routing" },
          { text: "Engineered multi-leg options strategies execution engine with deterministic, lock-free order routing" },
          { text: "Building trading platform", link: { label: "Nubra", href: "https://nubra.io" } },
        ]}
        tech={["Golang", "NATS JetStream", "Kafka", "PostgreSQL", "Redis", "Docker", "OpenTelemetry", "HFT"]}
        image={{ src: "/nubra.webp", alt: "Nubra Platform" }}
      />
    ),
  },
  {
    title: "JAN 2025 — JUN 2025",
    content: (
      <RoleCard
        accent="cyan"
        status="COMPLETED"
        role="SOFTWARE DEVELOPER INTERN"
        company="ONEFINNET"
        period="JAN 2025 – JUN 2025"
        stats={[
          { value: "10K+", label: "CONC. CONN" },
          { value: "45%", label: "API FASTER" },
          { value: "1K+", label: "USERS LIVE" },
        ]}
        points={[
          { text: "Built REST and WebSocket APIs in Go handling 10,000+ concurrent connections under production load" },
          { text: "Implemented Redis-based caching layer, reducing average API response time by 45%" },
          { text: "Built real-time chat infrastructure using Go and NATS JetStream for 1,000+ simultaneous users" },
          { text: "Containerised microservices with Docker, orchestrated zero-downtime deployments on GCP Cloud Run" },
          { text: "Led backend architecture for Spot Chat and Meeting Platform — schema, auth flow, pub/sub routing" },
          { text: "Wrote load tests with k6, identifying throughput bottlenecks before production release" },
          { text: "Built hiring platform", link: { label: "OneFinnet Talent", href: "https://onefinnet.com/talent" } },
        ]}
        tech={["Golang", "WebSocket", "Redis", "NATS", "Docker", "GCP Cloud Run", "k6"]}
        image={{ src: "/onefinnet.png", alt: "Onefinnet" }}
      />
    ),
  },
  {
    title: "JUL 2024 — OCT 2024",
    content: (
      <RoleCard
        accent="emerald"
        status="COMPLETED"
        role="SOFTWARE DEVELOPER INTERN"
        company="MODULUS TECHNOLOGIES"
        period="JUL 2024 – OCT 2024"
        stats={[
          { value: "30%", label: "LOAD FASTER" },
          { value: "SSR", label: "NEXT.JS" },
          { value: "RBAC", label: "MULTI-TENANT" },
        ]}
        points={[
          { text: "Built full-stack SaaS billing platform using Next.js, FeatherJS, and PostgreSQL" },
          { text: "Migrated React → Next.js with SSR and route-level code splitting, achieving 30% faster load times" },
          { text: "Integrated Stripe APIs with automated invoice generation, PDF export, and webhook handling" },
          { text: "Designed multi-tenant DB schema with row-level security and RBAC for billing workflows" },
          { text: "Built audit log system tracking financial mutations with immutable event sourcing" },
          { text: "Built invoice automation system", link: { label: "Ambill", href: "https://www.ambill.ai/about-us" } },
        ]}
        tech={["Next.js", "TypeScript", "FeatherJS", "PostgreSQL", "Stripe", "Tailwind CSS"]}
        image={{ src: "/ambill.jpg", alt: "Ambill" }}
      />
    ),
  },
  {
    title: "ACHIEVEMENTS",
    content: (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <AchievementBlock
          accent="amber"
          title="COMPETITIVE PROGRAMMING"
          badge="GUARDIAN"
          points={[
            "LeetCode Guardian — Rating 2200+",
            "CodeChef 4★ — Rating 1850+",
            "Solved 800+ algorithmic problems across platforms",
          ]}
          images={[
            { src: "/guardian.gif", alt: "LeetCode Guardian" },
            { src: "/codechef.svg", alt: "CodeChef 4★" },
          ]}
        />
        <AchievementBlock
          accent="indigo"
          title="NDA SSB RECOMMENDED"
          badge="AIR 193"
          points={[
            "Cleared NDA SSB Interview — All India Rank 193",
            "Demonstrated leadership under high-pressure scenarios across psychological and group testing",
            "Showcased strategic thinking in officer-selection assessments",
          ]}
        />
      </motion.div>
    ),
  },
];

/* ═══════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════ */
const Experience = () => (
  <section id="experience" className="w-full py-8 md:py-16">
    <div className="mx-auto max-w-[96vw] 2xl:max-w-[1600px]">
      <div className="bg-[#ffffff] dark:bg-[#090909] border border-black/[0.12] dark:border-white/[0.12] overflow-hidden">

        {/* ── header bar ── */}
        <div className="flex items-center justify-between px-5 md:px-8 py-3.5 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3 md:gap-5">
            <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-black/50 dark:text-white/50">
              SYS.HISTORY
            </span>
            <div className="h-3 w-px bg-black/15 dark:bg-white/15" />
            <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black dark:text-white">
              WORK EXPERIENCE
            </span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50">
            3 ROLES · 4 ENTRIES
          </span>
        </div>

        {/* ── section heading ── */}
        <div className="px-5 md:px-10 pt-10 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-amber-500/60" />
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/45 dark:text-white/45">
              WORK HISTORY
            </span>
          </div>
          <div
            className="font-black uppercase leading-none text-black dark:text-white"
            style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "clamp(3rem,10vw,8rem)", letterSpacing: "-0.03em" }}
          >
            EXPERIENCE
          </div>
          {/* cross markers */}
          <div className="flex items-center gap-8 mt-4">
            {["BACKEND", "INFRA", "FULL-STACK"].map((tag, i) => (
              <span key={tag} className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/35 dark:text-white/35">
                {String(i + 1).padStart(2, "0")}. {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── timeline ── */}
        <div className="px-2 md:px-6">
          <Timeline data={data} />
        </div>
      </div>
    </div>
  </section>
);

export default Experience;
