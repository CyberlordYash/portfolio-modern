"use client";

import React from "react";
import { Mask, Rise, Draw } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   EXPERIENCE

   A CV, set as one. Each role is a two-column spread: identity on the
   left, evidence on the right, a hairline between entries. No cards,
   no centre spine, no glass.

   The previous version rendered a vertical timeline of centred glass
   cards with per-job accent colours, hover states, a scroll-driven
   progress rail and a thumbnail each. All of that framing competed
   with the only thing a reader is here for — what was built and what
   it moved.

   The metrics are the one graphic moment: four numbers set at display
   scale. On a page of body copy, a row of large figures is what the
   eye lands on, and they are the strongest thing in this section.
══════════════════════════════════════════════════════════════════ */

type Job = (typeof JOBS)[number];

function Entry({ job, i }: { job: Job; i: number }) {
  return (
    <article className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-rule py-14 md:py-20 lg:grid-cols-12">
      {/* ── Identity ───────────────────────────────────────────── */}
      <div className="lg:col-span-4">
        <Rise>
          <div className="flex items-baseline gap-3">
            <span className="micro num">{job.idx}/</span>
            {job.status === "ACTIVE" && (
              <span className="flex items-center gap-1.5">
                <span className="block-mark h-[5px] w-[5px] rounded-full" />
                {/* text-mark, not text-accent: shadcn's config defines
                    `accent` as hsl(var(--accent)), and this system sets
                    --accent to an rgb() value — so `text-accent`
                    compiles to hsl(rgb(…)), which is invalid and gets
                    dropped, leaving the label inheriting grey. */}
                <span className="micro text-mark">Current</span>
              </span>
            )}
          </div>
        </Rise>

        <h3 className="display mt-4" style={{ fontSize: "var(--t-h2)" }}>
          <Mask>{job.company}</Mask>
        </h3>

        <Rise delay={0.08}>
          <p className="mt-3 text-[0.95rem] leading-snug text-ink2">{job.role}</p>
          <p className="micro mt-4">{job.period}</p>
          <p className="micro mt-1">{job.location}</p>

          {job.link && (
            <a
              href={job.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="elink micro mt-5 inline-block text-ink"
            >
              {job.link.label} ↗
            </a>
          )}
        </Rise>
      </div>

      {/* ── Evidence ───────────────────────────────────────────── */}
      <div className="lg:col-span-7 lg:col-start-6">
        <Rise delay={0.05}>
          <p className="lede max-w-[46ch]">{job.summary}</p>
        </Rise>

        {/* Metrics. Sized off the heading scale so they read as
            display type rather than as a stat widget. */}
        <Rise delay={0.12}>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {job.metrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd
                  className="display num"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
                >
                  {m.value}
                </dd>
                <p className="micro mt-2">{m.label}</p>
              </div>
            ))}
          </dl>
        </Rise>

        <Draw delay={0.18} className="mt-10" />

        <Rise delay={0.2}>
          <ul className="mt-8 flex flex-col gap-4">
            {job.bullets.map((b, bi) => (
              <li key={bi} className="flex gap-4">
                <span className="micro num mt-[0.3em] shrink-0 opacity-60">
                  {String(bi + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-ink2">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-1.5">
            {job.tech.map((t) => (
              <li key={t} className="micro">
                {t}
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </article>
  );
}

const Experience = () => (
  <div>
    {JOBS.map((job, i) => (
      <Entry key={job.idx} job={job} i={i} />
    ))}

    {/* ── Outside the job history ──────────────────────────────── */}
    <div className="border-t border-rule pt-14 md:pt-20">
      <Rise>
        <span className="micro">Also worth knowing</span>
      </Rise>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
        {ACHIEVEMENTS.map((a, i) => (
          <Rise key={a.badge} delay={0.06 * i}>
            <div className="flex items-baseline gap-3">
              <span className="sec-num">{a.badge}</span>
            </div>
            <h4 className="h3 mt-5">{a.title}</h4>
            <ul className="mt-4 flex flex-col gap-2">
              {a.points.map((p) => (
                <li key={p} className="text-[0.9375rem] leading-relaxed text-ink2">
                  {p}
                </li>
              ))}
            </ul>
          </Rise>
        ))}
      </div>
    </div>
  </div>
);

/* ─── content ─────────────────────────────────────────────────────
   Unchanged from the previous build except for the removal of the
   per-job `accent` and `image` fields, which existed only to colour
   and illustrate the retired cards. */

const JOBS = [
  {
    idx: "01",
    company: "Zanskar Securities",
    role: "Analyst · Software Engineer",
    location: "Bengaluru, India",
    period: "Jul 2025 — Present",
    status: "ACTIVE" as const,
    summary:
      "Building sub-millisecond order execution infrastructure for Nubra — an in-house fintech trading platform serving retail and institutional users.",
    metrics: [
      { value: "50K+", label: "Msg / sec" },
      { value: "35%", label: "P99 drop" },
      { value: "40%", label: "GC saved" },
      { value: "<1ms", label: "Latency" },
    ],
    bullets: [
      "Designed low-latency Golang services using advanced concurrency patterns — goroutines, channels, and worker pools — for high-frequency trading workloads.",
      "Built batch-based WebSocket pipelines that aggregate and stream market and trade data in real time, cutting network overhead and lifting client-side throughput.",
      "Used NATS JetStream for durable event streaming, and integrated Python alerting pipelines for live monitoring.",
      "Distributed the order book across custom ring-buffer structures, cutting GC pressure ~40% and P99 latency 35%, profiled with Go pprof.",
      "Integrated NSE, BSE, MF and IPO platforms over SOAP and Open APIs, enabling real-time data ingestion and order workflows.",
      "Engineered core Nubra modules — order management, portfolio tracking, real-time market feeds, plus eDIS, Early Pay-in and Pledge settlement flows.",
    ],
    link: { label: "nubra.io", href: "https://nubra.io" },
    tech: [
      "Golang",
      "NATS JetStream",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Python",
      "OpenTelemetry",
    ],
  },
  {
    idx: "02",
    company: "Onefinnet",
    role: "Software Engineering Intern",
    location: "Noida NCR, India",
    period: "Jan 2025 — Jun 2025",
    status: "COMPLETED" as const,
    summary:
      "Worked across the stack — Next.js frontend and high-performance Golang backend — on a fintech platform under production load.",
    metrics: [
      { value: "25%", label: "Throughput" },
      { value: "21%", label: "Manual work ↓" },
      { value: "3", label: "Obs. tools" },
    ],
    bullets: [
      "Contributed to the frontend architecture using Next.js and Material UI.",
      "Engineered high-performance Golang backend services using goroutines and channels for concurrent request handling — improving throughput 25% and reducing latency.",
      "Developed an internal chatbot with Go and Azure AI Services, using concurrency patterns for parallel workflow execution across multiple users, cutting manual tasks 21%.",
      "Enhanced observability with Grafana, Prometheus and Loki — identified slow endpoints and optimised hot paths.",
    ],
    link: { label: "onefinnet.com", href: "https://onefinnet.com/talent" },
    tech: [
      "Golang",
      "Next.js",
      "Material UI",
      "Azure AI",
      "Grafana",
      "Prometheus",
      "Loki",
    ],
  },
  {
    idx: "03",
    company: "Modulus Technologies",
    role: "Software Engineering Intern",
    location: "Remote",
    period: "Jul 2024 — Oct 2024",
    status: "COMPLETED" as const,
    summary:
      "Modernised a billing management platform — front to back — for faster loads and a more robust data layer.",
    metrics: [
      { value: "30%", label: "Faster loads" },
      { value: "SSR", label: "Next.js" },
      { value: "GCP", label: "Deployed" },
    ],
    bullets: [
      "Migrated the billing management system from React to Next.js, reducing page load times 30%.",
      "Designed and implemented a backend architecture using PostgreSQL, FeatherJS and GCP.",
      "Built typed, responsive UI with TypeScript and Tailwind CSS across the billing dashboard.",
    ],
    link: null,
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "FeatherJS",
      "PostgreSQL",
      "GCP",
    ],
  },
];

const ACHIEVEMENTS = [
  {
    badge: "CP",
    title: "Competitive programming",
    points: [
      "LeetCode Guardian — rating 2200+",
      "CodeChef 4★ — rating 1850+",
      "800+ algorithmic problems solved",
    ],
  },
  {
    badge: "NDA",
    title: "NDA SSB recommended",
    points: [
      "Cleared the NDA SSB — All India Rank 193",
      "Leadership under high-pressure scenarios",
      "Strategic thinking in officer-selection assessments",
    ],
  },
];

export default Experience;
