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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const categories = [
  {
    icon: <IconCpu size={18} />,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "from-blue-500/20 to-transparent",
    title: "Backend",
    subtitle: "Go · C++ · Node.js",
  },
  {
    icon: <IconDatabase size={18} />,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "from-emerald-500/20 to-transparent",
    title: "Infrastructure",
    subtitle: "Docker · AWS · Redis",
  },
  {
    icon: <IconNetwork size={18} />,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    accent: "from-purple-500/20 to-transparent",
    title: "Low Latency",
    subtitle: "HFT · WebSockets",
  },
  {
    icon: <IconCode size={18} />,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "from-amber-500/20 to-transparent",
    title: "Frontend",
    subtitle: "Next.js · TS · Tailwind",
  },
];

const Skills = () => {
  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative w-full overflow-hidden rounded-[2.5rem] border border-neutral-200/80 bg-white/80 p-6 py-10 shadow-sm backdrop-blur-3xl dark:border-white/[0.05] dark:bg-black/40 dark:shadow-none md:p-10"
      id="skills"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/8 blur-[100px] dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/8 blur-[100px] dark:bg-purple-500/10" />

      {/* Section label */}
      <motion.div
        variants={fadeUp}
        custom={0.05}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-neutral-200 to-transparent dark:from-white/[0.07]" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400 dark:text-slate-500">
          Technical Stack
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-neutral-200 to-transparent dark:from-white/[0.07]" />
      </motion.div>

      {/* Category Cards */}
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            variants={fadeUp}
            custom={0.1 + i * 0.07}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SkillCategory {...cat} />
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/[0.07]" />

      {/* Infinite Scroll Strip */}
      <motion.div
        variants={fadeUp}
        custom={0.4}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full antialiased"
      >
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          className="font-mono"
        />
      </motion.div>

      {/* Divider */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/[0.07]" />

      {/* Footer */}
      <motion.div
        variants={fadeUp}
        custom={0.5}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-5 flex items-center justify-between px-1"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400/80">
            Active
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-slate-600">
          16 technologies
        </span>
      </motion.div>
    </motion.div>
  );
};

const SkillCategory = ({
  icon,
  iconBg,
  iconColor,
  accent,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
  title: string;
  subtitle: string;
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-4 transition-all duration-300 hover:border-neutral-300/80 hover:bg-white hover:shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02] dark:hover:border-white/[0.08] dark:hover:bg-white/[0.04]"
  >
    {/* Subtle top accent gradient */}
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accent}`}
    />

    <div className="mb-2.5 flex items-center gap-2.5">
      <div className={`rounded-lg p-2 transition-colors duration-300 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="text-sm font-bold tracking-tight text-neutral-800 dark:text-slate-200">
        {title}
      </h3>
    </div>
    <p className="font-mono text-[10px] tracking-tight text-neutral-400 dark:text-slate-500 transition-colors duration-300 group-hover:text-neutral-600 dark:group-hover:text-slate-400">
      {subtitle}
    </p>
  </motion.div>
);

export default Skills;
