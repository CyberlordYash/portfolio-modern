"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── small "+" grid cross ─── */
const Cross = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="absolute pointer-events-none text-black dark:text-white opacity-20"
    style={style}
  >
    <div className="relative w-5 h-5">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-current" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current" />
    </div>
  </div>
);

/* ─── tech icons for orb compass points ─── */
type IconFn = (cx: number, cy: number) => React.ReactElement;

const outerIcons: IconFn[] = [
  // candlestick — cyan
  (cx, cy) => (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <g className="moon-f moon-o">
        <circle cx="7" cy="7" r="10.5" fill="url(#ms1)" />
        <g fill="none" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round">
          <line x1="3.5" y1="1.5" x2="3.5" y2="12.5" />
          <rect x="2" y="3.5" width="3" height="5" />
          <line x1="10.5" y1="1.5" x2="10.5" y2="12.5" />
          <rect x="9" y="5.5" width="3" height="3.5" />
        </g>
        <circle cx="7" cy="7" r="10.5" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.5" />
        <ellipse cx="3.5" cy="3.0" rx="3.2" ry="2.0" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // database — violet
  (cx, cy) => (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <g className="moon-f moon-o">
        <circle cx="7" cy="7" r="10.5" fill="url(#ms2)" />
        <g fill="none" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round">
          <ellipse cx="7" cy="3.8" rx="4.5" ry="1.6" />
          <line x1="2.5" y1="3.8" x2="2.5" y2="10.2" />
          <line x1="11.5" y1="3.8" x2="11.5" y2="10.2" />
          <ellipse cx="7" cy="10.2" rx="4.5" ry="1.6" />
        </g>
        <circle cx="7" cy="7" r="10.5" fill="none" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.5" />
        <ellipse cx="3.5" cy="3.0" rx="3.2" ry="2.0" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // network — emerald
  (cx, cy) => (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <g className="moon-f moon-o">
        <circle cx="7" cy="7" r="10.5" fill="url(#ms3)" />
        <g fill="none" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="7" cy="2.8" r="1.7" />
          <circle cx="2.8" cy="11" r="1.7" />
          <circle cx="11.2" cy="11" r="1.7" />
          <line x1="7" y1="4.5" x2="4" y2="9.4" />
          <line x1="7" y1="4.5" x2="10" y2="9.4" />
          <line x1="4.5" y1="11" x2="9.5" y2="11" />
        </g>
        <circle cx="7" cy="7" r="10.5" fill="none" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" />
        <ellipse cx="3.5" cy="3.0" rx="3.2" ry="2.0" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // server rack — orange
  (cx, cy) => (
    <g transform={`translate(${cx - 7},${cy - 7})`}>
      <g className="moon-f moon-o">
        <circle cx="7" cy="7" r="10.5" fill="url(#ms4)" />
        <g fill="none" stroke="#fb923c" strokeWidth="1.3" strokeLinecap="round">
          <rect x="1.5" y="2" width="11" height="4" />
          <rect x="1.5" y="8" width="11" height="4" />
          <circle cx="3.5" cy="4" r="0.9" fill="#fb923c" fillOpacity="0.7" />
          <circle cx="3.5" cy="10" r="0.9" fill="#fb923c" fillOpacity="0.7" />
          <line x1="6" y1="3.2" x2="11" y2="3.2" />
          <line x1="6" y1="9.2" x2="11" y2="9.2" />
        </g>
        <circle cx="7" cy="7" r="10.5" fill="none" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" />
        <ellipse cx="3.5" cy="3.0" rx="3.2" ry="2.0" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
];

const innerIcons: IconFn[] = [
  // message queue — blue
  (cx, cy) => (
    <g transform={`translate(${cx - 6},${cy - 6})`}>
      <g className="moon-f moon-i">
        <circle cx="6" cy="6" r="9" fill="url(#ms5)" />
        <g fill="none" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round">
          <line x1="1.5" y1="3.5" x2="10.5" y2="3.5" />
          <line x1="1.5" y1="6" x2="10.5" y2="6" />
          <line x1="1.5" y1="8.5" x2="10.5" y2="8.5" />
          <polyline points="8,4.8 10.5,6 8,7.2" />
        </g>
        <circle cx="6" cy="6" r="9" fill="none" stroke="#60a5fa" strokeWidth="0.9" strokeOpacity="0.5" />
        <ellipse cx="2.8" cy="2.6" rx="2.5" ry="1.6" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // load balancer — pink
  (cx, cy) => (
    <g transform={`translate(${cx - 6},${cy - 6})`}>
      <g className="moon-f moon-i">
        <circle cx="6" cy="6" r="9" fill="url(#ms6)" />
        <g fill="none" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round">
          <line x1="6" y1="1.5" x2="6" y2="4.5" />
          <line x1="6" y1="4.5" x2="2" y2="9.5" />
          <line x1="6" y1="4.5" x2="10" y2="9.5" />
          <line x1="1" y1="9.5" x2="3" y2="9.5" />
          <line x1="9" y1="9.5" x2="11" y2="9.5" />
        </g>
        <circle cx="6" cy="6" r="9" fill="none" stroke="#f472b6" strokeWidth="0.9" strokeOpacity="0.5" />
        <ellipse cx="2.8" cy="2.6" rx="2.5" ry="1.6" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // order flow — amber
  (cx, cy) => (
    <g transform={`translate(${cx - 6},${cy - 6})`}>
      <g className="moon-f moon-i">
        <circle cx="6" cy="6" r="9" fill="url(#ms7)" />
        <g fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round">
          <line x1="1.5" y1="4" x2="10.5" y2="4" />
          <polyline points="8,2.2 10.5,4 8,5.8" />
          <line x1="10.5" y1="8" x2="1.5" y2="8" />
          <polyline points="4,6.2 1.5,8 4,9.8" />
        </g>
        <circle cx="6" cy="6" r="9" fill="none" stroke="#fbbf24" strokeWidth="0.9" strokeOpacity="0.5" />
        <ellipse cx="2.8" cy="2.6" rx="2.5" ry="1.6" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
  // signal wave — green
  (cx, cy) => (
    <g transform={`translate(${cx - 6},${cy - 6})`}>
      <g className="moon-f moon-i">
        <circle cx="6" cy="6" r="9" fill="url(#ms8)" />
        <g fill="none" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round">
          <path d="M1.5,6 Q3,2 6,6 Q9,10 10.5,6" />
          <line x1="1.5" y1="10.5" x2="10.5" y2="10.5" strokeOpacity="0.3" />
        </g>
        <circle cx="6" cy="6" r="9" fill="none" stroke="#86efac" strokeWidth="0.9" strokeOpacity="0.5" />
        <ellipse cx="2.8" cy="2.6" rx="2.5" ry="1.6" fill="white" fillOpacity="0.2" />
      </g>
    </g>
  ),
];

/* ─── animated SVG orb (3-D multi-ring) ─── */
const TechOrb = ({ size = 340 }: { size?: number }) => {
  const half = size / 2;
  const r0 = Math.round(half * 0.976); // outer dashed
  const r1 = Math.round(half * 0.776); // middle — outer icons
  const r2 = Math.round(half * 0.553); // inner  — inner icons
  const r3 = Math.round(half * 0.318); // planet radius

  const compassPts = (r: number) =>
    [0, 90, 180, 270].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return { x: half + r * Math.sin(rad), y: half - r * Math.cos(rad) };
    });

  const svgClass = "absolute inset-0 w-full h-full text-black dark:text-white";
  const vb = `0 0 ${size} ${size}`;
  const orig = `${half}px ${half}px`;

  return (
    <div
      className="relative"
      style={{ width: size, height: size, perspective: `${size * 2.8}px` }}
    >
      <style>{`
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes spin-cw  { to { transform: rotate( 360deg); } }
        .moon-f { transform-box: fill-box; transform-origin: 50% 50%; }
        .moon-o { animation: spin-ccw 22s linear infinite; }
        .moon-i { animation: spin-cw  35s linear infinite; }
        @keyframes precess-0 {
          0%   { transform: rotateX(66deg) rotateY(0deg);   }
          18%  { transform: rotateX(50deg) rotateY(44deg);  }
          42%  { transform: rotateX(74deg) rotateY(-28deg); }
          65%  { transform: rotateX(56deg) rotateY(60deg);  }
          84%  { transform: rotateX(44deg) rotateY(-14deg); }
          100% { transform: rotateX(66deg) rotateY(0deg);   }
        }
        @keyframes precess-1 {
          0%   { transform: rotateX(42deg) rotateY(18deg);  }
          28%  { transform: rotateX(18deg) rotateY(-40deg); }
          52%  { transform: rotateX(62deg) rotateY(54deg);  }
          78%  { transform: rotateX(30deg) rotateY(-18deg); }
          100% { transform: rotateX(42deg) rotateY(18deg);  }
        }
        @keyframes precess-2 {
          0%   { transform: rotateX(14deg) rotateY(-24deg); }
          24%  { transform: rotateX(50deg) rotateY(16deg);  }
          50%  { transform: rotateX(8deg)  rotateY(54deg);  }
          76%  { transform: rotateX(40deg) rotateY(-44deg); }
          100% { transform: rotateX(14deg) rotateY(-24deg); }
        }
        @keyframes precess-3 {
          0%   { transform: rotateX(30deg) rotateY(10deg);  }
          34%  { transform: rotateX(60deg) rotateY(-34deg); }
          67%  { transform: rotateX(16deg) rotateY(48deg);  }
          100% { transform: rotateX(30deg) rotateY(10deg);  }
        }
        :root { --ob1: #0369a1; --ob2: #4338ca; --ob3: #1d4ed8; }
        .dark  { --ob1: #22d3ee; --ob2: #818cf8; --ob3: #38bdf8; }
      `}</style>

      {/* ── PLANET ── */}
      <div className="absolute inset-0">
        <svg viewBox={vb} className={svgClass} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id={`pg${size}`} cx="34%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#1e3f6e" />
              <stop offset="42%"  stopColor="#0b1d38" />
              <stop offset="100%" stopColor="#030c1a" />
            </radialGradient>
          </defs>
          {/* atmosphere glow */}
          <circle cx={half} cy={half} r={r3 + 9}
            fill="none" stroke="#22d3ee" strokeWidth="14" strokeOpacity="0.045" />
          {/* planet body */}
          <circle cx={half} cy={half} r={r3} fill={`url(#pg${size})`} />
          {/* latitude lines */}
          {([-0.72, -0.44, -0.14, 0.14, 0.44, 0.72] as number[]).map((f, i) => {
            const rx = r3 * Math.sqrt(1 - f * f);
            return (
              <ellipse key={i}
                cx={half} cy={half + f * r3}
                rx={rx} ry={rx * 0.27}
                fill="none" stroke="#22d3ee"
                strokeWidth="0.45"
                strokeOpacity={0.09 + (1 - Math.abs(f)) * 0.07} />
            );
          })}
          {/* longitude lines */}
          {([0, 36, 72, 108, 144] as number[]).map((angle) => (
            <ellipse key={angle}
              cx={half} cy={half}
              rx={r3 * 0.27} ry={r3}
              fill="none" stroke="#22d3ee"
              strokeWidth="0.45" strokeOpacity="0.09"
              transform={`rotate(${angle},${half},${half})`} />
          ))}
          {/* specular highlight */}
          <ellipse
            cx={half - r3 * 0.22} cy={half - r3 * 0.27}
            rx={r3 * 0.27} ry={r3 * 0.17}
            fill="white" fillOpacity="0.07" />
          {/* atmosphere rim */}
          <circle cx={half} cy={half} r={r3 + 1.5}
            fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.22" />
        </svg>
      </div>

      {/* ── ring 0: outer dashed — steep equatorial tilt ── */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(66deg) rotateY(0deg)",
          animation: "precess-0 25s ease-in-out infinite",
        }}
      >
        <svg viewBox={vb} className={svgClass}>
          <g
            style={{
              animation: "spin-ccw 70s linear infinite",
              transformOrigin: orig,
            }}
          >
            {/* bloom */}
            <circle cx={half} cy={half} r={r0} fill="none" stroke="var(--ob3)" strokeWidth="7" strokeDasharray="5 9" strokeOpacity="0.10" />
            {/* neon core */}
            <circle cx={half} cy={half} r={r0} fill="none" stroke="var(--ob3)" strokeWidth="0.8" strokeDasharray="5 9" strokeOpacity="0.85" />
          </g>
        </svg>
      </div>

      {/* ── ring 1: middle + outer icons — inclined orbit ── */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(42deg) rotateY(18deg)",
          animation: "precess-1 33s ease-in-out infinite",
        }}
      >
        <svg viewBox={vb} className={svgClass}>
          <defs>
            <radialGradient id="ms1" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#0d5a6e" /><stop offset="45%" stopColor="#041418" /><stop offset="100%" stopColor="#010508" />
            </radialGradient>
            <radialGradient id="ms2" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#3d2a70" /><stop offset="45%" stopColor="#0d0618" /><stop offset="100%" stopColor="#040208" />
            </radialGradient>
            <radialGradient id="ms3" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#0d5e3d" /><stop offset="45%" stopColor="#041610" /><stop offset="100%" stopColor="#010504" />
            </radialGradient>
            <radialGradient id="ms4" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#6b3010" /><stop offset="45%" stopColor="#180c04" /><stop offset="100%" stopColor="#080301" />
            </radialGradient>
          </defs>
          {/* bloom */}
          <circle cx={half} cy={half} r={r1} fill="none" stroke="var(--ob1)" strokeWidth="8" strokeOpacity="0.10" />
          {/* neon core */}
          <circle cx={half} cy={half} r={r1} fill="none" stroke="var(--ob1)" strokeWidth="0.9" strokeOpacity="0.9" />
          <g
            style={{
              animation: "spin-cw 22s linear infinite",
              transformOrigin: orig,
            }}
          >
            {compassPts(r1).map((p, i) => (
              <React.Fragment key={i}>{outerIcons[i](p.x, p.y)}</React.Fragment>
            ))}
          </g>
        </svg>
      </div>

      {/* ── ring 2: inner + inner icons — steep counter-inclined orbit ── */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(14deg) rotateY(-24deg)",
          animation: "precess-2 19s ease-in-out infinite",
        }}
      >
        <svg viewBox={vb} className={svgClass}>
          <defs>
            <radialGradient id="ms5" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#0d3060" /><stop offset="45%" stopColor="#040c18" /><stop offset="100%" stopColor="#010408" />
            </radialGradient>
            <radialGradient id="ms6" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#6b0a35" /><stop offset="45%" stopColor="#18040e" /><stop offset="100%" stopColor="#080203" />
            </radialGradient>
            <radialGradient id="ms7" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#6b4a08" /><stop offset="45%" stopColor="#181002" /><stop offset="100%" stopColor="#080501" />
            </radialGradient>
            <radialGradient id="ms8" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#0d5e30" /><stop offset="45%" stopColor="#041610" /><stop offset="100%" stopColor="#010504" />
            </radialGradient>
          </defs>
          {/* bloom */}
          <circle cx={half} cy={half} r={r2} fill="none" stroke="var(--ob2)" strokeWidth="7" strokeOpacity="0.12" />
          {/* neon core */}
          <circle cx={half} cy={half} r={r2} fill="none" stroke="var(--ob2)" strokeWidth="0.9" strokeOpacity="0.9" />
          <g
            style={{
              animation: "spin-ccw 35s linear infinite",
              transformOrigin: orig,
            }}
          >
            {compassPts(r2).map((p, i) => (
              <React.Fragment key={i}>{innerIcons[i](p.x, p.y)}</React.Fragment>
            ))}
          </g>
        </svg>
      </div>

      {/* ── ring 3: innermost crosshair — mid tilt ── */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(30deg) rotateY(10deg)",
          animation: "precess-3 27s ease-in-out infinite",
        }}
      >
        <svg viewBox={vb} className={svgClass}>
          {/* bloom */}
          <circle cx={half} cy={half} r={r3} fill="none" stroke="var(--ob3)" strokeWidth="6" strokeOpacity="0.10" />
          {/* neon core */}
          <circle cx={half} cy={half} r={r3} fill="none" stroke="var(--ob3)" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1={half} y1={half - r3} x2={half} y2={half + r3} stroke="var(--ob3)" strokeWidth="0.3" strokeOpacity="0.3" />
          <line x1={half - r3} y1={half} x2={half + r3} y2={half} stroke="var(--ob3)" strokeWidth="0.3" strokeOpacity="0.3" />
        </svg>
      </div>

      {/* ── centre monogram — always faces viewer ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="font-mono text-[7px] uppercase tracking-[0.5em] text-white/40 mb-1">
          BE_DEV
        </div>
        <div
          className="font-black text-white leading-none"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: `${Math.round(size * 0.15)}px`,
            letterSpacing: "-0.04em",
          }}
        >
          YS
        </div>
        <div className="font-mono text-[7px] uppercase tracking-[0.4em] text-white/40 mt-1.5">
          IST · 2026
        </div>
      </div>
    </div>
  );
};

/* ─── Glitch overlay slices ─── */
const GlitchOverlay = () => (
  <>
    <span className="glitch-slice-1" aria-hidden="true" />
    <span className="glitch-slice-2" aria-hidden="true" />
  </>
);

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
const Hero = () => {
  const [time, setTime] = useState("--:--");
  const [mobileOrbSize, setMobileOrbSize] = useState(240);

  useEffect(() => {
    const updateOrbSize = () => {
      const vw = window.innerWidth;
      setMobileOrbSize(Math.min(300, Math.max(200, Math.round(vw * 0.78))));
    };
    updateOrbSize();
    window.addEventListener("resize", updateOrbSize);
    return () => window.removeEventListener("resize", updateOrbSize);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      id="home"
      className="relative w-full min-h-screen bg-[#ffffff] dark:bg-[#090909] text-black dark:text-white overflow-hidden"
    >
      <style>{`
        @keyframes glitch-jitter {
          0%,83%,100% { transform:translate(0,0) skewX(0deg); }
          84% { transform:translate(-3px,1px) skewX(-0.4deg); }
          86% { transform:translate(3px,-1px) skewX(0.4deg); }
          88% { transform:translate(-2px,2px); }
          90% { transform:translate(2px,-1px); }
          92% { transform:translate(-1px,0); }
        }
        @keyframes glitch-slice-1-kf {
          0%,80%,100% { opacity:0; clip-path:inset(100% 0 0 0); transform:translateX(0); }
          81% { opacity:1; clip-path:inset(14% 0 63% 0); transform:translateX(-6px); }
          84% { opacity:1; clip-path:inset(56% 0 11% 0); transform:translateX(6px); }
          87% { opacity:.65; clip-path:inset(35% 0 43% 0); transform:translateX(-3px); }
          90% { opacity:0; clip-path:inset(100% 0 0 0); }
        }
        @keyframes glitch-slice-2-kf {
          0%,76%,100% { opacity:0; clip-path:inset(100% 0 0 0); transform:translateX(0); }
          77% { opacity:1; clip-path:inset(7% 0 74% 0); transform:translateX(5px); }
          80% { opacity:1; clip-path:inset(66% 0 13% 0); transform:translateX(-5px); }
          83% { opacity:.55; clip-path:inset(41% 0 33% 0); transform:translateX(3px); }
          86% { opacity:0; clip-path:inset(100% 0 0 0); }
        }
        @keyframes glitch-border-kf {
          0%,80%,100% { box-shadow:none; }
          81%,85% { box-shadow:inset 0 0 0 1px rgba(0,220,255,.9); }
          86%,89% { box-shadow:inset 0 0 0 1px rgba(255,20,120,.8); }
          90%,94% { box-shadow:none; }
        }
        .glitch-box { position:relative; overflow:hidden; }
        .glitch-slice-1,.glitch-slice-2 {
          display:block; position:absolute; inset:0; pointer-events:none; opacity:0; z-index:20;
          will-change:transform,opacity,clip-path;
        }
        .glitch-slice-1 { background:rgba(0,220,255,.22); }
        .glitch-slice-2 { background:rgba(255,20,120,.18); }
        .glitch-box:hover {
          animation:glitch-jitter 1.1s steps(1) infinite,glitch-border-kf 1.1s steps(1) infinite;
          transition:none !important;
        }
        .glitch-box:hover .glitch-slice-1 { animation:glitch-slice-1-kf 1.1s steps(1) infinite; }
        .glitch-box:hover .glitch-slice-2 { animation:glitch-slice-2-kf 1.1s steps(1) infinite .07s; }
      `}</style>
      {/* ── TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 py-4 border-b border-black/10 dark:border-white/10">
        <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase">
          YASH SACHAN
        </span>

        <div className="border border-black/20 dark:border-white/20 px-3 py-1.5 flex items-center gap-1.5">
          <svg
            viewBox="0 0 16 16"
            className="w-3 h-3 opacity-40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="8" cy="8" r="6.5" />
            <ellipse cx="8" cy="8" rx="3.5" ry="6.5" />
            <line x1="1.5" y1="8" x2="14.5" y2="8" />
          </svg>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.28em] uppercase">
            BACKEND DEVELOPER
          </span>
        </div>

        <div className="text-right">
          <div className="font-mono text-[7px] tracking-[0.35em] uppercase text-black/35 dark:text-white/35">
            LOCAL TIME
          </div>
          <div className="font-mono text-[10px] md:text-[11px] tracking-[0.18em]">
            IST {time}
          </div>
        </div>
      </header>

      {/* ══════════════════════
          MOBILE LAYOUT
      ══════════════════════ */}
      <div className="lg:hidden flex flex-col items-center pt-24 px-5 pb-12 min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full font-black uppercase leading-[1.05] text-center mb-8"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2rem, 11vw, 5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          SYSTEMS,
          <br />
          BY DESIGN.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <TechOrb size={mobileOrbSize} />
        </motion.div>

        {/* Core threads (mobile) */}
        <div className="w-full mt-10">
          <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
            [ CORE THREADS ]
          </div>
          <div className="space-y-2">
            {threads.map((t) => (
              <div key={t.n} className="flex items-center gap-3">
                <span className="font-mono text-[7px] text-black/25 dark:text-white/25">
                  {t.n}.////
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About (mobile) */}
        <div className="glitch-box w-full mt-8 border border-black/15 dark:border-white/15 p-4">
          <GlitchOverlay />
          <div className="font-mono text-[7px] uppercase tracking-[0.3em] font-bold mb-2">
            NOT A STUDIO — JUST ME
          </div>
          <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
          <p className="font-mono text-[8px] leading-relaxed text-black/65 dark:text-white/65 mb-3">
            I&apos;m Yash Sachan — backend developer at Zanskar. I build
            high-throughput distributed infrastructure and enjoy competitive
            programming.
          </p>
          <div className="flex flex-col gap-1.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-150 ${s.color} ${s.border} ${s.bg}`}
              >
                <span className={`w-1.5 h-1.5 shrink-0 ${s.dot}`} />
                <span className="flex-1">{s.label}</span>
                <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-[10px]">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links (mobile) */}
        <div className="w-full mt-6 flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`glitch-box border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.25em] transition-colors ${l.cls}`}
            >
              <GlitchOverlay />
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════
          DESKTOP LAYOUT
      ══════════════════════ */}
      <div className="hidden lg:block absolute inset-0 pt-[64px]">
        {/* ── HEADLINE ── */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[80px] left-8 z-20 font-black uppercase leading-[1.05]"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
            letterSpacing: "-0.02em",
            maxWidth: "45vw",
          }}
        >
          SYSTEMS,
          <br />
          BY DESIGN.
        </motion.h1>

        {/* ── CENTER ORB ── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
          >
            <TechOrb />
          </motion.div>
        </div>

        {/* ── ANNOTATION: top-right area ── */}
        <div className="absolute z-20" style={{ top: "24%", right: "30%" }}>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/55 dark:text-white/55 text-right">
            WHERE ENGINEERING
            <br />
            MEETS PRECISION —<br />
            INFRASTRUCTURE OF
            <br />
            ENDLESS SCALE
          </p>
          {/* vertical leader line ↓ */}
          <div className="absolute bottom-0 right-4 translate-y-full flex flex-col items-center">
            <div
              className="w-px bg-black/20 dark:bg-white/20"
              style={{ height: 40 }}
            />
            <div className="w-2 h-2 border border-black/35 dark:border-white/35 bg-[#ffffff] dark:bg-[#090909]" />
          </div>
        </div>

        {/* ── ANNOTATION: left mid ── */}
        <div
          className="absolute z-20 max-w-[150px]"
          style={{ top: "50%", left: "5%", transform: "translateY(-50%)" }}
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/50 dark:text-white/50">
            FROM DEEP ROOTS,
            <br />
            PERFORMANCE
            <br />
            DRAWS ITS
            <br />
            STRENGTH
          </p>
          {/* horizontal leader → */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-full flex items-center">
            <div
              className="bg-black/20 dark:bg-white/20 h-px"
              style={{ width: 48 }}
            />
          </div>
        </div>

        {/* ── ANNOTATION: bottom of orb ── */}
        <div className="absolute z-20" style={{ bottom: "23%", left: "56%" }}>
          <div className="flex flex-col items-center mb-2">
            <div className="w-2 h-2 border border-black/30 dark:border-white/30 bg-[#ffffff] dark:bg-[#090909]" />
            <div
              className="w-px bg-black/18 dark:bg-white/18"
              style={{ height: 36 }}
            />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-black/50 dark:text-white/50">
            FOUNDATION
            <br />
            DESIGNED FOR
            <br />
            GROWTH
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20"
          style={{
            right: "2.5%",
            top: "38%",
            transform: "translateY(-50%)",
            width: 210,
          }}
        >
          <div className="glitch-box border border-black/15 dark:border-white/15 p-4 xl:p-5">
            <GlitchOverlay />
            <div className="font-mono text-[7px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
              SPECIALIZATION
            </div>
            <div className="space-y-0.5 mb-4">
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                DISTRIBUTED
              </div>
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                + SYSTEMS
              </div>
              <div className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase">
                + PERFORMANCE
              </div>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
            <div className="font-mono text-[8px] tracking-[0.14em] leading-relaxed text-black/55 dark:text-white/55">
              → HIGH-THROUGHPUT
              <br />→ INFRA ENGINEERING
            </div>
          </div>
        </motion.div>

        {/* ── CORE THREADS (bottom-left) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20 bottom-8 left-8"
        >
          <div className="font-mono text-[7px] tracking-[0.42em] uppercase text-black/32 dark:text-white/32 mb-3">
            [ CORE THREADS OF MY WORK ]
          </div>
          <div className="space-y-2">
            {threads.map((t) => (
              <div key={t.n} className="flex items-center gap-3">
                <span className="font-mono text-[7px] text-black/25 dark:text-white/25 w-12">
                  {t.n}.////
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── ABOUT CARD (bottom-right) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-20 bottom-8 right-8"
          style={{ width: 270 }}
        >
          <div className="glitch-box border border-black/15 dark:border-white/15 p-4">
            <GlitchOverlay />
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[7px] uppercase tracking-[0.3em] font-bold">
                NOT A STUDIO — JUST ME
              </span>
              <div className="w-3.5 h-3.5 border border-black/25 dark:border-white/25 flex items-center justify-center font-mono text-[9px] text-black/35 dark:text-white/35">
                ×
              </div>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10 mb-3" />
            <p className="font-mono text-[8px] leading-relaxed text-black/62 dark:text-white/62 mb-3">
              I&apos;m Yash Sachan — backend developer at Zanskar. I build
              high-throughput distributed infrastructure and mentor aspiring
              engineers on the side.
            </p>
            <div className="grid grid-cols-2 gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-150 ${s.color} ${s.border} ${s.bg}`}
                >
                  <span className={`w-1 h-1 shrink-0 ${s.dot}`} />
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[9px]">↗</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── QUICK NAV (bottom-center) ── */}
        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`glitch-box border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.25em] transition-colors ${l.cls}`}
            >
              <GlitchOverlay />
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── GRID CROSS MARKERS ── */}
        <Cross style={{ top: "28%", right: "39%", transform: "none" }} />
        <Cross style={{ top: "63%", left: "36%" }} />
        <Cross style={{ top: "38%", left: "20%" }} />
        <Cross style={{ bottom: "28%", right: "22%" }} />
      </div>
    </div>
  );
};

/* ─── shared data ─── */
const threads = [
  { n: "01", label: "DISTRIBUTED SYSTEMS" },
  { n: "02", label: "PERFORMANCE ENGINEERING" },
  { n: "03", label: "CLOUD NATIVE INFRA" },
  { n: "04", label: "BACKEND ARCHITECTURE" },
];

const socials = [
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/yashsachan321/",
    color: "text-[#0a66c2] dark:text-blue-400",
    dot: "bg-[#0a66c2] dark:bg-blue-400",
    border: "border-blue-500/30 dark:border-blue-400/25",
    bg: "hover:bg-blue-500/[0.07] dark:hover:bg-blue-400/[0.07]",
  },
  {
    label: "GITHUB",
    href: "https://github.com/cyberlordyash",
    color: "text-black/75 dark:text-white/75",
    dot: "bg-black/50 dark:bg-white/50",
    border: "border-black/20 dark:border-white/20",
    bg: "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]",
  },
  {
    label: "LEETCODE",
    href: "https://leetcode.com/u/yashsachan/",
    color: "text-orange-500 dark:text-orange-400",
    dot: "bg-orange-500 dark:bg-orange-400",
    border: "border-orange-500/30 dark:border-orange-400/25",
    bg: "hover:bg-orange-500/[0.07] dark:hover:bg-orange-400/[0.07]",
  },
  {
    label: "CODECHEF",
    href: "https://www.codechef.com/users/cyberlordyash",
    color: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-600 dark:bg-yellow-400",
    border: "border-yellow-600/30 dark:border-yellow-400/25",
    bg: "hover:bg-yellow-500/[0.07] dark:hover:bg-yellow-400/[0.07]",
  },
];

const quickLinks = [
  {
    label: "WORKLOG",
    href: "/worklog",
    cls: "border-cyan-500/35 text-cyan-700 dark:text-cyan-400 bg-cyan-500/[0.05] hover:bg-cyan-500/[0.12] hover:border-cyan-500/60",
  },
  {
    label: "BLOGS",
    href: "/blogs",
    cls: "border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/[0.05] hover:bg-amber-500/[0.12] hover:border-amber-500/60",
  },
  {
    label: "GYM",
    href: "/gym",
    cls: "border-red-500/35 text-red-600 dark:text-red-400 bg-red-500/[0.05] hover:bg-red-500/[0.12] hover:border-red-500/60",
  },
];

export default Hero;
