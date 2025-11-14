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
  IconFolderCode,
  IconHome,
  IconMail,
  IconSettings,
  IconUser,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/utils/cn";

const links = [
  {
    label: "Home",
    href: "#home",
    icon: (
      <IconHome className="h-5 w-5 shrink-0 text-neutral-600 transition-colors duration-200 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-blue-400" />
    ),
  },
  {
    label: "Projects",
    href: "#projects",
    icon: (
      <IconFolderCode className="h-5 w-5 shrink-0 text-neutral-600 transition-colors duration-200 group-hover:text-emerald-600 dark:text-neutral-300 dark:group-hover:text-emerald-400" />
    ),
  },
  {
    label: "Contact",
    href: "#contact",
    icon: (
      <IconMail className="h-5 w-5 shrink-0 text-neutral-600 transition-colors duration-200 group-hover:text-rose-600 dark:text-neutral-300 dark:group-hover:text-rose-400" />
    ),
  },
  {
    label: "About",
    href: "#about",
    icon: (
      <IconUser className="h-5 w-5 shrink-0 text-neutral-600 transition-colors duration-200 group-hover:text-indigo-600 dark:text-neutral-300 dark:group-hover:text-indigo-400" />
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
    <main className="overflow-hidden relative bg-black  flex justify-center items-center flex-col mx-auto pb-4 font-Quicksand">
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
                        src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
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

              <h1 className="p-4 heading text-white-100">
                My
                <span className=" text-blue-200  tron"> Experience</span>
              </h1>

              <Experience />

              <Grid />

              <RecentProjects />

              <Certificates />

              <h1 className="p-4 heading  text-white-100">
                My Approach to{" "}
                <span className=" text-blue-200">Development</span>
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
