"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/ui/Reveal";

const WORDS = [
  "Engineering",
  "Distributed Systems",
  "AI Agents",
  "Low Latency",
  "System Design",
  "Scale",
  "LLM Infrastructure",
  "Architecture",
  "Ownership",
  "Shipped.",
];

// Same blue family as .flow-panel (globals.css).
const BAR_GRADIENT = "linear-gradient(90deg, #0e0846 0%, #0e1a9e 35%, #4658dc 70%, #145adc 100%)";

const COUNT_MS = 1300;
const FALLBACK_MS = 4500;
const FLIP_MS = 140;

export default function PageLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const counted = useRef(false);
  const loaded = useRef(false);

  useEffect(() => {
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const duration = reduce ? 300 : COUNT_MS;
    const start = performance.now();

    const tryHide = () => {
      if (counted.current && loaded.current) hideTimer = setTimeout(() => setVisible(false), 200);
    };

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        counted.current = true;
        tryHide();
      }
    };
    raf = requestAnimationFrame(tick);

    const onLoad = () => {
      loaded.current = true;
      tryHide();
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const flip = reduce ? undefined : setInterval(() => setIndex((i) => i + 1), FLIP_MS);
    const fallback = setTimeout(() => setVisible(false), FALLBACK_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (flip) clearInterval(flip);
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [reduce]);

  const dark = index % 2 === 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: dark ? "#000" : "#fff", color: dark ? "#fff" : "#000" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE }}
        >
          <span
            className="text-center font-normal leading-none tracking-tight"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            {WORDS[index % WORDS.length]}
          </span>

          <div className="absolute inset-x-0 bottom-0 h-[3px]">
            <span
              className="block h-full w-full origin-left"
              style={{ background: BAR_GRADIENT, transform: `scaleX(${progress})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
