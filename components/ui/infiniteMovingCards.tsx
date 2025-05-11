"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { FaNode, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb, SiNextdotjs } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { PiFileCppFill, PiFileSqlLight } from "react-icons/pi";
import { RiFirebaseLine } from "react-icons/ri";

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
        direction === "left" ? "forwards" : "reverse"
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
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 md:gap-10 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[120px] h-[120px] rounded-2xl  flex-shrink-0 p-2 md:p-4 lg:p-6 bg-violet-600"
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-xs md:text-sm lg:text-base leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
            </blockquote>
            {item.title === "1" && (
              <FaReact className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "2" && (
              <SiNextdotjs className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "3" && (
              <IoLogoJavascript className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "4" && (
              <PiFileCppFill className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "5" && (
              <PiFileSqlLight className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "6" && (
              <FaNode className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "7" && (
              <SiMongodb className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "8" && (
              <RiFirebaseLine className="text-white w-[64px] h-[64px]" />
            )}
            {item.title === "9" && (
              <SiExpress className="text-white w-[64px] h-[64px]" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
