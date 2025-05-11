import React from "react";
import { InfiniteMovingCards } from "./ui/infiniteMovingCards";
import { testimonials } from "@/data";

const Skills = () => {
  return (
    <div
      className=" py-10  w-[100%] m-[auto] mt-2 p-6 rounded-2xl bg-black  dark:bg-white"
      id="skills"
    >
      {/* <h1 className=" heading">
        My{" "}
        <span className=" text-violet-700 dark:text-purple font-Orbitron">
          Skills
        </span>
      </h1> */}
      <div className=" flex flex-col items-center ">
        <div className=" h-[20vh] md: h-[20rem] rounded-md flex flex-col antialiased items-center relative overflow-hidden">
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
