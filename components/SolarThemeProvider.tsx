"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { solarTheme, type SolarTheme } from "@/lib/solar-theme";

/* ══════════════════════════════════════════════════════════════════
   SOLAR THEME PROVIDER — headless. Owns the palette, draws nothing.

   Mounted in the root layout so every route rides the ramp, not just
   the home page. The dial (components/ThemeClock.tsx) is a consumer;
   the sub-pages simply don't render one, and stay on `auto`.

   Splitting the two is what stopped /blogs and /worklog from getting
   the right polarity out of the pre-paint script and then freezing
   there for the rest of the day.
══════════════════════════════════════════════════════════════════ */

export type Mode = "auto" | "dark" | "light";

/** The two ends of the ramp, used when a visitor pins a mode. */
const PINNED_HOUR: Record<Exclude<Mode, "auto">, number> = {
  dark: 0, // DEEP NIGHT
  light: 12, // NOON
};

/** 15s is finer than any perceptible step in the ramp and costs one
    style write. The steepest stretch — dawn — moves ~4/255 per tick. */
const TICK_MS = 15_000;

function atHour(h: number) {
  const d = new Date();
  d.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
  return d;
}

function paint(theme: SolarTheme) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.vars)) root.style.setProperty(k, v);
  root.classList.toggle("dark", theme.isDark);
  root.style.colorScheme = theme.isDark ? "dark" : "light";
  root.dataset.phase = theme.phase;

  /* Mobile browser chrome should sit in the same sky as the page. The
     <meta> in layout.tsx can only carry a static guess, so it gets the
     real interpolated ground once we know the local time. */
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (meta) meta.content = `rgb(${theme.paper.join(",")})`;
}

type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  /** What the dial draws. Deliberately not the whole palette — the
      palette goes straight to the DOM, so nothing re-renders for it. */
  dial: { phase: string; dayFraction: number; isDark: boolean };
  ready: boolean;
};

const SolarContext = createContext<Ctx | null>(null);

export function useSolar() {
  const ctx = useContext(SolarContext);
  if (!ctx) throw new Error("useSolar must be used inside <SolarThemeProvider>");
  return ctx;
}

export default function SolarThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("auto");
  const [dial, setDial] = useState({
    phase: "",
    dayFraction: 0,
    isDark: true,
  });

  useEffect(() => setMounted(true), []);

  const apply = useCallback((m: Mode) => {
    const theme = solarTheme(m === "auto" ? new Date() : atHour(PINNED_HOUR[m]));
    paint(theme);
    setDial({
      phase: theme.phase,
      // A pinned mode still shows real time on the ring: the mark is a
      // clock, not a readout of the palette.
      dayFraction: solarTheme().dayFraction,
      isDark: theme.isDark,
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    apply(mode);
    const id = setInterval(() => apply(mode), TICK_MS);
    /* A tab left open across sunrise holds a stale palette until its
       next tick, and on iOS timers stop outright when backgrounded.
       Repaint the moment it returns rather than waiting the interval
       out. */
    const onWake = () => document.visibilityState === "visible" && apply(mode);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onWake);
    };
  }, [mounted, mode, apply]);

  const value = useMemo(
    () => ({ mode, setMode, dial, ready: mounted }),
    [mode, dial, mounted],
  );

  return (
    <SolarContext.Provider value={value}>{children}</SolarContext.Provider>
  );
}
