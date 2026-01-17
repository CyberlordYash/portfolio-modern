"use client";
import React, { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

function ToggleDarkModeButton() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full transition-all duration-500
        flex items-center px-1 overflow-hidden
        ${
          isDark
            ? "bg-slate-900/80 shadow-[inset_0_2px_10px_rgba(0,0,0,1)]"
            : "bg-blue-100/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]"
        }
        border border-white/20 dark:border-white/5
      `}
    >
      {/* The Liquid Knob */}
      <div
        className={`
          relative w-6 h-6 rounded-full transition-all duration-500 z-20
          flex items-center justify-center
          ${
            isDark
              ? "translate-x-8 bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              : "translate-x-0 bg-gradient-to-tr from-orange-400 to-yellow-200 shadow-[0_0_15px_rgba(251,146,60,0.4)]"
          }
        `}
      >
        {isDark ? (
          <HiMoon className="text-white w-3.5 h-3.5" />
        ) : (
          <HiSun className="text-orange-900 w-3.5 h-3.5" />
        )}

        {/* Specular Highlight (The "Glass" Sparkle) */}
        <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/40 rounded-full blur-[0.5px]" />
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 opacity-20 dark:opacity-40">
        <HiSun
          size={14}
          className={isDark ? "text-white" : "text-orange-500"}
        />
        <HiMoon
          size={14}
          className={isDark ? "text-indigo-400" : "text-slate-400"}
        />
      </div>
    </button>
  );
}

export default ToggleDarkModeButton;
