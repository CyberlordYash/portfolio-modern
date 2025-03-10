import { projects } from "@/data";
import React from "react";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa";

const RecentProjects = () => {
  return (
    <div className=" py-20" id="projects">
      <h1 className=" heading font-Orbitron">
        My <span className=" text-violet-700 dark:text-purple">Projects</span>{" "}
        Section
      </h1>
      <div className=" flex flex-wrap items-center justify-center p-4 ">
        {projects.map(({ id, title, des, img, iconLists, link }) => (
          <div
            key={id}
            className=" sm:h-[41rem] h-[30rem] j- lg:min-h-[32.5rem] flex items-center justify-center sm:w-[470px] w-[80vw]"
          >
            <PinContainer title={title} href={link}>
              <div className=" bg-transparent relative flex items-center justify-center sm:w-[470px] w-[80vw] overflow-hidden h-[20vh]  sm:h-[30vh]  rounded-md">
                <div className=" relative w-full h-full overflow-hidden lg:rounded-3xl object-center"></div>
                <img
                  src={img}
                  alt={title}
                  className=" w-[105%] h-[105%] rounded-lg z-10 absolute bottom-0 object-fill"
                ></img>
              </div>
              <h1 className=" font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {title}
              </h1>
              <p className=" lg:font-normal font-light text-sm line-clamp-2">
                {des}
              </p>

              <div className=" flex items-center justify-between mt-7 mb-3">
                <div className=" flex items-center">
                  {iconLists.map((icon, index) => (
                    <div
                      key={icon}
                      className=" border border-white/[0.2] rounded-xl bg-black lg:w-10 lg:h-10 w-9 h-9 flex justify-center items-center"
                      style={{ transform: ` translateX(-${5 * index * 2}px)` }}
                    >
                      <img src={icon} alt={icon} className=" p-2"></img>
                    </div>
                  ))}
                  <a href={link}>
                    <div className=" flex justify-center items-center">
                      <p className=" flex lg:text-xl md:text-xs text-sm text-purple">
                        {" "}
                        Check Live Site
                      </p>
                      <FaLocationArrow className=" ms-3" color="#CBACF9" />
                    </div>
                  </a>
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
