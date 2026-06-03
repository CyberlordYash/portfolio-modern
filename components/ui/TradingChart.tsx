"use client";
import React, { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   Live candlestick chart — TradingView style.
   Green/red semi-transparent candles that scroll
   smoothly while the right-most candle "ticks" and
   forms in real time, then commits and a new one
   begins. Faint grid + dashed price crosshair.
─────────────────────────────────────────────── */

type Candle = { o: number; h: number; l: number; c: number };

const UP = "0,90,78"; // darker teal-green
const DOWN = "150,28,28"; // darker red

const TradingChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const isDarkNow = () =>
      document.documentElement.classList.contains("dark");

    const CW = 13; // px slot per candle
    const BODY = 8; // body width
    const SPEED = 0.28; // px per frame → smooth scroll + tick cadence
    let price = 100;
    let candles: Candle[] = []; // last element = live/forming candle
    let offset = 0;
    let N = 0;

    const clamp = (v: number) => Math.max(28, Math.min(172, v));

    const seedCandle = (): Candle => {
      const o = price;
      const c = clamp(o + (Math.random() - 0.5) * 7);
      const wick = Math.random() * 3 + 0.8;
      const h = Math.max(o, c) + wick;
      const l = Math.min(o, c) - wick * Math.random();
      price = c;
      return { o, h, l, c };
    };

    const seed = () => {
      N = Math.ceil(W / CW) + 3;
      price = 90 + Math.random() * 20;
      candles = [];
      for (let i = 0; i < N - 1; i++) candles.push(seedCandle());
      // live candle starts flat at last close
      candles.push({ o: price, h: price, l: price, c: price });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      const dark = isDarkNow();
      const grid = dark ? "255,255,255" : "15,23,42";
      const gridA = dark ? 0.05 : 0.05;
      const bodyA = dark ? 0.6 : 0.6;
      const wickA = dark ? 0.65 : 0.6;

      ctx.clearRect(0, 0, W, H);

      // ── tick the live candle in real time ──
      const live = candles[candles.length - 1];
      live.c = clamp(live.c + (Math.random() - 0.5) * 1.0);
      if (live.c > live.h) live.h = live.c;
      if (live.c < live.l) live.l = live.c;
      price = live.c;

      // ── advance scroll & commit candles ──
      offset += SPEED;
      if (offset >= CW) {
        offset -= CW;
        const open = live.c;
        candles.push({ o: open, h: open, l: open, c: open });
        if (candles.length > N) candles.shift();
      }

      // ── auto price range over visible candles ──
      let min = Infinity;
      let max = -Infinity;
      for (const c of candles) {
        if (c.l < min) min = c.l;
        if (c.h > max) max = c.h;
      }
      const pad = (max - min) * 0.12 || 6;
      min -= pad;
      max += pad;
      const span = max - min || 1;
      const top = H * 0.08;
      const plotH = H * 0.84;
      const yOf = (p: number) => top + (1 - (p - min) / span) * plotH;

      const baseX = W - candles.length * CW - offset;

      // ── faint grid ──
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${grid},${gridA})`;
      for (let i = 0; i <= 5; i++) {
        const y = top + (plotH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(W, Math.round(y) + 0.5);
        ctx.stroke();
      }
      let gx = (baseX % (CW * 6) + CW * 6) % (CW * 6);
      for (let x = gx; x < W; x += CW * 6) {
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, top);
        ctx.lineTo(Math.round(x) + 0.5, top + plotH);
        ctx.stroke();
      }

      // ── candles ──
      candles.forEach((c, i) => {
        const cx = baseX + i * CW + CW / 2;
        if (cx < -CW || cx > W + CW) return;
        const up = c.c >= c.o;
        const col = up ? UP : DOWN;
        const bodyTop = yOf(Math.max(c.o, c.c));
        const bodyBot = yOf(Math.min(c.o, c.c));

        // wick
        ctx.strokeStyle = `rgba(${col},${wickA})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.round(cx) + 0.5, yOf(c.h));
        ctx.lineTo(Math.round(cx) + 0.5, yOf(c.l));
        ctx.stroke();

        // body
        ctx.fillStyle = `rgba(${col},${bodyA})`;
        const bh = Math.max(1, bodyBot - bodyTop);
        ctx.fillRect(Math.round(cx - BODY / 2), bodyTop, BODY, bh);
      });

      // ── dashed price crosshair at live close ──
      const live2 = candles[candles.length - 1];
      const ly = yOf(live2.c);
      const lx = baseX + (candles.length - 1) * CW + CW / 2;
      const upLive = live2.c >= live2.o;
      const ccol = upLive ? UP : DOWN;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${grid},${dark ? 0.16 : 0.16})`;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(ly) + 0.5);
      ctx.lineTo(W, Math.round(ly) + 0.5);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${ccol},0.35)`;
      ctx.beginPath();
      ctx.moveTo(Math.round(lx) + 0.5, top);
      ctx.lineTo(Math.round(lx) + 0.5, top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // price tag
      const label = price.toFixed(2);
      ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      const tw = ctx.measureText(label).width + 12;
      const ty = Math.max(top + 8, Math.min(ly, top + plotH - 8));
      ctx.fillStyle = `rgba(${ccol},0.85)`;
      ctx.fillRect(W - tw - 6, ty - 8, tw, 16);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.textBaseline = "middle";
      ctx.fillText(label, W - tw, ty);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-25"
    />
  );
};

export default TradingChart;
