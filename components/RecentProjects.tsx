"use client";
import React from "react";
import { projects } from "@/data";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import { RevealText, RevealChars, DrawLine, FadeReveal } from "@/components/ui/ScrollReveal";
import { Spotlight } from "@/components/ui/Spotlight";

/* ── small "+" cross marker (from Hero) ── */
const Cross = ({ style }: { style?: React.CSSProperties }) => (
  <div className="absolute pointer-events-none text-black dark:text-white opacity-15" style={style}>
    <div className="relative w-5 h-5">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
    </div>
  </div>
);

/* ══════════════════════════════════════
   PROJECT META — monochrome
   Each of the six cards used to carry its own hue (blue/rose/sky/violet/
   amber), which made the grid read as six unrelated products. Category is
   now carried by the label alone and every card shares one surface, so the
   grid reads as a single body of work. The record shape is unchanged, so
   no call site below needed touching — each colour slot just resolves to
   the same graphite step.
══════════════════════════════════════ */
const SURFACE = {
  accent: "text-black/55 dark:text-white/55",
  border: "border-black/[0.12]", borderDark: "dark:border-white/[0.12]",
  badgeBg: "bg-black/[0.05] text-black/70",
  badgeBgDark: "dark:bg-white/[0.06] dark:text-white/70",
  headerBg: "bg-black/[0.02]", headerBgDark: "dark:bg-white/[0.02]",
  // "strip" is consumed by `bg-gradient-to-r ${m.strip}` — a hairline
  // fade-out replaces the solid 2px colour bar.
  strip: "from-black/20 to-transparent dark:from-white/20 dark:to-transparent",
  glow: "hover:border-black/25 dark:hover:border-white/25",
  ctaFrom: "from-transparent", ctaTo: "to-transparent",
};

const meta: Record<number, typeof SURFACE & { num: string; category: string }> = {
  9: { ...SURFACE, num: "01", category: "HFT · TRADING" },
  8: { ...SURFACE, num: "02", category: "SECURITY"      },
  1: { ...SURFACE, num: "03", category: "FULLSTACK"     },
  2: { ...SURFACE, num: "04", category: "REAL-TIME"     },
  3: { ...SURFACE, num: "05", category: "E-COMMERCE"    },
  4: { ...SURFACE, num: "06", category: "AI · NLP"      },
};

const isGithub = (l: string) => l.includes("github.com");

/* ── "IN PROGRESS" or link badge ── */
const LinkBadge = ({ link }: { link: string }) => {
  if (!link) return (
    <span className="flex items-center gap-1.5 border border-black/15 dark:border-white/15 px-2.5 py-1 font-mono text-[7px] uppercase tracking-widest text-black/40 dark:text-white/40">
      IN PROGRESS
    </span>
  );
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className="flex items-center gap-1.5 border border-black/15 dark:border-white/15 px-2.5 py-1 font-mono text-[7px] uppercase tracking-widest text-black/55 dark:text-white/55 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white transition-colors"
    >
      {isGithub(link) ? <Github size={9} /> : <Globe size={9} />}
      {isGithub(link) ? "GITHUB" : "LIVE"}
    </a>
  );
};

/* ── blurry-bg centred image ── */
const BlurImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-30 dark:opacity-20" />
    <img src={src} alt={alt} className="relative z-10 h-full w-full object-contain p-6" />
  </div>
);

/* ══════════════════════════════════════
   FEATURED CARD  (col-span-2)
══════════════════════════════════════ */
const FeaturedCard = ({ id, title, des, img, iconLists, link }: (typeof projects)[0]) => {
  const m = meta[id] ?? meta[4];
  const href = link || "#";

  return (
    <motion.div
      onClick={() => { if (link) window.open(href, "_blank"); }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col md:flex-row overflow-hidden border ${m.border} ${m.borderDark}
        bg-white dark:bg-[#0B0B0E] transition-all duration-500 ${m.glow} min-h-[360px] ${link ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* coloured top strip */}
      <div className={"absolute top-0 left-0 right-0 h-px bg-white/15 z-10"} />

      {/* ── left image zone ── */}
      <div className={`relative md:w-[45%] shrink-0 h-56 md:h-auto overflow-hidden ${m.headerBg} ${m.headerBgDark}`}>
        <img src={img} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-25 dark:opacity-15 group-hover:scale-125 transition-transform duration-700" />
        <img src={img} alt={title} className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]" />
        {/* right blend to card bg */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-transparent to-white dark:to-[#0B0B0E]" />
        <div className="absolute inset-0 md:hidden bg-gradient-to-t from-white dark:from-[#0B0B0E] via-transparent to-transparent" />

        {/* number watermark */}
        <div
          className="absolute -bottom-4 -left-3 font-black leading-none select-none pointer-events-none text-black/[0.05] dark:text-white/[0.06]"
          style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "9rem", letterSpacing: "-0.05em" }}
        >
          {m.num}
        </div>

        {/* FEATURED badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`${m.badgeBg} ${m.badgeBgDark} px-3 py-1 font-mono text-[8px] font-black uppercase tracking-widest`}>
            ★ FEATURED
          </span>
        </div>
      </div>

      {/* ── right content zone ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-5 sm:p-7 md:p-10">
        {/* corner cross */}
        <Cross style={{ top: 12, right: 12 }} />

        {/* category + index */}
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
            <span className={`font-mono text-[8px] uppercase tracking-[0.4em] ${m.accent}`}>{m.num}./</span>
            <span className={`border border-black/12 dark:border-white/12 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.25em] ${m.accent}`}>{m.category}</span>
            <div className="ml-auto">
              <LinkBadge link={link} />
            </div>
          </div>

          {/* title */}
          <h3
            className="font-bold uppercase leading-tight text-black dark:text-white mb-4"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1rem,2vw,1.4rem)", letterSpacing: "0.01em" }}
          >
            {title}
          </h3>

          {/* thin rule */}
          <div className="h-px bg-black/8 dark:bg-white/8 mb-4" />

          {/* description */}
          <p className="font-mono text-[11px] leading-relaxed text-black/55 dark:text-white/55 max-w-md mb-6">{des}</p>

          {/* tech icons */}
          <div className="flex items-center gap-2 flex-wrap">
            {iconLists.map((icon, i) => (
              <div key={i} className={`flex h-9 w-9 items-center justify-center border ${m.border} ${m.borderDark} bg-black/[0.03] dark:bg-white/[0.04] transition-transform duration-300 group-hover:-translate-y-1.5`}>
                <div className="scale-90">{icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/20 dark:text-white/20">
            PROJECT_{m.num}
          </span>
          <div className={"inline-flex items-center gap-2 border border-white/25 bg-white/[0.06] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 transition-colors duration-200 group-hover:bg-white/[0.14] group-hover:border-white/45"}>
            View Project
            <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   MEDIUM CARD  (col-span-1)
══════════════════════════════════════ */
const MediumCard = ({ id, title, des, img, iconLists, link, delay = 0 }: (typeof projects)[0] & { delay?: number }) => {
  const m = meta[id] ?? meta[4];
  const href = link || "#";

  return (
    <motion.div
      onClick={() => { if (link) window.open(href, "_blank"); }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden border ${m.border} ${m.borderDark}
        bg-white dark:bg-[#0B0B0E] transition-all duration-500 ${m.glow} ${link ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* coloured top strip */}
      <div className={"absolute top-0 left-0 right-0 h-px bg-white/15 z-10"} />

      {/* ── image zone ── */}
      <div className={`relative overflow-hidden ${m.headerBg} ${m.headerBgDark}`} style={{ height: 190 }}>
        {/* large number watermark */}
        <div
          className="absolute -bottom-6 -right-3 font-black leading-none select-none pointer-events-none text-black/[0.06] dark:text-white/[0.07]"
          style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "8rem", letterSpacing: "-0.05em" }}
        >
          {m.num}
        </div>

        {/* left colour rule */}
        <div className={"absolute top-0 left-0 w-px h-full bg-white/12"} />

        {/* blurry bg + centred image */}
        <img src={img} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-20 dark:opacity-15 group-hover:scale-125 transition-transform duration-700" />
        <img src={img} alt={title} className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.06]" />

        {/* badge top-left */}
        <div className="absolute top-3 left-5 z-20">
          <span className={`${m.badgeBg} ${m.badgeBgDark} px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-widest`}>
            {m.category}
          </span>
        </div>
        <div className="absolute top-3 right-4 z-20">
          <LinkBadge link={link} />
        </div>
      </div>

      {/* ── content ── */}
      <div className="relative flex flex-1 flex-col justify-between p-5">
        <Cross style={{ top: 8, right: 8 }} />

        <div>
          <span className={`font-mono text-[7px] uppercase tracking-[0.35em] ${m.accent} opacity-80`}>{m.num}. / {m.category}</span>
          <h3
            className="mt-2 mb-2 font-semibold uppercase leading-tight text-black dark:text-white"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.8rem,1.4vw,1rem)", letterSpacing: "0.02em" }}
          >
            {title}
          </h3>
          <div className="h-px bg-black/8 dark:bg-white/8 mb-2.5" />
          <p className="font-mono text-[10px] leading-relaxed text-black/50 dark:text-white/50 line-clamp-2">{des}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {iconLists.map((icon, i) => (
              <div key={i} className={`-ml-2 first:ml-0 flex h-7 w-7 items-center justify-center border ${m.border} ${m.borderDark} bg-black/[0.03] dark:bg-white/[0.03] transition-transform duration-200 group-hover:-translate-y-1`} style={{ zIndex: iconLists.length - i }}>
                <div className="scale-75">{icon}</div>
              </div>
            ))}
          </div>
          <div className={"inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.06] px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 transition-colors duration-200 group-hover:bg-white/[0.14] group-hover:border-white/45"}>
            View <ArrowUpRight size={10} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   WIDE CARD  (col-span-3, last row)
══════════════════════════════════════ */
const WideCard = ({ id, title, des, img, iconLists, link }: (typeof projects)[0]) => {
  const m = meta[id] ?? meta[4];
  const href = link || "#";

  return (
    <motion.div
      onClick={() => { if (link) window.open(href, "_blank"); }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col sm:flex-row overflow-hidden border ${m.border} ${m.borderDark}
        bg-white dark:bg-[#0B0B0E] transition-all duration-500 ${m.glow} ${link ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* top strip */}
      <div className={"absolute top-0 left-0 right-0 h-px bg-white/15 z-10"} />
      {/* left bar on desktop */}
      <div className={"absolute left-0 top-0 bottom-0 w-px bg-white/12 hidden sm:block"} />

      {/* ── image panel ── */}
      <div className={`relative sm:w-[260px] shrink-0 h-44 sm:h-auto overflow-hidden ${m.headerBg} ${m.headerBgDark}`}>
        <img src={img} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-25 dark:opacity-15 group-hover:scale-125 transition-transform duration-700" />
        <img src={img} alt={title} className="relative z-10 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-transparent to-white dark:to-[#0B0B0E]" />
      </div>

      {/* ── content ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-7 py-6 sm:pl-8">
        <Cross style={{ top: 12, right: 12 }} />

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={`${m.badgeBg} ${m.badgeBgDark} px-3 py-1 font-mono text-[8px] font-black uppercase tracking-widest`}>{m.category}</span>
          <LinkBadge link={link} />
          <span className={`font-mono text-[7px] uppercase tracking-[0.3em] ${m.accent} opacity-70`}>{m.num}.</span>
        </div>

        <h3
          className="font-semibold uppercase leading-tight text-black dark:text-white mb-2"
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(0.9rem,1.6vw,1.15rem)", letterSpacing: "0.01em" }}
        >
          {title}
        </h3>
        <div className="h-px bg-black/8 dark:bg-white/8 mb-3" />
        <p className="font-mono text-[10px] leading-relaxed text-black/50 dark:text-white/50 max-w-xl mb-4 line-clamp-2">{des}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {iconLists.map((icon, i) => (
              <div key={i} className={`-ml-2 first:ml-0 flex h-7 w-7 items-center justify-center border ${m.border} ${m.borderDark} bg-black/[0.03] dark:bg-white/[0.03]`} style={{ zIndex: iconLists.length - i }}>
                <div className="scale-75">{icon}</div>
              </div>
            ))}
          </div>
          <div className={"inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.06] px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 transition-colors duration-200 group-hover:bg-white/[0.14] group-hover:border-white/45"}>
            View Project <ArrowUpRight size={10} />
          </div>
        </div>
      </div>

      {/* number watermark */}
      <div
        className="absolute -right-4 bottom-0 top-0 flex items-center font-black leading-none select-none pointer-events-none text-black/[0.04] dark:text-white/[0.04]"
        style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "7rem", letterSpacing: "-0.05em" }}
      >
        {m.num}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════
   SECTION
══════════════════════════════════════ */
const RecentProjects = () => {
  const [p0, p1, p2, p3, p4, p5] = projects;

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-[#ffffff] dark:bg-transparent">

      {/* spotlight — dark mode accent */}
      <Spotlight
        className="-top-20 left-0 md:-left-10 md:-top-10 opacity-30 dark:opacity-50"
        fill="#91919A"
      />

      {/* subtle grid lines matching hero */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* corner crosses */}
      <Cross style={{ top: 24, left: 24 }} />
      <Cross style={{ top: 24, right: 24 }} />
      <Cross style={{ bottom: 24, left: 24 }} />
      <Cross style={{ bottom: 24, right: 24 }} />

      {/* px-4: this container had no horizontal padding at all, so on a phone
          the heading, the eyebrow row and every card butted straight against
          the screen edge — the page wrapper's 8px was all that separated them. */}
      <div className="relative mx-auto max-w-5xl px-4 md:px-0">

        {/* Side rails — frame the centered module, let the living background breathe */}
        <div className="pointer-events-none absolute inset-y-0 -left-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
          <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-white/15" />
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 -right-5 hidden md:flex flex-col items-center justify-center gap-2" aria-hidden>
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
          <span className="w-px flex-1 bg-gradient-to-b from-transparent via-black/15 to-transparent dark:via-white/15" />
          <span className="w-1.5 h-1.5 rotate-45 border border-black/25 dark:border-white/25" />
        </div>

        {/* ── HEADER ── */}
        <div className="mb-10 md:mb-14">
          {/* eyebrow tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <FadeReveal delay={0} className="flex items-center gap-3 border border-black/15 dark:border-white/15 px-4 py-1.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-black dark:bg-white"
              />
              <RevealChars
                text="SELECTED_WORK"
                className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white"
                delay={0.1}
              />
            </FadeReveal>

            <FadeReveal delay={0.15} className="flex items-center gap-3">
              <a
                href="https://github.com/CyberlordYash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-black/15 dark:border-white/15 px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest text-black/55 dark:text-white/55 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white transition-all"
              >
                <Github size={11} /> GitHub <ArrowUpRight size={10} />
              </a>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30 dark:text-white/25">
                {projects.length} PROJECTS
              </span>
            </FadeReveal>
          </div>

          {/* big heading */}
          <h2
            className="font-black uppercase leading-none whitespace-nowrap"
            style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "clamp(2rem,9vw,8rem)", letterSpacing: "-0.03em" }}
          >
            <span className="text-black dark:text-white/90">
              <RevealText text="RECENT" delay={0.1} stagger={0.06} />
            </span>{" "}
            <span
              className="text-black/70 dark:text-white/85"
              style={{ WebkitTextStrokeWidth: "1.75px", WebkitTextStrokeColor: "currentColor", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))" }}
            >
              <RevealText text="PROJECTS" delay={0.22} stagger={0.06} />
            </span>
          </h2>

          {/* underline annotation */}
          <div className="flex items-center gap-3 mt-3">
            <DrawLine delay={0.45} className="h-px w-12 bg-black/20 dark:bg-white/20" />
            <FadeReveal delay={0.5}>
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/40 dark:text-white/35">
                Things I&apos;ve shipped
              </span>
            </FadeReveal>
          </div>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/8 dark:bg-white/8">

          {/* Row 1: featured (2/3) + medium (1/3) */}
          <div className="lg:col-span-2 bg-[#ffffff] dark:bg-black/60 p-px">
            <FeaturedCard {...p0} />
          </div>
          <div className="lg:col-span-1 bg-[#ffffff] dark:bg-black/60 p-px">
            <MediumCard {...p1} delay={0.1} />
          </div>

          {/* Row 2: three equal medium cards */}
          {[p2, p3, p4].map((p, i) => (
            <div key={p.id} className="lg:col-span-1 bg-[#ffffff] dark:bg-black/60 p-px">
              <MediumCard {...p} delay={0.07 + i * 0.07} />
            </div>
          ))}

          {/* Row 3: wide card full width */}
          <div className="lg:col-span-3 bg-[#ffffff] dark:bg-black/60 p-px">
            <WideCard {...p5} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default RecentProjects;
