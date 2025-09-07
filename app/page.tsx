"use client";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Approach from "@/components/Approach";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import TopBar from "@/components/TopBar";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems } from "@/data";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/utils/cn";

// 👇 Inline FadeInSection Component
function FadeInSection({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
const links = [
  {
    label: "Home",
    href: "#home",
    icon: (
      <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Projects",
    href: "#projects",
    icon: (
      <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Contact",
    href: "#contact",
    icon: (
      <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "",
    href: "#",
    icon: (
      <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
];
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const [open, setOpen] = useState(false);
  return (
    <main className="overflow-hidden relative bg-black dark:bg-white flex justify-center items-center flex-col mx-auto pb-4 font-Quicksand">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen md:h-screen w-full">
          <Loading />
        </div>
      ) : (
        <div
          className={cn(
            "mx-auto flex w-full  flex-1 flex-col overflow-hidden  md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            "min-h-screen md:h-screen"
          )}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                <img
                  src="/logo.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: "Yash Sachan",
                    href: "#",
                    icon: (
                      <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQFmD9Vyo4Smww/profile-displayphoto-shrink_400_400/B56ZWKZbrcHEAk-/0/1741783681329?e=1759968000&v=beta&t=vLvMCe-qhRcLhOjx76IA2nVDmQ5T4k2exgFzSh4kf3A"
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <div className="flex-1 min-h-screen md:h-screen overflow-y-auto overflow-x-hidden">
            {/* <TopBar /> */}
            <div className="w-full p-2">
              <FloatingNav navItems={navItems} className="font-Quicksand" />

              <Hero />

              <Skills />

              <h1 className="p-4 heading dark:text-black-100 text-white-100">
                My
                <span className="dark:text-blue-800 text-blue-200 font-Orbitron">
                  {" "}
                  Experience
                </span>
              </h1>

              <Experience />

              <Grid />

              <RecentProjects />

              <Certificates />

              <h1 className="p-4 heading dark:text-black-100 text-white-100">
                My Approach to{" "}
                <span className="dark:text-blue-800 text-blue-200">
                  Development
                </span>
              </h1>
              <Approach />

              <Footer />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
