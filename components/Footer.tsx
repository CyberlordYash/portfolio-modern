"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import {
  ArrowUpRight, Copy, Check, Mail, Github, Linkedin, Twitter,
  MapPin, Clock, Briefcase, Zap,
} from "lucide-react";

const EMAIL = "yashsachan321@gmail.com";

/* Text legibility over the animated WebGL world (dark mode is transparent). */
const TXT = "0 2px 10px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.7)";

const COORDINATES = [
  { icon: <Briefcase size={13} />, label: "ROLE",     value: "Software Engineer · Zanskar Securities" },
  { icon: <MapPin size={13} />,    label: "LOCATION", value: "Bengaluru, India" },
  { icon: <Clock size={13} />,     label: "TIMEZONE", value: "IST · UTC +5:30" },
  { icon: <Zap size={13} />,       label: "RESPONSE", value: "Within 24 hours" },
];

/* ══════════════════════ FOOTER / CONTACT ══════════════════════ */
const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#ffffff] dark:bg-transparent border-t border-black/10 dark:border-white/10"
    >
      {/* grid lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28">

        {/* Side rails — consistent with other sections */}
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
        <div className="flex flex-col items-center text-center mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-500/[0.06] px-3.5 py-1.5 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400/90">
              SYS.CONTACT // OPEN CHANNEL
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-black uppercase leading-[0.92] whitespace-nowrap text-black dark:text-white/90"
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.9rem, 6.5vw, 4.2rem)", letterSpacing: "-0.035em", textShadow: TXT }}
          >
            LET&apos;S{" "}
            <span
              className="text-black/70 dark:text-white/85"
              style={{
                WebkitTextStrokeWidth: "1.75px",
                WebkitTextStrokeColor: "currentColor",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 14px rgba(0,0,0,0.85))",
              }}
            >
              TALK
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-[480px] text-[13px] md:text-[14px] leading-relaxed text-black/55 dark:text-white/65"
            style={{ textShadow: TXT }}
          >
            Have a role, a project, or an idea worth building? My inbox is open for
            opportunities, collaborations, and good engineering conversations.
          </motion.p>
        </div>

        {/* ── CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* DIRECT LINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col border border-black/12 dark:border-white/12 bg-[#fafafa] dark:bg-black/35 backdrop-blur-md overflow-hidden"
          >
            <span className="absolute inset-x-0 top-0 h-[2px] bg-indigo-400 z-10" />
            <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-indigo-400" />
            <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-indigo-400" />

            <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10">
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/50 dark:text-white/55">DIRECT_LINE</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-300">PRIMARY</span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-2">EMAIL</span>
              <div className="flex items-center gap-2 mb-6">
                <Mail size={15} className="shrink-0 text-indigo-500 dark:text-indigo-300" />
                <span className="font-mono text-[13px] md:text-[14px] text-black/85 dark:text-white/90 break-all select-all">{EMAIL}</span>
              </div>

              <div className="mt-auto flex flex-col gap-2.5">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center justify-center gap-2.5 border border-black dark:border-white bg-black dark:bg-white px-5 py-3 font-mono text-[10px] font-black uppercase tracking-wider text-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-200"
                >
                  <Mail size={13} />
                  Send a message
                  <ArrowUpRight size={11} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <button
                  onClick={copyEmail}
                  className="group inline-flex items-center justify-center gap-2.5 border border-black/20 dark:border-white/20 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-black/65 dark:text-white/65 hover:border-black/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white transition-all duration-200"
                >
                  {copied ? (
                    <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Copied to clipboard</span></>
                  ) : (
                    <><Copy size={12} />Copy address</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* COORDINATES / AVAILABILITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col border border-black/12 dark:border-white/12 bg-[#fafafa] dark:bg-black/35 backdrop-blur-md overflow-hidden"
          >
            <span className="absolute inset-x-0 top-0 h-[2px] bg-emerald-400 z-10" />
            <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-emerald-400" />
            <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-emerald-400" />

            <div className="flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10">
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/50 dark:text-white/55">COORDINATES</span>
              <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                AVAILABLE
              </span>
            </div>

            <div className="flex flex-1 flex-col divide-y divide-black/[0.08] dark:divide-white/[0.08]">
              {COORDINATES.map((c) => (
                <div key={c.label} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-emerald-600 dark:text-emerald-400/80 shrink-0">{c.icon}</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 w-[64px] shrink-0">{c.label}</span>
                  <span className="font-mono text-[11.5px] md:text-[12px] text-black/75 dark:text-white/80 leading-snug">{c.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── SOCIALS ── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/35 dark:text-white/35 mr-1">ELSEWHERE</span>
          {socialMedia.map((profile) => {
            if (!profile.link) return null;
            const Icon = profile.img.includes("git") ? Github : profile.img.includes("link") ? Linkedin : Twitter;
            return (
              <a
                key={profile.id}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-black/15 dark:border-white/15 bg-[#fafafa] dark:bg-black/35 backdrop-blur-md text-black/55 dark:text-white/65 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-150"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </motion.div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-16 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
            &copy; 2026 <span className="text-black dark:text-white font-bold">YASH SACHAN</span>
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30">
            Designed &amp; built with Next.js
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
