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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="overflow-hidden relative bg-black dark:bg-white flex justify-center items-center flex-col mx-auto p-2 font-Quicksand min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loading />
        </div>
      ) : (
        <>
          <ToggleDarkModeButton />
          <TopBar />
          <div className="w-full">
            <FloatingNav navItems={navItems} className="font-Quicksand" />

            <FadeInSection>
              <Hero />
            </FadeInSection>
            <FadeInSection>
              <Skills />
            </FadeInSection>
            <FadeInSection>
              <Grid />
            </FadeInSection>
            <FadeInSection>
              <Experience />
            </FadeInSection>
            <FadeInSection>
              <RecentProjects />
            </FadeInSection>
            <FadeInSection>
              <Certificates />
            </FadeInSection>
            <FadeInSection>
              <Approach />
            </FadeInSection>
            <FadeInSection>
              <Footer />
            </FadeInSection>
          </div>
        </>
      )}
    </main>
  );
}
