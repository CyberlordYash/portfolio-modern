"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ToggleDarkModeButton from "../ToggleDarkModeButton";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems?: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [time, setTime] = useState<string>("00:00:00");
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "SYSTEM_READY",
    "CODE.DEBUG.REPEAT",
    "GIT_COMMIT_WELCOME",
    "SCALING_DREAMS",
    "404_BOREDOM_NOT_FOUND",
    "DEBUG_MODE_ON",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false }));
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
      initial={{ y: 50, opacity: 0, x: "-50%" }} // Explicitly include x: "-50%" for centering
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      className={cn(
        // Centering Fix: ensure no "right" or "left" from className overrides this
        "fixed bottom-8 left-1/2 z-[5000]",
        "flex items-center gap-3 px-3 py-1.5 rounded-3xl", // Reduced padding (px-4 -> px-3, py-2.5 -> py-1.5)
        "bg-white/80 dark:bg-black/60 backdrop-blur-xl",
        "border border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10",
        className
      )}
    >
      {/* System Status Indicator */}
      <div className="flex items-center gap-2 border-r border-slate-200 dark:border-white/10 pr-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 hidden xs:block">
          {time}
        </span>
      </div>

      {/* Rotating Terminal Messages */}
      <div className="min-w-[100px] md:min-w-[130px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] md:text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter"
          >
            {messages[messageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Area: Bigger Dark Mode Toggle */}
      <div className="pl-3 border-l border-slate-200 dark:border-white/10 flex items-center">
        <div className="scale-110 sm:scale-125 hover:scale-135 transition-transform duration-300">
          {/* Increased scale from 90 to 110/125 to make it look bigger */}
          <ToggleDarkModeButton />
        </div>
      </div>
    </motion.div>
  );
};
