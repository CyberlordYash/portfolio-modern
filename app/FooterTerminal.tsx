"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IconTerminal2,
  IconClock,
  IconCpu,
  IconMaximize,
  IconMinimize,
  IconShieldCheck,
  IconHistory,
  IconDownload,
  IconDeviceDesktop,
  IconNetwork,
  IconChevronRight,
  IconTrophy,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

// --- PERSONALIZED DATA FROM RESUME ---
const SYSTEM_CONFIG = {
  user: "yash_sachan",
  hostname: "nodes.yashsachan.in",
  version: "8.3.0-stable", // Based on your CGPA [cite: 9]
  kernel: "LINUX-AARCH64-CSE",
};

const FILES = {
  "education.md":
    "INSTITUTION: IIIT Sonepat [cite: 5]\nDEGREE: B.Tech in Computer Science & Engineering [cite: 5]\nCGPA: 8.3/10 [cite: 9]",
  "experience.json": JSON.stringify(
    {
      current: "Analyst Software Engineer @ Zanskar Securities [cite: 7, 8]",
      previous: [
        "Software Engineering Intern @ Onefinnet [cite: 16, 17]",
        "Software Engineering Intern @ Modulus Technologies [cite: 23, 24]",
      ],
    },
    null,
    2,
  ),
  "achievements.log":
    "• LeetCode: Guardian (2200+ Rating) - Top 1% Globally \n• CodeChef: 4-Star (1800+ Rating) \n• NDA: AIR 193 & Recommended by Indian Army (SSB) ",
  "stack.sh":
    "# Systems & Backend\nexport LANGUAGES='Golang, C++, TypeScript, Java, SQL' [cite: 36]\nexport CLOUD='GCP, AWS, Docker, Kubernetes' [cite: 39]\nexport TOOLS='NATS, Elasticsearch, Prometheus, Grafana' [cite: 13, 14, 22]",
  "contact.txt":
    "Email: yashsachan321@gmail.com [cite: 4]\nLinkedIn: linkedin.com/in/yashsachan [cite: 4]\nWeb: yashsachan.in [cite: 4]",
};

const BOOT_SEQUENCE = [
  { delay: 100, text: "YASH_OS v5.0.0-PROD INITIALIZING...", type: "system" },
  { delay: 400, text: "AUTHENTICATING: Yash Sachan [cite: 3]", type: "info" },
  { delay: 700, text: "SECURE_BOOT: AIR-193 NDA Verified ", type: "success" },
  {
    delay: 1000,
    text: "LOADING_MODULE: Low-Latency Golang Services... [OK] ",
    type: "system",
  },
  {
    delay: 1300,
    text: "LOADING_MODULE: WebSocket Pipelines... [OK] [cite: 12]",
    type: "system",
  },
  {
    delay: 1600,
    text: "SYNCING: LeetCode Guardian Data (Rating 2200+) ",
    type: "success",
  },
  {
    delay: 2000,
    text: "------------------------------------------------",
    type: "system",
  },
  {
    delay: 2400,
    text: "CURRENT_STATUS: Analyst Software Engineer @ Zanskar [cite: 7, 8]",
    type: "info",
  },
  { delay: 2700, text: "LOCATION: Bengaluru, IN [cite: 10]", type: "info" },
  {
    delay: 3000,
    text: "SYSTEM READY. Type 'ls' to browse my core files.",
    type: "success",
  },
];

const FooterTerminal = () => {
  const [history, setHistory] = useState<{ text: string; type: string }[]>([]);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
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
      { threshold: 0.2 },
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
      setHistoryPointer(-1);
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
              text: "AVAILABLE: ls, cat <file>, clear, whoami, neofetch, resume, achievements",
              type: "system",
            },
          ]);
          break;
        case "ls":
          setHistory((prev) => [
            ...prev,
            { text: Object.keys(FILES).join("    "), type: "info" },
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
              text: "Yash Sachan [cite: 3] | Software Engineer [cite: 8] | Competitive Programmer ",
              type: "info",
            },
          ]);
          break;
        case "achievements":
          setHistory((prev) => [
            ...prev,
            {
              text: "LeetCode Guardian  | CodeChef 4*  | NDA AIR-193 ",
              type: "success",
            },
          ]);
          break;
        case "neofetch":
          setHistory((prev) => [
            ...prev,
            {
              text: `OS: ${SYSTEM_CONFIG.kernel}\nHOST: ${SYSTEM_CONFIG.hostname}\nUPTIME: High Performance\nCPU: Distributed-Go-Engine\nMEMORY: 8.3/10 CGPA [cite: 9]`,
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
            {
              text: "Redirecting to secure PDF storage... [cite: 4]",
              type: "system",
            },
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
        return "text-cyan-400 font-bold flex gap-2";
      case "system":
        return "text-neutral-600 italic";
      case "success":
        return "text-emerald-500 font-medium";
      case "info":
        return "text-blue-500 font-semibold";
      case "data":
        return "text-neutral-300 leading-relaxed whitespace-pre-wrap";
      case "error":
        return "text-red-500";
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
        isFullscreen ? "fixed inset-0 z-[999]" : "max-w-5xl mt-20 px-4",
      )}
    >
      <div
        className={cn(
          "bg-[#020202] border border-white/10 flex flex-col relative",
          isFullscreen ? "h-screen" : "h-[600px] rounded-2xl shadow-2xl",
        )}
      >
        {/* Header */}
        <div className="bg-[#0a0a0a] px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold ml-4">
              Terminal — {SYSTEM_CONFIG.user}@{SYSTEM_CONFIG.hostname}
            </span>
          </div>
          <div className="flex items-center gap-4">
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
            <span className="text-neutral-500 text-xs tabular-nums">
              {time}
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-8 space-y-2 bg-[#020202] custom-scrollbar relative"
        >
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] z-10" />

          <AnimatePresence>
            {history.map((line, i) => (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className={cn(
                  "text-xs md:text-sm relative z-20",
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
              className="flex items-center gap-3 pt-4 relative z-20"
            >
              <span className="text-emerald-500 font-bold shrink-0">
                {SYSTEM_CONFIG.user}@sys:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-white caret-cyan-500 font-mono text-sm"
                spellCheck={false}
                autoComplete="off"
                autoFocus
              />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#080808] px-6 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-600">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <IconTrophy size={12} /> RANK: GUARDIAN{" "}
            </span>
            <span className="flex items-center gap-1.5">
              <IconCpu size={12} /> GO_CONCURRENCY: ENABLED{" "}
            </span>
          </div>
          <span className="text-emerald-500/50 uppercase tracking-tighter">
            ● CONNECTION_SECURE
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterTerminal;
