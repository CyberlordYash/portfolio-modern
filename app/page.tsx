"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

// Components
import Approach from "@/components/Approach";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems } from "@/data";

// UI & Icons
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconTerminal2,
  IconCpu,
  IconDatabase,
  IconServer,
  IconActivity,
} from "@tabler/icons-react";
import TerminalSnake from "./TerminalSnake";

const links = [
  {
    label: "Terminal",
    href: "#home",
    icon: <IconTerminal2 className="h-6 w-6 shrink-0 text-blue-500" />,
  },
  {
    label: "Infrastructure",
    href: "#skills",
    icon: <IconCpu className="h-6 w-6 shrink-0 text-purple-500" />,
  },
  {
    label: "Systems",
    href: "#projects",
    icon: <IconServer className="h-6 w-6 shrink-0 text-emerald-500" />,
  },
  {
    label: "Architecture",
    href: "#approach",
    icon: <IconDatabase className="h-6 w-6 shrink-0 text-amber-500" />,
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Pure Black Background
    <main className="relative min-h-screen bg-black text-slate-200 font-Quicksand selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <Loading />
          </motion.div>
        ) : (
          <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black">
            {/* RESPONSIVE SIDEBAR */}
            <Sidebar open={open} setOpen={setOpen} animate={true}>
              {/* Added bg-black and subtle white border for OLED contrast */}
              <SidebarBody className="justify-between gap-10 border-r border-white/[0.05] bg-white dark:bg-black px-4 md:px-2">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="flex items-center justify-start gap-3 h-20 px-2">
                    <div className="h-8 w-1 min-w-[4px] bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
                    <span
                      className={cn(
                        "font-mono font-bold tracking-tighter text-xl text-white whitespace-nowrap transition-opacity duration-300",
                        open ? "opacity-100" : "opacity-0 md:hidden",
                      )}
                    >
                      SYS_ROOT
                    </span>
                  </div>

                  <div className="mt-4 md:mt-8 flex flex-col gap-4 md:gap-2">
                    {links.map((link, idx) => (
                      <SidebarLink
                        key={idx}
                        link={link}
                        className="group flex items-center gap-4 py-3 md:py-2 px-2 rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.05] py-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 px-2">
                    <div className="relative h-2 w-2 shrink-0">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                      <div className="relative h-2 w-2 bg-emerald-500 rounded-full" />
                    </div>
                    {open && (
                      <span className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase">
                        Server Online
                      </span>
                    )}
                  </div>

                  <SidebarLink
                    link={{
                      label: "Yash Sachan",
                      href: "#",
                      icon: (
                        <img
                          src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                          className="h-8 w-8 rounded-full border border-white/20 object-cover shrink-0"
                          alt="Avatar"
                        />
                      ),
                    }}
                    className="flex items-center gap-4 px-2"
                  />
                </div>
              </SidebarBody>
            </Sidebar>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-white dark:bg-black">
              {/* Pure Black Grid Pattern */}
              <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px] pointer-events-none" />

              <div className="relative z-10 w-full">
                <div className="">
                  <FloatingNav navItems={navItems} />
                </div>

                <div className="max-w-full mx-auto px-1 sm:px-2 md:px-2 space-y-4 md:space-y-6">
                  <section id="home" className="pt-12 md:pt-4">
                    <Hero />
                  </section>

                  <section id="skills" className="relative">
                    <div className="flex flex-col items-center mb-10 md:mb-16">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-blue-400 text-[10px] md:text-xs font-mono mb-4">
                        <IconActivity size={14} className="animate-pulse" />{" "}
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
                  {/* Section Wrappers adjusted for Pure Black */}
                  <section id="experience" className="px-2 md:px-0">
                    <Experience />
                  </section>

                  <section
                    id="architecture"
                    className="overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-black border border-white/[0.05]"
                  >
                    <Grid />
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

                  <Footer />
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
