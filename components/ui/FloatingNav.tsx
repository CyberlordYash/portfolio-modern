"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence kept for tooltip
import { cn } from "@/utils/cn";
import ToggleDarkModeButton from "../ToggleDarkModeButton";


/* ─── single nav item – expands when active ─── */
const NavPill = ({
  item,
  isActive,
}: {
  item: { name: string; link: string; icon: React.ReactNode };
  isActive: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* tooltip for inactive items */}
      <AnimatePresence>
        {hovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          >
            <div className="bg-black/80 dark:bg-white/90 text-white dark:text-black rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.25em] whitespace-nowrap backdrop-blur-sm">
              {item.name}
            </div>
            <div className="mx-auto mt-0.5 w-1 h-1 bg-black/80 dark:bg-white/90 rotate-45 rounded-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {isActive ? (
        /* ── active: inner lozenge (slides via layoutId) ── */
        <motion.a
          href={item.link}
          layoutId="oneUiLozenge"
          className="flex items-center gap-2 rounded-full px-3.5 py-2
            bg-black/[0.08] dark:bg-white/[0.14]
            border border-black/[0.06] dark:border-white/[0.1]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <span className="text-black dark:text-white [&>svg]:w-4 [&>svg]:h-4">
            {item.icon}
          </span>
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="font-mono text-[9px] uppercase tracking-[0.22em] text-black dark:text-white whitespace-nowrap overflow-hidden"
          >
            {item.name}
          </motion.span>
        </motion.a>
      ) : (
        /* ── inactive: icon only ── */
        <motion.a
          href={item.link}
          className="flex items-center justify-center w-9 h-9 rounded-full
            text-black/40 dark:text-white/35
            hover:text-black/75 dark:hover:text-white/75
            hover:bg-black/[0.05] dark:hover:bg-white/[0.06]
            transition-colors duration-150 [&>svg]:w-4 [&>svg]:h-4"
          whileTap={{ scale: 0.85 }}
        >
          {item.icon}
        </motion.a>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   FLOATING NAV
═══════════════════════════════════════ */
export const FloatingNav = ({ navItems, className }: any) => {
  const [time, setTime]           = useState("00:00:00");
  const [scrollPct, setScrollPct] = useState(0);
  const [active, setActive]       = useState("");
  const [visible, setVisible]     = useState(true);
  const [lastY, setLastY]         = useState(0);

  /* clock */
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false, timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);


  /* scroll: progress + hide-on-scroll-down */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? window.scrollY / total : 0);
      setVisible(window.scrollY < lastY || window.scrollY < 80);
      setLastY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  /* active section */
  useEffect(() => {
    if (!navItems?.length) return;
    const obs: IntersectionObserver[] = [];
    navItems.forEach((item: any) => {
      const el = document.getElementById(item.link.replace("#", ""));
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(item.link.replace("#", "")); },
        { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [navItems]);

  return (
    <motion.div
      initial={{ y: 120, opacity: 0, x: "-50%" }}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0, x: "-50%" }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay: visible ? 0 : 0 }}
      style={{ bottom: "1.75rem", left: "50%" }}
      className={cn("fixed z-[5000]", className)}
    >
      {/* ── Outer pill shell ── */}
      <div
        className="relative flex items-center gap-1 px-3 py-2 rounded-full
          bg-white/[0.55] dark:bg-neutral-900/75
          backdrop-blur-2xl
          border border-white/70 dark:border-white/[0.10]
          shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.9)_inset,0_-1px_0_rgba(0,0,0,0.04)_inset]
          dark:shadow-[0_4px_32px_rgba(0,0,0,0.65),0_1px_0_rgba(255,255,255,0.06)_inset]"
      >
        {/* inner top-shine */}
        <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 dark:from-white/[0.04] to-transparent" />
        </div>

        {/* ── Status + Clock ── */}
        <div className="flex items-center gap-2 pl-1 pr-2.5 border-r border-black/[0.07] dark:border-white/[0.08] shrink-0">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] tabular-nums tracking-tight text-black/60 dark:text-white/60 leading-none">
            {time}
          </span>
        </div>

        {/* ── Nav items ── */}
        <div className="flex items-center gap-0.5 px-1">
          {navItems.map((item: any) => (
            <NavPill
              key={item.link}
              item={item}
              isActive={active === item.link.replace("#", "")}
            />
          ))}
        </div>

        {/* ── Scroll arc ── */}
        <div className="absolute bottom-0 left-8 right-8 h-[1.5px] rounded-full overflow-hidden">
          <motion.div
            className="h-full origin-left rounded-full"
            style={{
              scaleX: scrollPct,
              background: "linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.35))",
            }}
          />
        </div>

        {/* ── Theme toggle ── */}
        <div className="shrink-0 pl-1 pr-0.5">
          <ToggleDarkModeButton />
        </div>
      </div>
    </motion.div>
  );
};
