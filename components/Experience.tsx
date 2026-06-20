"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import { RevealText, RevealChars, FadeReveal } from "@/components/ui/ScrollReveal";

/* Text legibility over the animated WebGL world — a soft dark halo that keeps
   the background fully visible while lifting text off it. */
const TXT = "0 2px 10px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)";

/* ─────────────────────────────────────────────────
   Count-up hook (subtle, fires once in view)
───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, trigger: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);
  return value;
}

const Metric = ({ value, label, color }: { value: string; label: string; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFired(true); obs.disconnect(); } },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const match = value.match(/^(\d+)(.*)/);
  const num = match ? parseInt(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const counted = useCountUp(num, 1200, fired);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div
        className="font-semibold leading-none tabular-nums"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1rem,1.8vw,1.45rem)", color, textShadow: `0 0 18px ${color}55, ${TXT}` }}
      >
        {match ? `${counted}${suffix}` : value}
      </div>
      <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">
        {label}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Data
───────────────────────────────────────────────── */
const JOBS = [
  {
    idx: "01",
    year: "2025",
    company: "ZANSKAR SECURITIES",
    role: "Analyst · Software Engineer",
    period: "JUL 2025 — PRESENT",
    status: "ACTIVE" as const,
    color: "#818cf8",
    colorRgb: "129,140,248",
    summary:
      "Building sub-millisecond order execution infrastructure for high-frequency trading.",
    metrics: [
      { value: "50K+", label: "MSG/SEC" },
      { value: "35%",  label: "P99 DROP" },
      { value: "40%",  label: "GC SAVED" },
      { value: "<1MS", label: "LATENCY"  },
    ],
    bullets: [
      "Event-driven microservices on NATS JetStream processing 50K+ messages/sec with guaranteed delivery",
      "Distributed order book using custom ring-buffer structures, cutting GC pressure by ~40%",
      "Real-time risk middleware — circuit breakers, rate limiting, distributed tracing with OpenTelemetry",
      "Profiled hot paths with Go pprof, reducing P99 latency by 35% on order routing",
      "Built core trading systems end-to-end — Mutual Funds, IPO, eDIS, Early Pay-in, and Pledge settlement flows",
      "Developed analytics pipelines and Python scripts for real-time monitoring and alerting",
    ],
    link: { label: "nubra.io", href: "https://nubra.io" },
    tech: ["Golang", "NATS JetStream", "Kafka", "PostgreSQL", "Redis", "OpenTelemetry"],
  },
  {
    idx: "02",
    year: "2025",
    company: "ONEFINNET",
    role: "Software Developer · Intern",
    period: "JAN 2025 — JUN 2025",
    status: "COMPLETED" as const,
    color: "#22d3ee",
    colorRgb: "34,211,238",
    summary:
      "Owned backend architecture for real-time chat and meeting platforms under production load.",
    metrics: [
      { value: "10K+", label: "CONC. CONN" },
      { value: "45%",  label: "API FASTER" },
      { value: "1K+",  label: "USERS LIVE" },
    ],
    bullets: [
      "Built REST and WebSocket APIs in Go handling 10,000+ concurrent connections",
      "Redis-based caching layer reducing average API response time by 45%",
      "Real-time chat infrastructure on Go and NATS JetStream for 1,000+ simultaneous users",
      "Containerised microservices with zero-downtime deployments on GCP Cloud Run",
    ],
    link: { label: "onefinnet.com", href: "https://onefinnet.com/talent" },
    tech: ["Golang", "WebSocket", "Redis", "NATS", "Docker", "GCP Cloud Run", "k6"],
  },
  {
    idx: "03",
    year: "2024",
    company: "MODULUS TECHNOLOGIES",
    role: "Software Developer · Intern",
    period: "JUL 2024 — OCT 2024",
    status: "COMPLETED" as const,
    color: "#34d399",
    colorRgb: "52,211,153",
    summary:
      "Shipped a full-stack SaaS billing platform with multi-tenant security and Stripe integration.",
    metrics: [
      { value: "30%",  label: "LOAD FASTER"  },
      { value: "SSR",  label: "NEXT.JS"      },
      { value: "RBAC", label: "MULTI-TENANT" },
    ],
    bullets: [
      "Built full-stack SaaS billing platform with Next.js, FeatherJS, and PostgreSQL",
      "Migrated React → Next.js with SSR and route-level code splitting, 30% faster loads",
      "Integrated Stripe with automated invoicing, PDF export, and webhook handling",
      "Multi-tenant schema with row-level security, RBAC, and immutable audit logging",
    ],
    link: { label: "ambill.ai", href: "https://www.ambill.ai/about-us" },
    tech: ["Next.js", "TypeScript", "FeatherJS", "PostgreSQL", "Stripe", "Tailwind CSS"],
  },
];

const ACHIEVEMENTS = [
  {
    badge: "GUARDIAN",
    title: "Competitive Programming",
    color: "#fbbf24",
    colorRgb: "251,191,36",
    points: [
      "LeetCode Guardian — Rating 2200+",
      "CodeChef 4★ — Rating 1850+",
      "800+ algorithmic problems solved",
    ],
  },
  {
    badge: "AIR 193",
    title: "NDA SSB Recommended",
    color: "#818cf8",
    colorRgb: "129,140,248",
    points: [
      "Cleared NDA SSB — All India Rank 193",
      "Leadership under high-pressure scenarios",
      "Strategic thinking in officer-selection assessments",
    ],
  },
];

/* ─────────────────────────────────────────────────
   Timeline entry — transparent, accent-edged
───────────────────────────────────────────────── */
const Entry = ({ job }: { job: typeof JOBS[0] }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid grid-cols-[44px_1fr] md:grid-cols-[120px_1fr] gap-x-3 md:gap-x-6"
    >
      {/* ── LEFT SPINE: index + node + big ghost year ── */}
      <div className="relative flex flex-col items-center md:items-end pt-1">
        <span
          className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] mb-3"
          style={{ color: job.color, textShadow: TXT }}
        >
          {job.idx}
        </span>

        <span className="relative z-10 flex h-6 w-6 items-center justify-center">
          {job.status === "ACTIVE" && (
            <span className="absolute inline-flex h-6 w-6 rounded-full animate-ping" style={{ background: `rgba(${job.colorRgb},0.45)` }} />
          )}
          {/* outer ring */}
          <span
            className="absolute inline-flex h-5 w-5 rounded-full border-2"
            style={{ borderColor: job.color, background: `rgba(${job.colorRgb},0.15)`, boxShadow: `0 0 16px ${job.color}` }}
          />
          {/* core */}
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: job.color, boxShadow: `0 0 8px ${job.color}` }} />
        </span>

        <span
          className="hidden md:block mt-4 font-black leading-none text-white/[0.07] select-none"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "2.6rem", letterSpacing: "-0.04em", writingMode: "vertical-rl" }}
        >
          {job.year}
        </span>
      </div>

      {/* ── RIGHT: transparent content, accent left edge ── */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mb-10 md:mb-14 pl-5 md:pl-7 py-1"
        style={{ borderLeft: `2px solid ${job.color}` }}
      >
        {/* hover glow hugging the accent edge (transparent — bg still shows) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-40"
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `linear-gradient(to right, rgba(${job.colorRgb},0.1), transparent)` }}
        />

        <div className="relative z-10">
          {/* meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: job.color, textShadow: TXT }}>
              {job.period}
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-[0.28em] px-2 py-0.5 border backdrop-blur-sm"
              style={{
                color: job.status === "ACTIVE" ? job.color : "rgba(255,255,255,0.55)",
                borderColor: job.status === "ACTIVE" ? `rgba(${job.colorRgb},0.4)` : "rgba(255,255,255,0.2)",
                background: job.status === "ACTIVE" ? `rgba(${job.colorRgb},0.12)` : "rgba(0,0,0,0.25)",
              }}
            >
              {job.status}
            </span>
          </div>

          {/* company + role */}
          <h3
            className="font-bold uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.25rem,2.6vw,1.9rem)", letterSpacing: "-0.02em", textShadow: TXT }}
          >
            {job.company}
          </h3>
          <p className="mt-2 font-mono text-[11px] md:text-[12px] tracking-wide text-white/80" style={{ textShadow: TXT }}>
            {job.role}
          </p>

          {/* summary */}
          <p className="mt-4 text-[13px] md:text-[14px] leading-relaxed text-white/95" style={{ textShadow: TXT }}>
            {job.summary}
          </p>

          {/* bullets */}
          <ul className="mt-5 flex flex-col gap-2.5">
            {job.bullets.map((b, bi) => (
              <li key={bi} className="flex items-start gap-3">
                <span className="mt-[7px] h-px w-3 shrink-0" style={{ background: job.color }} />
                <span className="font-mono text-[11.5px] md:text-[12.5px] leading-relaxed text-white/85" style={{ textShadow: TXT }}>{b}</span>
              </li>
            ))}
          </ul>

          {/* metrics */}
          <div className="mt-6 flex flex-wrap gap-x-9 gap-y-5 border-t border-white/[0.12] pt-5">
            {job.metrics.map((m) => (
              <Metric key={m.label} {...m} color={job.color} />
            ))}
          </div>

          {/* tech + link */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {job.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[8px] uppercase tracking-[0.18em] px-2.5 py-1 border border-white/[0.15] text-white/60 backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                {t}
              </span>
            ))}
            {job.link && (
              <a
                href={job.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.22em] transition-colors"
                style={{ color: hover ? job.color : "rgba(255,255,255,0.7)", textShadow: TXT }}
              >
                {job.link.label}
                <IconArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────
   Scroll-fill rail (through the spine column)
───────────────────────────────────────────────── */
const Rail = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 30%", "end 70%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute top-3 bottom-6 w-[3px] overflow-hidden rounded-full left-[21px] md:left-[119px] -translate-x-1/2">
      <div className="absolute inset-0 bg-white/25" />
      <motion.div
        className="absolute top-0 left-0 right-0 h-full origin-top rounded-full"
        style={{
          scaleY,
          background: "linear-gradient(to bottom, #818cf8, #22d3ee 50%, #34d399)",
          boxShadow: "0 0 16px rgba(129,140,248,0.9), 0 0 6px rgba(34,211,238,0.8)",
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────
   EXPERIENCE — main export (transparent)
───────────────────────────────────────────────── */
export default function Experience() {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full py-16 md:py-28 transition-colors duration-500">
      <div className="mx-auto max-w-[92vw] 2xl:max-w-[1180px] px-1">

        {/* ── header ── */}
        <div className="mb-14 md:mb-20">
          <FadeReveal delay={0} className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-400 animate-pulse" />
            <RevealChars
              text="SYS.CAREER_LOG"
              className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/50"
              delay={0.1}
            />
            <div className="h-px flex-1 max-w-[120px] bg-white/[0.15]" />
          </FadeReveal>

          <h2
            className="font-black uppercase leading-[0.92] text-white"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(2.6rem, 9vw, 7rem)", letterSpacing: "-0.035em", textShadow: TXT }}
          >
            <RevealText text="WORK" delay={0.1} stagger={0.05} />{" "}
            <span
              className="text-white/25"
              style={{ WebkitTextStrokeWidth: "1.5px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent" }}
            >
              <RevealText text="HISTORY" delay={0.18} stagger={0.045} />
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-7">
            {[
              { n: "3",    lbl: "ROLES"   },
              { n: "1.5+", lbl: "YRS EXP" },
              { n: "50K+", lbl: "MSG/SEC" },
              { n: "<1MS", lbl: "LATENCY" },
            ].map((s, i) => (
              <FadeReveal key={s.lbl} delay={0.4 + i * 0.06} className="flex items-baseline gap-2">
                <span
                  className="font-semibold text-white leading-none"
                  style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.85rem,1.6vw,1.05rem)", textShadow: TXT }}
                >
                  {s.n}
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-white/40" style={{ textShadow: TXT }}>{s.lbl}</span>
              </FadeReveal>
            ))}
          </div>
        </div>

        {/* ── timeline ── */}
        <div ref={railRef} className="relative">
          <Rail containerRef={railRef as React.RefObject<HTMLDivElement>} />
          {JOBS.map((job) => (
            <Entry key={job.idx} job={job} />
          ))}
        </div>

        {/* ── recognition ── */}
        <div className="mt-14 md:mt-20">
          <FadeReveal delay={0} className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/50" style={{ textShadow: TXT }}>RECOGNITION</span>
            <div className="h-px flex-1 bg-white/[0.12]" />
          </FadeReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.badge}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="relative pl-5 py-1"
                style={{ borderLeft: `2px solid ${a.color}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-[8px] uppercase tracking-[0.3em] px-2.5 py-1 border font-bold backdrop-blur-sm"
                    style={{ color: a.color, borderColor: `rgba(${a.colorRgb},0.4)`, background: `rgba(${a.colorRgb},0.12)` }}
                  >
                    {a.badge}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/35" style={{ textShadow: TXT }}>ACHIEVEMENT</span>
                </div>
                <h3
                  className="font-bold uppercase leading-tight text-white mb-4"
                  style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.05rem,2.2vw,1.4rem)", letterSpacing: "-0.01em", textShadow: TXT }}
                >
                  {a.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {a.points.map((p, pi) => (
                    <li key={pi} className="flex items-start gap-3">
                      <span className="mt-[7px] h-px w-3 shrink-0" style={{ background: a.color }} />
                      <span className="font-mono text-[11.5px] md:text-[12.5px] leading-relaxed text-white/85" style={{ textShadow: TXT }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
