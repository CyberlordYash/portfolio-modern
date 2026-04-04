"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ToggleDarkModeButton from "../ToggleDarkModeButton";

/* ── Glitch text ─────────────────────────────────────────────── */
const GlitchText = ({ text }: { text: string }) => (
  <span className="glitch-text" data-text={text}>
    {text}
  </span>
);

/* ── Ripple on click ─────────────────────────────────────────── */
const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Floating label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <span
              className="
                block px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase
                bg-black/85 dark:bg-white/10 text-white backdrop-blur-sm
                border border-white/15 shadow-lg whitespace-nowrap
              "
            >
              {item.name}
            </span>
            {/* Caret */}
            <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black/85 dark:bg-white/10 rotate-45 border-r border-b border-white/15" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active glow that slides via layoutId */}
      {isActive && (
        <motion.div
          layoutId="navGlow"
          className="absolute inset-0 rounded-xl bg-blue-500/25 dark:bg-cyan-400/20"
          style={{ filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <motion.a
        ref={ref}
        href={item.link}
        onClick={handleClick}
        whileHover={{ scale: 1.22, y: -3 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden",
          "transition-colors duration-200 select-none",
          isActive
            ? "text-blue-600 dark:text-cyan-400"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        {item.icon}

        {/* Click ripple */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-blue-400/40 dark:bg-cyan-400/30 animate-ripple pointer-events-none"
            style={{ left: r.x, top: r.y, width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
          />
        ))}
      </motion.a>

      {/* Active dot */}
      {isActive && (
        <motion.div
          layoutId="navDot"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-cyan-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};

/* ── Main component ──────────────────────────────────────────── */
export const FloatingNav = ({ navItems, className }: any) => {
  const [time, setTime] = useState("00:00:00");
  const [messageIndex, setMessageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("");
  const [beats, setBeats] = useState(false);

  const messages = [
    "SYSTEM_READY",
    "CODE.DEBUG.REPEAT",
    "SCALING_DREAMS",
    "DEBUG_MODE_ON",
  ];

  /* Clock */
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* Message rotation */
  useEffect(() => {
    const t = setInterval(() => {
      setMessageIndex((p) => (p + 1) % messages.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  /* Heartbeat pulse every 2s */
  useEffect(() => {
    const t = setInterval(() => {
      setBeats(true);
      setTimeout(() => setBeats(false), 300);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  /* Scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section via IntersectionObserver */
  useEffect(() => {
    if (!navItems?.length) return;
    const observers: IntersectionObserver[] = [];
    navItems.forEach((item: any) => {
      const id = item.link.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [navItems]);

  return (
    <motion.div
      initial={{ y: 120, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.6 }}
      className={cn(
        "fixed bottom-8 left-1/2 z-[5000]",
        "flex items-center gap-3 px-4 py-2.5 rounded-2xl",
        // Glass shell
        "bg-white/25 dark:bg-black/35 backdrop-blur-2xl",
        "border border-white/35 dark:border-white/10",
        "shadow-[0_8px_40px_rgba(31,38,135,0.18),0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {/* ── Scroll progress line ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl overflow-hidden">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
          style={{ scaleX: scrollProgress }}
        />
      </div>

      {/* ── Top-glass shimmer ── */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* ── Status: pulse + clock ── */}
      <div className="flex items-center gap-2 pr-3 border-r border-black/10 dark:border-white/10 shrink-0">
        <div className="relative flex h-2.5 w-2.5">
          <motion.span
            animate={{ scale: beats ? 2.2 : 1, opacity: beats ? 0 : 0.6 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full bg-emerald-400"
          />
          <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 tabular-nums tracking-tight">
          {time}
        </span>
      </div>

      {/* ── Nav items ── */}
      <div className="flex items-center gap-0.5">
        {navItems.map((item: any) => (
          <NavItem
            key={item.link}
            item={item}
            isActive={activeSection === item.link.replace("#", "")}
          />
        ))}
      </div>

      {/* ── Message ticker ── */}
      <div className="px-2.5 border-l border-r border-black/10 dark:border-white/10 min-w-[118px] overflow-hidden shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-[9px] font-mono font-bold tracking-widest"
          >
            <GlitchText text={messages[messageIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Theme toggle ── */}
      <div className="shrink-0">
        <ToggleDarkModeButton />
      </div>
    </motion.div>
  );
};
