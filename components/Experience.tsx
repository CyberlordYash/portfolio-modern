import { workExperience } from "@/data";
import React from "react";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";

const Experience = () => {
  return (
    <div className=" py-20" id="experience">
      <h1 className=" heading">
        My
        <span className=" text-violet-700 dark:text-purple  font-Orbitron">
          {" "}
          Experience
        </span>
      </h1>
      <div className=" w-full mt-12 grid  gap-1">
        {workExperience.map((card: any) => (
          <div
            key={card.id}
            className={` outer m-1  bg-[url('/Sprinkle.svg')] border-2  bg-[#0c0d0d] dark:bg-black hover:bg-[#e9e3ffee] flex-1 text-black dark:text-white-100
      border-neutral-300 rounded-md dark:border-slate-600 flex items-center justify-center
          ${card.className}`}
          >
            <div className="card p-2">
              <div className="ray"></div>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
