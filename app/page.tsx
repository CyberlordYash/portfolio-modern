"use client";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { FollowerPointerCard } from "@/components/ui/FollowingPointer";
import { TracingBeam } from "@/components/ui/tracingBeam";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { navItems } from "@/data";
export default function Home() {
  return (
    <main className=" relative bg-black-100 flex justify-center items-center flex-col  mx-auto sm:px-10 px-5 overflow-clip">
      <div className=" max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <TracingBeam>
          <FollowerPointerCard title="Yash Sachan">
            <Hero />
          </FollowerPointerCard>
          <FollowerPointerCard title="About Me">
            <Grid />
          </FollowerPointerCard>
          <FollowerPointerCard title="Projects">
            <RecentProjects />
          </FollowerPointerCard>
          <FollowerPointerCard title="Skills">
            <Skills />
          </FollowerPointerCard>
          <FollowerPointerCard title="Experience">
            <Experience />
          </FollowerPointerCard>
          <FollowerPointerCard title="Approach">
            <Approach />
          </FollowerPointerCard>
          <FollowerPointerCard title="Connect with Me">
            <Footer />
          </FollowerPointerCard>
        </TracingBeam>
      </div>
    </main>
  );
}
