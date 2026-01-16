"use client";
import { cn } from "@/utils/cn";
import { useState } from "react";
import Lottie from "react-lottie";
import animationData from "@/data/confetti.json";
import MagicButton from "./MagicButton";
import { IoCopyOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
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
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-8 mx-auto",
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn(
        // Smooth rounded corners and adaptive borders
        "relative overflow-hidden rounded-[2.5rem] group/bento transition duration-300 flex flex-col justify-between space-y-4",
        "bg-white dark:bg-black border border-slate-200 dark:border-white/[0.1] shadow-sm dark:shadow-none",
        className
      )}
    >
      {/* 1. High-Performance Glow Effect */}
      <div className="absolute inset-0 z-0">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
      </div>

      <div
        className={`${id === 6 && "flex justify-center"} h-full relative z-10`}
      >
        {/* ✅ Optimized Image Layers */}
        {img && (
          <div className="absolute inset-0 w-full h-full opacity-40 dark:opacity-50 group-hover/bento:opacity-60 transition duration-500">
            <img
              src={img}
              alt={img}
              className={cn(
                imgClassName,
                "object-cover object-center w-full h-full"
              )}
            />
          </div>
        )}

        {spareImg && (
          <div
            className={`absolute right-0 bottom-0 z-0 ${
              id === 5 && "w-full opacity-80"
            }`}
          >
            <img
              src={spareImg}
              alt={spareImg}
              className="object-cover object-center w-full h-full opacity-50 dark:opacity-100"
            />
          </div>
        )}

        {/* ✅ Content Layer with High-Contrast Text */}
        <div
          className={cn(
            titleClassName,
            "relative z-20 min-h-40 px-6 py-8 lg:px-10 flex flex-col transition duration-200 group-hover/bento:translate-x-1"
          )}
        >
          <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            {description}
          </div>
          <div className="font-bold text-xl lg:text-3xl text-slate-900 dark:text-slate-100 leading-tight tracking-tighter max-w-96">
            {title}
          </div>

          {/* Special ID rendering remains functional but styled cleaner */}
          {id === 3 && (
            <div className="mt-6">
              <a href="#skills">
                <MagicButton
                  title="View Matrix"
                  icon={<IoCopyOutline />}
                  position="left"
                  otherClasses="!bg-indigo-600 dark:!bg-[#240750] text-white"
                />
              </a>
            </div>
          )}

          {id === 6 && (
            <div className="mt-8 relative">
              <div
                className={`absolute -bottom-5 right-0 ${
                  copied ? "block" : "hidden"
                }`}
              >
                <Lottie
                  options={{
                    loop: false,
                    autoplay: true,
                    animationData,
                    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                  }}
                  height={200}
                  width={400}
                />
              </div>
              <MagicButton
                title={
                  copied ? "Email Encrypted & Copied" : "Copy_Email_Address"
                }
                icon={
                  copied ? (
                    <IoCheckmarkDoneOutline className="text-emerald-400" />
                  ) : (
                    <IoCopyOutline />
                  )
                }
                position="left"
                otherClasses="!bg-slate-900 dark:!bg-[#161a31] text-white border border-white/10"
                handleClick={handleCopy}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
