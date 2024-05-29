import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { TracingBeam } from "@/components/ui/tracingBeam";
import Image from "next/image";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <main className=" relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className=" max-w-7xl w-full">
        <FloatingNav
          navItems={[{ name: "Home", link: "/", icon: <FaHome /> }]}
        />
        <TracingBeam>
          <Hero />
          <Grid />
          <RecentProjects />
          <Skills />
          <Experience />
          <Approach />
        </TracingBeam>
      </div>
    </main>
  );
}
