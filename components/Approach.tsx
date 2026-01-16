"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvanRevealEffect";

const Approach = () => {
  return (
    <section
      className="py-10 w-full bg-white dark:bg-[#020617] transition-colors duration-500"
      id="approach"
    >
      <div className="max-w-[85vw] 2xl:max-w-[1400px] mx-auto px-4">
        {/* Compact System Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Execution_Pipeline
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
            My_Approach
          </h2>
        </div>

        {/* Dense Grid - Tightened spacing from my-20 to my-2 */}
        <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center">
          <Card
            title="Architecture"
            icon={<AceternityIcon order="Phase 1" />}
            description="Scalable system design, database selection, and low-latency architectural planning."
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-blue-900"
            />
            <DotsBackground />
          </Card>

          <Card
            title="Development"
            icon={<AceternityIcon order="Phase 2" />}
            description="High-performance gRPC/REST APIs, cloud infra, and distributed service integration."
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-emerald-900"
            />
            <DotsBackground />
          </Card>

          <Card
            title="Optimization"
            icon={<AceternityIcon order="Phase 3" />}
            description="Latency reduction, memory profiling, and stress testing for peak traffic reliability."
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-purple-900"
            />
            <DotsBackground />
          </Card>

          <Card
            title="Deployment"
            icon={<AceternityIcon order="Phase 4" />}
            description="CI/CD automation, Kubernetes orchestration, and proactive system monitoring."
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-sky-900"
            />
            <DotsBackground />
          </Card>
        </div>
      </div>
    </section>
  );
};

const Card = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  description: string;
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-slate-200 dark:border-white/[0.1] group/canvas-card flex items-center justify-center
      w-full mx-auto p-4 relative h-[18rem] lg:h-[22rem] rounded-[2rem] overflow-hidden bg-slate-50/50 dark:bg-black/40 backdrop-blur-sm transition-all duration-300"
    >
      {/* Refined Corner Plus Icons */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-slate-500 text-slate-300" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-slate-500 text-slate-300" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-slate-500 text-slate-300" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-slate-500 text-slate-300" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div
          className="text-center group-hover/canvas-card:-translate-y-4 
        absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 
        group-hover/canvas-card:opacity-0 transition duration-300 w-full 
        mx-auto flex items-center justify-center"
        >
          {icon}
        </div>

        <h2
          className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 
        relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white 
        group-hover/canvas-card:-translate-y-2 transition duration-300 text-center tracking-tight"
        >
          {title}
        </h2>

        <p
          className="text-[11px] font-mono leading-relaxed dark:text-slate-200 opacity-0 group-hover/canvas-card:opacity-100 
        relative z-10 mt-2 transition duration-300 text-center px-4"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const DotsBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_1px,transparent_1px)] [background-size:20px_20px]" />
);

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <button className="px-6 py-1.5 rounded-full relative bg-slate-900 dark:bg-slate-800 text-white text-sm border border-slate-700 font-mono font-bold tracking-tighter">
      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      <span className="relative z-20">{order}</span>
    </button>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export default Approach;
