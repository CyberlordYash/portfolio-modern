"use client";

import React from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

const EMAIL = "yashsachan321@gmail.com";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-white pt-20 pb-8 dark:bg-[#020617] transition-colors duration-500"
    >
      {/* Atmospheric blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-b from-indigo-600/[0.08] via-fuchsia-600/[0.06] to-transparent blur-[140px] dark:from-indigo-600/[0.14] dark:via-fuchsia-600/[0.10]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-violet-600/[0.07] to-transparent blur-[120px] dark:from-violet-600/[0.12]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full bg-gradient-to-tl from-rose-600/[0.07] to-transparent blur-[120px] dark:from-rose-600/[0.12]" />

      <div className="relative mx-auto max-w-[85vw] px-4 2xl:max-w-[1400px]">

        {/* ── Main CTA block ── */}
        <div className="flex flex-col items-center text-center">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-[2px] w-8 rounded-full bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
              Let&apos;s Connect
            </span>
            <div className="h-[2px] w-8 rounded-full bg-gradient-to-l from-transparent to-fuchsia-500" />
          </motion.div>

          {/* Availability badge */}
          <motion.div
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Open to Opportunities
            </span>
          </motion.div>

          {/* Big headline */}
          <motion.h2
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-black tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)" }}
          >
            <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400">
              Get In
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-fuchsia-400 dark:to-rose-400">
              Touch.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            custom={0.18}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:text-base"
          >
            Ready to discuss scalable systems or collaborative engineering?
            Reach out and let&apos;s build something high-performance together.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            custom={0.25}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            {/* Primary email button */}
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-8 py-4 font-mono text-[11px] font-black uppercase tracking-wider text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-fuchsia-500/30"
            >
              <Mail size={15} />
              Send a Message
              <ArrowUpRight
                size={13}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            {/* Copy email pill */}
            <button
              onClick={copyEmail}
              className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/[0.15]"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  {EMAIL}
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-20 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/[0.07]" />

        {/* ── Bottom bar ── */}
        <div className="mt-8 flex flex-col items-center justify-between gap-5 md:flex-row">
          {/* Name / credit */}
          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-500">
            Designed &amp; built by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text font-black uppercase tracking-widest text-transparent dark:from-indigo-400 dark:to-fuchsia-400">
              Yash Sachan
            </span>
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socialMedia.map((profile) => (
              <a
                key={profile.id}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:scale-110 hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-indigo-500/40 dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
              >
                <img
                  src={profile.img}
                  alt="social"
                  width={16}
                  height={16}
                  className="opacity-60 transition-opacity duration-300 group-hover:opacity-100 dark:invert"
                />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
            &copy; 2026 All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
