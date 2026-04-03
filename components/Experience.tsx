"use client";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import {
  IconCircleCheckFilled,
  IconBriefcase,
  IconTerminal,
  IconCode,
  IconExternalLink,
  IconTrophy,
} from "@tabler/icons-react";

// --- Shared helpers ---

const ExperiencePoint = ({
  text,
  link,
}: {
  text: string;
  link?: { label: string; href: string };
}) => (
  <div className="group/pt flex items-start gap-2.5">
    <IconCircleCheckFilled
      size={14}
      className="mt-[3px] shrink-0 text-emerald-500/50 transition-colors duration-200 group-hover/pt:text-emerald-500"
    />
    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
      {text}
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 inline-flex items-center gap-0.5 font-semibold text-indigo-600 decoration-indigo-500/30 underline-offset-4 hover:underline dark:text-indigo-400"
        >
          {link.label}
          <IconExternalLink size={11} />
        </a>
      )}
    </p>
  </div>
);

const TechPill = ({
  label,
  color = "default",
}: {
  label: string;
  color?: "default" | "indigo" | "blue" | "emerald";
}) => {
  const colors = {
    default:
      "border-slate-200/80 bg-slate-100/60 text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-slate-400",
    indigo:
      "border-indigo-500/20 bg-indigo-500/[0.07] text-indigo-600 dark:text-indigo-400",
    blue: "border-blue-500/20 bg-blue-500/[0.07] text-blue-600 dark:text-blue-400",
    emerald:
      "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-600 dark:text-emerald-400",
  };
  return (
    <span
      className={`rounded-md border px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide ${colors[color]}`}
    >
      {label}
    </span>
  );
};

// --- Role Cards ---

const ZanskarCard = () => (
  <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-violet-500/[0.03] p-6 dark:from-indigo-500/[0.09] dark:to-violet-500/[0.04]">
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-[60px]" />

    {/* Status badge */}
    <div className="mb-5 flex items-center gap-2.5">
      <IconBriefcase size={15} className="text-indigo-500/70" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        Active
      </span>
    </div>

    <h3 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-[1.75rem]">
      Analyst Software Engineer
    </h3>
    <p className="mb-6 font-mono text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">
      @ Zanskar Securities
    </p>

    <div className="mb-6 space-y-2.5">
      <ExperiencePoint text="Building sub-millisecond order execution pipelines in Go for high-frequency trading" />
      <ExperiencePoint text="Designed event-driven microservices on NATS JetStream processing 50,000+ messages/sec with guaranteed delivery" />
      <ExperiencePoint text="Architected distributed order book using custom memory-efficient ring-buffer data structures, cutting GC pressure by ~40%" />
      <ExperiencePoint text="Implemented real-time risk management middleware — circuit breakers, rate limiting, distributed tracing with OpenTelemetry" />
      <ExperiencePoint text="Profiled critical hot paths with Go pprof and trace tooling, reducing P99 latency by 35% on order routing" />
      <ExperiencePoint text="Engineered multi-leg options strategies execution engine with deterministic, lock-free order routing" />
      <ExperiencePoint text="Optimized Go runtime — tuned GOMAXPROCS, goroutine pools, and sync.Pool to minimize allocations under load" />
      <ExperiencePoint
        text="Building trading platform "
        link={{ label: "Nubra", href: "https://nubra.io" }}
      />
    </div>

    <div className="mb-6 flex flex-wrap gap-1.5">
      {[
        "Go",
        "NATS JetStream",
        "Kafka",
        "PostgreSQL",
        "Redis",
        "Docker",
        "OpenTelemetry",
        "HFT",
      ].map((t) => (
        <TechPill key={t} label={t} color="indigo" />
      ))}
    </div>

    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-indigo-500/10 md:h-72">
      <img
        src="/nubra.webp"
        alt="Nubra"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  </div>
);

const OnefinnetCard = () => (
  <div className="group relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-500/[0.03] p-6 dark:from-blue-500/[0.09] dark:to-cyan-500/[0.04]">
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/5 blur-[60px]" />

    <div className="mb-5 flex items-center gap-2.5">
      <IconTerminal size={15} className="text-blue-500/70" />
      <span className="rounded-full border border-slate-300/60 bg-slate-100/60 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400">
        Completed
      </span>
    </div>

    <h3 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-[1.75rem]">
      Software Developer Intern
    </h3>
    <p className="mb-6 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
      @ Onefinnet
    </p>

    <div className="mb-6 space-y-2.5">
      <ExperiencePoint text="Designed and built REST and WebSocket APIs in Go handling 10,000+ concurrent connections under production load" />
      <ExperiencePoint text="Implemented Redis-based caching and session management layer, reducing average API response time by 45%" />
      <ExperiencePoint text="Built real-time chat infrastructure using Go and NATS JetStream supporting 1,000+ simultaneous users" />
      <ExperiencePoint text="Containerized microservices with Docker and orchestrated zero-downtime deployments on GCP Cloud Run" />
      <ExperiencePoint text="Led backend architecture for Spot Chat and Meeting Platform — designed schema, auth flow, and pub/sub routing" />
      <ExperiencePoint text="Wrote integration and load tests with k6, identifying throughput bottlenecks before production release" />
      <ExperiencePoint
        text="Built hiring platform "
        link={{ label: "OneFinnet Talent", href: "https://onefinnet.com/talent" }}
      />
    </div>

    <div className="mb-6 flex flex-wrap gap-1.5">
      {["Go", "WebSocket", "Redis", "NATS", "Docker", "GCP Cloud Run", "k6"].map((t) => (
        <TechPill key={t} label={t} color="blue" />
      ))}
    </div>

    <div className="flex h-28 w-full items-center justify-center rounded-xl border border-blue-500/10 bg-slate-100/50 p-6 dark:bg-slate-900/50 md:h-44">
      <img
        src="/onefinnet.png"
        alt="Onefinnet"
        className="max-h-full object-contain dark:invert"
      />
    </div>
  </div>
);

const ModulusCard = () => (
  <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-teal-500/[0.03] p-6 dark:from-emerald-500/[0.09] dark:to-teal-500/[0.04]">
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/5 blur-[60px]" />

    <div className="mb-5 flex items-center gap-2.5">
      <IconCode size={15} className="text-emerald-500/70" />
      <span className="rounded-full border border-slate-300/60 bg-slate-100/60 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400">
        Completed
      </span>
    </div>

    <h3 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-[1.75rem]">
      Software Developer Intern
    </h3>
    <p className="mb-6 font-mono text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
      @ Modulus Technologies LLP
    </p>

    <div className="mb-6 space-y-2.5">
      <ExperiencePoint text="Built full-stack SaaS billing and invoice automation platform using Next.js, FeatherJS, and PostgreSQL" />
      <ExperiencePoint text="Migrated system from React → Next.js with SSR and route-level code splitting, achieving 30% faster load times" />
      <ExperiencePoint text="Integrated Stripe payment APIs with automated invoice generation, PDF export, and webhook event handling" />
      <ExperiencePoint text="Designed multi-tenant database schema with row-level security and role-based access control for billing workflows" />
      <ExperiencePoint text="Built audit log system tracking all financial mutations with immutable event sourcing" />
      <ExperiencePoint
        text="Built invoice automation system "
        link={{ label: "Ambill", href: "https://www.ambill.ai/about-us" }}
      />
    </div>

    <div className="mb-6 flex flex-wrap gap-1.5">
      {["Next.js", "TypeScript", "FeatherJS", "PostgreSQL", "Stripe", "Tailwind CSS"].map(
        (t) => (
          <TechPill key={t} label={t} color="emerald" />
        ),
      )}
    </div>

    <div className="flex h-28 w-full items-center justify-center rounded-xl border border-emerald-500/10 bg-slate-100/50 p-6 dark:bg-slate-900/50 md:h-44">
      <img
        src="/ambill.jpg"
        alt="Ambill"
        className="max-h-full rounded-lg object-contain"
      />
    </div>
  </div>
);

const AchievementsCard = () => (
  <div className="space-y-5">
    {/* Competitive Programming */}
    <div className="relative overflow-hidden rounded-2xl p-[1px]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400" />
      <div className="relative rounded-[calc(1rem-1px)] bg-white p-5 dark:bg-slate-950 md:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-orange-500/80 via-amber-400/80 to-yellow-400/80" />
        <div className="mb-4 flex items-center gap-3">
          <IconTrophy className="text-orange-500" size={20} />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            Competitive Programming
          </h4>
        </div>
        <div className="mb-6 space-y-2.5">
          <ExperiencePoint text="Guardian @ LeetCode — Rating 2200+" />
          <ExperiencePoint text="4★ @ CodeChef — Rating 1850+" />
          <ExperiencePoint text="Solved 800+ algorithmic problems across platforms" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img
            src="/guardian.gif"
            className="h-24 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain dark:border-white/5 dark:bg-black/40 md:h-40"
            alt="LeetCode Guardian"
          />
          <img
            src="/codechef.svg"
            className="h-24 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain p-2 dark:border-white/5 dark:bg-black/40 md:h-40 md:p-4"
            alt="CodeChef 4 Star"
          />
        </div>
      </div>
    </div>

    {/* NDA SSB */}
    <div className="relative overflow-hidden rounded-2xl p-[1px]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />
      <div className="relative rounded-[calc(1rem-1px)] bg-white p-5 dark:bg-slate-950 md:p-7">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-indigo-600/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            AIR 193
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            NDA SSB Recommended
          </h4>
        </div>
        <div className="space-y-2.5">
          <ExperiencePoint text="Cleared NDA SSB Interview — All India Rank 193" />
          <ExperiencePoint text="Demonstrated leadership under high-pressure scenarios across psychological and group testing" />
          <ExperiencePoint text="Showcased strategic thinking and communication in officer-selection assessments" />
        </div>
      </div>
    </div>
  </div>
);

const data = [
  { title: "July 2025 – Present", content: <ZanskarCard /> },
  { title: "Jan 2025 – June 2025", content: <OnefinnetCard /> },
  { title: "July 2024 – Oct 2024", content: <ModulusCard /> },
  { title: "Achievements", content: <AchievementsCard /> },
];

const Experience = () => {
  return (
    <section className="w-full py-12 md:py-24" id="experience">
      <div className="mx-auto max-w-[96vw] px-2 md:px-6 2xl:max-w-[1600px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-50/50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02] md:rounded-[3rem] md:p-12">
          {/* Background glows */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/5 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />

          {/* Section header */}
          <div className="relative mb-10 md:mb-14">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-[3px] w-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Work History
              </span>
            </div>
            <h2 className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-4xl font-bold tracking-tighter text-transparent dark:from-white dark:via-slate-200 dark:to-slate-500 md:text-8xl">
              Experience
            </h2>
          </div>

          <Timeline data={data} />
        </div>
      </div>
    </section>
  );
};

export default Experience;
