"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import { Curtain, Rise } from "@/components/ui/Reveal";

import CertNism from "../public/nism-equity-derivatives.png";
import CertGo from "../public/go.jpg";
import CertWeb from "../public/web.jpg";
import CertDsa from "../public/dsa.jpg";
import CertNode from "../public/node.jpg";
import CertAws from "../public/aws.jpg";
import CertStock from "../public/stock_foundation.png";
import CertClaude from "../public/claude_code.png";
import CertLinux from "../public/linux.png";

type Poster = {
  bg: string;
  ink: string;
  soft: string;
  // "box" sets the accent word on an ink slab; "tint" just recolours it.
  accent: { style: "box" | "tint"; color: string };
  head: [string, string, string?];
  blurb: string;
};

type Cert = {
  num: string;
  title: string;
  issuer: string;
  category: string;
  year?: string;
  ref?: string;
  link?: string;
  image: StaticImageData;
  poster: Poster;
};

function Headline({ p }: { p: Poster }) {
  const [pre, hl, post] = p.head;
  return (
    <h3
      className="font-semibold leading-[0.95] tracking-[-0.035em]"
      style={{ fontSize: "clamp(1.05rem, 2.2vw, 2rem)" }}
    >
      {pre}{" "}
      {p.accent.style === "box" ? (
        <span
          className="box-decoration-clone px-1.5"
          style={{ background: p.ink, color: p.accent.color }}
        >
          {hl}
        </span>
      ) : (
        <span style={{ color: p.accent.color }}>{hl}</span>
      )}
      {post && <> {post}</>}
    </h3>
  );
}

function Card({ c, i }: { c: Cert; i: number }) {
  const p = c.poster;
  const body = (
    <>
      <Curtain delay={(i % 3) * 0.06}>
        <div
          className="relative flex aspect-[1/1] flex-col overflow-hidden p-3 md:p-4"
          style={{ background: p.bg, color: p.ink }}
        >
          <div
            className="flex items-baseline justify-between gap-2 font-mono text-[0.5rem] uppercase tracking-[0.12em] sm:text-[0.625rem] sm:tracking-[0.16em]"
            style={{ color: p.soft }}
          >
            <span>{c.category}</span>
            <span className="num">
              {c.num} / {String(certs.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3">
            <Headline p={p} />
          </div>

          <p
            className="mt-2 hidden max-w-[30ch] font-mono sm:block text-[0.6875rem] leading-[1.7]"
            style={{ color: p.soft }}
          >
            {p.blurb}
          </p>

          <div className="relative mt-auto translate-y-4 px-2 pt-3 transition-transform duration-700 ease-out group-hover:translate-y-1 md:px-3">
            <div
              className="bg-white p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)]"
              style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={c.image}
                  alt={`${c.title} — certificate issued by ${c.issuer}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Curtain>

      <Rise delay={0.08}>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <span className="text-[0.875rem] leading-snug tracking-[-0.01em] text-ink sm:text-[1.0625rem]">
            {c.title}
          </span>
          {c.link && (
            <span
              aria-hidden
              className="text-sm text-ink3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          )}
        </div>
        <span className="micro mt-1 block">
          {c.issuer}
          {c.year && (
            <>
              <span className="px-2 opacity-40">·</span>
              <span className="num">{c.year}</span>
            </>
          )}
          {c.ref && (
            <span className="hidden sm:inline">
              <span className="px-2 opacity-40">·</span>
              <span className="opacity-60">{c.ref}</span>
            </span>
          )}
        </span>
      </Rise>
    </>
  );

  if (!c.link) return <div className="group">{body}</div>;

  return (
    <a href={c.link} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  );
}

const Certificates = () => (
  <div>
    <Rise className="mb-10 flex items-baseline justify-between gap-4">
      <span className="micro">Certifications</span>
      <span className="micro num">{certs.length} total</span>
    </Rise>

    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {certs.map((c, i) => (
        <li key={c.num}>
          <Card c={c} i={i} />
        </li>
      ))}
    </ul>
  </div>
);

// Years only where they are legible on the certificate itself.
const certs: Cert[] = [
  {
    num: "01",
    title: "Equity Derivatives — NISM Series VIII",
    issuer: "NISM",
    category: "Securities markets",
    year: "2026",
    image: CertNism,
    poster: {
      bg: "#F7C325",
      ink: "#141413",
      soft: "rgba(20,20,19,0.7)",
      accent: { style: "box", color: "#F7C325" },
      head: ["Markets,", "regulated."],
      blurb: "Futures, options and the rules behind them — the regulator's own exam.",
    },
  },
  {
    num: "02",
    title: "Multithreading with Go",
    issuer: "Udemy",
    category: "Concurrency",
    year: "2026",
    ref: "UC-711CED98",
    link: "https://www.udemy.com/certificate/UC-711ced98-8cc0-4890-b170-370d51230530/",
    image: CertGo,
    poster: {
      bg: "#3EE0B5",
      ink: "#0B2B24",
      soft: "rgba(11,43,36,0.72)",
      accent: { style: "box", color: "#3EE0B5" },
      head: ["Go,", "concurrently."],
      blurb: "Goroutines, channels, mutexes, and knowing which one to reach for.",
    },
  },
  {
    num: "03",
    title: "Web Development Bootcamp",
    issuer: "Udemy",
    category: "Fullstack",
    year: "2024",
    ref: "UC-AA9D5A25",
    link: "https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/",
    image: CertWeb,
    poster: {
      bg: "linear-gradient(160deg, #C8D4FF 0%, #F2D3EC 55%, #FFE2C4 100%)",
      ink: "#15152B",
      soft: "rgba(21,21,43,0.66)",
      accent: { style: "tint", color: "#4B4BF0" },
      head: ["The whole", "web stack."],
      blurb: "From markup to servers to databases, end to end.",
    },
  },
  {
    num: "04",
    title: "Data Structures & Algorithms",
    issuer: "Udemy",
    category: "Algorithms",
    ref: "UC-4E3ACD8C",
    link: "https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/",
    image: CertDsa,
    poster: {
      bg: "#17171B",
      ink: "#F4F2EC",
      soft: "rgba(244,242,236,0.6)",
      accent: { style: "tint", color: "#FF7A45" },
      head: ["Bound first.", "Code", "second."],
      blurb: "The competitive-programming habit, formalised.",
    },
  },
  {
    num: "05",
    title: "Backend Engineering with Node.js",
    issuer: "Udemy",
    category: "Backend",
    ref: "UC-E1548ADE",
    link: "https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/",
    image: CertNode,
    poster: {
      bg: "#F3F0E8",
      ink: "#141413",
      soft: "rgba(20,20,19,0.62)",
      accent: { style: "tint", color: "#2F9E44" },
      head: ["Backends", "that hold."],
      blurb: "APIs, auth, queues and the plumbing between them.",
    },
  },
  {
    num: "06",
    title: "AWS Cloud Practitioner",
    issuer: "AWS Credly",
    category: "Cloud",
    ref: "CREDLY-6886E2D2",
    link: "https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq",
    image: CertAws,
    poster: {
      bg: "linear-gradient(165deg, #1B1440 0%, #3A22B8 100%)",
      ink: "#FFFFFF",
      soft: "rgba(255,255,255,0.66)",
      accent: { style: "tint", color: "#FF9900" },
      head: ["Cloud,", "certified."],
      blurb: "Core AWS services, pricing and the shared-responsibility model.",
    },
  },
  {
    num: "07",
    title: "The Complete Stock Foundation Course",
    issuer: "Udemy",
    category: "Equity markets",
    ref: "UC-2F9FB887",
    link: "https://www.udemy.com/certificate/UC-2f9fb887-0a0a-4793-a62b-5d0ec1b7b5a0/",
    image: CertStock,
    poster: {
      bg: "#FF5A4E",
      ink: "#1A0A08",
      soft: "rgba(26,10,8,0.7)",
      accent: { style: "box", color: "#FF5A4E" },
      head: ["Reading", "the market."],
      blurb: "Price action, fundamentals and how orders actually move a stock.",
    },
  },
  {
    num: "08",
    title: "Claude Code — The Practical Guide",
    issuer: "Udemy",
    category: "AI engineering",
    ref: "UC-58A46E89",
    link: "https://www.udemy.com/certificate/UC-58a46e89-b0a3-44d9-8407-49ddf0fc05dc/",
    image: CertClaude,
    poster: {
      bg: "#D97757",
      ink: "#141413",
      soft: "rgba(20,20,19,0.72)",
      accent: { style: "box", color: "#D97757" },
      head: ["Agents,", "in practice."],
      blurb: "Sub-agents, skills, hooks and MCP — shipping with Claude Code.",
    },
  },
  {
    num: "09",
    title: "Linux Administration Bootcamp",
    issuer: "Udemy",
    category: "Systems",
    ref: "UC-C5843232",
    link: "https://www.udemy.com/certificate/UC-c5843232-76c0-486e-84cf-968eb0e71745/",
    image: CertLinux,
    poster: {
      bg: "#0E1A12",
      ink: "#DDF5E1",
      soft: "rgba(221,245,225,0.6)",
      accent: { style: "tint", color: "#4ADE80" },
      head: ["Root,", "granted."],
      blurb: "Users, permissions, processes, networking — the box underneath.",
    },
  },
];

export default Certificates;
