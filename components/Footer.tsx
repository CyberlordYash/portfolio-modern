import React from "react";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from "@/data";

const Footer = () => {
  return (
    <footer className=" w-full pt-20 pb-10" id="contact">
      <div className=" flex flex-col items-center">
        <h1 className=" heading max-w-[45vw]">Get In Touch</h1>
        <p className=" text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s connect
        </p>
        <a href="mailto:yashsachan321@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          ></MagicButton>
        </a>
      </div>
      <div className=" flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className=" text-lg  ">
          Made with ❤️ by <span className=" text-red-200">Yash Sachan</span>{" "}
        </p>

        <div className=" flex items-center md:gap-3 gap-6 ">
          {socialMedia.map((profile) => (
            <div
              key={profile.id}
              className=" w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-150 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <a href={profile.link}>
                <img
                  src={profile.img}
                  alt="social media"
                  width={20}
                  height={20}
                ></img>
              </a>
            </div>
          ))}
        </div>
      </div>
      <hr></hr>
      <p className=" mt-5 opacity-45 text-center md:text-base text-sm md:font-normal text-white-200">
        Design Inspired by{" "}
        <a href="https://github.com/adrianhajdin/">Adrian Hajdin</a>
      </p>
      <p className=" opacity-40 text-center md:text-base text-sm md:font-normal text-white-200">
        Designed with Aceternity UI
      </p>
    </footer>
  );
};

export default Footer;
