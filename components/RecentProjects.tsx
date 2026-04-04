"use client";

import React from "react";
import { projects } from "@/data";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Per-project visual DNA ── */
const projectMeta: Record<
  number,
  {
    cardGrad: string;
    blob1: string;
    blob2: string;
    badge: string;
    glowShadow: string;
    borderColor: string;
    topLine: string;
    category: string;
    num: string;
    featured?: boolean;
  }
> = {
  8: {
    cardGrad: "from-[#021a0e] via-[#062918] to-[#040f1a]",
    blob1: "bg-emerald-500/35",
    blob2: "bg-teal-400/25",
    badge: "from-emerald-400 to-teal-500",
    glowShadow:
      "hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_16px_70px_rgba(16,185,129,0.35)]",
    borderColor: "border-emerald-500/20",
    topLine: "via-emerald-400/70",
    category: "Security",
    num: "01",
    featured: true,
  },
  1: {
    cardGrad: "from-[#020d28] via-[#061840] to-[#030c1e]",
    blob1: "bg-blue-500/30",
    blob2: "bg-cyan-400/20",
    badge: "from-blue-400 to-cyan-500",
    glowShadow:
      "hover:shadow-[0_0_0_1px_rgba(59,130,246,0.25),0_16px_70px_rgba(59,130,246,0.35)]",
    borderColor: "border-blue-500/20",
    topLine: "via-blue-400/70",
    category: "Fullstack",
    num: "02",
  },
  2: {
    cardGrad: "from-[#0f0430] via-[#180842] to-[#080318]",
    blob1: "bg-violet-500/30",
    blob2: "bg-purple-400/20",
    badge: "from-violet-400 to-fuchsia-500",
    glowShadow:
      "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_16px_70px_rgba(139,92,246,0.35)]",
    borderColor: "border-violet-500/20",
    topLine: "via-violet-400/70",
    category: "Real-time",
    num: "03",
  },
  3: {
    cardGrad: "from-[#1e0a00] via-[#2e1200] to-[#140800]",
    blob1: "bg-amber-500/30",
    blob2: "bg-orange-400/20",
    badge: "from-amber-400 to-orange-500",
    glowShadow:
      "hover:shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_16px_70px_rgba(245,158,11,0.35)]",
    borderColor: "border-amber-500/20",
    topLine: "via-amber-400/70",
    category: "E-commerce",
    num: "04",
  },
  4: {
    cardGrad: "from-[#1e0412] via-[#2e0820] to-[#14030e]",
    blob1: "bg-rose-500/30",
    blob2: "bg-pink-400/20",
    badge: "from-rose-400 to-pink-500",
    glowShadow:
      "hover:shadow-[0_0_0_1px_rgba(244,63,94,0.25),0_16px_70px_rgba(244,63,94,0.35)]",
    borderColor: "border-rose-500/20",
    topLine: "via-rose-400/70",
    category: "AI",
    num: "05",
  },
};

const isGithub = (link: string) => link.includes("github.com");

/* ─────────────────────────────────────────
   Featured Card — full-width horizontal
───────────────────────────────────────── */
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
      custom={0.1}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2.5rem] border ${m.borderColor} bg-gradient-to-br ${m.cardGrad} transition-all duration-500 ${m.glowShadow} md:flex-row`}
    >
      {/* Top iridescent accent line */}
      <div
        className={`absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent ${m.topLine} to-transparent`}
      />

      {/* Ambient blobs */}
      <div
        className={`pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-[110px] ${m.blob1} transition-all duration-700 group-hover:scale-[1.3]`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 right-16 h-60 w-60 rounded-full blur-[90px] ${m.blob2} transition-all duration-700 group-hover:scale-[1.2]`}
      />

      {/* Big translucent project number */}
      <div className="pointer-events-none absolute bottom-6 right-8 hidden select-none font-black leading-none text-white/[0.04] md:block"
           style={{ fontSize: "180px" }}>
        {m.num}
      </div>

      {/* ── Image panel ── */}
      <div className="relative h-64 overflow-hidden md:h-auto md:w-[46%] md:shrink-0">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Directional blend into card */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-black/60 md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />

        {/* Featured badge */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 shadow-lg shadow-yellow-500/40">
          <Star size={10} className="fill-black text-black" />
          <span className="font-mono text-[8px] font-black uppercase tracking-widest text-black">
            Featured
          </span>
        </div>

        {/* Link type */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
          {isGithub(link) ? (
            <Github size={10} className="text-white/90" />
          ) : (
            <Globe size={10} className="text-white/90" />
          )}
          <span className="font-mono text-[8px] text-white/80">
            {isGithub(link) ? "GitHub" : "Live"}
          </span>
        </div>
      </div>

      {/* ── Content panel ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-12">
        <div>
          {/* Category chip */}
          <span
            className={`mb-5 inline-block rounded-full bg-gradient-to-r ${m.badge} px-3.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest text-white shadow-lg`}
          >
            {m.category}
          </span>

          {/* Subtle index */}
          <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.4em] text-white/20">
            Project_{m.num}
          </p>

          {/* Title */}
          <h3 className="mb-4 text-3xl font-black tracking-tight text-white md:text-[2.6rem] md:leading-tight">
            {title}
          </h3>

          <p className="max-w-lg text-sm leading-relaxed text-white/55">
            {des}
          </p>
        </div>

        {/* Footer row */}
        <div className="mt-8 flex items-center justify-between">
          {/* Tech icon stack */}
          <div className="flex items-center">
            {iconLists.map((icon, idx) => (
              <div
                key={idx}
                style={{ zIndex: iconLists.length - idx }}
                className="-ml-2.5 flex h-10 w-10 first:ml-0 items-center justify-center rounded-full border border-white/10 bg-white/8 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1.5"
              >
                {icon}
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${m.badge} px-6 py-2.5 font-mono text-[10px] font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
          >
            View Project
            <ArrowUpRight
              size={13}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

/* ─────────────────────────────────────────
   Regular Project Card
───────────────────────────────────────── */
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
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border ${m.borderColor} bg-gradient-to-br ${m.cardGrad} transition-all duration-500 ${m.glowShadow}`}
    >
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent ${m.topLine} to-transparent`}
      />

      {/* Blobs */}
      <div
        className={`pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full blur-[80px] ${m.blob1} transition-all duration-700 group-hover:scale-[1.3]`}
      />
      <div
        className={`pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-[60px] ${m.blob2} opacity-70`}
      />

      {/* Number watermark */}
      <div className="pointer-events-none absolute bottom-4 right-4 select-none font-black leading-none text-white/[0.04]"
           style={{ fontSize: "90px" }}>
        {m.num}
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Category chip over image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`rounded-full bg-gradient-to-r ${m.badge} px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-widest text-white shadow-lg`}
          >
            {m.category}
          </span>
        </div>

        {/* Link type badge */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2 py-1.5 backdrop-blur-md">
          {isGithub(link) ? (
            <Github size={9} className="text-white/80" />
          ) : (
            <Globe size={9} className="text-white/80" />
          )}
          <span className="font-mono text-[7px] text-white/80">
            {isGithub(link) ? "GitHub" : "Live"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="mb-1 font-mono text-[7px] uppercase tracking-[0.4em] text-white/20">
            Project_{m.num}
          </p>
          <h3 className="mb-2.5 text-[18px] font-bold leading-tight tracking-tight text-white">
            {title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-white/55">
            {des}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          {/* Tech stack */}
          <div className="flex items-center">
            {iconLists.map((icon, idx) => (
              <div
                key={idx}
                style={{ zIndex: iconLists.length - idx }}
                className="-ml-1.5 flex h-8 w-8 first:ml-0 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1"
              >
                <div className="scale-75">{icon}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${m.badge} px-4 py-2 font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
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

/* ─────────────────────────────────────────
   Section
───────────────────────────────────────── */
const RecentProjects = () => {
  const [featured, ...rest] = projects;

  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden py-20 bg-white dark:bg-[#020617] transition-colors duration-500 md:py-32"
    >
      {/* Atmospheric section-level blobs */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-600/[0.07] to-transparent blur-[140px] dark:from-violet-600/[0.12]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-emerald-600/[0.07] to-transparent blur-[140px] dark:from-emerald-600/[0.12]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-600/[0.04] to-cyan-600/[0.04] blur-[160px] dark:from-fuchsia-600/[0.07] dark:to-cyan-600/[0.07]" />

      <div className="relative mx-auto max-w-[88vw] px-4 2xl:max-w-[1400px]">

        {/* ── Section Header ── */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            {/* Eyebrow */}
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                Selected Work
              </span>
              <div className="h-[2px] w-5 rounded-full bg-gradient-to-r from-pink-500 to-transparent" />
            </div>

            {/* Big gradient title */}
            <h2
              className="font-black tracking-tight leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            >
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400">
                Projects
              </span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Things I&apos;ve built that I&apos;m proud of
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Count badge */}
            <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-gradient-to-r from-violet-500/8 to-fuchsia-500/8 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                {projects.length} projects
              </span>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/CyberlordYash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-mono text-[10px] text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/[0.15]"
            >
              <Github size={12} />
              GitHub
              <ArrowUpRight size={11} />
            </a>
          </div>
        </motion.div>

        {/* Featured project */}
        <div className="mb-5">
          <FeaturedCard {...featured} />
        </div>

        {/* Grid — 2 columns */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rest.map((project, i) => (
            <ProjectCard
              key={project.id}
              {...project}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default RecentProjects;
