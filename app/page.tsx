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
  IconTopologyComplex,
  IconLayoutDashboard,
  IconShieldLock,
  IconBoxPadding,
} from "@tabler/icons-react";
import TerminalSnake from "./TerminalSnake";
import FooterTerminal from "./FooterTerminal";

// Updated Links with specialized professional icons
const links = [
  {
    label: "Terminal",
    href: "#home",
    icon: (
      <IconLayoutDashboard className="h-6 w-6 shrink-0 text-blue-500 transition-colors group-hover:text-blue-400" />
    ),
  },
  {
    label: "Infrastructure",
    href: "#skills",
    icon: (
      <IconBoxPadding className="h-6 w-6 shrink-0 text-purple-500 transition-colors group-hover:text-purple-400" />
    ),
  },
  {
    label: "Systems",
    href: "#projects",
    icon: (
      <IconTopologyComplex className="h-6 w-6 shrink-0 text-emerald-500 transition-colors group-hover:text-emerald-400" />
    ),
  },
  {
    label: "Architecture",
    href: "#approach",
    icon: (
      <IconShieldLock className="h-6 w-6 shrink-0 text-amber-500 transition-colors group-hover:text-amber-400" />
    ),
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-slate-200 font-Quicksand selection:bg-blue-500/30">
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black">
        {/* RESPONSIVE SIDEBAR */}
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody className="justify-between gap-10 bg-slate-50 dark:bg-[#030712] px-3">

            {/* ── Top: Brand + Nav ── */}
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

              {/* Brand */}
              <div className="flex items-center gap-3 h-20 px-2">
                <div className="relative flex h-9 w-[5px] min-w-[5px] overflow-hidden rounded-full shrink-0">
                  <motion.div
                    animate={{
                      background: [
                        "linear-gradient(to bottom, #6366f1, #a855f7)",
                        "linear-gradient(to bottom, #a855f7, #ec4899)",
                        "linear-gradient(to bottom, #ec4899, #6366f1)",
                      ],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    className="absolute inset-0"
                  />
                </div>
                <motion.div
                  animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
                  className="flex flex-col"
                >
                  <span className="font-mono font-black text-[15px] tracking-tighter text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                    YS
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                      .DEV
                    </span>
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
                    Portfolio
                  </span>
                </motion.div>
              </div>

              {/* Nav links */}
              <div className="mt-2 flex flex-col gap-0.5">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            {/* ── Bottom: Status + Profile ── */}
            <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-white/[0.06] pt-4 pb-2">

              {/* Status */}
              <div className="flex items-center gap-3 px-3 py-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <motion.span
                  animate={{ display: open ? "inline" : "none", opacity: open ? 1 : 0 }}
                  className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500 whitespace-nowrap"
                >
                  Available for work
                </motion.span>
              </div>

              {/* Profile */}
              <SidebarLink
                link={{
                  label: "Yash Sachan",
                  href: "#",
                  icon: (
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-500/40 blur-sm" />
                      <img
                        src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                        className="relative h-8 w-8 rounded-full border border-indigo-500/30 object-cover"
                        alt="Avatar"
                      />
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
              <section id="home" className="pt-12 md:pt-4">
                <Hero />
              </section>

              <section id="skills" className="relative">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-blue-400 text-[10px] md:text-xs font-mono mb-4">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <IconActivity size={14} />
                    </motion.div>
                    SYSTEM_RUNTIME
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600">
                    Technical Stack
                  </h2>
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 border-l-4 border-blue-600 pl-4 md:pl-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tighter">
                    Production
                  </h2>
                  <p className="text-neutral-500 font-mono text-xs md:text-sm">
                    Deployment logs & system designs
                  </p>
                </div>
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
