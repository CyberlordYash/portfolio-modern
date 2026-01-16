"use client";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import {
  IconCircleCheckFilled,
  IconBriefcase,
  IconTrophy,
  IconTerminal,
  IconExternalLink,
  IconCode,
} from "@tabler/icons-react";

// Helper for bullet points - Added 'px-1' to prevent text touching edges
const ExperiencePoint = ({
  text,
  link,
}: {
  text: string;
  link?: { label: string; href: string };
}) => (
  <div className="flex items-start gap-2 md:gap-3 group/point px-1">
    <IconCircleCheckFilled
      className="mt-1 text-emerald-600 dark:text-emerald-500 shrink-0 opacity-60 group-hover/point:opacity-100 transition-opacity"
      size={16}
    />
    <p className="text-sm md:text-base text-slate-700 dark:text-slate-400 leading-relaxed">
      {text}
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 inline-flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline decoration-indigo-500/30 underline-offset-4"
        >
          {link.label} <IconExternalLink size={12} />
        </a>
      )}
    </p>
  </div>
);

const data = [
  {
    title: "July 2025 - Present",
    content: (
      <div className="relative group">
        <div className="flex items-center gap-2 mb-4">
          <IconBriefcase
            className="text-indigo-600 dark:text-indigo-400"
            size={20}
          />
          <span className="text-[10px] font-mono font-bold text-indigo-600/80 dark:text-indigo-400 uppercase tracking-[0.2em]">
            Active System
          </span>
        </div>
        <p className="mb-4 text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Analyst Software Engineer{" "}
          <span className="text-indigo-600 dark:text-indigo-500 block md:inline">
            @ Zanskar Securities
          </span>
        </p>
        <div className="space-y-3 mb-8">
          <ExperiencePoint text="Building low-latency backend systems in Go for high-frequency trading (HFT)" />
          <ExperiencePoint text="Working on real-time data processing and order execution pipelines" />
          <ExperiencePoint text="Optimizing performance using Go routines, channels, and efficient system design" />
          <ExperiencePoint
            text="Working on trading platform "
            link={{ label: "Nubra", href: "https://nubra.io" }}
          />
        </div>
        <div className="relative h-44 md:h-80 w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-indigo-500/20 shadow-xl">
          <img
            src="/nubra.webp"
            alt="Nubra"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>
    ),
  },
  {
    title: "Jan 2025 - June 2025",
    content: (
      <div className="relative group">
        <div className="flex items-center gap-2 mb-4">
          <IconTerminal
            className="text-blue-600 dark:text-blue-400"
            size={20}
          />
          <span className="text-[10px] font-mono font-bold text-blue-600/80 dark:text-blue-400 uppercase tracking-[0.2em]">
            Runtime: Completed
          </span>
        </div>
        <p className="mb-4 text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Software Developer Intern{" "}
          <span className="text-blue-600 dark:text-blue-500 block md:inline">
            @ Onefinnet
          </span>
        </p>
        <div className="space-y-3 mb-6">
          <ExperiencePoint text="Designing and developing scalable backend systems using Go" />
          <ExperiencePoint text="Building high-performance APIs and microservices for real-time platforms" />
          <ExperiencePoint text="Leading backend architecture for Spot Chat and Meeting Platforms" />
          <ExperiencePoint
            text="Build hiring platform "
            link={{
              label: "OneFinnet Talent",
              href: "https://onefinnet.com/talent",
            }}
          />
        </div>
        <div className="h-28 md:h-48 w-full rounded-2xl md:rounded-[2rem] bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200 dark:border-blue-500/10 p-6 md:p-8 shadow-inner">
          <img
            src="/onefinnet.png"
            alt="Onefinnet"
            className="max-h-full object-contain dark:invert"
          />
        </div>
      </div>
    ),
  },
  {
    title: "July 2024 - Oct 2024",
    content: (
      <div className="relative group">
        <div className="flex items-center gap-2 mb-4">
          <IconCode
            className="text-emerald-600 dark:text-emerald-400"
            size={20}
          />
          <span className="text-[10px] font-mono font-bold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-[0.2em]">
            Stack: Fullstack
          </span>
        </div>
        <p className="mb-4 text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          Software Developer Intern{" "}
          <span className="text-emerald-600 dark:text-emerald-500 block md:inline">
            @ Modulus Technologies LLP
          </span>
        </p>
        <div className="space-y-3 mb-6">
          <ExperiencePoint text="Developed SAAS Billing app with NextJS, FeatherJS, PostgreSQL" />
          <ExperiencePoint text="Migrated system from React → Next.js (30% faster load times)" />
          <ExperiencePoint
            text="Built invoice automation system "
            link={{ label: "Ambill", href: "https://www.ambill.ai/about-us" }}
          />
        </div>
        <div className="h-28 md:h-48 w-full rounded-2xl md:rounded-[2rem] bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200 dark:border-emerald-500/10 p-6 md:p-8 shadow-inner">
          <img
            src="/ambill.jpg"
            alt="Ambill"
            className="max-h-full object-contain rounded-xl"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Achievements",
    content: (
      <div className="space-y-6 md:space-y-8">
        <div className="relative p-[1px] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-lg">
          <div className="relative bg-white dark:bg-slate-950 p-5 md:p-8 rounded-[1.8rem] md:rounded-[2.45rem] h-full w-full">
            <div className="flex items-center gap-3 mb-4">
              <IconTrophy className="text-orange-500" size={24} />
              <h4 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
                Competitive Programming
              </h4>
            </div>
            <div className="space-y-2 mb-6">
              <ExperiencePoint text="Guardian @ LeetCode (Rating 2200+)" />
              <ExperiencePoint text="4⭐ @ CodeChef (Rating 1850+)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/guardian.gif"
                className="h-24 md:h-44 w-full object-contain rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5"
                alt="Guardian"
              />
              <img
                src="/codechef.svg"
                className="h-24 md:h-44 w-full object-contain rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-2 md:p-4"
                alt="CodeChef"
              />
            </div>
          </div>
        </div>

        <div className="relative p-[1px] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500 shadow-lg">
          <div className="relative bg-white dark:bg-slate-950 p-5 md:p-8 rounded-[1.8rem] md:rounded-[2.45rem] h-full w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-2 py-0.5 bg-indigo-600/10 dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase">
                AIR_193
              </div>
              <h4 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white tracking-tighter">
                NDA SSB Recommended
              </h4>
            </div>
            <div className="space-y-2">
              <ExperiencePoint text="Cleared NDA SSB Interview with All India Rank 193" />
              <ExperiencePoint text="Showcased leadership under high-pressure scenarios" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const Experience = () => {
  return (
    <section
      className="py-12 md:py-24 w-full bg-white dark:bg-[#020617]"
      id="experience"
    >
      {/* Container: px-2 on mobile allows more width than px-4 */}
      <div className="max-w-[96vw] 2xl:max-w-[1600px] mx-auto px-2 md:px-6">
        {/* Inner Card: p-4 on mobile is the key fix to stop squeezing */}
        <div className="relative p-4 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 overflow-hidden">
          <div className="mb-10 md:mb-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                Kernel_History
              </span>
            </div>
            <h2 className="text-4xl md:text-8xl font-bold text-slate-900 dark:text-white tracking-tighter">
              Experience
            </h2>
          </div>

          <Timeline data={data} />
        </div>
      </div>
    </section>
  );
};

export default Experience;
