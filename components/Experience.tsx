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
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div
        className="font-semibold leading-none tabular-nums"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1rem,1.8vw,1.45rem)", color, textShadow: `0 0 18px ${color}55, ${TXT}` }}
      >
        {match ? `${counted}${suffix}` : value}
      </div>
      <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/55">
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
    location: "Bengaluru",
    period: "JUL 2025 — PRESENT",
    status: "ACTIVE" as const,
    color: "#4ade80",
    colorRgb: "74,222,128",
    image: "/nubra.webp",
    imageAlt: "Nubra",
    summary:
      "Building sub-millisecond order execution infrastructure for Nubra — an in-house fintech trading platform serving retail and institutional users.",
    metrics: [
      { value: "50K+", label: "MSG/SEC" },
      { value: "35%",  label: "P99 DROP" },
      { value: "40%",  label: "GC SAVED" },
      { value: "<1MS", label: "LATENCY"  },
    ],
    bullets: [
      "Designed low-latency Golang services using advanced concurrency patterns — goroutines, channels, and worker pools — for high-frequency trading workloads",
      "Built batch-based WebSocket pipelines that aggregate and stream market & trade data in real time, cutting network overhead and lifting client-side throughput",
      "Used NATS JetStream for durable event streaming and integrated Python alerting pipelines for live monitoring",
      "Distributed order book on custom ring-buffer structures, cutting GC pressure ~40% and P99 latency 35% via Go pprof profiling",
      "Integrated NSE, BSE, MF, and IPO platforms over SOAP-based and Open APIs, enabling real-time data ingestion and order workflows",
      "Engineered core Nubra modules — order management, portfolio tracking, and real-time market feeds, plus eDIS, Early Pay-in & Pledge settlement flows",
    ],
    link: { label: "nubra.io", href: "https://nubra.io" },
    tech: ["Golang", "NATS JetStream", "Kafka", "PostgreSQL", "Redis", "Python", "OpenTelemetry"],
  },
  {
    idx: "02",
    year: "2025",
    company: "ONEFINNET",
    role: "Software Engineering Intern",
    location: "Noida-NCR",
    period: "JAN 2025 — JUN 2025",
    status: "COMPLETED" as const,
    color: "#22c55e",
    colorRgb: "34,197,94",
    image: "/onefinnet.png",
    imageAlt: "OneFinnet",
    summary:
      "Worked across the stack — Next.js frontend and high-performance Golang backend — on a fintech platform under production load.",
    metrics: [
      { value: "25%", label: "THROUGHPUT" },
      { value: "21%", label: "MANUAL ↓"   },
      { value: "3",   label: "OBS. TOOLS" },
    ],
    bullets: [
      "Contributed to the frontend architecture using Next.js and Material UI",
      "Engineered high-performance Golang backend services leveraging goroutines and channels for concurrent request handling — improving throughput by 25% and reducing latency",
      "Developed an internal chatbot with Go and Azure AI Services, using concurrency patterns for parallel workflow execution and multi-user interactions, cutting manual tasks by 21%",
      "Enhanced observability with Grafana, Prometheus, and Loki — identified slow endpoints and optimised hot paths",
    ],
    link: { label: "onefinnet.com", href: "https://onefinnet.com/talent" },
    tech: ["Golang", "Next.js", "Material UI", "Azure AI", "Grafana", "Prometheus", "Loki"],
  },
  {
    idx: "03",
    year: "2024",
    company: "MODULUS TECHNOLOGIES",
    role: "Software Engineering Intern",
    location: "Remote",
    period: "JUL 2024 — OCT 2024",
    status: "COMPLETED" as const,
    color: "#34d399",
    colorRgb: "52,211,153",
    image: "/ambill.jpg",
    imageAlt: "Ambill",
    summary:
      "Modernised a billing management platform — front to back — for faster loads and a more robust data layer.",
    metrics: [
      { value: "30%",  label: "LOAD FASTER" },
      { value: "SSR",  label: "NEXT.JS"     },
      { value: "GCP",  label: "DEPLOYED"    },
    ],
    bullets: [
      "Migrated the billing management system from React to Next.js, reducing page load times by 30%",
      "Designed and implemented a robust backend architecture using PostgreSQL, FeatherJS, and GCP",
      "Built typed, responsive UI with TypeScript and Tailwind CSS across the billing dashboard",
    ],
    link: null,
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "FeatherJS", "PostgreSQL", "GCP"],
  },
];

const ACHIEVEMENTS = [
  {
    badge: "GUARDIAN",
    title: "Competitive Programming",
    color: "#14b8a6",
    colorRgb: "20,184,166",
    points: [
      "LeetCode Guardian — Rating 2200+",
      "CodeChef 4★ — Rating 1850+",
      "800+ algorithmic problems solved",
    ],
  },
  {
    badge: "AIR 193",
    title: "NDA SSB Recommended",
    color: "#16a34a",
    colorRgb: "22,163,74",
    points: [
      "Cleared NDA SSB — All India Rank 193",
      "Leadership under high-pressure scenarios",
      "Strategic thinking in officer-selection assessments",
    ],
  },
];

/* ─────────────────────────────────────────────────
   Timeline entry — centered glass card on a center spine
───────────────────────────────────────────────── */
const Entry = ({ job }: { job: typeof JOBS[0] }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full flex-col items-center mb-16 md:mb-24"
    >
      {/* ── node on the spine: index + pulsing dot ── */}
      <div className="relative z-10 flex flex-col items-center">
        <span
          className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] mb-3"
          style={{ color: job.color, textShadow: TXT }}
        >
          {job.idx}
        </span>
        <span className="relative flex h-6 w-6 items-center justify-center">
          {job.status === "ACTIVE" && (
            <span className="absolute inline-flex h-6 w-6 rounded-full animate-ping" style={{ background: `rgba(${job.colorRgb},0.45)` }} />
          )}
          <span
            className="absolute inline-flex h-5 w-5 rounded-full border-2"
            style={{ borderColor: job.color, background: `rgba(${job.colorRgb},0.15)`, boxShadow: `0 0 16px ${job.color}` }}
          />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: job.color, boxShadow: `0 0 8px ${job.color}` }} />
        </span>
      </div>

      {/* ── centered glass card ── */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mt-7 w-full max-w-[660px] border backdrop-blur-md overflow-hidden transition-all duration-300"
        style={{
          borderColor: hover ? `rgba(${job.colorRgb},0.5)` : "rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.34)",
          boxShadow: hover ? `0 0 40px rgba(${job.colorRgb},0.18)` : "none",
        }}
      >
        {/* top accent strip */}
        <span className="absolute inset-x-0 top-0 h-[2px] z-20" style={{ background: job.color }} />
        {/* corner brackets (HUD) */}
        <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: job.color }} />
        <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: job.color }} />

        {/* giant ghost year behind the content */}
        <span
          className="pointer-events-none absolute -top-2 right-3 font-black leading-none select-none text-white/[0.05]"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(4rem,9vw,7rem)", letterSpacing: "-0.05em" }}
        >
          {job.year}
        </span>
        {/* accent glow from the top edge */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{ background: `radial-gradient(60% 100% at 50% 0%, rgba(${job.colorRgb},0.12), transparent 70%)` }}
        />

        <div className="relative z-10 px-6 md:px-9 pt-7 pb-7 text-center">
          {/* company logo chip */}
          <div
            className="group/logo relative mx-auto mb-5 flex h-16 w-32 items-center justify-center border backdrop-blur-md overflow-hidden"
            style={{ borderColor: `rgba(${job.colorRgb},0.3)`, background: "rgba(0,0,0,0.3)" }}
          >
            <img
              src={job.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-125 blur-xl opacity-50"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/40" />
            <img
              src={job.image}
              alt={job.imageAlt}
              className="relative z-10 max-h-9 max-w-[80%] object-contain transition-transform duration-300 group-hover/logo:scale-105"
              style={{ filter: `drop-shadow(0 0 10px rgba(${job.colorRgb},0.4))` }}
            />
          </div>

          {/* meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: job.color, textShadow: TXT }}>
              {job.period}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/45" style={{ textShadow: TXT }}>
              {job.location}
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
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.3rem,2.6vw,1.95rem)", letterSpacing: "-0.02em", textShadow: TXT }}
          >
            {job.company}
          </h3>
          <p className="mt-2 font-mono text-[11px] md:text-[12px] tracking-wide text-white/80" style={{ textShadow: TXT }}>
            {job.role}
          </p>

          {/* summary */}
          <p className="mt-4 mx-auto max-w-[540px] text-[13px] md:text-[14px] leading-relaxed text-white/95" style={{ textShadow: TXT }}>
            {job.summary}
          </p>

          {/* accent divider */}
          <div className="mx-auto my-6 h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${job.color}, transparent)` }} />

          {/* bullets — left-aligned within a centered block for readability */}
          <ul className="mx-auto flex max-w-[560px] flex-col gap-2.5 text-left">
            {job.bullets.map((b, bi) => (
              <li key={bi} className="flex items-start gap-3">
                <span className="mt-[7px] h-px w-3 shrink-0" style={{ background: job.color }} />
                <span className="font-mono text-[11.5px] md:text-[12.5px] leading-relaxed text-white/85" style={{ textShadow: TXT }}>{b}</span>
              </li>
            ))}
          </ul>

          {/* metrics */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-9 gap-y-5 border-t border-white/[0.12] pt-6">
            {job.metrics.map((m) => (
              <Metric key={m.label} {...m} color={job.color} />
            ))}
          </div>

          {/* tech */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {job.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[8px] uppercase tracking-[0.18em] px-2.5 py-1 border border-white/[0.15] text-white/60 backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* link */}
          {job.link && (
            <a
              href={job.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.22em] transition-colors"
              style={{ color: hover ? job.color : "rgba(255,255,255,0.7)", textShadow: TXT }}
            >
              {job.link.label}
              <IconArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────
   Scroll-fill rail (down the center spine)
───────────────────────────────────────────────── */
const Rail = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 30%", "end 70%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute top-3 bottom-10 w-[3px] overflow-hidden rounded-full left-1/2 -translate-x-1/2">
      <div className="absolute inset-0 bg-white/20" />
      <motion.div
        className="absolute top-0 left-0 right-0 h-full origin-top rounded-full"
        style={{
          scaleY,
          background: "linear-gradient(to bottom, #4ade80, #22c55e 50%, #16a34a)",
          boxShadow: "0 0 16px rgba(129,140,248,0.9), 0 0 6px rgba(34,211,238,0.8)",
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────
   EXPERIENCE — main export (centered, transparent)
───────────────────────────────────────────────── */
export default function Experience() {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full py-16 md:py-28 transition-colors duration-500">
      <div className="mx-auto max-w-[760px] px-4">

        {/* ── header (centered) ── */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <FadeReveal delay={0} className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 animate-pulse" />
            <RevealChars
              text="SYS.CAREER_LOG"
              className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/50"
              delay={0.1}
            />
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
          </FadeReveal>

          <h2
            className="font-black uppercase leading-[0.92] whitespace-nowrap text-white/90"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.9rem, 6.5vw, 4.2rem)", letterSpacing: "-0.035em", textShadow: TXT }}
          >
            <RevealText text="WORK" delay={0.1} stagger={0.05} />{" "}
            <span
              style={{
                WebkitTextStrokeWidth: "1.75px",
                WebkitTextStrokeColor: "rgba(255,255,255,0.82)",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))",
              }}
            >
              <RevealText text="HISTORY" delay={0.18} stagger={0.045} />
            </span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-7">
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

        {/* ── timeline (center spine) ── */}
        <div ref={railRef} className="relative flex flex-col items-center">
          <Rail containerRef={railRef as React.RefObject<HTMLDivElement>} />
          {JOBS.map((job) => (
            <Entry key={job.idx} job={job} />
          ))}
        </div>

        {/* ── recognition (centered) ── */}
        <div className="mt-10 md:mt-16">
          <FadeReveal delay={0} className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 max-w-[80px] bg-white/[0.12]" />
            <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/50" style={{ textShadow: TXT }}>RECOGNITION</span>
            <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
            <div className="h-px flex-1 max-w-[80px] bg-white/[0.12]" />
          </FadeReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.badge}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="relative border backdrop-blur-md overflow-hidden px-5 py-5"
                style={{ borderColor: `rgba(${a.colorRgb},0.25)`, background: "rgba(0,0,0,0.3)" }}
              >
                <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: a.color }} />
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
