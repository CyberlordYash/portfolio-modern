"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/* ══════════════════════════════════════════
   THEME TOGGLE — auto-cycling countdown dial

   A small dial that flips the theme every CYCLE_MS. The ring around it is
   the countdown: it sweeps clockwise and the theme changes when it closes.
   Clicking pauses the cycle (and clicking again resumes) — the ring freezes
   where it stood rather than resetting, so a pause never loses progress.
══════════════════════════════════════════ */

const CYCLE_MS = 10_000;

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
  // next-themes owns the class and the persisted value. This component used to
  // write documentElement.classList and localStorage by hand, which fought the
  // provider and desynced on navigation.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);

  const btnRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  /* Progress lives in a ref, not state: the ring updates every frame and
     re-rendering React 60×/s to move one attribute is pure waste. It also
     survives a pause, which is what lets the dial resume mid-sweep. */
  const progressRef = useRef(0);
  /* The rAF loop reads the theme through a ref so a theme change doesn't tear
     down and restart the timer (which would drop the elapsed progress). */
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => setMounted(true), []);

  /* An unprompted full-page theme flip every 10s is exactly the kind of motion
     prefers-reduced-motion exists to suppress, so start held there. The dial
     still works — it just waits to be started by a click. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  const isDark = resolvedTheme !== "light";

  /* Circular reveal centred on the dial. Every switch here is automatic, so
     there is no cursor position to grow from — the button's own centre is the
     natural origin. */
  const flip = () => {
    const next = themeRef.current === "light" ? "dark" : "light";
    const apply = () => setTheme(next);

    const r = btnRef.current?.getBoundingClientRect();
    if (!r || !(document as any).startViewTransition) {
      apply();
      return;
    }
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const t = (document as any).startViewTransition(apply);
    t.ready
      .then(() =>
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 600,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
  };

  useEffect(() => {
    if (!mounted || paused) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      /* Delta-based, not (now - start): the loop is torn down and rebuilt on
         every pause, and a start timestamp would restart the sweep each time. */
      progressRef.current += (now - last) / CYCLE_MS;
      last = now;

      if (progressRef.current >= 1) {
        progressRef.current = 0;
        flip();
      }
      ringRef.current?.setAttribute(
        "stroke-dashoffset",
        String(1 - progressRef.current),
      );
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, paused]);

  // resolvedTheme is undefined until mounted — rendering then flashes the wrong icon.
  if (!mounted) return null;

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => setPaused((p) => !p)}
      aria-pressed={paused}
      title={
        paused
          ? "Theme auto-switch paused — click to resume"
          : "Auto-switching theme every 10s — click to pause"
      }
      aria-label={
        paused
          ? "Resume automatic theme switching"
          : "Pause automatic theme switching"
      }
      className={[
        "group grid h-9 w-9 place-items-center rounded-full",
        "border border-ink/20 bg-paper/60 backdrop-blur-md",
        "text-ink transition-colors duration-200",
        "hover:border-ink/45 hover:bg-paper/80",
        inline
          ? "relative"
          : // Clears the mobile bottom nav (56px + safe area); tucks into the
            // corner on desktop where that bar doesn't exist.
            "fixed right-4 bottom-[calc(68px+env(safe-area-inset-bottom))] z-[60] md:right-5 md:bottom-5",
      ].join(" ")}
    >
      {/* Countdown ring. pathLength=1 makes the dash math resolution-independent,
          so one dashoffset value maps straight to progress. */}
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          ref={ringRef}
          cx="18"
          cy="18"
          r="16"
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          strokeWidth="1.75"
          strokeLinecap="round"
          className={
            paused
              ? "stroke-ink/20 transition-[stroke] duration-300"
              : "stroke-ink/70 transition-[stroke] duration-300"
          }
        />
      </svg>

      {/* Sun in light mode, moon in dark — the dial reads as current state. */}
      <span className="relative grid place-items-center">
        {paused ? (
          /* Paused: two bars, so the held state is legible without a second
             control or a tooltip. */
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <rect x="7" y="5" width="3.5" height="14" rx="1" />
            <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
          </svg>
        ) : isDark ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.6 8.6 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
            <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
          </svg>
        )}
      </span>
    </button>
  );
}
