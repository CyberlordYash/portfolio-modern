"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { FaNode, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb, SiNextdotjs } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { PiFileCppFill } from "react-icons/pi";
import { PiFileSqlLight } from "react-icons/pi";
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
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-10 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[50vw] h-[30vh]  relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 md:p-16 md:w-[20vw] bg-[#01137c51] "
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className=" relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
            </blockquote>
            {item.title == "1" && <FaReact className=" w-[170px] h-[170px]" />}
            {item.title == "2" && (
              <SiNextdotjs className=" w-[170px] h-[170px]" />
            )}
            {item.title == "3" && (
              <IoLogoJavascript className=" w-[170px] h-[170px]" />
            )}
            {item.title == "4" && (
              <PiFileCppFill className=" w-[170px] h-[170px]" />
            )}
            {item.title == "5" && (
              <PiFileSqlLight className=" w-[170px] h-[170px]" />
            )}
            {item.title == "6" && <FaNode className=" w-[170px] h-[170px]" />}
            {item.title == "7" && (
              <SiMongodb className=" w-[170px] h-[170px]" />
            )}
            {item.title == "8" && (
              <RiFirebaseLine className=" w-[170px] h-[170px]" />
            )}
            {item.title == "9" && (
              <SiExpress className=" w-[170px] h-[170px]" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
