"use client";

import React from "react";
import { projects } from "@/data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { FaLocationArrow } from "react-icons/fa";
import { IconTerminal2 } from "@tabler/icons-react";

const RecentProjects = () => {
  return (
    <section
      className="py-16 w-full bg-white dark:bg-[#020617] transition-colors duration-500 rounded-[2rem]"
      id="projects"
    >
      <div className="max-w-[85vw] 2xl:max-w-[1400px] mx-auto px-4">
        {/* Compact Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Binary_Outputs
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
            Featured_Work
          </h2>
        </div>

        {/* Project Grid */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {projects.map(({ id, title, des, img, iconLists, link }) => (
            <CardContainer key={id} className="inter-var py-2">
              <CardBody className="bg-slate-50/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-indigo-500/[0.1] dark:bg-black/40 dark:border-white/[0.1] border-slate-200 w-[88vw] sm:w-[350px] h-auto rounded-[2rem] p-6 border backdrop-blur-sm transition-all">
                {/* Status Indicator */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <IconTerminal2
                      className="text-indigo-600 dark:text-indigo-400"
                      size={16}
                    />
                    <span className="font-mono text-[9px] font-bold text-slate-500">
                      PRJ_0{id}
                    </span>
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>

                {/* Title */}
                <CardItem
                  translateZ="40"
                  className="text-xl font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1"
                >
                  {title}
                </CardItem>

                {/* Description */}
                <CardItem
                  as="p"
                  translateZ="50"
                  className="text-slate-600 text-xs mt-2 dark:text-slate-400 line-clamp-2 leading-relaxed"
                >
                  {des}
                </CardItem>

                {/* Project Image */}
                <CardItem translateZ="80" className="w-full mt-5">
                  <div className="relative group/img rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                    <img
                      src={img}
                      alt={title}
                      className="h-40 w-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                  </div>
                </CardItem>

                <div className="flex items-center justify-between mt-6">
                  {/* Technology Icons - FIXED: Now rendering JSX elements */}
                  <div className="flex items-center">
                    {iconLists.map((icon, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-200 dark:border-white/[0.2] rounded-full bg-white dark:bg-black w-9 h-9 flex items-center justify-center -ml-2 first:ml-0 shadow-sm transition-transform group-hover/card:translate-y-[-2px]"
                        style={{ zIndex: iconLists.length - idx }}
                      >
                        {/* We render the icon directly because it's already a component in your data */}
                        <div className="flex items-center justify-center">
                          {icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Link Button */}
                  <CardItem
                    as="a"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    translateZ={20}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white dark:text-black text-white text-[10px] font-bold hover:opacity-80 transition-opacity"
                  >
                    Source
                    <FaLocationArrow
                      size={8}
                      className="text-indigo-400 dark:text-indigo-600"
                    />
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentProjects;
