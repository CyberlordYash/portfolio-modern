"use client";
import React, { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

function ToggleDarkModeButton() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    const isDarkTheme = savedTheme === "dark";
    setIsDark(isDarkTheme);
    if (isDarkTheme) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center justify-center p-1">
      <button
        onClick={toggleTheme}
        className={`
          relative w-[80px] h-[40px] rounded-full transition-all duration-500 ease-in-out flex items-center px-1.5
          /* Large Inner Depth */
          ${
            isDark
              ? "bg-slate-900 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] border-slate-800"
              : "bg-slate-200 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] border-slate-300"
          }
          border-2 hover:border-slate-400 dark:hover:border-slate-600 transition-colors group
        `}
        aria-label="Toggle Theme"
      >
        {/* Track Labels - Fixed positions */}
        <div className="absolute inset-0 flex items-center justify-between px-3.5 pointer-events-none">
          <HiMoon
            className={`w-4 h-4 transition-all duration-700 ${
              isDark
                ? "text-slate-600 opacity-100 scale-110"
                : "opacity-0 scale-50"
            }`}
          />
          <HiSun
            className={`w-4 h-4 transition-all duration-700 ${
              !isDark
                ? "text-orange-500 opacity-100 scale-110"
                : "opacity-0 scale-50"
            }`}
          />
        </div>

        {/* The Bold Professional Knob */}
        <div
          className={`
            relative w-[32px] h-[32px] rounded-full transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            flex items-center justify-center z-10
            /* Knob Material Surface */
            ${
              isDark
                ? "translate-x-[38px] bg-gradient-to-b from-slate-600 to-slate-800 shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
                : "translate-x-0 bg-gradient-to-b from-white to-slate-100 shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
            }
          `}
        >
          {/* Subtle Icon Glow inside Knob */}
          <div
            className={`transition-all duration-500 ${
              isDark
                ? "text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]"
                : "text-slate-500"
            }`}
          >
            {isDark ? <HiMoon size={18} /> : <HiSun size={18} />}
          </div>

          {/* Luxury High-Light Rim */}
          <div className="absolute inset-0 rounded-full border-t border-white/20 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border-b border-black/20 pointer-events-none" />
        </div>
      </button>
    </div>
  );
}

export default ToggleDarkModeButton;
