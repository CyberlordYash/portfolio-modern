import { workExperience } from "@/data";
import React from "react";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlowingEffect } from "./ui/glowing-effect";
import { Timeline } from "@/components/ui/timeline";
const data = [
  {
    title: "July 2025 - Present",
    content: (
      <div>
        <p className="mb-8 text-lg md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          Analyst Software Engineer @ Zanskar Securities
        </p>
        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          • Building low-latency backend systems in Go for high-frequency
          trading (HFT)
          <br />
          • Working on real-time data processing and order execution pipelines
          <br />
          • Optimizing performance using Go routines, channels, and efficient
          system design
          <br />• Working on trading platform{" "}
          <a
            href="https://nubra.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Nubra
          </a>
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative flex items-center justify-center h-20 w-full rounded-lg bg-white border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4),_0_0_30px_rgba(34,197,94,0.2)] md:h-44 lg:h-60 overflow-hidden">
            <img
              src="/nubra.webp"
              alt="Zanskar Securities"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "January 2025 - June 2025",
    content: (
      <div>
        <p className="mb-8 text-lg md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
          Software Developer Intern @ Onefinnet
        </p>

        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          • Designing and developing scalable backend systems using Go <br />
          • Building high-performance APIs and microservices for real-time
          platforms <br />• Leading backend architecture for Spot Chat and
          Meeting Platforms <br />• Optimizing database performance and system
          reliability
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center h-20 w-full rounded-lg bg-white  border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)] md:h-44 lg:h-60">
            <img
              src="/onefinnet.png"
              alt="Onefinnet"
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "July 2024 - October 2024",
    content: (
      <div>
        <p className="mb-8 text-lg md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 dark:from-green-400 dark:via-emerald-400 dark:to-lime-400">
          Software Developer Intern @ Modulus Technologies LLP
        </p>

        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          • Developed SAAS Billing app with NextJS, FeatherJS, PostgreSQL,
          Typescript, TailwindCSS <br />
          • Engineered customer management, invoicing, GST handling, Chart of
          Accounts <br />
          • Migrated system from React → Next.js (30% faster load times, better
          retention) <br />
          • Automated email & WhatsApp follow-ups, improving recovery rates by
          60% <br />• Designed scalable backend with PostgreSQL, FeatherJS, and
          GCP
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center h-20 w-full rounded-lg bg-white  border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.4),_0_0_30px_rgba(168,85,247,0.2)] md:h-44 lg:h-60">
            <img
              src="/ambill.jpg"
              alt="Ambill"
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Competitive Programming",
    content: (
      <div>
        <p className="mb-8 text-lg md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400">
          Guardian @ LeetCode (2200+) & 4⭐ @ CodeChef (1850+)
        </p>

        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          • Solved 1300+ problems on LeetCode, Guardian badge holder <br />• 4⭐
          on CodeChef with 50+ solved problems
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/guardian.gif"
            alt="LeetCode Guardian"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/codechef.svg"
            alt="CodeChef 4 Star"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "AIR 193 - NDA",
    content: (
      <div>
        <p className="mb-8 text-lg md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500 dark:from-blue-400 dark:via-indigo-400 dark:to-red-400">
          Cleared NDA SSB Interview with All India Rank 193
        </p>

        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          • Recommended by Indian Army Officer Entry after a 5-day long SSB
          process <br />• Showcased leadership, strategy, and decision-making
          under pressure
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/soldier.svg"
            alt="NDA"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
];

const Experience = () => {
  return (
    <div
      className=" py-10 w-[100%] m-[auto] mt-2 p-6 rounded-2xl bg-white  dark:bg-black"
      id="experience"
    >
      <div className=" w-full mt-12 grid  gap-1">
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default Experience;
