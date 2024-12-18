"use client";
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
import { FloatingNav } from "@/components/ui/FloatingNav";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import { TracingBeam } from "@/components/ui/tracingBeam";

import { navItems } from "@/data";
import { useEffect, useState } from "react";
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect will set isLoading to false after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    // Cleanup the timer in case the component is unmounted
    return () => clearTimeout(timer);
  }, []);
  return (
    <main className=" overflow-hidden relative bg-white dark:bg-black flex justify-center items-center flex-col mx-auto sm:px-10 px-5  font-Quicksand min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loading /> {/* Center the Loading component */}
        </div>
      ) : (
        <>
          {" "}
          <ToggleDarkModeButton />
          <TopBar />
          <div className=" w-full">
            <FloatingNav navItems={navItems} className="font-Quicksand" />
            <Hero />

            <Grid />

            <Experience />
            <Skills />
            <RecentProjects />

            <Certificates />
            <Approach />
            <Footer />
          </div>
        </>
      )}
    </main>
  );
}
