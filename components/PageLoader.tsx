"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false); // true when 100% is hit
  const [exiting, setExiting] = useState(false);   // true when exit animation starts
  const [done, setDone] = useState(false);          // true when fully removed

  useEffect(() => {
    let raf: number;
    let startTime = 0;
    const RAMP_MS = 900;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / RAMP_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2.5);
      setProgress(Math.floor(eased * 85));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exit = () => {
      cancelAnimationFrame(raf);
      setProgress(100);
      setComplete(true);
      // pause at 100% for 500ms so user sees it, then start exit
      setTimeout(() => setExiting(true), 500);
    };

    const fallback = setTimeout(exit, 6000);

    if (document.readyState === "complete") {
      exit();
      clearTimeout(fallback);
    } else {
      window.addEventListener("load", () => { exit(); clearTimeout(fallback); }, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, []);

  if (done) return null;

  return (
    // White overlay — fades out after panel has exited
    <motion.div
      className="fixed inset-0 z-[9999] bg-white pointer-events-none"
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: exiting ? 0.15 : 0 }}
      onAnimationComplete={() => { if (exiting) setDone(true); }}
    >
      {/* Black panel — wipes IN left→right, exits by sliding OUT right */}
      <motion.div
        className="absolute bottom-0 left-0 h-1/4 bg-black overflow-hidden"
        initial={{ width: "0%", x: 0 }}
        animate={
          exiting
            ? { opacity: 0 }
            : { width: "100%" }
        }
        transition={
          exiting
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* Top-edge progress line */}
        <div className="absolute top-0 left-0 h-px w-full bg-white/10" />
        <motion.div
          className="absolute top-0 left-0 h-px bg-white/60"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.12, ease: "linear" }}
        />

        {/* Panel content */}
        <div className="h-full flex items-center justify-between px-6 sm:px-10 md:px-14">

          {/* Left — name */}
          <div className="flex flex-col gap-1.5">
            <span
              className="font-black uppercase text-white leading-none"
              style={{
                fontFamily: "Impact,'Arial Black',sans-serif",
                fontSize: "clamp(1rem, 2.8vw, 2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              YASH SACHAN
            </span>
            <span className="font-mono text-[7px] uppercase tracking-[0.45em] text-white/35">
              {complete ? "READY" : "INITIALISING"}
            </span>
          </div>

          {/* Right — percentage with flash at 100 */}
          <div className="flex items-end gap-1 leading-none">
            <motion.span
              className="font-black tabular-nums"
              style={{
                fontFamily: "Impact,'Arial Black',sans-serif",
                fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#ffffff",
              }}
              animate={complete ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {progress}
            </motion.span>
            <span
              className="font-black mb-1"
              style={{
                fontFamily: "Impact,'Arial Black',sans-serif",
                fontSize: "clamp(1.2rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              %
            </span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
