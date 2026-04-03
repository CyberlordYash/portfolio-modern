"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { FaGitAlt, FaJava, FaNode, FaReact } from "react-icons/fa";
import {
  SiApachekafka,
  SiExpress,
  SiGo,
  SiGooglecloud,
  SiMongodb,
  SiNatsdotio,
  SiNextdotjs,
  SiPostgresql,
  SiSpringboot,
  SiTailwindcss,
} from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { PiFileCppFill, PiFileSqlLight } from "react-icons/pi";

const iconMap: Record<string, React.ReactNode> = {
  "1": <FaReact className="h-8 w-8 text-cyan-400" />,
  "2": <SiNextdotjs className="h-8 w-8 text-gray-800 dark:text-white" />,
  "3": <IoLogoJavascript className="h-8 w-8 text-yellow-400" />,
  "4": <PiFileCppFill className="h-8 w-8 text-blue-500" />,
  "5": <PiFileSqlLight className="h-8 w-8 text-emerald-400" />,
  "6": <FaNode className="h-8 w-8 text-green-500" />,
  "7": <SiMongodb className="h-8 w-8 text-green-500" />,
  "8": <SiGo className="h-8 w-8 text-sky-400" />,
  "9": <SiSpringboot className="h-8 w-8 text-green-400" />,
  "10": <FaJava className="h-8 w-8 text-red-400" />,
  "11": <SiPostgresql className="h-8 w-8 text-sky-600" />,
  "12": <SiTailwindcss className="h-8 w-8 text-sky-400" />,
  "13": <SiGooglecloud className="h-8 w-8 text-blue-400" />,
  "14": <FaGitAlt className="h-8 w-8 text-orange-500" />,
  "15": <SiNatsdotio className="h-8 w-8 text-blue-400" />,
  "16": <SiApachekafka className="h-8 w-8 text-gray-700 dark:text-gray-300" />,
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 w-max flex-nowrap gap-4 py-3",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className="group relative flex w-[136px] shrink-0 flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/80 p-4 transition-all duration-300 hover:border-gray-300/80 hover:bg-white hover:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
          >
            {/* Hover accent glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Icon container */}
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md dark:border-white/[0.07] dark:bg-black/50">
              {iconMap[item.title]}
            </div>

            {/* Text */}
            <div className="relative z-10 flex flex-col items-center gap-0.5 text-center">
              <p className="font-mono text-[11px] font-semibold leading-tight text-gray-800 dark:text-slate-200">
                {item.quote}
              </p>
              <p className="font-mono text-[8px] uppercase tracking-wider text-gray-400 dark:text-slate-500 leading-tight">
                {item.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
