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
import { ArrowUpRight, BookOpenText, NotebookPen } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-[900px] w-full mx-auto rounded-3xl bg-white dark:bg-black dark:bg-grid-white/[0.02] bg-grid-black/[0.01] flex items-center justify-center overflow-hidden transition-colors duration-500 px-6 md:px-12 py-12 lg:py-0">
      {" "}
      {/* 🌟 Background Sparks */}
      <div className="absolute inset-0 z-0 hidden dark:block">
        <SparklesCore
          id="tsparticleshero"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={12}
          className="w-full h-full"
          particleColor="#3b82f6"
        />
      </div>
      {/* 🔦 Spotlights */}
      <div className="pointer-events-none">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen opacity-50 dark:opacity-70"
          fill="gray"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw] opacity-10 dark:opacity-30"
          fill="#3b82f6"
        />
      </div>
      {/* 🌐 Main Content Container */}
      <div className="flex flex-col items-center justify-center relative z-20 w-full max-w-5xl">
        {/* 🔹 Name Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-6 text-center"
        >
          <p className="font-orbitron font-semibold uppercase tracking-[0.4em] text-2xl md:text-3xl text-gray-900 dark:text-white/90">
            Yash Sachan
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-blue-500/20" />
            <span className="text-[9px] font-mono text-blue-500/80 tracking-[0.3em] uppercase font-medium">
              Systems Engineer
            </span>
            <span className="h-px w-8 bg-blue-500/20" />
          </div>
        </motion.div>

        {/* 🔹 NEW INTEGRATED CENTER SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-3xl group"
        >
          {/* Shining Animated Gradient Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1.5px] overflow-hidden rounded-full">
            <div className="h-full w-full bg-gray-200 dark:bg-white/5" />
            <motion.div
              animate={{
                y: ["-100%", "200%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-blue-500 to-transparent shadow-[0_0_12px_#3b82f6]"
            />
          </div>

          <div className="relative space-y-5 text-left pl-8 py-2">
            {/* Tagline: More professional size */}
            <div className="max-w-2xl">
              <TextGenerateEffect
                className="text-xl md:text-2xl font-medium tracking-tight text-gray-800 dark:text-slate-200"
                words="Engineering impactful digital experiences with precision and purpose."
              />
            </div>

            {/* Main Bio: Clean and Integrated */}
            <div className="space-y-4">
              <p className="font-Quicksand text-base md:text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                Hello, I&apos;m{" "}
                <span className="text-gray-900 dark:text-white font-semibold">
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
                  className="inline-flex items-baseline gap-1.5 hover:opacity-80 transition-opacity font-semibold text-gray-900 dark:text-white"
                >
                  <Image
                    src={logo}
                    alt="Zanskar"
                    width={14}
                    height={14}
                    className="rounded-full inline-block mb-0.5 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  Zanskar
                </a>
                .
              </p>

              <p className="font-mono text-[10px] md:text-[11px] text-gray-500 dark:text-slate-500 max-w-2xl leading-relaxed uppercase tracking-wider">
                Specialized in <span className="text-blue-500/80">Golang</span>{" "}
                performance engineering &{" "}
                <span className="text-blue-500/80 font-semibold">
                  distributed systems
                </span>
                .
              </p>
            </div>

            {/* Tech Chips: Small and Sharp */}
            <div className="flex flex-wrap gap-2 pt-1">
              <TechTag label="Distributed Systems" color="blue" />
              <TechTag label="Performance Tuning" color="orange" />
              <TechTag label="Cloud Native" color="emerald" />
            </div>

          </div>
        </motion.div>

        {/* 🔹 DASHBOARD SOCIAL BAR */}
        <div className="w-full mt-12 pt-6 border-t border-gray-200 dark:border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SocialCard
              href="https://www.linkedin.com/in/yashsachan321/"
              icon={<SiLinkedin className="text-[#0A66C2]" />}
              platform="LinkedIn"
              status="Professional Network"
              tag="Connect"
              hoverColor="hover:border-[#0A66C2]/40"
              gradient="from-[#0A66C2]/20 via-[#0A66C2]/5 to-transparent"
            />
            <SocialCard
              href="https://www.codechef.com/users/cyberlordyash"
              icon={
                <SiCodechef className="text-[#5B4638] dark:text-[#D1B181]" />
              }
              platform="CodeChef"
              status="Competitive Programming"
              tag="4★ Rated"
              hoverColor="hover:border-amber-500/40"
              gradient="from-amber-500/20 via-amber-500/5 to-transparent"
            />
            <SocialCard
              href="https://leetcode.com/u/yashsachan/"
              icon={<SiLeetcode className="text-[#FFA116]" />}
              platform="LeetCode"
              status="Algorithm Mastery"
              tag="Top 5%"
              hoverColor="hover:border-[#FFA116]/40"
              gradient="from-[#FFA116]/20 via-[#FFA116]/5 to-transparent"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/worklog"
              className="group inline-flex items-center gap-3 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/15"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-black/30">
                <NotebookPen className="h-4 w-4" />
              </span>
              <span className="flex flex-col items-start gap-1">
                <span>Open Worklog</span>
                <span className="text-[9px] tracking-[0.2em] text-slate-400 transition group-hover:text-slate-300">
                  Save daily company updates
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/blogs"
              className="group inline-flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(250,204,21,0.08))] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-700 transition hover:border-amber-400/45 hover:bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(250,204,21,0.12))] dark:text-amber-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-white/50 dark:bg-black/30">
                <BookOpenText className="h-4 w-4" />
              </span>
              <span className="flex flex-col items-start gap-1">
                <span>Blogs</span>
                <span className="text-[9px] tracking-[0.2em] text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300">
                  Public blogs
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
      <Meteors number={8} />
    </div>
  );
};

// --- Helper Components ---

const TechTag = ({ label, color }: { label: string; color: string }) => {
  const colors: any = {
    orange: "text-orange-500/80 border-orange-500/10",
    blue: "text-blue-500/80 border-blue-500/10",
    emerald: "text-emerald-500/80 border-emerald-500/10",
  };
  return (
    <span
      className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase font-semibold tracking-wider ${colors[color]}`}
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
}: any) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 transition-all duration-500 ${hoverColor} backdrop-blur-md overflow-hidden`}
  >
    <div
      className={`absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${gradient} pointer-events-none`}
    />
    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    <div
      className={`absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-0`}
    >
      <span className="text-5xl">{icon}</span>
    </div>
    <div className="relative z-10 flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 group-hover:border-white/20 transition-all duration-300">
      <span className="text-xl">{icon}</span>
    </div>
    <div className="relative z-10 flex flex-col items-start text-left">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-tight text-gray-900 dark:text-white uppercase">
          {platform}
        </span>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/10 uppercase font-bold">
          {tag}
        </span>
      </div>
      <span className="text-[10px] font-mono text-gray-500 dark:text-slate-500 mt-0.5 uppercase tracking-tighter font-medium">
        {status}
      </span>
    </div>
    <div className="ml-auto relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
      <svg
        className="h-3.5 w-3.5 text-gray-400 dark:text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </div>
  </a>
);

export default Hero;
