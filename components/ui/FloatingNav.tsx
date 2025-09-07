"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ToggleDarkModeButton from "../ToggleDarkModeButton";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [time, setTime] = useState<string>("");
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Hello, World! 🌍",
    "Deploying ideas 🚀",
    "Code. Debug. Repeat 🔁",
    "git commit -m 'Welcome' ✅",
    "Full-stack in progress ⚡",
    "Debug mode: ON 🐛",
    "const life = { code: true } 💻",
    "Automating coffee ☕",
    "Scaling dreams 📈",
    "404 Boredom Not Found 😎",
  ];

  // ⏰ Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Rotating messages
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(msgInterval);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed bottom-2 right-[25%] md:right-[35%] transform -translate-x-1/2 z-[5000] px-3 py-2 rounded-2xl border shadow-md bg-white dark:bg-black text-black dark:text-white font-semibold flex items-center justify-center gap-3 md:gap-6",
        className
      )}
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* 🕒 Clock */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-[10px] sm:text-xs md:text-sm lg:text-base font-mono text-gray-700 dark:text-gray-300"
      >
        🕒 {time}
      </motion.div>

      {/* 🌟 Rotating Messages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] sm:text-xs md:text-xs lg:text-base font-bold text-blue-600 dark:text-blue-400"
        >
          {messages[messageIndex]}
        </motion.div>
      </AnimatePresence>

      {/* 🌙 Toggle Button */}
      <ToggleDarkModeButton />
    </motion.div>
  );
};
