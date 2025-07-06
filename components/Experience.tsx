import { workExperience } from "@/data";
import React from "react";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlowingEffect } from "./ui/glowing-effect";
const Experience = () => {
  return (
    <div
      className=" py-10 w-[100%] m-[auto] mt-2 p-6 rounded-2xl bg-white  dark:bg-black"
      id="experience"
    >
      <div className=" w-full mt-12 grid  gap-1">
        {workExperience.map((card: any) => (
          <div
            key={card.id}
            className={` border-2 relative overflow-visible border-black/[0.1] dark:border-white/[0.2] rounded-2xl outer m-1   flex-1 text-white dark:text-white-100
        flex items-center justify-center 
          ${card.className}`}
          >
            <GlowingEffect
              blur={0}
              borderWidth={5}
              spread={100}
              glow={true}
              disabled={false}
              proximity={84}
              inactiveZone={0.01}
            />
            <div className=" w-[100%]">
              <div className=" relative w-full flex flex-col gap-2 p-3 py-6 md:p-2 lg:p-2">
                {/* Top section div */}
                {card.date != null && (
                  <div className="  absolute top-1 right-1 w-full max-w-xs h-6 rounded-md text-center font-bold bg-gray-700 text-white">
                    {card.date}
                  </div>
                )}

                {/* Existing content section (row) */}
                <div className="w-full flex lg:flex-row flex-col  gap-2 justify-center items-center">
                  <Image
                    src={card.thumbnail}
                    alt="image"
                    width={80}
                    height={80}
                    className="lg:w-[130px] md:w-[130px] w-[80px] rounded-xl"
                  />
                  <div className="lg:w-[65%] lg:ms-5">
                    <h1 className="lg:text-start text-center text-xl md:text-2xl font-bold text-black-100 dark:text-white-100">
                      {card.title}
                    </h1>
                    <div className="m-1 text-start text-black-200 dark:text-white-100 mt-3 font-semibold">
                      {card.desc.map((point: any, index: any) => (
                        <p key={index}>{point}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
