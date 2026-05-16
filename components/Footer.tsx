"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";

const EMAIL = "yashsachan321@gmail.com";

/* ══════════════════════════════════════════
   FLYING ROBOT
══════════════════════════════════════════ */
const Robot = () => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative"
  >
    <style>{`
      :root {
        --rb-shell: #dbeafe;
        --rb-mid:   #bfdbfe;
        --rb-recess:#1e3a8a;
      }
      .dark {
        --rb-shell: #1e3a5f;
        --rb-mid:   #0f2744;
        --rb-recess:#060d1a;
      }
      @keyframes propSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes eyeGlow    { 0%,100%{opacity:0.95} 50%{opacity:0.4} }
      @keyframes blink      { 0%,86%,100%{transform:scaleY(1)} 89%,95%{transform:scaleY(0.07)} }
      @keyframes chestPulse { 0%,100%{opacity:0.78} 50%{opacity:1} }
      @keyframes flame      { 0%,100%{transform:scaleY(1);opacity:0.85}   50%{transform:scaleY(0.42);opacity:0.42} }
      @keyframes flameCore  { 0%,100%{transform:scaleY(0.48);opacity:0.5} 50%{transform:scaleY(1);opacity:0.95} }
    `}</style>

    <svg viewBox="0 0 200 262" fill="none" style={{ width: 190, height: 249 }}>
      <defs>
        <radialGradient id="rChest" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </radialGradient>
        <filter id="fEye" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="fChest" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ━━ PROPELLER ━━ */}
      <g style={{ transformOrigin:"100px 23px", animation:"propSpin 0.65s linear infinite" }}>
        <rect x="48" y="20" width="104" height="6" rx="3" fill="#3b82f6" fillOpacity="0.78"/>
      </g>
      <circle cx="100" cy="23" r="6" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1.3" strokeOpacity="0.9"/>
      <circle cx="100" cy="23" r="2.5" fill="white" fillOpacity="0.88"/>

      {/* ━━ HEAD ━━ */}
      <rect x="62" y="27" width="76" height="68" rx="14"
        style={{ fill:"var(--rb-shell)" }} stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.6"/>
      {/* forehead bar */}
      <rect x="70" y="31" width="60" height="7" rx="3.5" fill="#3b82f6" fillOpacity="0.13"/>
      {/* visor */}
      <rect x="66" y="48" width="68" height="22" rx="5"
        style={{ fill:"var(--rb-recess)" }} fillOpacity="0.75" stroke="#3b82f6" strokeWidth="0.9" strokeOpacity="0.5"/>
      {/* corner ticks on visor */}
      <line x1="68" y1="50" x2="74" y2="50" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.45"/>
      <line x1="126" y1="50" x2="132" y2="50" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.45"/>
      <line x1="68" y1="68" x2="74" y2="68" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.45"/>
      <line x1="126" y1="68" x2="132" y2="68" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.45"/>

      {/* LEFT EYE — glow */}
      <circle cx="88" cy="59" r="8.5" fill="#60a5fa" fillOpacity="0.55" filter="url(#fEye)"
        style={{ animation:"eyeGlow 2.4s ease-in-out infinite" }}/>
      {/* LEFT EYE — blinking face */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"blink 5s ease-in-out infinite" }}>
        <circle cx="88" cy="59" r="8.5" fill="#60a5fa" fillOpacity="0.92"/>
        <circle cx="88" cy="59" r="4.2" fill="white" fillOpacity="0.95"/>
        <circle cx="85.5" cy="56.5" r="1.8" fill="white" fillOpacity="0.6"/>
      </g>

      {/* RIGHT EYE — glow */}
      <circle cx="112" cy="59" r="8.5" fill="#60a5fa" fillOpacity="0.55" filter="url(#fEye)"
        style={{ animation:"eyeGlow 2.4s ease-in-out infinite 0.7s" }}/>
      {/* RIGHT EYE — blinking face */}
      <g style={{ transformBox:"fill-box", transformOrigin:"center", animation:"blink 5s ease-in-out infinite 0.7s" }}>
        <circle cx="112" cy="59" r="8.5" fill="#60a5fa" fillOpacity="0.92"/>
        <circle cx="112" cy="59" r="4.2" fill="white" fillOpacity="0.95"/>
        <circle cx="109.5" cy="56.5" r="1.8" fill="white" fillOpacity="0.6"/>
      </g>

      {/* smile arc */}
      <path d="M90,75 Q100,83 110,75" stroke="#3b82f6" strokeWidth="1.8" strokeOpacity="0.6" strokeLinecap="round" fill="none"/>
      {/* chin bar */}
      <rect x="84" y="80" width="32" height="6" rx="3"
        style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.35"/>

      {/* ━━ NECK ━━ */}
      <rect x="89" y="95" width="22" height="13" rx="3"
        style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="0.9" strokeOpacity="0.45"/>
      <circle cx="93.5" cy="101.5" r="1.6" fill="#3b82f6" fillOpacity="0.5"/>
      <circle cx="106.5" cy="101.5" r="1.6" fill="#3b82f6" fillOpacity="0.5"/>

      {/* ━━ BODY ━━ */}
      <rect x="54" y="108" width="92" height="66" rx="10"
        style={{ fill:"var(--rb-shell)" }} stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.6"/>
      {/* top stripe */}
      <rect x="58" y="108" width="84" height="4" rx="2" fill="#3b82f6" fillOpacity="0.16"/>
      {/* shoulder bolts */}
      <circle cx="63" cy="117" r="2.5" style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.55"/>
      <circle cx="137" cy="117" r="2.5" style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.55"/>
      {/* left vents */}
      <rect x="58" y="124" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.42"/>
      <rect x="58" y="136" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.28"/>
      <rect x="58" y="148" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.16"/>
      {/* right vents */}
      <rect x="138" y="124" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.42"/>
      <rect x="138" y="136" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.28"/>
      <rect x="138" y="148" width="4" height="8" rx="1.5" fill="#3b82f6" fillOpacity="0.16"/>
      {/* chest reactor */}
      <circle cx="100" cy="138" r="22" fill="#3b82f6" fillOpacity="0.07"/>
      <circle cx="100" cy="138" r="16" fill="url(#rChest)" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.85"
        filter="url(#fChest)" style={{ animation:"chestPulse 2.5s ease-in-out infinite" }}/>
      <circle cx="100" cy="138" r="9" style={{ fill:"var(--rb-recess)" }} stroke="#93c5fd" strokeWidth="0.9" strokeOpacity="0.75"/>
      <circle cx="100" cy="138" r="4.5" fill="white" fillOpacity="0.92"/>
      {/* bottom stripe */}
      <rect x="58" y="170" width="84" height="4" rx="2" fill="#3b82f6" fillOpacity="0.14"/>

      {/* ━━ ARMS ━━ */}
      {/* left — blue outline, shell fill, blue edge line */}
      <path d="M54,118 Q32,110 14,116" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.65" fill="none"/>
      <path d="M54,118 Q32,110 14,116" style={{ stroke:"var(--rb-shell)" }} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M54,118 Q32,110 14,116" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" fill="none"/>
      <circle cx="14" cy="116" r="6.5" style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.58"/>
      <circle cx="14" cy="116" r="2.4" fill="#3b82f6" fillOpacity="0.55"/>
      {/* right */}
      <path d="M146,118 Q168,110 186,116" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.65" fill="none"/>
      <path d="M146,118 Q168,110 186,116" style={{ stroke:"var(--rb-shell)" }} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M146,118 Q168,110 186,116" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" fill="none"/>
      <circle cx="186" cy="116" r="6.5" style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.58"/>
      <circle cx="186" cy="116" r="2.4" fill="#3b82f6" fillOpacity="0.55"/>

      {/* ━━ THRUSTER CONNECTOR ━━ */}
      <rect x="74" y="174" width="52" height="10" rx="3"
        style={{ fill:"var(--rb-mid)" }} stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.4"/>

      {/* ━━ THRUSTER PODS ━━ */}
      <rect x="64" y="182" width="32" height="22" rx="6"
        style={{ fill:"var(--rb-shell)" }} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6"/>
      <rect x="104" y="182" width="32" height="22" rx="6"
        style={{ fill:"var(--rb-shell)" }} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="70" y1="190" x2="90" y2="190" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.28"/>
      <line x1="110" y1="190" x2="130" y2="190" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.28"/>
      {/* nozzles */}
      <rect x="68" y="200" width="24" height="4" rx="2" fill="#3b82f6" fillOpacity="0.42"/>
      <rect x="108" y="200" width="24" height="4" rx="2" fill="#3b82f6" fillOpacity="0.42"/>

      {/* ━━ FLAMES ━━ */}
      <path d="M69,204 Q80,240 91,204" fill="#f97316" fillOpacity="0.82"
        style={{ transformBox:"fill-box", transformOrigin:"50% 0%", animation:"flame 0.4s ease-in-out infinite" }}/>
      <path d="M73,204 Q80,226 87,204" fill="#fef08a" fillOpacity="0.72"
        style={{ transformBox:"fill-box", transformOrigin:"50% 0%", animation:"flameCore 0.4s ease-in-out infinite" }}/>
      <path d="M109,204 Q120,240 131,204" fill="#f97316" fillOpacity="0.82"
        style={{ transformBox:"fill-box", transformOrigin:"50% 0%", animation:"flame 0.4s ease-in-out infinite 0.2s" }}/>
      <path d="M113,204 Q120,226 127,204" fill="#fef08a" fillOpacity="0.72"
        style={{ transformBox:"fill-box", transformOrigin:"50% 0%", animation:"flameCore 0.4s ease-in-out infinite 0.2s" }}/>
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
      className="relative w-full overflow-hidden bg-[#ffffff] dark:bg-[#090909] border-t border-black/10 dark:border-white/10"
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

            <Robot />

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
