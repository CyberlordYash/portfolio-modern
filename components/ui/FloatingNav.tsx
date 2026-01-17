"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ToggleDarkModeButton from "../ToggleDarkModeButton";

export const FloatingNav = ({ navItems, className }: any) => {
  const [time, setTime] = useState<string>("00:00:00");
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "SYSTEM_READY",
    "CODE.DEBUG.REPEAT",
    "SCALING_DREAMS",
    "DEBUG_MODE_ON",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(msgInterval);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      className={cn(
        "fixed bottom-8 left-1/2 z-[5000]",
        "flex items-center gap-4 px-4 py-2 rounded-2xl",
        // Liquid Glass Effect
        "bg-white/40 dark:bg-black/20 backdrop-blur-2xl",
        "border border-white/40 dark:border-white/10",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]",
        "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-white/20 after:to-transparent after:pointer-events-none",
        className,
      )}
    >
      {/* Status Section */}
      <div className="flex items-center gap-3 pr-3 border-r border-black/5 dark:border-white/10">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
          {time}
        </span>
      </div>

      {/* Messaging Engine */}
      <div className="min-w-[120px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 tracking-widest"
          >
            {messages[messageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Section */}
      <div className="pl-3 border-l border-black/5 dark:border-white/10 flex items-center">
        <ToggleDarkModeButton />
      </div>
    </motion.div>
  );
};
