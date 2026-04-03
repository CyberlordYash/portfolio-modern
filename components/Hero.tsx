"use client";
import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { SiLeetcode, SiLinkedin, SiCodechef } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.jpg";
import { motion } from "framer-motion";
import { Meteors } from "./ui/Metors";
import { SparklesCore } from "./ui/sparkles";
import {
  ArrowUpRight,
  BookOpenText,
  Dumbbell,
  NotebookPen,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

const Hero = () => {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-[900px] w-full mx-auto rounded-3xl bg-white dark:bg-[#030303] dark:bg-grid-white/[0.02] bg-grid-black/[0.01] flex items-center justify-center overflow-hidden transition-colors duration-500 px-6 md:px-12 py-16 lg:py-0">

      {/* Background Sparkles */}
      <div className="absolute inset-0 z-0 hidden dark:block">
        <SparklesCore
          id="tsparticleshero"
          background="transparent"
          minSize={0.3}
          maxSize={0.8}
          particleDensity={8}
          className="w-full h-full"
          particleColor="#3b82f6"
        />
      </div>

      {/* Radial glow — dark mode only */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden dark:block">
        <div className="absolute left-1/2 top-1/3 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[110px]" />
      </div>

      {/* Spotlights */}
      <div className="pointer-events-none">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen opacity-40 dark:opacity-55"
          fill="gray"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw] opacity-10 dark:opacity-20"
          fill="#3b82f6"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex w-full max-w-5xl flex-col items-center justify-center">

        {/* Name & Role */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="mb-8 space-y-2 text-center"
        >
          <p className="bg-gradient-to-b from-gray-900 to-gray-500 bg-clip-text font-orbitron text-2xl font-bold uppercase tracking-[0.45em] text-transparent dark:from-white dark:to-white/50 md:text-3xl">
            Yash Sachan
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500/40" />
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-blue-500/70">
              Systems Engineer
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500/40" />
          </div>
        </motion.div>

        {/* Content Block */}
        <motion.div
          variants={fadeUp}
          custom={0.15}
          initial="hidden"
          animate="visible"
          className="group relative w-full max-w-3xl"
        >
          {/* Animated left accent line */}
          <div className="absolute bottom-0 left-0 top-0 w-[1px] overflow-hidden">
            <div className="h-full w-full bg-gray-100 dark:bg-white/[0.04]" />
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 top-0 h-20 w-full bg-gradient-to-b from-transparent via-blue-500/60 to-transparent"
            />
          </div>

          <div className="space-y-5 py-1 pl-8">
            {/* Tagline */}
            <div className="max-w-2xl">
              <TextGenerateEffect
                className="text-xl font-medium leading-snug tracking-tight text-gray-800 dark:text-slate-200 md:text-2xl"
                words="Engineering impactful digital experiences with precision and purpose."
              />
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <p className="font-Quicksand text-base leading-relaxed text-gray-600 dark:text-slate-400 md:text-[17px]">
                Hello, I&apos;m{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  Yash Sachan
                </span>
                . I architect{" "}
                <span className="italic text-blue-600 dark:text-blue-400">
                  high-performance
                </span>{" "}
                infrastructure at{" "}
                <a
                  href="https://zanskar.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1 font-semibold text-gray-900 transition-opacity duration-200 hover:opacity-70 dark:text-white"
                >
                  <Image
                    src={logo}
                    alt="Zanskar"
                    width={13}
                    height={13}
                    className="mb-0.5 inline-block rounded-full grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                  Zanskar
                </a>
                .
              </p>

              <p className="max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-widest text-gray-400 dark:text-slate-500 md:text-[11px]">
                Specialized in{" "}
                <span className="text-blue-500/90">Golang</span> performance
                engineering &{" "}
                <span className="font-medium text-blue-500/90">
                  distributed systems
                </span>
              </p>
            </div>

            {/* Tech Tags */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-1.5 pt-0.5"
            >
              <TechTag label="Distributed Systems" color="blue" />
              <TechTag label="Performance Tuning" color="orange" />
              <TechTag label="Cloud Native" color="emerald" />
            </motion.div>
          </div>
        </motion.div>

        {/* Social + Action Links */}
        <motion.div
          variants={fadeUp}
          custom={0.4}
          initial="hidden"
          animate="visible"
          className="mt-10 w-full border-t border-gray-100 pt-6 dark:border-white/[0.05]"
        >
          {/* Social Cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SocialCard
              href="https://www.linkedin.com/in/yashsachan321/"
              icon={<SiLinkedin className="text-[#0A66C2]" />}
              platform="LinkedIn"
              status="Professional Network"
              tag="Connect"
              hoverColor="hover:border-[#0A66C2]/30"
              gradient="from-[#0A66C2]/12 via-[#0A66C2]/5 to-transparent"
            />
            <SocialCard
              href="https://www.codechef.com/users/cyberlordyash"
              icon={
                <SiCodechef className="text-[#5B4638] dark:text-[#D1B181]" />
              }
              platform="CodeChef"
              status="Competitive Programming"
              tag="4★ Rated"
              hoverColor="hover:border-amber-500/30"
              gradient="from-amber-500/12 via-amber-500/5 to-transparent"
            />
            <SocialCard
              href="https://leetcode.com/u/yashsachan/"
              icon={<SiLeetcode className="text-[#FFA116]" />}
              platform="LeetCode"
              status="Algorithm Mastery"
              tag="Top 5%"
              hoverColor="hover:border-[#FFA116]/30"
              gradient="from-[#FFA116]/12 via-[#FFA116]/5 to-transparent"
            />
          </div>

          {/* Action Links */}
          <div className="mt-4 flex flex-wrap justify-center gap-2.5 md:justify-start">
            <ActionLink
              href="/worklog"
              icon={<NotebookPen className="h-3.5 w-3.5" />}
              label="Open Worklog"
              sublabel="Daily company updates"
              colorClass="border-cyan-500/20 bg-cyan-500/[0.06] text-cyan-600 dark:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10"
              iconBg="border-cyan-500/15 bg-white/30 dark:bg-black/40"
            />
            <ActionLink
              href="/blogs"
              icon={<BookOpenText className="h-3.5 w-3.5" />}
              label="Blogs"
              sublabel="Public articles"
              colorClass="border-amber-500/20 bg-amber-500/[0.06] text-amber-700 dark:text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/10"
              iconBg="border-amber-500/15 bg-white/50 dark:bg-black/40"
            />
            <ActionLink
              href="/gym"
              icon={<Dumbbell className="h-3.5 w-3.5" />}
              label="Gym"
              sublabel="Daily tracker"
              colorClass="border-red-500/20 bg-red-500/[0.06] text-red-700 dark:text-red-300 hover:border-red-500/40 hover:bg-red-500/10"
              iconBg="border-red-500/15 bg-white/50 dark:bg-black/40"
            />
          </div>
        </motion.div>
      </div>

      <Meteors number={6} />
    </div>
  );
};

// --- Helper Components ---

const TechTag = ({ label, color }: { label: string; color: string }) => {
  const colors: Record<string, string> = {
    orange: "text-orange-500/70 border-orange-500/15 bg-orange-500/5",
    blue: "text-blue-500/70 border-blue-500/15 bg-blue-500/5",
    emerald: "text-emerald-500/70 border-emerald-500/15 bg-emerald-500/5",
  };
  return (
    <span
      className={`rounded-md border px-2.5 py-[3px] font-mono text-[9px] font-medium uppercase tracking-wider ${colors[color]}`}
    >
      {label}
    </span>
  );
};

const SocialCard = ({
  href,
  icon,
  platform,
  status,
  tag,
  hoverColor,
  gradient,
}: {
  href: string;
  icon: React.ReactNode;
  platform: string;
  status: string;
  tag: string;
  hoverColor: string;
  gradient: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50/60 p-3 backdrop-blur-sm transition-all duration-300 dark:border-white/[0.06] dark:bg-white/[0.02] ${hoverColor}`}
  >
    {/* Gradient fill on hover */}
    <div
      className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${gradient}`}
    />
    {/* Shimmer sweep */}
    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

    {/* Icon */}
    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all duration-300 dark:border-white/[0.08] dark:bg-black/50">
      <span className="text-lg">{icon}</span>
    </div>

    {/* Text */}
    <div className="relative z-10 min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-tight text-gray-900 dark:text-white/90">
          {platform}
        </span>
        <span className="rounded border border-blue-500/15 bg-blue-500/[0.08] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-blue-500/80">
          {tag}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-tight text-gray-400 dark:text-slate-500">
        {status}
      </span>
    </div>

    {/* Arrow */}
    <div className="relative z-10 shrink-0 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
      <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-400" />
    </div>
  </a>
);

const ActionLink = ({
  href,
  icon,
  label,
  sublabel,
  colorClass,
  iconBg,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  colorClass: string;
  iconBg: string;
}) => (
  <Link
    href={href}
    className={`group inline-flex items-center gap-3 rounded-xl border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${colorClass}`}
  >
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${iconBg}`}
    >
      {icon}
    </span>
    <span className="flex flex-col items-start gap-0.5">
      <span className="font-semibold">{label}</span>
      <span className="text-[8px] tracking-[0.15em] opacity-55">
        {sublabel}
      </span>
    </span>
    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
  </Link>
);

export default Hero;
