"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data";
import { Draw, Mask, Rise, EASE } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   SELECTED WORK

   A ruled register — number, title, domain, year — that scans in
   seconds, every row closed until asked for. Each row opens in place to show its
   screenshot, brief and stack. Click, not hover: it behaves the same
   on a phone as on a trackpad, so there is one layout instead of a
   desktop version and a mobile fallback.
══════════════════════════════════════════════════════════════════ */

type Project = (typeof projects)[number];

const pad = (n: number) => String(n).padStart(2, "0");

/* What a link actually is, read off its host — a repo and a live
   deployment are different promises, so they get different labels. */
function linkMeta(link: string) {
  if (!link) return null;
  const host = new URL(link).host.replace(/^www\./, "");
  const isRepo = host === "github.com";
  return {
    host,
    path: isRepo ? new URL(link).pathname.replace(/^\//, "") : "",
    label: isRepo ? "View source" : "Visit live site",
  };
}

/* Screenshot in a hairline window. The bar carries the address the
   project lives at, or its name when it has no public one. */
function Frame({ p, priority = false }: { p: Project; priority?: boolean }) {
  const meta = linkMeta(p.link);
  return (
    <div className="pframe">
      <div className="pframe__bar">
        <span className="pframe__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="micro truncate normal-case tracking-[0.08em]">
          {meta
            ? `${meta.host}${meta.path ? `/${meta.path}` : ""}`
            : p.title.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={p.img}
          alt={`${p.title} — screenshot`}
          fill
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}

function ProjectLink({ p }: { p: Project }) {
  const meta = linkMeta(p.link);
  if (!meta) return null;
  return (
    <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-line group">
      {meta.label}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  );
}

function Stack({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {tech.map((t) => (
        <li key={t} className="micro text-ink2">
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ── Head ───────────────────────────────────────────────────────── */
function Head() {
  const years = projects.map((p) => Number(p.year));
  return (
    <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <Rise>
          <div className="flex items-center gap-3">
            <span className="sec-num">02</span>
            <span className="micro">— Selected work</span>
          </div>
        </Rise>
        <h2 className="display mt-7" style={{ fontSize: "var(--t-h1)" }}>
          <Mask delay={0.05}>Things I built</Mask>
          <Mask delay={0.14}>
            <span className="ink-italic">and shipped.</span>
          </Mask>
        </h2>
      </div>

      <Rise delay={0.1} className="lg:col-span-4 lg:text-right">
        <p className="micro">
          <span className="num text-ink">{pad(projects.length)}</span> projects
          <span className="px-2 opacity-40">·</span>
          <span className="num">
            {Math.min(...years)}—{Math.max(...years)}
          </span>
        </p>
      </Rise>
    </div>
  );
}

/* ── Index row ──────────────────────────────────────────────────── */
function Row({
  p,
  n,
  open,
  onToggle,
}: {
  p: Project;
  n: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `project-${p.id}`;
  return (
    <li className="border-b border-rule">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="prow group"
      >
        <span className={`micro num shrink-0 transition-colors duration-300 ${open ? "text-mark" : ""}`}>
          {pad(n)}/
        </span>
        <span className="blist__title text-left">{p.title}</span>
        <span className="micro hidden w-44 shrink-0 text-left md:block">{p.tag}</span>
        <span className="micro num hidden w-12 shrink-0 text-right sm:block">{p.year}</span>
        <span aria-hidden className={`prow__toggle ${open ? "is-open" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 pb-12 pt-2 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Frame p={p} />
              </div>
              <div className="flex flex-col gap-6 lg:col-span-5">
                <p className="micro md:hidden">{p.tag}</p>
                <p className="copy text-ink">{p.des}</p>
                <Stack tech={p.tech} />
                <div className="lg:mt-auto">
                  <ProjectLink p={p} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ── Section ────────────────────────────────────────────────────── */
const RecentProjects = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <Head />

      <div className="mt-16 md:mt-20">
        <Rise>
          <div className="flex items-baseline justify-between gap-6">
            <span className="micro">Index</span>
            <span className="micro hidden sm:inline">Select a row to open it</span>
          </div>
        </Rise>
        <Draw className="mt-4" />

        <ul>
          {projects.map((p, i) => (
            <Row
              key={p.id}
              p={p}
              n={i + 1}
              open={open === p.id}
              onToggle={() => setOpen((o) => (o === p.id ? null : p.id))}
            />
          ))}
        </ul>

        <Rise delay={0.1}>
          <p className="micro mt-6">{DOMAINS.join("  ·  ")}</p>
        </Rise>
      </div>
    </div>
  );
};

/* Derived from the data so it can't drift when a project is added. */
const DOMAINS = Array.from(new Set(projects.map((p) => p.tag)));

export default RecentProjects;
