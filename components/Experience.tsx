import { workExperience } from "@/data";
import React from "react";
import { Button } from "./ui/MovingBorders";

const Experience = () => {
  return (
    <div className=" py-20" id="experience">
      <h1 className=" heading">
        My
        <span className=" text-purple"> Experience</span>
      </h1>
      <div className=" w-full mt-12 grid  gap-1">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            duration={Math.floor(Math.random() * 8000) + 1000}
            className={` hover:bg-gradient-to-r from-violet-600 to-indigo-600 flex-1 text-white-100
      border-neutral-200 dark:border-slate-800 flex items-center justify-center
          ${card.className}`}
          >
            <div className=" w-full flex lg:flex-row flex-col lg:items-center  p-3 py-6 md:p-2 lg:p-4 gap-2 justify-center items-center">
              <>
                <img
                  src={card.thumbnail}
                  alt="image"
                  className=" lg:w-[150px] md:w-[150px] w-[100px]"
                />
                <div className="lg:w-[50%] lg:ms-5">
                  <h1 className=" lg:text-start text-center text-xl md:text-2xl font-bold">
                    {card.title}
                  </h1>
                  <div className=" m-1 text-start text-white-200 mt-3 font-semibold">
                    {card.desc.map((point: any, index: any) => (
                      <p key={index}>{point}</p>
                    ))}
                  </div>
                </div>
              </>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
