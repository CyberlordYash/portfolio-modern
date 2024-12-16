import React from "react";
import { InfiniteMovingCards } from "./ui/infiniteMovingCards";
import { testimonials } from "@/data";

const Skills = () => {
  return (
    <div className=" py-20" id="skills">
      <h1 className=" heading">
        My{" "}
        <span className=" text-violet-700 dark:text-purple font-Orbitron">
          Skills
        </span>
      </h1>
      <div className=" flex flex-col items-center ">
        <div className=" h-[50vh] md: h-[30rem] rounded-md flex flex-col antialiased items-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="normal"
          />
        </div>
      </div>
    </div>
  );
};

export default Skills;
