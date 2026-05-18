"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || "dark";
    setIsDark(saved === "dark");
  }, []);

  const toggle = (e: React.MouseEvent) => {
    const next = !isDark;
    const apply = () => {
      setIsDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    };
    if (!(document as any).startViewTransition) { apply(); return; }
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = (document as any).startViewTransition(apply);
    t.ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      )
    );
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-5 right-5 z-[5000] w-14 h-14 rounded-full flex items-center justify-center focus:outline-none transition-colors duration-500 backdrop-blur-xl overflow-hidden ${
        isDark
          ? "bg-neutral-900/85 border-2 border-sky-400"
          : "bg-white/90 border-2 border-yellow-500"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle at 40% 35%, rgba(56,189,248,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle at 40% 35%, rgba(234,179,8,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Shimmer sweep — repeats every ~2s */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
          borderRadius: "9999px",
        }}
        animate={{ x: ["-80px", "80px"] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      />

      {/* Icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "moon" : "sun"}
          className="relative z-10"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {isDark
            ? <HiMoon className="w-[20px] h-[20px] text-sky-400" />
            : <HiSun className="w-[20px] h-[20px] text-yellow-500" />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
