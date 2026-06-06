"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socialMedia } from "@/data";
import { ArrowUpRight, Copy, Check, Send, Coffee, Bug, Zap, Github, Linkedin, Twitter } from "lucide-react";

const EMAIL = "yashsachan321@gmail.com";

/* witty rotating taglines (typewriter in the speech bubble) */
const TAGLINES = [
  "Hi! I'm Yash's trading bot. 🤖📈",
  "Buy low, email high. 📩",
  "Latency? Never met her.",
  "I reply faster than the order book updates.",
  "Got a cool idea? Poke me →",
];

/* one-shot lines when you click the robot */
const POKES = [
  "Ouch! 😵", "To the moon! 🚀", "Boop. 👆", "01001000 01101001",
  "Stop, you'll spike the volatility 📉", "I'm ticklish, stop it 🤭", "Beep boop. Hire Yash.",
];

/* ══════════════════════ CARTOON ROBOT ══════════════════════ */
const RobotMascot = ({ onPoke }: { onPoke: () => void }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    onClick={onPoke}
    className="relative cursor-pointer select-none active:scale-95 transition-transform"
    title="poke me"
  >
    <style>{`
      @keyframes bot-wave  { 0%,100%{transform:rotate(10deg)} 50%{transform:rotate(-26deg)} }
      @keyframes bot-blink { 0%,92%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)} }
      @keyframes bot-ant   { 0%,100%{opacity:.45} 50%{opacity:1} }
      .bot-wave  { transform-box:view-box; transform-origin:170px 150px; animation:bot-wave 2.2s ease-in-out infinite; }
      .bot-eyes  { transform-box:fill-box; transform-origin:center; animation:bot-blink 4s ease-in-out infinite; }
      .bot-ant   { animation:bot-ant 1.4s ease-in-out infinite; }
    `}</style>

    <svg viewBox="0 0 240 270" width="220" height="247" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="botHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b9dff" /><stop offset="100%" stopColor="#2f6fe0" />
        </linearGradient>
        <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f7fe8" /><stop offset="100%" stopColor="#1f53b8" />
        </linearGradient>
        <radialGradient id="botEye" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#d8f3ff" /><stop offset="100%" stopColor="#7fd6ff" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="120" cy="256" rx="56" ry="9" fill="#3b82f6" opacity="0.18" />

      {/* antenna — green "bull" up-arrow */}
      <line x1="120" y1="44" x2="120" y2="26" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
      <circle className="bot-ant" cx="120" cy="19" r="12" fill="#22c55e" opacity="0.22" />
      <path className="bot-ant" d="M120 11 l7 11 h-14 z" fill="#22c55e" />

      {/* arms (right one waves) */}
      <g className="bot-wave">
        <rect x="162" y="142" width="14" height="40" rx="7" fill="url(#botBody)" />
        <circle cx="169" cy="186" r="10" fill="#5b9dff" />
      </g>
      <rect x="64" y="150" width="14" height="42" rx="7" fill="url(#botBody)" />
      {/* left hand holding a gold coin */}
      <circle cx="71" cy="196" r="11" fill="#f6c945" stroke="#c79a12" strokeWidth="1.5" />
      <text x="71" y="197" textAnchor="middle" dominantBaseline="middle" fill="#8a6a06" fontSize="12" fontWeight="bold" fontFamily="monospace">$</text>

      {/* body */}
      <rect x="78" y="132" width="84" height="74" rx="20" fill="url(#botBody)" stroke="#1e40af" strokeWidth="1" />

      {/* chest screen — live trading chart */}
      <rect x="96" y="148" width="48" height="38" rx="8" fill="#06122e" stroke="#1e3a8a" strokeWidth="1" />
      {/* grid */}
      <line x1="100" y1="160" x2="140" y2="160" stroke="#1e3a8a" strokeWidth="0.6" opacity="0.5" />
      <line x1="100" y1="172" x2="140" y2="172" stroke="#1e3a8a" strokeWidth="0.6" opacity="0.5" />
      {/* candlesticks */}
      <line x1="106" y1="166" x2="106" y2="180" stroke="#f43f5e" strokeWidth="1" /><rect x="103" y="170" width="6" height="8" fill="#f43f5e" />
      <line x1="115" y1="160" x2="115" y2="177" stroke="#22c55e" strokeWidth="1" /><rect x="112" y="164" width="6" height="11" fill="#22c55e" />
      <line x1="124" y1="158" x2="124" y2="171" stroke="#f43f5e" strokeWidth="1" /><rect x="121" y="161" width="6" height="7" fill="#f43f5e" />
      <line x1="133" y1="152" x2="133" y2="168" stroke="#22c55e" strokeWidth="1" /><rect x="130" y="156" width="6" height="11" fill="#22c55e" />
      {/* up-trend line + arrow */}
      <polyline points="102,178 115,170 124,164 135,156" fill="none" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M135 156 l5 -1 l-2 5 z" fill="#4ade80" />

      {/* feet */}
      <rect x="92" y="204" width="22" height="12" rx="6" fill="#2f6fe0" />
      <rect x="126" y="204" width="22" height="12" rx="6" fill="#2f6fe0" />

      {/* head */}
      <rect x="68" y="46" width="104" height="84" rx="26" fill="url(#botHead)" stroke="#1e40af" strokeWidth="1" />
      {/* face plate */}
      <rect x="80" y="58" width="80" height="58" rx="18" fill="#0b1f44" />
      {/* eyes (blink) */}
      <g className="bot-eyes">
        <circle cx="103" cy="86" r="11" fill="url(#botEye)" />
        <circle cx="137" cy="86" r="11" fill="url(#botEye)" />
        <circle cx="106" cy="83" r="3.5" fill="#0b1f44" />
        <circle cx="140" cy="83" r="3.5" fill="#0b1f44" />
      </g>
      {/* cheeks */}
      <circle cx="92" cy="104" r="5" fill="#ff5d8f" opacity="0.7" />
      <circle cx="148" cy="104" r="5" fill="#ff5d8f" opacity="0.7" />
      {/* smile */}
      <path d="M110 106 q10 9 20 0" fill="none" stroke="#7fd6ff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </motion.div>
);

/* ══════════════════════ FOOTER ══════════════════════ */
const Footer = () => {
  const [copied, setCopied] = useState(false);
  const [txt, setTxt] = useState("");
  const [ti, setTi] = useState(0);
  const [del, setDel] = useState(false);
  const [poke, setPoke] = useState<string | null>(null);
  const [pokeIdx, setPokeIdx] = useState(0);

  /* typewriter */
  useEffect(() => {
    if (poke) return;
    const full = TAGLINES[ti];
    let d = 42;
    if (!del && txt === full) { const t = setTimeout(() => setDel(true), 1700); return () => clearTimeout(t); }
    if (del && txt === "") { setDel(false); setTi((ti + 1) % TAGLINES.length); return; }
    if (del) d = 20;
    const t = setTimeout(() => setTxt(del ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1)), d);
    return () => clearTimeout(t);
  }, [txt, del, ti, poke]);

  const pokeRobot = () => {
    setPoke(POKES[pokeIdx % POKES.length]);
    setPokeIdx((i) => i + 1);
    setTimeout(() => setPoke(null), 1600);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#ffffff] dark:bg-[#000000] border-t border-black/10 dark:border-white/10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-[90vw] 2xl:max-w-[1400px] py-16 md:py-24">

        {/* ── HEADLINE (lighter weight) ── */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/[0.05] px-3 py-1.5 mb-6"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400/90">
              ONLINE · ACCEPTING HUMAN CONTACT
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-black heading-gradient-blue"
            style={{ fontFamily: "var(--font-orbitron)", fontWeight: 600, fontSize: "clamp(2.2rem,7vw,5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            Let&apos;s talk.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 font-mono text-[11px] text-black/45 dark:text-white/45"
          >
            (my robot does the talking — emails reach the human)
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-center justify-center">

          {/* ── ROBOT + SPEECH BUBBLE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center shrink-0"
          >
            {/* speech bubble */}
            <motion.div
              key={poke ?? "type"}
              initial={{ opacity: 0, y: 8, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="relative mb-3 max-w-[260px] min-h-[52px] flex items-center border border-black/15 dark:border-white/15 bg-[#fafafa] dark:bg-[#0a0a0a] px-4 py-3"
            >
              <p className="font-mono text-[11px] leading-snug text-black/70 dark:text-white/75">
                {poke ?? txt}
                {!poke && <span className="inline-block w-[6px] h-[12px] -mb-[1px] ml-[1px] bg-emerald-500 dark:bg-emerald-400 animate-pulse" />}
              </p>
              {/* tail */}
              <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-black/15 dark:border-white/15 bg-[#fafafa] dark:bg-[#0a0a0a]" />
            </motion.div>

            <RobotMascot onPoke={pokeRobot} />

            <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.3em] text-black/25 dark:text-white/25">
              ↑ go on, poke him
            </span>
          </motion.div>

          {/* ── SIDE: STATUS + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6"
          >
            {/* funny status panel */}
            <div className="border border-black/15 dark:border-white/15 bg-[#fafafa] dark:bg-[#070707]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10 dark:border-white/10">
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/50 dark:text-white/50">ROBOT_STATUS</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">● HEALTHY-ISH</span>
              </div>
              <div className="p-4 space-y-3.5">
                <StatBar icon={<Coffee size={11} />} label="Coffee level" value="CRITICAL" fill={0.18} tone="#f59e0b" />
                <StatBar icon={<Bug size={11} />} label="Bugs today" value="7 fixed / 9 made" fill={0.55} tone="#ec4899" />
                <StatBar icon={<Zap size={11} />} label="Reply speed" value="< 24h*" fill={0.82} tone="#22c55e" />
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Timezone</span>
                  <span className="font-mono text-[9px] text-black/65 dark:text-white/70">IST · chaotic good</span>
                </div>
                <p className="font-mono text-[7.5px] text-black/30 dark:text-white/30 pt-1">*if awake. results may vary.</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center justify-center gap-2.5 border border-black dark:border-white bg-black dark:bg-white px-6 py-3.5 font-mono text-[10px] font-black uppercase tracking-wider text-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-200"
              >
                <Send size={13} />
                Beam Me An Email
                <ArrowUpRight size={11} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button
                onClick={copyEmail}
                className="group inline-flex items-center justify-center gap-2.5 border border-black/20 dark:border-white/20 px-6 py-3.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black/65 dark:text-white/65 hover:border-black/50 dark:hover:border-white/50 hover:text-black dark:hover:text-white transition-all duration-200"
              >
                {copied ? (
                  <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Copied! Paste it somewhere nice.</span></>
                ) : (
                  <><Copy size={12} />Copy email (go on)</>
                )}
              </button>
            </div>

            {/* socials */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[7px] uppercase tracking-[0.35em] text-black/30 dark:text-white/30 mr-1">STALK ·</span>
              {socialMedia.map((profile) => {
                if (!profile.link) return null;
                const Icon = profile.img.includes("git") ? Github : profile.img.includes("link") ? Linkedin : Twitter;
                return (
                  <a key={profile.id} href={profile.link} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center border border-black/15 dark:border-white/15 text-black/55 dark:text-white/65 hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/[0.06] transition-all duration-150">
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="mt-16 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
            Hand-crafted with ☕ &amp; questionable sleep by <span className="text-black dark:text-white font-bold">YASH SACHAN</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">NO BUGS WERE HARMED*</span>
            <div className="w-1 h-1 bg-black/20 dark:bg-white/20" />
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/30 dark:text-white/30">&copy; 2026 · MOSTLY WORKING</p>
        </div>
      </div>
    </footer>
  );
};

/* mini status meter */
const StatBar = ({ icon, label, value, fill, tone }: {
  icon: React.ReactNode; label: string; value: string; fill: number; tone: string;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: tone }}>
        {icon}<span className="text-black/50 dark:text-white/50">{label}</span>
      </span>
      <span className="font-mono text-[9px] font-bold" style={{ color: tone }}>{value}</span>
    </div>
    <div className="h-1.5 bg-black/[0.07] dark:bg-white/[0.07] overflow-hidden">
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: fill }} viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-full origin-left" style={{ backgroundColor: tone }} />
    </div>
  </div>
);

export default Footer;
