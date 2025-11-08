"use client";
import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { SiLeetcode, SiLinkedin, SiCodechef } from "react-icons/si";
import Image from "next/image";
import logo from "../public/logo.jpg";
import { motion } from "framer-motion";
import { Meteors } from "./ui/Metors";
import "./hero.css";
import { SparklesCore } from "./ui/sparkles";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-[93vh] w-full mx-auto rounded-2xl bg-white dark:bg-black dark:bg-grid-white/[0.04] bg-grid-black/[0.02] flex items-center justify-center px-4 sm:px-6"
    >
      {/* 🌟 Spotlights */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-10 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 -left-full h-[80vh] w-[50vw]"
          fill="blue"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* 🌐 Main Content */}
      <div className="flex justify-center relative my-12 sm:my-20 z-10 w-full">
        <div className="w-full max-w-[90vw] sm:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center text-center">
          {/* 🔹 Name */}
          <p className="font-orbitron font-semibold uppercase tracking-widest text-lg sm:text-xl md:text-2xl lg:text-3xl dark:text-blue-100 text-gray-800 tron mb-2 font-Orbitron">
            Yash Sachan
          </p>

          {/* 🔹 Gradient Line */}
          <div className="w-[80%] h-8 relative mb-4">
            <div className="absolute inset-x-16 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-16 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-44 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[4px] w-1/4 blur-sm" />
            <div className="absolute inset-x-44 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          </div>

          {/* 🔹 Tagline */}
          <TextGenerateEffect
            className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-snug sm:leading-snug md:leading-tight tracking-tight"
            words="Engineering impactful digital experiences with precision and purpose."
          />

          {/* 🔹 Description */}
          <p className="font-Quicksand text-xs sm:text-sm md:text-base lg:text-base font-normal mt-4 sm:mt-6 text-gray-700 dark:text-gray-300 leading-relaxed px-1 sm:px-2">
            Hello, I&apos;m{" "}
            <strong className="text-black dark:text-white">Yash</strong>, a
            passionate Software Engineer at{" "}
            <a
              href="https://zanskar.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-black dark:text-white"
            >
              <Image
                src={logo}
                alt="Zanskar logo"
                width={24}
                height={24}
                className="inline-block rounded-md mr-1"
              />
              Zanskar
            </a>
            , a high-frequency trading and algorithmic research platform
            building ultra-low-latency systems. I specialize in backend systems
            using <span className="text-cyan-500 font-semibold">Golang</span>,{" "}
            <span className="text-yellow-500 font-semibold">Node.js</span>. My
            frontend roots lie in{" "}
            <span className="text-blue-500 font-semibold">React</span> and{" "}
            <span className="text-green-500 font-semibold">Next.js</span>, with
            a strong foundation in{" "}
            <span className="text-orange-400 font-semibold">C++</span> and
            performance-oriented engineering — building from{" "}
            <span className="text-orange-400 font-semibold">In</span>
            <span className="text-green-400 font-semibold">dia</span>.
          </p>

          {/* 🔹 Social Links */}
          <ul className="social-buttons mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* LinkedIn */}
            <li>
              <a
                href="https://www.linkedin.com/in/yashsachan321/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile in a new tab"
                className="social-btn linkedin group"
              >
                <SiLinkedin className="icon text-lg sm:text-xl md:text-2xl" />
                <span className="tooltip">LinkedIn</span>
              </a>
            </li>

            {/* CodeChef */}
            <li>
              <a
                href="https://www.codechef.com/users/cyberlordyash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open CodeChef profile in a new tab"
                className="social-btn codechef group"
              >
                <SiCodechef className="icon text-lg sm:text-xl md:text-2xl" />
                <span className="tooltip">CodeChef</span>
              </a>
            </li>

            {/* LeetCode */}
            <li>
              <a
                href="https://leetcode.com/u/yashsachan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LeetCode profile in a new tab"
                className="social-btn leetcode group"
              >
                <SiLeetcode className="icon text-lg sm:text-xl md:text-2xl" />
                <span className="tooltip">LeetCode</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 🌠 Meteor Effect */}
      <Meteors number={20} />
    </motion.div>
  );
};

export default Hero;
