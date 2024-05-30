"use client";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { FloatingNav } from "@/components/ui/FloatingNav";

import { TracingBeam } from "@/components/ui/tracingBeam";

import { navItems } from "@/data";
export default function Home() {
  return (
    <main className=" relative bg-black-100 flex justify-center items-center flex-col  mx-auto sm:px-10 px-5 overflow-clip font-Quicksand">
      <div className=" max-w-7xl w-full">
        <FloatingNav navItems={navItems} className=" font-Quicksand" />
        <TracingBeam>
          <Hero />

          <Grid />

          <RecentProjects />

          <Skills />

          <Experience />

          <Approach />

          <Footer />
        </TracingBeam>
      </div>
    </main>
  );
}
