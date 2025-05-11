"use client";
import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { SiLeetcode, SiLinkedin, SiCodechef } from "react-icons/si";
import Image from "next/image";
import onefinnet from "../public/onefinnet.png";
import { motion } from "framer-motion";
import { Meteors } from "./ui/Metors";
import "./hero.css";

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
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* 🌐 Main Content */}
      <div className="flex justify-center relative my-12 sm:my-20 z-10 w-full">
        <div className="w-full max-w-[90vw] sm:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center text-center">
          <p className="font-semibold uppercase tracking-widest text-base sm:text-lg dark:text-blue-100 text-gray-800 font-Orbitron mb-2">
            Yash Sachan
          </p>

          <TextGenerateEffect
            className="text-xl sm:text-3xl md:text-5xl lg:text-5xl font-Orbitron"
            words="Engineering impactful digital experiences with precision and purpose."
          />

          <p className="font-Quicksand text-sm sm:text-base font-normal mt-4 text-gray-700 dark:text-gray-300 leading-relaxed px-1">
            Hello, I&apos;m{" "}
            <strong className="text-black dark:text-white">Yash</strong>, a
            passionate Software Engineer at{" "}
            <a
              href="https://onefinnet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-black dark:text-white"
            >
              <Image
                src={onefinnet}
                alt="Onefinnet logo"
                width={24}
                height={24}
                className="inline-block rounded-md mr-1"
              />
              Onefinnet
            </a>
            , headquartered in New York. I specialize in modern web platforms
            using <span className="text-blue-500">React</span>,{" "}
            <span className="text-green-500">Next.js</span>,{" "}
            <span className="text-yellow-500">Node.js</span>, and{" "}
            <span className="text-pink-500">Golang</span>. My roots lie in{" "}
            <span className="text-orange-400">C++</span> and frontend
            engineering — building high-quality UIs from{" "}
            <span className="text-orange-400">In</span>
            <span className="text-green-400">dia</span>.
          </p>

          {/* 🔗 Social Links */}
          <ul className="wrapper mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/yashsachan321/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="icon facebook text-black-100">
                <span className="tooltip">LinkedIn</span>
                <SiLinkedin className="text-black dark:text-white w-7 h-7 sm:w-8 sm:h-8" />
              </li>
            </a>
            <a
              href="https://www.codechef.com/users/cyberlordyash"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="icon twitter">
                <span className="tooltip">CodeChef</span>
                <SiCodechef className="text-black dark:text-white w-7 h-7 sm:w-8 sm:h-8" />
              </li>
            </a>
            <a
              href="https://leetcode.com/u/yashsachan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <li className="icon instagram">
                <span className="tooltip">LeetCode</span>
                <SiLeetcode className="text-black dark:text-white w-7 h-7 sm:w-8 sm:h-8" />
              </li>
            </a>
          </ul>
        </div>
      </div>

      {/* 🌠 Meteor Effect */}
      <Meteors number={20} />
    </motion.div>
  );
};

export default Hero;
