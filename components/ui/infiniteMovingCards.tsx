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
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
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
            className="relative w-[8rem] md:w-[10rem] h-[8rem] md:h-[10rem] rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-2 md:p-4 lg:p-6 bg-[#01137c51]"
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
              <FaReact className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "2" && (
              <SiNextdotjs className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "3" && (
              <IoLogoJavascript className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "4" && (
              <PiFileCppFill className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "5" && (
              <PiFileSqlLight className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "6" && (
              <FaNode className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "7" && (
              <SiMongodb className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "8" && (
              <RiFirebaseLine className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
            {item.title === "9" && (
              <SiExpress className="w-[1.5rem] h-[1.5rem] md:w-[4rem] md:h-[4rem]" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
