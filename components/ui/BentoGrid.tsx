"use client";
import { cn } from "@/utils/cn";
import { useState } from "react";
import Lottie from "react-lottie";
import animationData from "@/data/confetti.json";
import MagicButton from "./MagicButton";
import { IoCopyOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { GlowingEffect } from "./glowing-effect";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};
export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id?: number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("yashsachan321@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-visible rounded-2xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none border-2 flex flex-col border-black/[0.1] dark:border-white/[0.2]",
        className
      )}
    >
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />

      <div
        className={`${id === 6 && "flex justify-center"} h-full relative z-10`}
      >
        {/* ✅ Image Layer */}
        {img && (
          <img
            src={img}
            alt={img}
            className={cn(
              imgClassName,
              "absolute inset-0 object-cover object-center w-full h-full"
            )}
          />
        )}

        {/* ✅ Spare Image Layer */}
        {spareImg && (
          <div className="absolute right-0 -bottom-5 z-0">
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full h-full"
            />
          </div>
        )}

        {/* ✅ Content Layer */}
        <div
          className={cn(
            titleClassName,
            "relative z-10 min-h-40 px-5 py-5 lg:p-10 flex flex-col gap-4"
          )}
        >
          <div className="font-Quicksand font-extralight md:text-s lg:text-base text-sm">
            {description}
          </div>
          <div className="font-Quicksand text-lg lg:text-2xl max-w-96 font-bold">
            {title}
          </div>

          {id === 3 && (
            <div className="flex w-fit absolute -right-3 lg:-right-2">
              <a href="#skills">
                <MagicButton
                  title="Check my Skills"
                  icon={<IoCopyOutline />}
                  position="left"
                  otherClasses="dark:bg-[#240750]"
                />
              </a>
              {/* <div className="flex flex-col gap-3 lg:gap-8 z-[-1]">
                {["React.js", "Next.js", "TypeScript"].map((item) => (
                  <span
                    key={item}
                    className="py-2 lg:py-4 lg:px-3 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="py-4 px-3 rounded-lg text-center bg-[#10132E]" />
              </div> */}

              {/* <div className="flex flex-col gap-3 lg:gap-8">
                <span className="py-4 px-3 rounded-lg text-center bg-[#10132E]" />
                {["C++", "Node js", "MongoDB"].map((item) => (
                  <span
                    key={item}
                    className="py-2 lg:py-4 lg:px-3 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div> */}
            </div>
          )}

          {id === 6 && (
            <div className="mt-5 relative">
              <div className="absolute -bottom-5 right-0">
                <Lottie
                  options={{
                    loop: copied,
                    autoplay: copied,
                    animationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                />
              </div>
              <MagicButton
                title={copied ? "Email copied" : "Copy my Email"}
                icon={<IoCopyOutline />}
                position="left"
                otherClasses="bg-[#161a31]"
                handleClick={handleCopy}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
