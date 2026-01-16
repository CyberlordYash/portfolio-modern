"use client";
import React from "react";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from "@/data";

const Footer = () => {
  return (
    // Reduced pt-20 to pt-10 to close the gap from the previous section
    <footer
      className="w-full pt-10 pb-6 bg-white dark:bg-[#020617]"
      id="contact"
    >
      <div className="flex flex-col items-center">
        {/* Simplified Header for better density */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            Final_Connection
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter text-center">
          Get_In_Touch
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mt-4 mb-6 text-center text-sm md:text-base max-w-md px-4">
          Ready to discuss scalable systems or collaborative engineering? Reach
          out today and let&apos;s build something high-performance.
        </p>

        <a href="mailto:yashsachan321@gmail.com">
          <MagicButton
            title="Send Message"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      {/* Tighter Socials & Info Section */}
      <div className="max-w-[85vw] mx-auto mt-16 flex md:flex-row flex-col justify-between items-center gap-6 border-t border-slate-200 dark:border-white/10 pt-8">
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
          Made with ❤️ by{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">
            Yash Sachan
          </span>{" "}
        </p>

        <div className="flex items-center gap-3">
          {socialMedia.map((profile) => (
            <a
              key={profile.id}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-blur-lg bg-slate-50/50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/10 hover:scale-110 transition-transform duration-300"
            >
              <img
                src={profile.img}
                alt="social media"
                width={18}
                height={18}
                className="opacity-70 group-hover:opacity-100"
              />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-8 opacity-30 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-mono">
        &copy; 2026 SYSTEM_CORE // DESIGNED WITH ACETERNITY UI
      </p>
    </footer>
  );
};

export default Footer;
