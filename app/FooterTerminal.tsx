"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IconTerminal2,
  IconClock,
  IconCpu,
  IconMaximize,
  IconMinimize,
  IconShieldCheck,
  IconTrophy,
  IconChevronRight,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

// --- SYSTEM DATA (Cleaned of problematic syntax) ---
const SYSTEM_CONFIG = {
  user: "yash",
  hostname: "nodes",
  version: "8.3.0-stable",
  kernel: "LINUX-AARCH64-CSE",
};

const FILES = {
  "education.md":
    "INSTITUTION: IIIT Sonepat\nDEGREE: B.Tech in CSE\nCGPA: 8.3/10",
  "experience.json": JSON.stringify(
    {
      current: "Analyst Software Engineer @ Zanskar Securities",
      previous: [
        "Software Engineering Intern @ Onefinnet",
        "Software Engineering Intern @ Modulus Technologies",
      ],
    },
    null,
    2,
  ),
  "achievements.log":
    "• LeetCode: Guardian (2200+ Rating)\n• CodeChef: 4-Star (1800+ Rating)\n• NDA: AIR 193 & Recommended by Indian Army",
  "matching_engine.go":
    "// High-performance Price-Time Priority Matching\nfunc (ob *OrderBook) Process(order *Order) {\n  // Logic: Mutex Lock -> Match -> Sort -> Unlock\n  // Optimized for low-latency HFT workloads",
  "stack.sh":
    "export LANGUAGES='Golang, C++, TS, Java'\nexport TOOLS='NATS, Elasticsearch, Prometheus, Docker'",
};

const BOOT_SEQUENCE = [
  { delay: 100, text: "YASH_OS v5.0.0-PROD INITIALIZING...", type: "system" },
  { delay: 400, text: "AUTHENTICATING: Yash Sachan", type: "info" },
  { delay: 700, text: "SECURE_BOOT: AIR-193 NDA Verified", type: "success" },
  {
    delay: 1000,
    text: "LOADING: Golang Concurrency Patterns... [OK]",
    type: "system",
  },
  {
    delay: 1300,
    text: "LOADING: NATS JetStream & WebSockets... [OK]",
    type: "system",
  },
  {
    delay: 1600,
    text: "SYNC: LeetCode Guardian Data (2200+)",
    type: "success",
  },
  {
    delay: 2000,
    text: "------------------------------------------------",
    type: "system",
  },
  { delay: 2400, text: "STATUS: Analyst SE @ Zanskar", type: "info" },
  { delay: 3000, text: "SYSTEM READY. Type 'ls' to start.", type: "success" },
];

const FooterTerminal = () => {
  const [history, setHistory] = useState<{ text: string; type: string }[]>([]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isAutoPlaying) {
          BOOT_SEQUENCE.forEach((line, index) => {
            setTimeout(() => {
              setHistory((prev) => [
                ...prev,
                { text: line.text, type: line.type },
              ]);
              if (index === BOOT_SEQUENCE.length - 1) setIsBooted(true);
            }, line.delay);
          });
          setIsAutoPlaying(false);
        }
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isAutoPlaying]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim();
      if (!trimmed) return;

      setCommandHistory((prev) => [...prev, trimmed]);
      setHistory((prev) => [
        ...prev,
        {
          text: `${SYSTEM_CONFIG.user}@${SYSTEM_CONFIG.hostname}:~$ ${trimmed}`,
          type: "command",
        },
      ]);

      const [cmd, ...args] = trimmed.toLowerCase().split(" ");

      switch (cmd) {
        case "help":
          setHistory((prev) => [
            ...prev,
            {
              text: "ls, cat <file>, clear, whoami, neofetch, resume",
              type: "system",
            },
          ]);
          break;
        case "ls":
          setHistory((prev) => [
            ...prev,
            { text: Object.keys(FILES).join("  "), type: "info" },
          ]);
          break;
        case "cat":
          const file = args[0];
          if (file && FILES[file as keyof typeof FILES]) {
            setHistory((prev) => [
              ...prev,
              { text: FILES[file as keyof typeof FILES], type: "data" },
            ]);
          } else {
            setHistory((prev) => [
              ...prev,
              { text: `Error: ${file || "NULL"} not found.`, type: "error" },
            ]);
          }
          break;
        case "whoami":
          setHistory((prev) => [
            ...prev,
            {
              text: "Yash Sachan | Analyst Software Engineer @ Zanskar",
              type: "info",
            },
          ]);
          break;
        case "neofetch":
          setHistory((prev) => [
            ...prev,
            {
              text: `OS: ${SYSTEM_CONFIG.kernel}\nUPTIME: High Performance\nRAM: 8.3/10 CGPA\nRANK: LeetCode Guardian`,
              type: "data",
            },
          ]);
          break;
        case "clear":
          setHistory([]);
          break;
        case "resume":
          setHistory((prev) => [
            ...prev,
            { text: "Opening yashsachan.in...", type: "system" },
          ]);
          window.open("https://yashsachan.in/", "_blank");
          break;
        default:
          setHistory((prev) => [
            ...prev,
            { text: `Unknown command: ${cmd}`, type: "error" },
          ]);
      }
      setInput("");
    },
    [commandHistory],
  );

  const getLineClass = (type: string) => {
    switch (type) {
      case "command":
        return "text-cyan-400 font-bold break-all";
      case "system":
        return "text-neutral-600 italic break-words";
      case "success":
        return "text-emerald-500 font-medium break-words";
      case "info":
        return "text-blue-500 font-semibold break-words";
      case "data":
        return "text-neutral-300 leading-relaxed whitespace-pre-wrap break-all";
      case "error":
        return "text-red-500 break-words";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <motion.div
      layout
      ref={containerRef}
      className={cn(
        "w-full mx-auto font-mono",
        isFullscreen
          ? "fixed inset-0 z-[999]"
          : "max-w-5xl mt-10 md:mt-20 px-2 md:px-4",
      )}
    >
      <div
        className={cn(
          "bg-[#020202] border border-white/10 flex flex-col relative overflow-hidden transition-all",
          isFullscreen
            ? "h-screen rounded-none"
            : "min-h-[400px] h-[60vh] md:h-[600px] rounded-xl shadow-2xl",
        )}
      >
        {/* Header */}
        <div className="bg-[#0a0a0a] px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold hidden sm:inline">
              Terminal — {SYSTEM_CONFIG.user}@{SYSTEM_CONFIG.hostname}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <IconMinimize size={18} />
              ) : (
                <IconMaximize size={18} />
              )}
            </button>
            <span className="text-neutral-500 text-[10px] tabular-nums">
              {time}
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 bg-[#020202] relative custom-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {history.map((line, i) => (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className={cn(
                  "text-[11px] md:text-sm relative z-20",
                  getLineClass(line.type),
                )}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {isBooted && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCommand(input);
              }}
              className="flex items-center gap-2 pt-2 relative z-20"
            >
              <span className="text-emerald-500 font-bold shrink-0 text-[11px] md:text-sm">
                ➜
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-white caret-cyan-500 font-mono text-[11px] md:text-sm"
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
            </form>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#080808] px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-600 shrink-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <IconTrophy size={12} /> GUARDIAN
            </span>
            <span className="flex items-center gap-1">
              <IconShieldCheck size={12} /> SECURE
            </span>
          </div>
          <span className="text-emerald-500/50 hidden xs:inline">
            ● SESSION_ACTIVE
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterTerminal;
