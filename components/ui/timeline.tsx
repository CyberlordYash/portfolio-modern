"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-36"
          >
            {/* Sticky date + dot */}
            <div className="sticky top-40 z-40 flex max-w-xs self-start items-center md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#030303]">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-white dark:ring-offset-[#030303]" />
              </div>
              <h3 className="hidden pl-20 font-mono text-[13px] tracking-tight text-neutral-400 dark:text-neutral-500 md:block">
                {item.title}
              </h3>
            </div>

            {/* Content */}
            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left font-mono text-sm tracking-tight text-neutral-400 dark:text-neutral-500 md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* ── Vertical line system ── */}

        {/* 1. Static rail — always full height, faint */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] bg-neutral-200 dark:bg-neutral-800/50
                     [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
        />

        {/* 2. Wide soft glow halo — largest, most diffuse layer */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 h-48 w-[2px]
                     -translate-x-1/2 -translate-y-1/2
                     bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent
                     blur-[6px]"
        />

        {/* 3. Mid glow — tighter and brighter */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 h-28 w-[2px]
                     -translate-x-1/2 -translate-y-1/2
                     bg-gradient-to-b from-transparent via-violet-400/90 to-transparent
                     blur-[2px]"
        />

        {/* 4. Sharp bright core line — crisp white centre */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 h-16 w-[2px]
                     -translate-x-1/2 -translate-y-1/2
                     bg-gradient-to-b from-transparent via-white to-transparent"
        />

        {/* 5. Bright dot at the centre of the shine */}
        <motion.div
          style={{ top: heightTransform, opacity: opacityTransform }}
          className="pointer-events-none absolute left-8 z-10 h-2.5 w-2.5
                     -translate-x-1/2 -translate-y-1/2 rounded-full bg-white
                     shadow-[0_0_0_2px_rgba(139,92,246,0.3),0_0_8px_4px_rgba(139,92,246,0.8),0_0_20px_8px_rgba(99,102,241,0.4)]"
        />
      </div>
    </div>
  );
};
