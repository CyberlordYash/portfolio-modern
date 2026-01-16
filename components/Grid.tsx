import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";

const Grid = () => {
  return (
    <section id="about" className="py-12 w-full bg-slate-50 dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Sleek Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-[2px] w-4 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-[0.3em]">
                System_Core.v2
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
              About_<span className="text-indigo-500">Me</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs max-w-xs md:text-right">
            Technical overview of core competencies and professional background.
          </p>
        </div>

        <BentoGrid className="grid-auto-rows-[12rem]">
          {gridItems.map((item) => (
            <BentoGridItem
              id={item.id}
              key={item.id}
              title={item.title}
              description={item.description}
              className={item.className}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default Grid;
