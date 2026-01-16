import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";

const Grid = () => {
  return (
    <section id="about" className="py-20 w-full">
      <div className="max-w-[92vw] 2xl:max-w-[1600px] mx-auto px-4">
        {/* Consistent Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              System_Overview
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
            About_Me
          </h2>
        </div>

        <BentoGrid className="w-full">
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
