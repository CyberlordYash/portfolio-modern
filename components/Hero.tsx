import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { SiLeetcode, SiLinkedin } from "react-icons/si";
import { Meteors } from "./ui/Metors";
const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className=" -top-40 -left-10 md:-left-32 md:-top-10 h-screen"
          fill="white"
        />
        <Spotlight
          className=" top-10 -left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className=" top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.04] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className=" flex justify-center relative my-20 z-10 ">
        <div className=" max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className=" uppercase tracking-widest text-xl text-center text-blue-100 max-w-80">
            Yash Sachan
          </p>

          <TextGenerateEffect
            className=" text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Delivering exceptional digital experiences and solutions"
          />
          <p className="text-center">
            Hi, I&apos;m<span className=" text-purple"> Yash</span> , a Website
            Designer & Developer based in{" "}
            <span className=" text-orange-400">In</span>d
            <span className=" text-green-400">ia</span>
          </p>

          <a
            href="https://www.linkedin.com/in/yash-sachan-187405209/"
            className=" mt-3"
          >
            <MagicButton
              title="Let's Connect"
              icon={<SiLinkedin />}
              position="left"
            />
          </a>
        </div>
      </div>
      <Meteors number={20} />
    </div>
  );
};

export default Hero;
