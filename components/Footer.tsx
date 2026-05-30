"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";

const EMAIL = "yashsachan321@gmail.com";

/* ══════════════════════════════════════════
   GLOWING ENVELOPE
══════════════════════════════════════════ */
const ContactEnvelope = () => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative"
  >
    <style>{`
      @keyframes envRingOut {
        0%   { transform: scale(0.75); opacity: 0.55; }
        100% { transform: scale(1.7);  opacity: 0; }
      }
      @keyframes envAtBlink {
        0%,100% { opacity: 0.9; }
        45%,55% { opacity: 0.2; }
      }
      @keyframes envTxDot {
        0%,60%,100% { opacity: 0.15; }
        30% { opacity: 1; }
      }
      @keyframes envScanLine {
        0%   { transform: translateY(-52px); opacity: 0; }
        10%  { opacity: 0.25; }
        90%  { opacity: 0.25; }
        100% { transform: translateY(52px);  opacity: 0; }
      }
    `}</style>

    <svg viewBox="0 0 200 220" width="190" height="209" style={{ display: "block" }}>
      <defs>
        <linearGradient id="envBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#112040" />
          <stop offset="100%" stopColor="#070e1d" />
        </linearGradient>
        <linearGradient id="envFlapGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3158" />
          <stop offset="100%" stopColor="#0d1e38" />
        </linearGradient>
        <filter id="envAtGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="envHaloGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="envBodyClip">
          <rect x="18" y="68" width="164" height="110" rx="8" />
        </clipPath>
      </defs>

      {/* Pulse rings */}
      {([0, 1, 2] as const).map((i) => (
        <circle key={i} cx="100" cy="123" r="72" fill="none" stroke="#3b82f6" strokeWidth="1"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: `envRingOut 3s ease-out ${i}s infinite`,
          }}
        />
      ))}

      {/* Soft halo behind envelope */}
      <ellipse cx="100" cy="123" rx="68" ry="48"
        fill="#3b82f6" fillOpacity="0.07" filter="url(#envHaloGlow)" />

      {/* Envelope body */}
      <rect x="18" y="68" width="164" height="110" rx="8"
        fill="url(#envBodyGrad)" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.7" />

      {/* Body fold lines (bottom-left and bottom-right to the flap apex) */}
      <line x1="18"  y1="178" x2="100" y2="128" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.22" />
      <line x1="182" y1="178" x2="100" y2="128" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.22" />

      {/* Scan line overlay (clipped to body) */}
      <line x1="18" y1="123" x2="182" y2="123" stroke="#93c5fd" strokeWidth="1"
        clipPath="url(#envBodyClip)"
        style={{ animation: "envScanLine 3s ease-in-out infinite" }} />

      {/* Flap V-shape */}
      <path d="M18,68 L100,126 L182,68"
        fill="url(#envFlapGrad)" stroke="#3b82f6" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="18" y1="68" x2="182" y2="68" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* Corner bracket accents — top-left */}
      <line x1="18" y1="68" x2="30" y2="68" stroke="#60a5fa" strokeWidth="1.8" strokeOpacity="0.85" />
      <line x1="18" y1="68" x2="18" y2="80" stroke="#60a5fa" strokeWidth="1.8" strokeOpacity="0.85" />
      {/* top-right */}
      <line x1="182" y1="68" x2="170" y2="68" stroke="#60a5fa" strokeWidth="1.8" strokeOpacity="0.85" />
      <line x1="182" y1="68" x2="182" y2="80" stroke="#60a5fa" strokeWidth="1.8" strokeOpacity="0.85" />
      {/* bottom-left */}
      <line x1="18"  y1="178" x2="30"  y2="178" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="18"  y1="178" x2="18"  y2="166" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
      {/* bottom-right */}
      <line x1="182" y1="178" x2="170" y2="178" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="182" y1="178" x2="182" y2="166" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />

      {/* @ symbol */}
      <text x="100" y="155" textAnchor="middle" dominantBaseline="middle"
        fill="#60a5fa" fontSize="36" fontFamily="monospace" fontWeight="bold"
        filter="url(#envAtGlow)"
        style={{ animation: "envAtBlink 2.8s ease-in-out infinite" }}>
        @
      </text>

      {/* Transmission dots */}
      {([-14, 0, 14] as const).map((dx, i) => (
        <circle key={i} cx={100 + dx} cy="173" r="2.5" fill="#3b82f6"
          style={{ animation: `envTxDot 1.5s ease-in-out ${i * 0.5}s infinite` }} />
      ))}

      {/* TRANSMITTING label */}
      <text x="100" y="205" textAnchor="middle"
        fill="#3b82f6" fillOpacity="0.4" fontSize="7.5" fontFamily="monospace" letterSpacing="3">
        TRANSMITTING
      </text>
    </svg>
  </motion.div>
);

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
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
      className="relative w-full overflow-hidden bg-[#ffffff] dark:bg-[#060d1a] border-t border-black/10 dark:border-white/10"
    >
      {/* grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-[90vw] 2xl:max-w-[1400px] py-16 md:py-24">

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

          {/* ── LEFT: Robot ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 shrink-0"
          >
            <div className="flex items-center gap-2 border border-blue-500/25 bg-blue-500/[0.04] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-blue-500" />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-blue-500/80 dark:text-blue-400/80">
                UNIT_YS · CONTACT MODULE
              </span>
            </div>

            <ContactEnvelope />

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 border border-black/10 dark:border-white/10 px-4 py-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">
                  OPEN TO OPPORTUNITIES
                </span>
              </div>
              <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-black/25 dark:text-white/25">
                IST · INDIA · REMOTE OK
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: CTA ── */}
          <div className="flex-1 flex flex-col justify-center">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="border border-black/15 dark:border-white/15 px-3 py-1.5 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-black dark:bg-white"
                />
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black dark:text-white">
                  INIT_CONTACT.EXE
                </span>
              </div>
              <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30">
                ▶ RUNNING
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-black uppercase leading-none mb-5 text-black heading-gradient-blue"
              style={{ fontFamily: "Impact,'Arial Black',sans-serif", fontSize: "clamp(3rem,9vw,7rem)", letterSpacing: "-0.03em" }}
            >
              GET IN<br />TOUCH.
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-black/12 dark:bg-white/12 mb-5 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[11px] leading-relaxed text-black/55 dark:text-white/55 max-w-md mb-8"
            >
              Ready to discuss scalable distributed systems or high-throughput
              infrastructure? Transmit a signal — let&apos;s engineer something that performs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-2.5 border border-black dark:border-white bg-black dark:bg-white px-6 py-3.5 font-mono text-[10px] font-black uppercase tracking-wider text-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-200"
              >
                <Mail size={13} />
                Send Message
                <ArrowUpRight size={11} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <button
                onClick={copyEmail}
                className="group inline-flex items-center gap-2.5 border border-black/20 dark:border-white/20 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black/65 dark:text-white/65 hover:border-black/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white transition-all duration-200"
              >
                {copied ? (
                  <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Copied!</span></>
                ) : (
                  <><Copy size={12} />{EMAIL}</>
                )}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2"
            >
              <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-black/30 dark:text-white/30 mr-2">LINKS ·</span>
              {socialMedia.map((profile) =>
                profile.link ? (
                  <a
                    key={profile.id}
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center border border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-150"
                  >
                    <img src={profile.img} alt="social" width={14} height={14} className="opacity-50 dark:invert transition-opacity hover:opacity-80" />
                  </a>
                ) : null
              )}
            </motion.div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-16 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
            Designed &amp; built by <span className="text-black dark:text-white font-bold">YASH SACHAN</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">SYSTEMS, BY DESIGN.</span>
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">&copy; 2026 · ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
