"use client";
import { useState, useEffect, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
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

  /* ── Inline (nav pill) — compact sliding toggle ── */
  if (inline) {
    const fs = 15; // base font-size px
    const pillStyle: CSSProperties = {
      fontSize: `${fs}px`,
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: "3.5em",
      height: "1.7em",
      borderRadius: "3em",
      flexShrink: 0,
      cursor: "pointer",
      border: "none",
      outline: "none",
      backgroundColor: isDark ? "#374151" : "#9ca3af",
      boxShadow: isDark
        ? "rgba(55,65,81,0.45) 0.25em 0.25em, rgba(55,65,81,0.25) 0.5em 0.5em"
        : "rgba(156,163,175,0.45) -0.25em 0.25em, rgba(156,163,175,0.25) -0.5em 0.5em",
      transition: "background-color 0.45s cubic-bezier(0.68,-0.55,0.265,1.55), box-shadow 0.45s",
    };

    return (
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.94 }}
        style={pillStyle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <motion.div
          animate={{ x: isDark ? "2em" : "0.2em" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            position: "absolute",
            width: "1.3em",
            height: "1.3em",
            backgroundColor: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.28)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? "moon" : "sun"}
              initial={{ scale: 0.3, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotate: 60 }}
              transition={{ duration: 0.15 }}
              style={{ color: isDark ? "#d1d5db" : "#6b7280", lineHeight: 0, fontSize: "9px" }}
            >
              {isDark ? <HiMoon /> : <HiSun />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.button>
    );
  }

  /* ── Floating (other pages) — full-size sliding toggle ── */
  const fs = 17;
  const pillStyle: CSSProperties = {
    fontSize: `${fs}px`,
    position: "fixed",
    bottom: "1.25rem",
    right: "1.25rem",
    zIndex: 5000,
    display: "inline-flex",
    alignItems: "center",
    width: "7.65em",
    height: "3.53em",
    borderRadius: "3em",
    cursor: "pointer",
    border: "none",
    outline: "none",
    backgroundColor: isDark ? "#374151" : "#9ca3af",
    boxShadow: isDark
      ? "rgba(55,65,81,0.4) 0.3em 0.3em, rgba(55,65,81,0.3) 0.6em 0.6em, rgba(55,65,81,0.2) 0.9em 0.9em, rgba(55,65,81,0.1) 1.2em 1.2em"
      : "rgba(156,163,175,0.4) -0.3em 0.3em, rgba(156,163,175,0.3) -0.6em 0.6em, rgba(156,163,175,0.2) -0.9em 0.9em, rgba(156,163,175,0.1) -1.2em 1.2em",
    transition: "background-color 0.5s cubic-bezier(0.68,-0.55,0.265,1.55), box-shadow 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)",
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.96 }}
      style={pillStyle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        animate={{ x: isDark ? "4.41em" : "0.3em" }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{
          position: "absolute",
          width: "2.94em",
          height: "2.94em",
          backgroundColor: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ color: isDark ? "#d1d5db" : "#6b7280", lineHeight: 0 }}
          >
            {isDark
              ? <HiMoon style={{ width: "1.2em", height: "1.2em" }} />
              : <HiSun style={{ width: "1.2em", height: "1.2em" }} />
            }
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
