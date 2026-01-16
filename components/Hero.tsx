"use client";
import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { SiLeetcode, SiLinkedin, SiCodechef } from "react-icons/si";
import Image from "next/image";
import logo from "../public/logo.jpg";
import { motion } from "framer-motion";
import { Meteors } from "./ui/Metors";
import { SparklesCore } from "./ui/sparkles";
import "./hero.css";

const Hero = () => {
  return (
    <div className="relative h-screen max-h-[900px] w-full mx-auto rounded-3xl bg-white dark:bg-[#020617] dark:bg-grid-white/[0.02] bg-grid-black/[0.01] flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/5 shadow-2xl transition-colors duration-500 px-6 md:px-12">
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
      <div className="flex flex-col items-center justify-center relative z-20 w-full max-w-6xl">
        {/* 🔹 Name Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-4"
        >
          <p className="font-orbitron font-semibold uppercase tracking-[0.4em] text-2xl md:text-3xl text-gray-900 dark:text-white/90">
            Yash Sachan
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-blue-500/20" />
            <span className="text-[9px] font-mono text-blue-500/80 tracking-[0.3em] uppercase font-medium">
              Systems Engineer
            </span>
            <span className="h-px w-10 bg-blue-500/20" />
          </div>
        </motion.div>

        {/* 🔹 Hero Tagline */}
        <div className="max-w-4xl px-4 mb-4">
          <TextGenerateEffect
            className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-gray-800 dark:text-slate-200"
            words="Engineering impactful digital experiences with precision and purpose."
          />
        </div>

        {/* 🔹 COMPACT SYSTEM STATUS CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="group relative w-full"
        >
          <div className="relative py-6 px-8 rounded-2xl bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-hidden text-left">
            <div className="absolute top-4 right-6 flex gap-1.5 opacity-20">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="hidden md:flex flex-col items-center pt-1">
                <div className="h-7 w-7 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 font-mono text-[7px] font-medium">
                    0x
                  </span>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-blue-500/20 to-transparent mt-3" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-emerald-500/60 animate-pulse" />
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-500">
                    status: active
                  </p>
                </div>

                <div className="space-y-2.5">
                  <p className="font-Quicksand text-lg md:text-xl text-gray-700 dark:text-slate-300 leading-snug font-medium">
                    Hello, I&apos;m{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      Yash Sachan
                    </span>
                    . Focused on building{" "}
                    <span className="italic font-normal text-gray-900 dark:text-white">
                      high-performance
                    </span>{" "}
                    infrastructure at{" "}
                    <a
                      href="https://zanskar.xyz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors font-semibold text-gray-900 dark:text-white"
                    >
                      <Image
                        src={logo}
                        alt="Zanskar"
                        width={14}
                        height={14}
                        className="rounded-full grayscale"
                      />
                      Zanskar
                    </a>
                    .
                  </p>

                  <p className="font-Quicksand text-sm md:text-base text-gray-500 dark:text-slate-400 font-normal max-w-3xl">
                    Specializing in{" "}
                    <span className="font-mono text-cyan-500/80">Golang</span>{" "}
                    performance engineering and distributed systems.
                    Architecting scalable, concurrent backends optimized for
                    high-throughput and reliability.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                  <TechTag label="Distributed Systems" color="blue" />
                  <TechTag label="Performance Tuning" color="orange" />
                  <TechTag label="Cloud Native" color="emerald" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.01)_50%)] bg-[length:100%_4px]" />
          </div>
        </motion.div>

        {/* 🔹 DASHBOARD SOCIAL BAR WITH PERMANENT + SHINE GRADIENTS */}
        <div className="w-full mt-8 pt-6 border-t border-gray-200 dark:border-white/5">
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
    {/* 🌈 Brand Gradient Layer - Always visible (opacity-40), shines on hover (opacity-100) */}
    <div
      className={`absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${gradient} pointer-events-none`}
    />

    {/* ⚡ Shine Effect on Hover */}
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
