"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

// Components
import Approach from "@/components/Approach";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems } from "@/data";

// UI & Icons
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconActivity,
  IconBrandGolang,
  IconSmartHome,
  IconUser,
  IconBriefcase,
  IconFolderCode,
  IconBulb,
} from "@tabler/icons-react";
import TerminalSnake from "./TerminalSnake";
import FooterTerminal from "./FooterTerminal";

const links = [
  {
    label: "Home",
    href: "#home",
    icon: <IconSmartHome className="h-5 w-5 shrink-0" />,
  },
  {
    label: "About Me",
    href: "#skills",
    icon: <IconUser className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Experience",
    href: "#experience",
    icon: <IconBriefcase className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Projects",
    href: "#projects",
    icon: <IconFolderCode className="h-5 w-5 shrink-0" />,
  },
  {
    label: "Approach",
    href: "#approach",
    icon: <IconBulb className="h-5 w-5 shrink-0" />,
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-slate-200 font-Quicksand selection:bg-blue-500/30">
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black">
        {/* RESPONSIVE SIDEBAR */}
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody className="justify-between gap-10 bg-[#ffffff] dark:bg-[#090909] px-2">

            {/* ── Top: Brand + Nav ── */}
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

              {/* Brand */}
              <div className="flex items-center gap-3 h-[64px] px-2 border-b border-black/10 dark:border-white/10">
                {/* thin vertical bar */}
                <div className="h-8 w-[2px] bg-black/30 dark:bg-white/30 shrink-0" />
                <motion.div
                  animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
                  className="flex flex-col"
                >
                  <span className="font-mono font-black text-[13px] tracking-[0.05em] uppercase text-black dark:text-white whitespace-nowrap leading-tight">
                    YS.DEV
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-black/35 dark:text-white/35">
                    PORTFOLIO
                  </span>
                </motion.div>
              </div>

              {/* Nav links */}
              <div className="mt-3 flex flex-col gap-0">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            {/* ── Bottom: Status + Profile ── */}
            <div className="flex flex-col gap-1 border-t border-black/10 dark:border-white/10 pt-3 pb-2">

              {/* Status */}
              <div className="flex items-center gap-3 px-3 py-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-black/40 dark:bg-white/40 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-black dark:bg-white" />
                </span>
                <motion.span
                  animate={{ display: open ? "inline" : "none", opacity: open ? 1 : 0 }}
                  className="font-mono text-[8px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50 whitespace-nowrap"
                >
                  AVAILABLE FOR WORK
                </motion.span>
              </div>

              {/* Profile */}
              <SidebarLink
                link={{
                  label: "YASH SACHAN",
                  href: "#",
                  icon: (
                    <div className="relative shrink-0 w-6 h-6 border border-black/20 dark:border-white/20 flex items-center justify-center">
                      <span className="font-mono text-[8px] font-bold text-black/60 dark:text-white/60">YS</span>
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-white dark:bg-black">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px] pointer-events-none" />

          <div className="relative z-10 w-full">
            <FloatingNav navItems={navItems} />

            <div className="max-w-full mx-auto px-1 sm:px-2 md:px-2 space-y-4 md:space-y-6">
              <section id="home" className="pt-4">
                <Hero />
              </section>

              <section id="skills" className="relative">
                {/* ── Section heading ── */}
                <div className="flex flex-col items-center mb-8 md:mb-10">
                  {/* label tag */}
                  <div className="flex items-center gap-2 border border-black/15 dark:border-white/15 bg-[#ffffff] dark:bg-[#090909] px-4 py-1.5 mb-5">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-black dark:bg-white"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white">
                      SYSTEM_RUNTIME
                    </span>
                  </div>

                  {/* main heading */}
                  <h2
                    className="font-black uppercase leading-none text-black dark:text-white text-center"
                    style={{
                      fontFamily: "var(--font-orbitron)",
                      fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Technical Stack
                  </h2>

                  {/* underline annotation */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
                      16 Technologies
                    </span>
                    <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
                  </div>
                </div>
                <Skills />
              </section>

              <section id="game" className="px-2 md:px-0">
                <TerminalSnake />
              </section>

              <section id="experience" className="px-2 md:px-0">
                <Experience />
              </section>

              <section
                id="architecture"
                className="overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-black border border-white/[0.05]"
              >
                <Grid />
              </section>

              <section className="flex justify-center pb-10">
                <button
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                      "_blank",
                    )
                  }
                  className="group relative px-4 py-2 font-mono text-[10px] text-red-500/50 hover:text-red-500 transition-colors"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    [!] sudo rm -rf /
                  </span>
                  <span className="mx-2 underline decoration-dotted">
                    Access Restricted Archive
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    [!]
                  </span>
                </button>
              </section>

              <section id="projects">
                <RecentProjects />
              </section>

              <section id="certificates">
                <Certificates />
              </section>

              <section id="approach" className="pb-20">
                <Approach />
              </section>

              <section id="terminal-console" className="px-4 md:px-0 py-10">
                <FooterTerminal />
              </section>

              <Footer />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
