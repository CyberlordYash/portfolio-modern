"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const USR = "yash";
const HOST = "nodes";

const FILES: Record<string, string> = {
  "education.md":
    "INSTITUTION : IIIT Sonepat\nDEGREE      : B.Tech in CSE\nCGPA        : 8.3 / 10\nGRAD        : 2025",
  "experience.json":
    '{\n  "current": "Analyst SE @ Zanskar Securities",\n  "previous": [\n    "SWE Intern @ Onefinnet",\n    "SWE Intern @ Modulus Technologies"\n  ]\n}',
  "achievements.log":
    "[★] LeetCode  : Guardian — 2200+ Rating\n[★] CodeChef  : 4-Star  — 1800+ Rating\n[★] NDA Exam  : AIR 193 — Recommended by Indian Army",
  "matching_engine.go":
    "// Price-Time Priority Matching Engine\nfunc (ob *OrderBook) Process(o *Order) {\n  ob.mu.Lock()\n  defer ob.mu.Unlock()\n  ob.match(o) // O(log n)\n  ob.sort()\n}",
  "stack.sh":
    '#!/bin/bash\nLANGUAGES="Golang  C++  TypeScript  Java"\nINFRA="NATS  Elasticsearch  Prometheus  Docker"\nFOCUS="Low-latency HFT Systems"',
};

const BOOT: { d: number; t: string; c: string }[] = [
  { d: 60,   t: "YASH_OS v5.0.0-PROD  ·  Secure Boot Initializing", c: "dim" },
  { d: 250,  t: "[ OK ] BIOS integrity check passed", c: "dim" },
  { d: 440,  t: "[ OK ] Kernel LINUX-AARCH64-CSE loaded", c: "dim" },
  { d: 630,  t: "[ OK ] Identity: Yash Sachan — AIR-193 NDA Verified", c: "ok" },
  { d: 820,  t: "[ OK ] Module: Golang Concurrency & Channels", c: "dim" },
  { d: 1010, t: "[ OK ] Module: NATS JetStream & WebSockets", c: "dim" },
  { d: 1200, t: "[SYNC] LeetCode Guardian · Rating 2200+", c: "info" },
  { d: 1390, t: "[LIVE] Zanskar Securities · HFT Matching Engine", c: "info" },
  { d: 1580, t: "────────────────────────────────────────────────────", c: "sep" },
  { d: 1770, t: "System ready. Type 'help' to see available commands.", c: "ready" },
];

const NEOFETCH = [
  "  ██╗   ██╗ █████╗ ███████╗██╗  ██╗",
  "  ╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║",
  "   ╚████╔╝ ███████║███████╗███████║ ",
  "    ╚██╔╝  ██╔══██║╚════██║██╔══██║ ",
  "     ██║   ██║  ██║███████║██║  ██║ ",
  "     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝",
  "",
  `${USR}@${HOST}`,
  "─────────────────────────────────────",
  "OS     : LINUX-AARCH64-CSE",
  "Role   : Analyst SE @ Zanskar Securities",
  "Edu    : B.Tech CSE · IIIT Sonepat · CGPA 8.3",
  "Rank   : LeetCode Guardian · 2200+  |  CodeChef 4★",
  "Stack  : Golang · C++ · TypeScript · Java",
  "Infra  : NATS · Docker · Prometheus · GCP",
];

const COMPLETIONS = [
  "help", "ls", "cat ", "whoami", "neofetch",
  "skills", "contact", "resume", "date", "clear",
  ...Object.keys(FILES).map(f => `cat ${f}`),
];

type Line = { text: string; c: string; id: number };
let lid = 0;

const FooterTerminal = () => {
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [booted, setBooted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [full, setFull] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cmdHistRef = useRef<string[]>([]);
  const cmdIdxRef = useRef(-1);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && autoPlay) {
          setAutoPlay(false);
          BOOT.forEach((b, i) =>
            setTimeout(() => {
              setHistory(prev => [...prev, { text: b.t, c: b.c, id: ++lid }]);
              if (i === BOOT.length - 1) setBooted(true);
            }, b.d),
          );
        }
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const push = useCallback((...lines: { text: string; c: string }[]) => {
    setHistory(prev => [...prev, ...lines.map(l => ({ ...l, id: ++lid }))]);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      cmdHistRef.current = [cmd, ...cmdHistRef.current];
      cmdIdxRef.current = -1;
      push({ text: `${USR}@${HOST} ~ $ ${cmd}`, c: "cmd" });

      const [name, ...args] = cmd.split(/\s+/);

      switch (name.toLowerCase()) {
        case "help":
          push(
            { text: "┌── Commands ─────────────────────────────────────┐", c: "box" },
            { text: "│  help        Show this message                  │", c: "box" },
            { text: "│  ls          List directory contents            │", c: "box" },
            { text: "│  cat <file>  Print file contents                │", c: "box" },
            { text: "│  whoami      Display user profile               │", c: "box" },
            { text: "│  neofetch    System info with ASCII art         │", c: "box" },
            { text: "│  skills      Print full tech stack              │", c: "box" },
            { text: "│  contact     Show contact info                  │", c: "box" },
            { text: "│  resume      Open portfolio site                │", c: "box" },
            { text: "│  date        Current datetime                   │", c: "box" },
            { text: "│  clear       Clear terminal                     │", c: "box" },
            { text: "└─────────────────────────────────────────────────┘", c: "box" },
          );
          break;

        case "ls":
          push(
            { text: "total 5", c: "dim" },
            ...Object.keys(FILES).map(f => ({
              text: `-rw-r--r--  1  yash  nodes  ${f}`,
              c: "ls",
            })),
          );
          break;

        case "cat": {
          const f = args[0];
          if (!f) {
            push({ text: "cat: missing operand. Usage: cat <filename>", c: "err" });
            break;
          }
          const content = FILES[f];
          if (!content) {
            push({ text: `cat: ${f}: No such file or directory`, c: "err" });
            break;
          }
          push(...content.split("\n").map(t => ({ text: t, c: "data" })));
          break;
        }

        case "whoami":
          push(
            { text: "╔═══════════════════════════════════════════════╗", c: "box-hi" },
            { text: "║     Yash Sachan  —  yash@nodes                ║", c: "box-title" },
            { text: "╠═══════════════════════════════════════════════╣", c: "box-hi" },
            { text: "║  Company   :  Zanskar Securities               ║", c: "box-hi" },
            { text: "║  Role      :  Analyst Software Engineer        ║", c: "box-hi" },
            { text: "║  Rank      :  LeetCode Guardian · 2200+        ║", c: "box-hi" },
            { text: "║  NDA       :  AIR 193 · Recommended by Army    ║", c: "box-hi" },
            { text: "╚═══════════════════════════════════════════════╝", c: "box-hi" },
          );
          break;

        case "neofetch":
          push(
            ...NEOFETCH.map((t, i) => ({
              text: t,
              c: i === 7 ? "nf-title" : i === 8 ? "dim" : i < 6 ? "nf-art" : "nf",
            })),
          );
          break;

        case "skills":
          push(
            { text: "Languages  :  Golang · C++ · TypeScript · Java · Python", c: "info" },
            { text: "Backend    :  Fiber · Express · Next.js · gRPC · REST", c: "info" },
            { text: "Infra      :  NATS JetStream · Docker · Kubernetes · GCP", c: "info" },
            { text: "Data       :  Elasticsearch · PostgreSQL · Redis · Kafka", c: "info" },
            { text: "Observ     :  Prometheus · Grafana · OpenTelemetry", c: "info" },
          );
          break;

        case "contact":
          push(
            { text: "Email   :  yashsachan321@gmail.com", c: "ok" },
            { text: "GitHub  :  github.com/cyberlordyash", c: "ok" },
            { text: "Web     :  yashsachan.in", c: "ok" },
          );
          break;

        case "resume":
          push({ text: "Navigating to yashsachan.in …", c: "dim" });
          window.open("https://yashsachan.in/", "_blank");
          break;

        case "date":
          push({ text: new Date().toLocaleString(), c: "info" });
          break;

        case "clear":
          setHistory([]);
          break;

        default:
          push(
            { text: `bash: ${name}: command not found`, c: "err" },
            { text: "Type 'help' for a list of commands.", c: "dim" },
          );
      }

      setInput("");
    },
    [push],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cmdIdxRef.current + 1, cmdHistRef.current.length - 1);
      cmdIdxRef.current = next;
      setInput(cmdHistRef.current[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cmdIdxRef.current - 1;
      cmdIdxRef.current = next;
      setInput(next < 0 ? "" : cmdHistRef.current[next] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMPLETIONS.find(c => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
  };

  const cls = (c: string) => {
    switch (c) {
      case "cmd":       return "text-green-400 font-semibold";
      case "ok":        return "text-emerald-400";
      case "err":       return "text-red-400";
      case "info":      return "text-emerald-300";
      case "data":      return "text-neutral-300";
      case "dim":       return "text-neutral-600";
      case "sep":       return "text-neutral-700";
      case "ready":     return "text-green-400 font-semibold";
      case "box":       return "text-green-300/40";
      case "box-hi":    return "text-green-300/60";
      case "box-title": return "text-green-200 font-bold";
      case "ls":        return "text-neutral-300";
      case "nf-art":    return "text-green-500/70";
      case "nf-title":  return "text-emerald-300 font-bold";
      case "nf":        return "text-neutral-400";
      default:          return "text-neutral-400";
    }
  };

  return (
    <motion.div
      layout
      ref={containerRef}
      className={cn(
        "w-full mx-auto font-mono",
        full ? "fixed inset-0 z-[999]" : "max-w-5xl mt-10 md:mt-20 px-2 md:px-4",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col overflow-hidden border transition-all duration-300",
          "bg-[#040a06] border-green-500/20",
          "shadow-[0_0_80px_-20px_rgba(34,197,94,0.22),0_0_20px_-5px_rgba(34,197,94,0.06)]",
          full ? "h-screen rounded-none" : "h-[460px] md:h-[580px] rounded-xl",
        )}
      >
        {/* Scanlines */}
        <div
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 2px,#000 2px,#000 4px)",
          }}
        />

        {/* Green edge glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        {/* Header */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-green-500/10 bg-[#030a06] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="block h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="block h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="block h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px]">
              <span className="text-green-400/60 uppercase tracking-[0.2em]">
                {USR}@{HOST}
              </span>
              <span className="text-neutral-700">—</span>
              <span className="text-neutral-700 tracking-widest">bash</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="tabular-nums text-[10px] text-neutral-700">{time}</span>
            <button
              onClick={() => setFull(f => !f)}
              className="text-neutral-700 transition-colors hover:text-green-400"
              aria-label="Toggle fullscreen"
            >
              {full ? (
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                  <path d="M5.5 0H0v5.5h1.5V1.5H5.5V0zm5 0v1.5h4V5.5H16V0h-5.5zm5 10.5H16V16h-5.5v-1.5H14v-4zM1.5 14v-4H0V16h5.5v-1.5H1.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                  <path d="M1.5 1.5H6V0H0v6h1.5V1.5zm9 0V0H16v6h-1.5V1.5H11zM6 16H0v-6h1.5v4.5H6V16zm8.5-6V16H9v-1.5h4.5V10H16z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="relative z-10 flex-1 cursor-text overflow-y-auto p-4 md:p-6"
        >
          <div className="space-y-0.5">
            <AnimatePresence initial={false}>
              {history.map(line => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className={cn(
                    "whitespace-pre-wrap break-all text-[11px] leading-[1.7] md:text-[13px]",
                    cls(line.c),
                  )}
                >
                  {line.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {booted && (
            <form
              onSubmit={e => { e.preventDefault(); run(input); }}
              className="mt-1.5 flex items-center"
            >
              <span className="shrink-0 text-[11px] font-semibold text-green-500 md:text-[13px]">
                {USR}@{HOST}
              </span>
              <span className="mx-1 shrink-0 text-[11px] text-neutral-600 md:text-[13px]">~</span>
              <span className="mr-2 shrink-0 text-[11px] text-neutral-500 md:text-[13px]">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-[11px] text-white caret-green-400 outline-none md:text-[13px]"
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
            </form>
          )}
        </div>

        {/* Status bar */}
        <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-green-500/10 bg-[#020704] px-4 py-1.5 text-[9px] text-neutral-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              SESSION ACTIVE
            </span>
            <span>GUARDIAN · 2200+</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-green-500/30">bash</span>
            <span>{history.length} ln</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterTerminal;
