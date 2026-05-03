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
          "flex min-w-full shrink-0 w-max flex-nowrap gap-0 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className="group relative flex shrink-0 items-center gap-2.5 border border-black/10 dark:border-white/10 px-3.5 py-2 transition-colors duration-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-default"
          >
            {/* icon */}
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              {iconMap[item.title]}
            </div>

            {/* text */}
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black dark:text-white whitespace-nowrap">
                {item.quote}
              </span>
              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-black/55 dark:text-white/55 whitespace-nowrap hidden md:inline">
                {item.name}
              </span>
            </div>

            {/* separator */}
            <div className="absolute -right-px top-1/4 bottom-1/4 w-px bg-black/10 dark:bg-white/10" />
          </li>
        ))}
      </ul>
    </div>
  );
};
