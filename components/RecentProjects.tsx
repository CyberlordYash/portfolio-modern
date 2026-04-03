"use client";

import React from "react";
import { projects } from "@/data";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// Per-project visual identity
const projectMeta: Record<
  number,
  {
    gradient: string;
    line: string;
    blob: string;
    chipClass: string;
    ctaClass: string;
    category: string;
    featured?: boolean;
  }
> = {
  8: {
    gradient:
      "from-emerald-500/[0.09] via-teal-500/[0.04] to-transparent dark:from-emerald-500/[0.13] dark:via-teal-500/[0.06] dark:to-transparent",
    line: "via-emerald-500/60",
    blob: "bg-emerald-500/10",
    chipClass:
      "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-600 dark:text-emerald-400",
    ctaClass:
      "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.14]",
    category: "Security",
    featured: true,
  },
  1: {
    gradient:
      "from-blue-500/[0.09] via-cyan-500/[0.04] to-transparent dark:from-blue-500/[0.13] dark:via-cyan-500/[0.06] dark:to-transparent",
    line: "via-blue-500/60",
    blob: "bg-blue-500/10",
    chipClass:
      "border-blue-500/20 bg-blue-500/[0.07] text-blue-600 dark:text-blue-400",
    ctaClass:
      "border-blue-500/30 bg-blue-500/[0.07] text-blue-600 dark:text-blue-400 hover:bg-blue-500/[0.14]",
    category: "Fullstack",
  },
  2: {
    gradient:
      "from-violet-500/[0.09] via-purple-500/[0.04] to-transparent dark:from-violet-500/[0.13] dark:via-purple-500/[0.06] dark:to-transparent",
    line: "via-violet-500/60",
    blob: "bg-violet-500/10",
    chipClass:
      "border-violet-500/20 bg-violet-500/[0.07] text-violet-600 dark:text-violet-400",
    ctaClass:
      "border-violet-500/30 bg-violet-500/[0.07] text-violet-600 dark:text-violet-400 hover:bg-violet-500/[0.14]",
    category: "Real-time",
  },
  3: {
    gradient:
      "from-amber-500/[0.09] via-orange-500/[0.04] to-transparent dark:from-amber-500/[0.13] dark:via-orange-500/[0.06] dark:to-transparent",
    line: "via-amber-500/60",
    blob: "bg-amber-500/10",
    chipClass:
      "border-amber-500/20 bg-amber-500/[0.07] text-amber-600 dark:text-amber-400",
    ctaClass:
      "border-amber-500/30 bg-amber-500/[0.07] text-amber-600 dark:text-amber-400 hover:bg-amber-500/[0.14]",
    category: "E-commerce",
  },
  4: {
    gradient:
      "from-indigo-500/[0.09] via-blue-500/[0.04] to-transparent dark:from-indigo-500/[0.13] dark:via-blue-500/[0.06] dark:to-transparent",
    line: "via-indigo-500/60",
    blob: "bg-indigo-500/10",
    chipClass:
      "border-indigo-500/20 bg-indigo-500/[0.07] text-indigo-600 dark:text-indigo-400",
    ctaClass:
      "border-indigo-500/30 bg-indigo-500/[0.07] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/[0.14]",
    category: "AI",
  },
};

const isGithub = (link: string) => link.includes("github.com");

/* ── Featured card — full width horizontal ── */
const FeaturedCard = ({
  id,
  title,
  des,
  img,
  iconLists,
  link,
}: (typeof projects)[0]) => {
  const m = projectMeta[id] ?? projectMeta[4];
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      custom={0.05}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br dark:border-white/[0.07] md:flex-row ${m.gradient} transition-all duration-300 hover:border-slate-300/80 hover:shadow-2xl hover:shadow-black/5 dark:hover:border-white/[0.12] dark:hover:shadow-black/40`}
    >
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 z-10 h-[1px] bg-gradient-to-r from-transparent ${m.line} to-transparent`}
      />
      {/* Ambient blobs */}
      <div
        className={`pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full blur-[80px] ${m.blob}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 right-8 h-40 w-40 rounded-full blur-[60px] ${m.blob}`}
      />

      {/* Image — left half on desktop */}
      <div className="relative h-56 overflow-hidden md:h-auto md:w-[45%] md:shrink-0">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-none" />

        {/* Featured badge */}
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 backdrop-blur-sm">
          <Star size={10} className="text-yellow-500 fill-yellow-500" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
            Featured
          </span>
        </div>
      </div>

      {/* Content — right half */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-7 md:p-10">
        {/* Header */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${m.chipClass}`}
            >
              {m.category}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/60 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400">
              {isGithub(link) ? (
                <Github size={9} />
              ) : (
                <Globe size={9} />
              )}
              {isGithub(link) ? "GitHub" : "Live"}
            </span>
          </div>

          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Project_{String(id).padStart(2, "0")}
          </p>
          <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            {title}
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
            {des}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            {iconLists.map((icon, idx) => (
              <div
                key={idx}
                style={{ zIndex: iconLists.length - idx }}
                className="-ml-2 flex h-9 w-9 first:ml-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/[0.12] dark:bg-black/60"
              >
                {icon}
              </div>
            ))}
          </div>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${m.ctaClass}`}
          >
            View Project
            <ArrowUpRight
              size={12}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

/* ── Regular project card ── */
const ProjectCard = ({
  id,
  title,
  des,
  img,
  iconLists,
  link,
  delay = 0,
}: (typeof projects)[0] & { delay?: number }) => {
  const m = projectMeta[id] ?? projectMeta[4];
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br dark:border-white/[0.07] ${m.gradient} transition-all duration-300 hover:border-slate-300/80 hover:shadow-xl hover:shadow-black/5 dark:hover:border-white/[0.12] dark:hover:shadow-black/30`}
    >
      {/* Accent line */}
      <div
        className={`absolute inset-x-0 top-0 z-10 h-[1px] bg-gradient-to-r from-transparent ${m.line} to-transparent`}
      />
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[50px] ${m.blob}`}
      />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Category over image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm ${m.chipClass}`}
          >
            {m.category}
          </span>
        </div>
        {/* Link type badge */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-1 backdrop-blur-sm">
          {isGithub(link) ? (
            <Github size={9} className="text-white/80" />
          ) : (
            <Globe size={9} className="text-white/80" />
          )}
          <span className="font-mono text-[8px] uppercase tracking-wider text-white/80">
            {isGithub(link) ? "GitHub" : "Live"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="mb-0.5 font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Project_{String(id).padStart(2, "0")}
          </p>
          <h3 className="mb-2 text-[17px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
            {des}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* Icon stack */}
          <div className="flex items-center">
            {iconLists.map((icon, idx) => (
              <div
                key={idx}
                style={{ zIndex: iconLists.length - idx }}
                className="-ml-1.5 flex h-7 w-7 first:ml-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/[0.12] dark:bg-black/60"
              >
                <div className="scale-75">{icon}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${m.ctaClass}`}
          >
            View
            <ArrowUpRight
              size={10}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

/* ── Section ── */
const RecentProjects = () => {
  const [featured, ...rest] = projects;

  return (
    <section
      id="projects"
      className="w-full py-16 md:py-24 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="mx-auto max-w-[88vw] px-4 2xl:max-w-[1400px]">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-[3px] w-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Selected Work
              </span>
            </div>
            <h2 className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-4xl font-bold tracking-tighter text-transparent dark:from-white dark:via-slate-200 dark:to-slate-500 md:text-6xl">
              Projects
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 font-mono text-[10px] text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400">
              {projects.length} projects
            </span>
            <a
              href="https://github.com/CyberlordYash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 font-mono text-[10px] text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/[0.14] dark:hover:text-slate-200"
            >
              <Github size={11} />
              GitHub
              <ArrowUpRight size={10} />
            </a>
          </div>
        </motion.div>

        {/* Featured project */}
        <div className="mb-4">
          <FeaturedCard {...featured} />
        </div>

        {/* Rest — 2×2 grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rest.map((project, i) => (
            <ProjectCard key={project.id} {...project} delay={0.1 + i * 0.07} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecentProjects;
