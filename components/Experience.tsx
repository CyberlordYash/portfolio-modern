"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconExternalLink, IconBolt } from "@tabler/icons-react";
import { RevealText, RevealChars, FadeReveal } from "@/components/ui/ScrollReveal";
import { EncryptedText } from "@/components/ui/encrypted-text";

/* ─────────────────────────────────────────────────
   Count-up hook
───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, trigger: boolean) {
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

/* ─────────────────────────────────────────────────
   Animated Metric
───────────────────────────────────────────────── */
const Metric = ({ value, label, color }: { value: string; label: string; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
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
  const isNum = !!match;
  const counted = useCountUp(num, 1400, fired);

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      <div
        className="font-black leading-none tabular-nums"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.1rem,2.2vw,1.7rem)", color }}
      >
        {isNum
          ? `${counted}${suffix}`
          : mounted
          ? <EncryptedText text={value} revealDelayMs={60} charset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" className="font-black" />
          : value}
      </div>
      <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/45 dark:text-white/35">{label}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Data
───────────────────────────────────────────────── */
const JOBS = [
  {
    idx: "01",
    company: "ZANSKAR SECURITIES",
    role: ["ANALYST", "SOFTWARE", "ENGINEER"],
    period: "JUL 2025 — PRESENT",
    status: "ACTIVE" as const,
    color: "#818cf8",
    colorRgb: "129,140,248",
    image: "/nubra.webp",
    imageAlt: "Nubra Platform",
    metrics: [
      { value: "50K+", label: "MSG/SEC" },
      { value: "35%",  label: "P99 DROP" },
      { value: "40%",  label: "GC SAVED" },
      { value: "<1MS", label: "LATENCY"  },
    ],
    bullets: [
      "Building sub-millisecond order execution pipelines in Go for high-frequency trading",
      "Event-driven microservices on NATS JetStream processing 50K+ messages/sec with guaranteed delivery",
      "Distributed order book using custom ring-buffer data structures, cutting GC pressure by ~40%",
      "Real-time risk middleware — circuit breakers, rate limiting, distributed tracing with OpenTelemetry",
      "Profiled hot paths with Go pprof, reducing P99 latency by 35% on order routing",
      "Multi-leg options strategies execution engine with deterministic, lock-free routing",
    ],
    link: { label: "Nubra", href: "https://nubra.io" },
    tech: ["Golang", "NATS JetStream", "Kafka", "PostgreSQL", "Redis", "Docker", "OpenTelemetry", "HFT"],
  },
  {
    idx: "02",
    company: "ONEFINNET",
    role: ["SOFTWARE", "DEVELOPER", "INTERN"],
    period: "JAN 2025 — JUN 2025",
    status: "COMPLETED" as const,
    color: "#22d3ee",
    colorRgb: "34,211,238",
    image: "/onefinnet.png",
    imageAlt: "Onefinnet",
    metrics: [
      { value: "10K+", label: "CONC. CONN" },
      { value: "45%",  label: "API FASTER" },
      { value: "1K+",  label: "USERS LIVE" },
    ],
    bullets: [
      "Built REST and WebSocket APIs in Go handling 10,000+ concurrent connections under production load",
      "Redis-based caching layer reducing average API response time by 45%",
      "Real-time chat infrastructure using Go and NATS JetStream for 1,000+ simultaneous users",
      "Containerised microservices with Docker, zero-downtime deployments on GCP Cloud Run",
      "Led backend architecture for Spot Chat and Meeting Platform — schema, auth, pub/sub routing",
      "Load tests with k6, identifying throughput bottlenecks before production release",
    ],
    link: { label: "OneFinnet Talent", href: "https://onefinnet.com/talent" },
    tech: ["Golang", "WebSocket", "Redis", "NATS", "Docker", "GCP Cloud Run", "k6"],
  },
  {
    idx: "03",
    company: "MODULUS TECHNOLOGIES",
    role: ["SOFTWARE", "DEVELOPER", "INTERN"],
    period: "JUL 2024 — OCT 2024",
    status: "COMPLETED" as const,
    color: "#34d399",
    colorRgb: "52,211,153",
    image: "/ambill.jpg",
    imageAlt: "Ambill",
    metrics: [
      { value: "30%",  label: "LOAD FASTER"  },
      { value: "SSR",  label: "NEXT.JS"       },
      { value: "RBAC", label: "MULTI-TENANT" },
    ],
    bullets: [
      "Built full-stack SaaS billing platform using Next.js, FeatherJS, and PostgreSQL",
      "Migrated React → Next.js with SSR and route-level code splitting, 30% faster load times",
      "Integrated Stripe APIs with automated invoice generation, PDF export, and webhook handling",
      "Multi-tenant DB schema with row-level security and RBAC for billing workflows",
      "Audit log system tracking financial mutations with immutable event sourcing",
    ],
    link: { label: "Ambill", href: "https://www.ambill.ai/about-us" },
    tech: ["Next.js", "TypeScript", "FeatherJS", "PostgreSQL", "Stripe", "Tailwind CSS"],
  },
];

const ACHIEVEMENTS = [
  {
    idx: "CP",
    color: "#fbbf24",
    colorRgb: "251,191,36",
    badge: "GUARDIAN",
    title: ["COMPETITIVE", "PROGRAMMING"],
    points: [
      "LeetCode Guardian — Rating 2200+",
      "CodeChef 4★ — Rating 1850+",
      "800+ algorithmic problems solved across platforms",
    ],
  },
  {
    idx: "NDA",
    color: "#818cf8",
    colorRgb: "129,140,248",
    badge: "AIR 193",
    title: ["NDA SSB", "RECOMMENDED"],
    points: [
      "Cleared NDA SSB — All India Rank 193",
      "Leadership under high-pressure scenarios",
      "Strategic thinking in officer-selection assessments",
    ],
  },
];

/* ─────────────────────────────────────────────────
   Job Card
───────────────────────────────────────────────── */
const JobCard = ({ job, i }: { job: typeof JOBS[0]; i: number }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
      className="relative overflow-hidden bg-white dark:bg-black/80 border border-black/[0.07] dark:border-white/[0.06]"
      style={{
        borderTop: `2px solid ${job.color}`,
        boxShadow: `0 0 60px rgba(${job.colorRgb},0.06)`,
      }}
    >
      {/* Ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 55% 45% at 100% 0%, rgba(${job.colorRgb},0.08) 0%, transparent 65%)` }}
      />

      {/* Index watermark */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-1 select-none font-black leading-none text-black/[0.045] dark:text-white/[0.028]"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(8rem,18vw,14rem)", letterSpacing: "-0.05em" }}
      >
        {job.idx}
      </div>

      {/* ── HEADER BAR ── */}
      <div
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 md:px-10 py-4"
        style={{ borderBottom: `1px solid rgba(${job.colorRgb},0.14)` }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            {job.status === "ACTIVE" && (
              <span className="absolute inline-flex h-full w-full animate-ping opacity-70" style={{ background: job.color }} />
            )}
            <span className="relative inline-flex h-1.5 w-1.5" style={{ background: job.color }} />
          </span>

          {mounted ? (
            <EncryptedText
              text={job.company}
              revealDelayMs={38}
              charset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-"
              className="font-mono text-[11px] md:text-[13px] font-bold uppercase tracking-[0.22em] text-black dark:text-white"
            />
          ) : (
            <span className="font-mono text-[11px] md:text-[13px] font-bold uppercase tracking-[0.22em] text-black dark:text-white">
              {job.company}
            </span>
          )}

          <span
            className="font-mono text-[8px] uppercase tracking-[0.28em] border px-2 py-0.5"
            style={{ color: job.color, borderColor: `rgba(${job.colorRgb},0.32)`, background: `rgba(${job.colorRgb},0.07)` }}
          >
            {job.status}
          </span>
        </div>

        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-black/40 dark:text-white/30">
          {job.period}
        </span>
      </div>

      {/* ── BODY: two columns ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[5fr_7fr]">

        {/* LEFT — image + metrics */}
        <div className="flex flex-col gap-6 p-5 md:p-8 border-b border-black/[0.06] dark:border-white/[0.04]">
          {/* Image */}
          <div
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              minHeight: 160,
              background: `rgba(${job.colorRgb},0.04)`,
              border: `1px solid rgba(${job.colorRgb},0.18)`,
            }}
          >
            <img
              src={job.image} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-15"
            />
            <img
              src={job.image} alt={job.imageAlt}
              className="relative z-10 max-h-40 w-full object-contain p-5 transition-transform duration-500 hover:scale-[1.04]"
            />
            <div
              className="absolute bottom-2 left-2.5 font-mono text-[7px] uppercase tracking-[0.3em] px-2 py-0.5"
              style={{ color: job.color, background: `rgba(${job.colorRgb},0.12)`, border: `1px solid rgba(${job.colorRgb},0.2)` }}
            >
              {job.imageAlt}
            </div>
          </div>

          {/* Metrics */}
          <div className={`grid gap-x-6 gap-y-4 ${job.metrics.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
            {job.metrics.map((m) => (
              <Metric key={m.label} {...m} color={job.color} />
            ))}
          </div>
        </div>

        {/* RIGHT — role + log entries */}
        <div className="flex flex-col gap-5 p-5 md:p-8 border-t lg:border-t-0 lg:border-l border-black/[0.06] dark:border-white/[0.04]">
          {/* Role title */}
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.32em] mb-2.5" style={{ color: `rgba(${job.colorRgb},0.7)` }}>
              {"// ROLE"}
            </div>
            <h3
              className="font-black uppercase leading-[1.0] text-black dark:text-white"
              style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.6rem, 3.5vw, 2.7rem)", letterSpacing: "-0.025em" }}
            >
              {job.role.map((line, li) => <span key={li} className="block">{line}</span>)}
            </h3>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: `linear-gradient(to right, rgba(${job.colorRgb},0.4), transparent)` }} />

          {/* Bullet log entries */}
          <div className="flex flex-col gap-2.5 flex-1">
            {job.bullets.map((b, bi) => (
              <div key={bi} className="flex items-start gap-3 group">
                <span
                  className="font-mono text-[9px] mt-[3px] shrink-0 tabular-nums"
                  style={{ color: `rgba(${job.colorRgb},0.45)` }}
                >
                  {String(bi + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-black/55 dark:text-white/50 group-hover:text-black/80 dark:group-hover:text-white/75 transition-colors duration-200">
                  {b}
                </p>
              </div>
            ))}
          </div>

          {/* Link */}
          {job.link && (
            <a
              href={job.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60 w-fit mt-1"
              style={{ color: job.color }}
            >
              <IconExternalLink size={11} />
              {job.link.label}
            </a>
          )}
        </div>
      </div>

      {/* ── TECH FOOTER ── */}
      <div
        className="relative z-10 flex flex-wrap gap-2 px-5 md:px-10 py-4"
        style={{ borderTop: `1px solid rgba(${job.colorRgb},0.1)` }}
      >
        {job.tech.map((t) => (
          <span
            key={t}
            className="font-mono text-[8px] uppercase tracking-[0.18em] px-2.5 py-1 transition-colors duration-200"
            style={{
              color: job.color,
              background: `rgba(${job.colorRgb},0.07)`,
              border: `1px solid rgba(${job.colorRgb},0.2)`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────
   Achievement Card
───────────────────────────────────────────────── */
const AchCard = ({ a, i }: { a: typeof ACHIEVEMENTS[0]; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
    className="relative overflow-hidden flex flex-col bg-white dark:bg-black/80"
    style={{
      borderTop: `2px solid ${a.color}`,
      boxShadow: `0 0 40px rgba(${a.colorRgb},0.06)`,
    }}
  >
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(ellipse 80% 70% at 50% -10%, rgba(${a.colorRgb},0.1) 0%, transparent 60%)` }}
    />
    <div
      className="pointer-events-none absolute bottom-0 right-3 select-none font-black leading-none text-black/[0.05] dark:text-white/[0.035]"
      style={{ fontFamily: "var(--font-orbitron)", fontSize: "8rem", letterSpacing: "-0.05em" }}
    >
      {a.idx}
    </div>

    <div className="relative z-10 p-6 md:p-8 flex flex-col gap-5 flex-1">
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-[8px] uppercase tracking-[0.3em] border px-2.5 py-1 font-bold"
          style={{ color: a.color, borderColor: `rgba(${a.colorRgb},0.35)`, background: `rgba(${a.colorRgb},0.08)` }}
        >
          {a.badge}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/35 dark:text-white/25">ACHIEVEMENT</span>
      </div>

      <h3
        className="font-black uppercase leading-[1.0] text-black dark:text-white"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.3rem, 2.8vw, 2rem)", letterSpacing: "-0.02em" }}
      >
        {a.title.map((l, li) => <span key={li} className="block">{l}</span>)}
      </h3>

      <div className="h-px" style={{ background: `linear-gradient(to right, rgba(${a.colorRgb},0.4), transparent)` }} />

      <div className="flex flex-col gap-2.5 flex-1">
        {a.points.map((p, pi) => (
          <div key={pi} className="flex items-start gap-2.5">
            <IconBolt size={11} className="shrink-0 mt-[3px]" style={{ color: a.color }} />
            <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-black/55 dark:text-white/50">{p}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────
   Scroll-driven left rail
───────────────────────────────────────────────── */
const Rail = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 15%", "end 85%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-[2px] hidden lg:block pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/[0.06] dark:bg-white/[0.04]" />
      <motion.div
        className="absolute top-0 left-0 right-0 h-full origin-top"
        style={{
          scaleY,
          background: "linear-gradient(to bottom, #818cf8 0%, #22d3ee 40%, #34d399 80%, #fbbf24 100%)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Section header
───────────────────────────────────────────────── */
const Header = () => (
  <div className="relative px-5 md:px-10 pt-10 pb-8 md:pt-14 md:pb-10 overflow-hidden">
    {/* faint grid bg */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.05] dark:hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,1) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.018] hidden dark:block"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    <FadeReveal delay={0} className="flex items-center gap-3 mb-5">
      <div className="w-1.5 h-1.5 bg-indigo-400 animate-pulse" />
      <RevealChars
        text="SYS.CAREER_LOG"
        className="font-mono text-[9px] uppercase tracking-[0.45em] text-black/45 dark:text-white/35"
        delay={0.1}
      />
      <div className="h-px w-16 bg-gradient-to-r from-indigo-400/50 to-transparent" />
    </FadeReveal>

    {/* WORK / HISTORY — editorial stacked titles */}
    <div className="flex flex-col md:flex-row md:items-end md:gap-8">
      <div>
        <h2
          className="font-black uppercase leading-none text-black dark:text-white block"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(3rem, 10vw, 8rem)", letterSpacing: "-0.035em" }}
        >
          <RevealText text="WORK" delay={0.1} stagger={0.05} />
        </h2>
        <h2
          className="font-black uppercase leading-none block text-black/25 dark:text-white/20"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            letterSpacing: "-0.035em",
            WebkitTextStrokeWidth: "1.5px",
            WebkitTextStrokeColor: "currentColor",
            WebkitTextFillColor: "transparent",
          }}
        >
          <RevealText text="HISTORY" delay={0.18} stagger={0.045} />
        </h2>
      </div>

      <div className="flex flex-row md:flex-col gap-4 md:gap-1.5 mb-1 mt-5 md:mt-0">
        {["01 · BACKEND", "02 · INFRA", "03 · FULL-STACK"].map((t, i) => (
          <FadeReveal key={t} delay={0.5 + i * 0.07}>
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/40 dark:text-white/28 whitespace-nowrap">{t}</span>
          </FadeReveal>
        ))}
      </div>
    </div>

    {/* quick-stats strip */}
    <div className="flex flex-wrap items-center gap-6 md:gap-10 mt-6 pt-5 border-t border-black/[0.10] dark:border-white/[0.07]">
      {[
        { n: "3",    lbl: "ROLES"     },
        { n: "1.5+", lbl: "YRS EXP"  },
        { n: "50K+", lbl: "MSG/SEC"  },
        { n: "<1MS", lbl: "LATENCY"  },
      ].map((s) => (
        <div key={s.lbl} className="flex flex-col gap-0.5">
          <span
            className="font-bold text-black dark:text-white leading-none"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.9rem,2vw,1.15rem)" }}
          >
            {s.n}
          </span>
          <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-black/40 dark:text-white/28">{s.lbl}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────
   Sticky stacking wrapper — each card pins, the next
   slides up and rests on top. Works on every screen
   size (top-pinned, not viewport-locked, so tall
   mobile cards are never clipped).
───────────────────────────────────────────────── */
// jobs (each its own card) + the achievements slide (1)
const DECK_TOTAL = JOBS.length + 1;

const StickyStack = ({ children, i, total }: { children: React.ReactNode; i: number; total: number }) => {
  // earlier cards sit slightly smaller behind newer ones → layered deck depth
  const scale = 1 - (total - 1 - i) * 0.025;
  return (
    <div className="sticky" style={{ top: `${14 + i * 12}px` }}>
      <div className="origin-top will-change-transform" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   EXPERIENCE — main export
───────────────────────────────────────────────── */
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full py-8 md:py-16 bg-white dark:bg-transparent transition-colors duration-500">
      <div className="relative mx-auto max-w-[96vw] 2xl:max-w-[1600px]">
        <div
          ref={containerRef}
          className="relative bg-neutral-50 dark:bg-black/35 border border-black/[0.10] dark:border-white/[0.07]"
        >
          <Rail containerRef={containerRef as React.RefObject<HTMLDivElement>} />

          <Header />

          {/* gradient separator */}
          <div
            className="h-px mx-5 md:mx-10"
            style={{ background: "linear-gradient(to right, #818cf8, #22d3ee, #34d399, transparent)" }}
          />

          {/* Unified sticky stacking deck: jobs first, then the achievements
              slide pins on top last — every card participates in the stack. */}
          <div className="relative mt-px">
            {JOBS.map((job, i) => (
              <StickyStack key={job.idx} i={i} total={DECK_TOTAL}>
                <JobCard job={job} i={i} />
              </StickyStack>
            ))}

            {/* Achievements = one final pinning slide (kept side-by-side, opaque
                so it cleanly covers the job card beneath it) */}
            <StickyStack i={JOBS.length} total={DECK_TOTAL}>
              <div className="relative bg-neutral-50 dark:bg-black/80 border-t border-black/[0.08] dark:border-white/[0.06]">
                {/* separator */}
                <div className="px-5 md:px-10 py-4 flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black/45 dark:text-white/35">ACHIEVEMENTS</span>
                  <div className="flex-1 h-px bg-black/[0.10] dark:bg-white/[0.05]" />
                </div>
                {/* achievement cards (2-up) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.06] dark:bg-white/[0.03]">
                  {ACHIEVEMENTS.map((a, i) => (
                    <AchCard key={a.idx} a={a} i={i} />
                  ))}
                </div>
              </div>
            </StickyStack>
          </div>
        </div>
      </div>
    </section>
  );
}
