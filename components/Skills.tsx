"use client";
import React from "react";
import { InfiniteMovingCards } from "./ui/infiniteMovingCards";
import { testimonials } from "@/data";
import { motion } from "framer-motion";
import {
  IconCpu,
  IconDatabase,
  IconCode,
  IconNetwork,
} from "@tabler/icons-react";

const Skills = () => {
  return (
    <div
      className="relative py-12 w-full mt-2 p-4 md:p-8 rounded-[2.5rem] 
                 bg-white/80 dark:bg-black/40 
                 border border-neutral-200 dark:border-white/5 
                 backdrop-blur-3xl shadow-sm dark:shadow-none overflow-hidden"
      id="skills"
    >
      {/* 1. Background Decorative Elements - Adjusted for light mode visibility */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 2. Top Header: System Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <SkillCategory
          icon={<IconCpu className="text-blue-600 dark:text-blue-400" />}
          title="Backend"
          subtitle="Go, C++, Node.js"
        />
        <SkillCategory
          icon={
            <IconDatabase className="text-emerald-600 dark:text-emerald-400" />
          }
          title="Infrastructure"
          subtitle="Docker, AWS, Redis"
        />
        <SkillCategory
          icon={
            <IconNetwork className="text-purple-600 dark:text-purple-400" />
          }
          title="Low Latency"
          subtitle="HFT, WebSockets"
        />
        <SkillCategory
          icon={<IconCode className="text-amber-600 dark:text-amber-400" />}
          title="Frontend"
          subtitle="Next.js, TS, Tailwind"
        />
      </div>

      {/* 3. The Infinite Moving Engine */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden">
        {/* Visual Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent mb-10" />

        <div className="w-full antialiased relative">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="font-mono"
          />
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent mt-10" />
      </div>

      {/* 4. Bottom Status Bar */}
      <div className="mt-8 flex justify-between items-center px-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-tighter text-blue-600 dark:text-blue-400/80">
              Data_Processing: Optimized
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 dark:text-slate-600 uppercase">
          Architecture_v2.0
        </span>
      </div>
    </div>
  );
};

const SkillCategory = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-4 rounded-2xl 
               bg-neutral-50/50 dark:bg-white/[0.02] 
               border border-neutral-200 dark:border-white/5 
               hover:bg-white hover:shadow-md dark:hover:bg-white/[0.04] dark:hover:shadow-none
               transition-all group"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 group-hover:bg-blue-50 dark:group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-neutral-800 dark:text-slate-200 tracking-tight">
        {title}
      </h3>
    </div>
    <p className="text-xs font-mono text-neutral-500 dark:text-slate-500 group-hover:text-neutral-600 dark:group-hover:text-slate-400 transition-colors">
      {subtitle}
    </p>
  </motion.div>
);

export default Skills;
