"use client";

import React from "react";
import { projects } from "@/data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { FaLocationArrow } from "react-icons/fa";

const RecentProjects = () => {
  return (
    <section className="py-12 w-full max-w-7xl mx-auto px-4" id="projects">
      <h1 className="text-center text-3xl sm:text-4xl  tron font-bold mb-10  text-blue-200">
        My <span className="">Projects</span> Section
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {projects.map(({ id, title, des, img, iconLists, link }) => (
          <CardContainer key={id} className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[85vw] sm:w-[380px] h-auto rounded-xl p-6 border">
              {/* Title */}
              <CardItem
                translateZ="50"
                className="text-lg sm:text-xl font-bold text-neutral-600 dark:text-white line-clamp-1"
              >
                {title}
              </CardItem>

              {/* Description */}
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 line-clamp-2"
              >
                {des}
              </CardItem>

              {/* Image */}
              <CardItem
                translateZ="100"
                rotateX={5} // reduced tilt
                rotateZ={-2} // reduced tilt
                className="w-full mt-4"
              >
                <img
                  src={img}
                  alt={title}
                  height="1000"
                  width="1000"
                  className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
              </CardItem>

              {/* Icons */}
              <div className="flex items-center space-x-2 mt-4">
                {iconLists.map((icon, idx) => (
                  <CardItem
                    key={idx}
                    translateZ={20}
                    className="bg-black border border-white/20 rounded-md w-8 h-8 flex items-center justify-center"
                  >
                    {icon}
                  </CardItem>
                ))}
              </div>

              {/* Link */}
              <div className="flex justify-end mt-6">
                <CardItem
                  as="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  translateZ={20}
                  translateX={40}
                  className="inline-flex items-center px-3 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Check Live Site
                  <FaLocationArrow className="ml-2" color="#CBACF9" />
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
