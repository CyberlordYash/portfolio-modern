import { workExperience } from "@/data";
import React from "react";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";
import { motion } from "framer-motion";
const Experience = () => {
  return (
    <div
      className=" py-10 w-[100%] m-[auto] mt-2 p-6 rounded-2xl bg-white  dark:bg-black"
      id="experience"
    >
      <h1 className=" heading">
        My
        <span className=" text-violet-700 dark:text-purple  font-Orbitron">
          {" "}
          Experience
        </span>
      </h1>
      <div className=" w-full mt-12 grid  gap-1">
        {workExperience.map((card: any) => (
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.01,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            key={card.id}
            className={` rounded-2xl outer m-1   flex-1 text-white dark:text-white-100
      border-neutral-300   flex items-center justify-center
          ${card.className}`}
          >
            <div className=" p-2">
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
                    width={100}
                    height={100}
                    className="lg:w-[150px] md:w-[150px] w-[100px] rounded-xl"
                  />
                  <div className="lg:w-[65%] lg:ms-5">
                    <h1 className="lg:text-start text-center text-xl md:text-2xl font-bold">
                      {card.title}
                    </h1>
                    <div className="m-1 text-start text-white-200 mt-3 font-semibold">
                      {card.desc.map((point: any, index: any) => (
                        <p key={index}>{point}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
