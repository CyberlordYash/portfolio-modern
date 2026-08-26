"use client";

import { useRef } from "react";
import { useSolar, type Mode } from "@/components/SolarThemeProvider";

/* ══════════════════════════════════════════════════════════════════
   THEME CLOCK — the dial that reads the sky.

   Replaces the old 10-second auto-flip. The palette itself is owned by
   SolarThemeProvider and follows the visitor's own wall clock (see
   lib/solar-theme.ts): black at 3am, warm at sunrise, white at noon,
   gold at 6pm, indigo at dusk.

   The control is a 24-hour dial — the ring is the day, the lit arc is
   daylight, the mark on it is now. Clicking cycles auto → night → day
   → auto, so a visitor who wants the other half of the ramp is one tap
   from it. That override is session-only by design: nothing is
   persisted, so the site always opens on the sky the visitor is
   actually sitting in.
══════════════════════════════════════════════════════════════════ */

export default function ThemeClock({ inline = false }: { inline?: boolean }) {
  const { mode, setMode, dial, ready } = useSolar();
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Cycling modes is a discrete jump across the whole ramp, so it gets
     the circular reveal — grown from the dial, which is the thing that
     caused it. The gradual drift needs no such treatment: it is already
     continuous. */
  const cycle = () => {
    const next: Mode =
      mode === "auto" ? "dark" : mode === "dark" ? "light" : "auto";
    const run = () => setMode(next);

    const r = btnRef.current?.getBoundingClientRect();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!r || reduced || !(document as any).startViewTransition) {
      run();
      return;
    }

    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    (document as any)
      .startViewTransition(run)
      .ready.then(() =>
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

  // Before the provider's first tick there is no clock reading, and
  // guessing one renders the wrong glyph for a frame.
  if (!ready) return null;

  /* The mark's angle is the time of day. -90° puts midnight at the top,
     so the ring reads like a 24-hour watch face. */
  const angle = dial.dayFraction * 360 - 90;
  const markX = 18 + 16 * Math.cos((angle * Math.PI) / 180);
  const markY = 18 + 16 * Math.sin((angle * Math.PI) / 180);

  const label =
    mode === "auto"
      ? `${dial.phase} — theme follows your local time. Click to pin night.`
      : mode === "dark"
        ? "Pinned to night. Click to pin day."
        : "Pinned to day. Click to follow your local time again.";

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={cycle}
      title={label}
      aria-label={label}
      className={[
        "group grid h-9 w-9 place-items-center rounded-full",
        "border border-ink/20 bg-paper/60 backdrop-blur-md",
        "text-ink transition-colors duration-200",
        "hover:border-ink/45 hover:bg-paper/80",
        inline
          ? "relative"
          : // Clears the mobile bottom nav (56px + safe area); tucks into
            // the corner on desktop where that bar doesn't exist.
            "fixed right-4 bottom-[calc(68px+env(safe-area-inset-bottom))] z-[60] md:right-5 md:bottom-5",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* The night half, drawn first so the daylight arc lays over it. */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          strokeWidth="1.5"
          className="stroke-ink/10"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          /* pathLength=24 makes one dash unit exactly one hour, so the
             figures below are just the ramp's own crossover times:
             sunrise 6.7h → dusk 19.5h is a 12.8h lit arc, offset to
             begin at 6.7h with midnight rotated to the top. */
          pathLength={24}
          strokeDasharray="12.8 11.2"
          strokeDashoffset={-6.7}
          strokeWidth="1.5"
          strokeLinecap="butt"
          transform="rotate(-90 18 18)"
          className="stroke-ink/45"
        />
        <circle
          cx={markX}
          cy={markY}
          r="2.4"
          className={
            // Dimmed while pinned: the mark is still the true time, but
            // it is no longer what the palette is following.
            mode === "auto"
              ? "fill-ink transition-[fill] duration-500"
              : "fill-ink/40 transition-[fill] duration-500"
          }
        />
      </svg>

      {/* Sun over a light ground, moon over a dark one — the glyph
          reports where the ramp currently sits, not what a click does. */}
      <span className="relative grid place-items-center">
        {dial.isDark ? (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden="true"
          >
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
