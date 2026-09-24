"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════
   LOAD TEST — an easter egg, dressed down

   Packets fall, you route them, throughput climbs and p99 degrades
   until you start dropping. The mechanic is unchanged; what changed
   is everything around it.

   The previous version wore five Tabler icons, a red alert state, an
   amber latency readout and a green "healthy" pill — an arcade
   cabinet sitting in the middle of an otherwise monochrome editorial
   page. Here it is built from the same parts as every other section:
   hairlines, mono marginalia, ink, and the single accent for the one
   thing that matters (a dropped packet).

   Collapsed by default. A toy that opens on request is a personality
   note; one that occupies a screen unasked is a liability on a
   portfolio aimed at hiring managers.
══════════════════════════════════════════════════════════════════ */

type Packet = { id: number; x: number; y: number };

const CATCH_LINE = 88; // % of height where the router sits
const CATCH_HALF_WIDTH = 9; // % either side that counts as a hit
const MAX_DROPS = 5;

export default function LoadTest() {
  const [open, setOpen] = useState(false);
  const [routed, setRouted] = useState(0);
  const [dropped, setDropped] = useState(0);
  const [routerX, setRouterX] = useState(50);
  const [packets, setPackets] = useState<Packet[]>([]);

  const arena = useRef<HTMLDivElement>(null);
  const raf = useRef<number>();
  const last = useRef<number>(0);
  const seq = useRef(0);

  const over = dropped >= MAX_DROPS;
  // Derived, not stored: p99 is a function of load, and keeping it in
  // state would let it drift out of sync with the score.
  const p99 = (18 + routed * 0.8).toFixed(1);

  const reset = useCallback(() => {
    setRouted(0);
    setDropped(0);
    setPackets([]);
    seq.current = 0;
  }, []);

  /* ── Spawn ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (!open || over) return;
    const gap = Math.max(320, 950 - routed * 14);
    const id = setInterval(() => {
      setPackets((p) => [
        ...p,
        { id: seq.current++, x: 6 + Math.random() * 88, y: -6 },
      ]);
    }, gap);
    return () => clearInterval(id);
  }, [open, over, routed]);

  /* ── Step ───────────────────────────────────────────────────────
     Delta-timed rather than per-frame, so the fall speed is the same
     on a 60Hz panel and a 144Hz one. */
  useEffect(() => {
    if (!open || over) return;

    const step = (t: number) => {
      const dt = last.current ? Math.min((t - last.current) / 1000, 0.05) : 0;
      last.current = t;
      const speed = 34 + routed * 0.5; // % of height per second

      setPackets((prev) => {
        const next: Packet[] = [];
        let caught = 0;
        let missed = 0;

        for (const pk of prev) {
          const y = pk.y + speed * dt;
          if (y >= CATCH_LINE && pk.y < CATCH_LINE) {
            // Crossed the router line this frame — resolve it now.
            if (Math.abs(pk.x - routerX) <= CATCH_HALF_WIDTH) {
              caught++;
              continue;
            }
          }
          if (y > 104) {
            missed++;
            continue;
          }
          next.push({ ...pk, y });
        }

        if (caught) setRouted((s) => s + caught);
        if (missed) setDropped((d) => d + missed);
        return next;
      });

      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [open, over, routed, routerX]);

  /* ── Control ────────────────────────────────────────────────── */
  const track = (clientX: number) => {
    const el = arena.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRouterX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key === "ArrowLeft") setRouterX((x) => Math.max(0, x - 6));
      if (e.key === "ArrowRight") setRouterX((x) => Math.min(100, x + 6));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="border-t border-rule pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <span className="micro">Off the record</span>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen((o) => !o);
          }}
          className="elink micro text-ink"
          aria-expanded={open}
        >
          {open ? "Close ×" : "Run a load test ↗"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {/* ── Readout ──────────────────────────────────────── */}
            <dl className="mt-8 grid grid-cols-3 gap-x-6 border-b border-rule pb-5">
              {[
                { k: "Routed", v: String(routed).padStart(3, "0") },
                { k: "p99", v: `${p99}ms` },
                { k: "Dropped", v: `${dropped}/${MAX_DROPS}` },
              ].map((s, i) => (
                <div key={s.k}>
                  <dt className="micro">{s.k}</dt>
                  <dd
                    className="display num mt-2"
                    style={{
                      fontSize: "clamp(1.3rem, 2.4vw, 2rem)",
                      // Only a real failure earns the accent.
                      color: i === 2 && dropped > 0 ? "var(--mark)" : undefined,
                    }}
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            {/* ── Arena ────────────────────────────────────────── */}
            <div
              ref={arena}
              onPointerMove={(e) => track(e.clientX)}
              className="relative mt-6 h-[300px] w-full cursor-none overflow-hidden border border-rule bg-paper2 md:h-[360px]"
            >
              {packets.map((pk) => (
                <span
                  key={pk.id}
                  className="absolute block bg-ink"
                  style={{
                    left: `${pk.x}%`,
                    top: `${pk.y}%`,
                    width: 6,
                    height: 14,
                    transform: "translate(-50%,-50%)",
                  }}
                />
              ))}

              {/* The router line, and the router itself. */}
              <div
                className="absolute inset-x-0 border-t border-dashed border-rule"
                style={{ top: `${CATCH_LINE}%` }}
              />
              <span
                className="absolute bg-ink"
                style={{
                  left: `${routerX}%`,
                  top: `${CATCH_LINE}%`,
                  width: `${CATCH_HALF_WIDTH * 2}%`,
                  height: 4,
                  transform: "translate(-50%,-50%)",
                }}
              />

              {over && (
                <div className="absolute inset-0 grid place-items-center bg-paper/85">
                  <div className="text-center">
                    <p
                      className="display"
                      style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
                    >
                      Saturated at{" "}
                      <span className="num">{routed}</span> req/s.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="elink micro mt-5 text-ink"
                    >
                      Retry ↻
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="copy mt-4 text-sm">
              Move to route. Arrow keys work too. Five drops and the node is
              saturated.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
