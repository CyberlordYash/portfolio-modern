"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/ui/Reveal";

// Same flood colour as the About panel, fixed rather than var(--accent) so white type holds contrast in dark mode too.
const PANEL = "#1A32FF";
const INK = "#FFFFFF";
const INK_SOFT = "rgba(255,255,255,0.7)";
const ITALIC = "#A9B6FF";
const RULE = "rgba(255,255,255,0.25)";

const COUNT_MS = 1300;
const FALLBACK_MS = 4500;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function PageLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const counted = useRef(false);
  const loaded = useRef(false);

  useEffect(() => {
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const duration = reduce ? 300 : COUNT_MS;
    const start = performance.now();

    const tryHide = () => {
      if (counted.current && loaded.current) hideTimer = setTimeout(() => setVisible(false), 250);
    };

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
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

    const fallback = setTimeout(() => setVisible(false), FALLBACK_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-[9999] flex flex-col justify-between py-8 md:py-12"
          style={{ background: PANEL, color: INK }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduce ? 0.2 : 0.95, ease: EASE }}
        >
          <motion.div
            className="shell flex items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="border px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
                style={{ borderColor: INK }}
              >
                YS®
              </span>
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
                Portfolio
              </span>
            </div>
            <span
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]"
              style={{ color: INK_SOFT }}
            >
              Bengaluru · IN
            </span>
          </motion.div>

          <div className="shell">
            <div className="display" style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)" }}>
              <Line delay={0.15}>Yash Sachan</Line>
              <Line delay={0.27}>
                <span className="ink-italic" style={{ color: ITALIC }}>
                  Software Engineer
                </span>
              </Line>
            </div>

            <div className="mt-10 flex items-end justify-between gap-6 md:mt-14">
              <span
                className="max-w-[28ch] font-mono text-[0.6875rem] uppercase leading-[1.7] tracking-[0.16em]"
                style={{ color: INK_SOFT }}
              >
                Trading systems · Distributed backends · Low latency
              </span>
              <span
                className="display num leading-none"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                {String(count).padStart(3, "0")}
              </span>
            </div>

            <div className="relative mt-5 h-px w-full" style={{ background: RULE }}>
              <span
                className="absolute inset-y-0 left-0 block w-full origin-left"
                style={{ background: INK, transform: `scaleX(${count / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
