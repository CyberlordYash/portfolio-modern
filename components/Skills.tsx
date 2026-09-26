"use client";

import React from "react";
import { Mask, Rise, Draw } from "@/components/ui/Reveal";
import AIEngineering from "@/components/AIEngineering";

/* ══════════════════════════════════════════════════════════════════
   STACK

   Two halves. The core — the two languages the work actually revolves
   around — set large, with a sentence each explaining why. Then
   everything else as a ruled index, grouped by domain.

   Every brand icon is gone. The previous version rendered nineteen
   react-icons at their official brand colours (#00ADD8, #E76F00,
   #9D5BD2, #FF4438 …), which is nineteen accent colours in a palette
   that allows one. Set as text, the same list reads faster, works at
   any size, and says "PostgreSQL" rather than asking the reader to
   recognise an elephant.

   The hierarchy also does something the old flat grid could not: it
   says Go and C++ matter more than the other seventeen, which is the
   single most useful thing this section can communicate.
══════════════════════════════════════════════════════════════════ */

const Skills = () => (
  <div className="flex flex-col gap-24 md:gap-32">
    <AIEngineering />

    {/* ══ Core ═══════════════════════════════════════════════════ */}
    <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
      {CORE.map((c, i) => (
        <div key={c.name}>
          <Rise delay={i * 0.06}>
            <span className="micro">{c.label}</span>
          </Rise>

          <h3
            className="display mt-4"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            <Mask delay={i * 0.06}>{c.name}</Mask>
          </h3>

          <Draw delay={0.1 + i * 0.06} className="mt-6" />

          <Rise delay={0.16 + i * 0.06}>
            <p className="copy mt-6 max-w-[42ch]">{c.desc}</p>
          </Rise>
        </div>
      ))}
    </div>

    {/* ══ Everything else ════════════════════════════════════════
        A ruled index: domain on the left, the tools in it on the
        right. Two columns of text, one hairline per row. */}
    <div>
      <Rise className="mb-8 flex items-baseline justify-between gap-4">
        <span className="micro">Working knowledge</span>
        <span className="micro num">
          {TECH_COUNT} tools · {DOMAINS.length} domains
        </span>
      </Rise>

      <dl className="border-t border-rule">
        {DOMAINS.map((d, i) => (
          <Rise key={d.id} delay={i * 0.04}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-rule py-6 md:grid-cols-12 md:py-7">
              <dt className="micro md:col-span-4">{d.label}</dt>
              <dd className="md:col-span-8">
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {d.techs.map((t) => (
                    <li
                      key={t.name}
                      title={t.note}
                      className="text-[0.9375rem] tracking-[-0.01em] text-ink"
                    >
                      {t.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </Rise>
        ))}
      </dl>
    </div>
  </div>
);

/* ─── content ─────────────────────────────────────────────────────
   Same nineteen tools as before; the `icon` and `color` fields are
   dropped and the explanatory `note` is retained as a title
   attribute. */

const CORE = [
  {
    name: "Go",
    label: "Primary language",
    desc: "What I build production systems in — trading engines, real-time pipelines, distributed services. Chosen for its concurrency model and its predictable latency under load.",
  },
  {
    name: "C++",
    label: "Systems language",
    desc: "For the performance-critical paths — order books, memory-tight engines — and the language behind my competitive programming. Raw control, zero-cost abstractions.",
  },
];

const DOMAINS = [
  {
    id: "lang",
    label: "Languages",
    techs: [
      { name: "Go", note: "Primary language — trading systems, services" },
      { name: "C++", note: "Low-latency paths, competitive programming" },
      { name: "TypeScript", note: "Full-stack type safety" },
      { name: "Java", note: "Enterprise services, Spring ecosystem" },
      { name: "Python", note: "Tooling, automation, data scripts" },
    ],
  },
  {
    id: "infra",
    label: "Infra & observability",
    techs: [
      { name: "Google Cloud", note: "Cloud-native deployments" },
      { name: "Docker", note: "Containerised builds and runtimes" },
      { name: "Kubernetes", note: "Service orchestration" },
      { name: "Prometheus", note: "Metrics and alerting" },
      { name: "Grafana", note: "Dashboards and visualisation" },
    ],
  },
  {
    id: "be",
    label: "Backend",
    techs: [
      { name: "Node.js", note: "Real-time APIs and services" },
      { name: "Spring Boot", note: "JVM microservices" },
    ],
  },
  {
    id: "data",
    label: "Data & storage",
    techs: [
      { name: "PostgreSQL", note: "Relational modelling, query tuning" },
      { name: "MongoDB", note: "Document stores" },
      { name: "Redis", note: "Caching, pub/sub" },
    ],
  },
  {
    id: "msg",
    label: "Messaging & streaming",
    techs: [
      { name: "Kafka", note: "Event streaming backbones" },
      { name: "NATS", note: "JetStream messaging" },
    ],
  },
  {
    id: "ai",
    label: "AI & retrieval",
    techs: [
      { name: "RAG pipelines", note: "Retrieval-augmented generation over private corpora" },
      { name: "pgvector", note: "Vector search inside PostgreSQL" },
      { name: "Qdrant", note: "Dedicated vector store" },
      { name: "LangChain", note: "LLM orchestration" },
      { name: "OpenAI API", note: "Embeddings and completions" },
    ],
  },
  {
    id: "fe",
    label: "Frontend",
    techs: [
      { name: "React", note: "Component-driven UIs" },
      { name: "Next.js", note: "App Router, RSC — this site" },
      { name: "Tailwind CSS", note: "Design systems" },
    ],
  },
];

const TECH_COUNT = DOMAINS.reduce((n, d) => n + d.techs.length, 0);

export default Skills;
