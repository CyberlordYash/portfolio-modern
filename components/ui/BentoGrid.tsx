"use client";
import { cn } from "@/utils/cn";
import { useState } from "react";
import Lottie from "react-lottie";
import animationData from "@/data/confetti.json";
import MagicButton from "./MagicButton";
import { IoCopyOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
import { motion } from "framer-motion";

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
        "grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-4 mx-auto",
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
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-3xl group/bento flex flex-col justify-between",
        "bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/[0.05]",
        "hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:border-indigo-500/30 transition-all",
        className
      )}
    >
      {/* Visual background decorations */}
      {img && (
        <div className="absolute inset-0 opacity-20 group-hover/bento:opacity-30 transition-opacity">
          <img
            src={img}
            alt=""
            className={cn(imgClassName, "object-cover w-full h-full")}
          />
        </div>
      )}

      {/* Terminal-style header bar */}
      <div className="flex items-center justify-between px-5 pt-4 z-30 pointer-events-none">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
        </div>
        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
          id_0{id}
        </div>
      </div>

      <div
        className={cn(
          "relative z-20 flex flex-col h-full px-5 pb-6 pt-2",
          titleClassName
        )}
      >
        <div className="font-mono text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
          {description}
        </div>
        <div className="font-bold text-lg lg:text-xl text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
          {title}
        </div>

        {/* Action Button: Condensed styling */}
        {id === 3 && (
          <div className="mt-4">
            <MagicButton
              title="View Skills"
              icon={<IoCopyOutline />}
              position="left"
              otherClasses="!h-9 !text-xs dark:!bg-indigo-950/30 border-indigo-500/20"
            />
          </div>
        )}

        {id === 6 && (
          <div className="mt-auto pt-4 relative">
            <div
              className={`absolute -top-20 left-1/2 -translate-x-1/2 ${
                copied ? "block" : "hidden"
              }`}
            >
              <Lottie
                options={{ loop: false, autoplay: true, animationData }}
                height={120}
                width={200}
              />
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity border border-white/10"
            >
              {copied ? (
                <IoCheckmarkDoneOutline size={14} />
              ) : (
                <IoCopyOutline size={14} />
              )}
              {copied ? "Copied" : "Get_Contact"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
