"use client";
import { useState, useEffect, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  /* size config (em-based so both variants share one render) */
  const cfg = inline
    ? { fs: 15, w: "3.5em", h: "1.7em", knob: "1.3em", xOn: "2em", xOff: "0.2em", fixed: false }
    : { fs: 17, w: "7.65em", h: "3.53em", knob: "2.94em", xOn: "4.41em", xOff: "0.3em", fixed: true };

  /* a few stars (em coords inside the track) */
  const stars = [
    { t: "0.35em", l: "0.55em", s: "0.16em", d: "0s" },
    { t: "0.85em", l: "1.15em", s: "0.12em", d: "0.6s" },
    { t: "0.45em", l: "1.55em", s: "0.1em", d: "1.1s" },
    { t: "1.05em", l: "0.7em", s: "0.1em", d: "0.3s" },
  ];

  const trackStyle: CSSProperties = {
    fontSize: `${cfg.fs}px`,
    position: cfg.fixed ? "fixed" : "relative",
    ...(cfg.fixed ? { bottom: "1.25rem", right: "1.25rem", zIndex: 5000 } : {}),
    display: "inline-flex",
    alignItems: "center",
    width: cfg.w,
    height: cfg.h,
    borderRadius: "3em",
    flexShrink: 0,
    cursor: "pointer",
    border: "none",
    outline: "none",
    padding: 0,
    overflow: "hidden",
    background: isDark
      ? "linear-gradient(160deg,#0e1a2b 0%,#070c14 55%,#040404 100%)"
      : "linear-gradient(160deg,#bfe0f5 0%,#7bb6e6 100%)",
    boxShadow: isDark
      ? "inset 0 1px 3px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,211,238,0.18)"
      : "inset 0 1px 3px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.4)",
    transition: "background 0.6s ease, box-shadow 0.6s ease",
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.95 }}
      style={trackStyle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <style>{`@keyframes tt-twinkle{0%,100%{opacity:.25}50%{opacity:.95}}`}</style>

      {/* stars (night) */}
      {stars.map((st, i) => (
        <span key={i} style={{
          position: "absolute", top: st.t, left: st.l, width: st.s, height: st.s,
          borderRadius: "50%", background: "#d6f7ff",
          boxShadow: "0 0 0.18em rgba(34,211,238,0.9)",
          opacity: isDark ? 1 : 0,
          animation: `tt-twinkle 2.6s ease-in-out ${st.d} infinite`,
          transition: "opacity 0.5s ease",
        }} />
      ))}

      {/* clouds (day) */}
      <span style={{
        position: "absolute", bottom: "0.18em", left: "0.45em",
        width: "1.1em", height: "0.45em", borderRadius: "1em",
        background: "rgba(255,255,255,0.85)", filter: "blur(0.02em)",
        opacity: isDark ? 0 : 1, transition: "opacity 0.5s ease",
      }} />
      <span style={{
        position: "absolute", top: "0.3em", left: "0.95em",
        width: "0.7em", height: "0.32em", borderRadius: "1em",
        background: "rgba(255,255,255,0.7)",
        opacity: isDark ? 0 : 1, transition: "opacity 0.5s ease",
      }} />

      {/* knob: sun ⇄ moon */}
      <motion.div
        animate={{ x: isDark ? cfg.xOn : cfg.xOff }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        style={{
          position: "absolute",
          width: cfg.knob,
          height: cfg.knob,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle at 35% 30%, #eef6fb 0%, #cdd9e3 60%, #aebccb 100%)"
            : "radial-gradient(circle at 35% 30%, #fff3b0 0%, #fcd34d 45%, #f59e0b 100%)",
          boxShadow: isDark
            ? "0 0 0.6em 0.04em rgba(34,211,238,0.45), inset -0.12em -0.12em 0.2em rgba(0,0,0,0.14)"
            : "0 0 0.7em 0.12em rgba(252,211,77,0.9), 0 0 0.25em rgba(245,158,11,0.7)",
          transition: "background 0.5s ease, box-shadow 0.5s ease",
        }}
      >
        <AnimatePresence>
          {isDark && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* moon craters */}
              <span style={{ position: "absolute", top: "26%", left: "52%", width: "22%", height: "22%", borderRadius: "50%", background: "#c2c7d0" }} />
              <span style={{ position: "absolute", top: "55%", left: "28%", width: "16%", height: "16%", borderRadius: "50%", background: "#c2c7d0" }} />
              <span style={{ position: "absolute", top: "60%", left: "62%", width: "13%", height: "13%", borderRadius: "50%", background: "#c2c7d0" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
