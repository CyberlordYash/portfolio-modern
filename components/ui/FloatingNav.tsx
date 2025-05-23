"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed top-4 left-[20px] transform -translate-x-1/2 z-[5000] px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-gray-200 shadow-md bg-white dark:bg-black text-black dark:text-white font-semibold flex items-center justify-center gap-4 md:gap-6",
          className
        )}
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {/* 🕒 Clock - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden md:block text-sm font-mono text-gray-700 dark:text-gray-300"
        >
          🕒 {time}
        </motion.div>

        {/* 🧭 Navigation Links */}
        {navItems.map((navItem, idx) => (
          <Link
            key={`nav-item-${idx}`}
            href={navItem.link}
            className="group relative flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
          >
            {/* Always show icon */}
            {navItem.icon && <span className="text-lg">{navItem.icon}</span>}

            {/* Show text only on md+ */}
            <span className="hidden md:inline text-sm ml-1">
              {navItem.name}
            </span>

            {/* Tooltip for small screens */}
            <span className="absolute bottom-full mb-2 px-2 py-1 rounded text-xs text-white bg-black dark:bg-white dark:text-black opacity-0 group-hover:opacity-100 transition md:hidden whitespace-nowrap z-10">
              {navItem.name}
            </span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
