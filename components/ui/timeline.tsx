"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref          = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform  = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <div className="w-full font-mono" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-28">

            {/* ── Sticky date + square dot ── */}
            <div className="sticky top-36 z-40 flex max-w-xs self-start items-center md:w-full md:flex-row lg:max-w-sm">
              {/* square dot */}
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center bg-[#ffffff] dark:bg-[#090909]">
                <div className="h-2.5 w-2.5 bg-black dark:bg-white border border-black/30 dark:border-white/30" />
              </div>

              {/* date tag */}
              <div className="hidden md:flex pl-20">
                <span className="border border-black/15 dark:border-white/15 bg-[#ffffff] dark:bg-[#090909] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.35em] text-black/60 dark:text-white/60 whitespace-nowrap">
                  {item.title}
                </span>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="relative w-full pl-20 pr-2 md:pl-4">
              {/* mobile date */}
              <span className="mb-4 inline-block border border-black/15 dark:border-white/15 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.3em] text-black/60 dark:text-white/60 md:hidden">
                {item.title}
              </span>
              {item.content}
            </div>
          </div>
        ))}

        {/* ── Rail: static faint line ── */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-px bg-black/10 dark:bg-white/10
                     [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]"
        />

        {/* ── Scroll-driven amber glow ── */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 h-40 w-px
                     -translate-x-1/2 -translate-y-1/2
                     bg-gradient-to-b from-transparent via-amber-400/50 to-transparent
                     blur-[4px]"
        />
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 h-20 w-px
                     -translate-x-1/2 -translate-y-1/2
                     bg-gradient-to-b from-transparent via-amber-300 to-transparent"
        />

        {/* ── Travelling square dot ── */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 z-10 h-2 w-2
                     -translate-x-1/2 -translate-y-1/2
                     bg-amber-400
                     shadow-[0_0_0_2px_rgba(251,191,36,0.25),0_0_12px_6px_rgba(251,191,36,0.4)]"
        />
      </div>
    </div>
  );
};
