"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvanRevealEffect";

type PhaseColor = "cyan" | "emerald" | "violet" | "amber";

const colorMap: Record<PhaseColor, {
  strip: string;
  led: string;
  ledGlow: string;
  label: string;
  canvasBg: string;
  canvasColors: number[][];
}> = {
  cyan: {
    strip: "bg-cyan-400",
    led: "bg-cyan-400",
    ledGlow: "shadow-[0_0_6px_2px_rgba(34,211,238,0.7)]",
    label: "text-cyan-500 dark:text-cyan-400",
    canvasBg: "bg-cyan-950",
    canvasColors: [[34, 211, 238]],
  },
  emerald: {
    strip: "bg-emerald-400",
    led: "bg-emerald-400",
    ledGlow: "shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]",
    label: "text-emerald-500 dark:text-emerald-400",
    canvasBg: "bg-emerald-950",
    canvasColors: [[52, 211, 153]],
  },
  violet: {
    strip: "bg-violet-400",
    led: "bg-violet-400",
    ledGlow: "shadow-[0_0_6px_2px_rgba(167,139,250,0.7)]",
    label: "text-violet-500 dark:text-violet-400",
    canvasBg: "bg-violet-950",
    canvasColors: [[167, 139, 250]],
  },
  amber: {
    strip: "bg-amber-400",
    led: "bg-amber-400",
    ledGlow: "shadow-[0_0_6px_2px_rgba(251,191,36,0.7)]",
    label: "text-amber-500 dark:text-amber-400",
    canvasBg: "bg-amber-950",
    canvasColors: [[251, 191, 36]],
  },
};

const PhaseCard = ({
  moduleId,
  title,
  description,
  color,
  status = "ACTIVE",
}: {
  moduleId: string;
  title: string;
  description: string;
  color: PhaseColor;
  status?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const c = colorMap[color];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden border border-black/[0.1] dark:border-white/[0.1]
        bg-[#ffffff] dark:bg-[#111111] h-[20rem] lg:h-[24rem] cursor-default
        transition-all duration-300 group"
    >
      {/* Colored top strip */}
      <div className={`absolute inset-x-0 top-0 h-[2px] ${c.strip} z-20`} />

      {/* Canvas reveal on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName={c.canvasBg}
              colors={c.canvasColors}
              dotSize={3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className={`font-mono text-[8px] uppercase tracking-[0.4em] ${c.label}`}>
            {moduleId}
          </span>
          {/* LED indicator */}
          <span className={`inline-block w-1.5 h-1.5 ${c.led} ${hovered ? c.ledGlow : ""} transition-shadow duration-300`} />
        </div>

        {/* Phase label */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/30 mb-2
            group-hover:text-white/40 transition-colors duration-300">
            PHASE // {moduleId.slice(-2)}
          </p>
          <h3
            className="font-bold uppercase leading-tight text-black dark:text-white mb-4
              group-hover:text-white transition-colors duration-300"
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
              letterSpacing: "0em",
            }}
          >
            {title}
          </h3>
          <p className="font-mono text-[10px] leading-relaxed text-black/50 dark:text-white/40
            group-hover:text-white/70 transition-colors duration-300 max-w-[22ch]">
            {description}
          </p>
        </div>

        {/* Footer status */}
        <div className="flex items-center gap-2 border-t border-black/[0.08] dark:border-white/[0.08]
          group-hover:border-white/[0.12] pt-3 transition-colors duration-300">
          <span className={`inline-block w-1 h-1 ${c.led}`} />
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/35 dark:text-white/30
            group-hover:text-white/50 transition-colors duration-300">
            STATUS: {status}
          </span>
        </div>
      </div>
    </div>
  );
};

const Approach = () => {
  return (
    <section
      className="w-full bg-[#ffffff] dark:bg-[#090909] transition-colors duration-500 py-16"
      id="approach"
    >
      <div className="max-w-[90vw] 2xl:max-w-[1400px] mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col items-center mb-12">
          {/* label tag */}
          <div className="flex items-center gap-2 border border-black/15 dark:border-white/15
            bg-[#ffffff] dark:bg-[#090909] px-4 py-1.5 mb-5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-black dark:bg-white"
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white">
              EXECUTION_PIPELINE
            </span>
          </div>

          <h2
            className="font-black uppercase leading-none text-black dark:text-white text-center"
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Approach
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
              4 Phase Protocol
            </span>
            <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
          </div>
        </div>

        {/* Phase cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.09] dark:bg-white/[0.09]">
          <PhaseCard
            moduleId="MODULE_01"
            title="Architecture"
            description="Scalable system design, database selection, and low-latency architectural planning."
            color="cyan"
          />
          <PhaseCard
            moduleId="MODULE_02"
            title="Development"
            description="High-performance gRPC/REST APIs, cloud infra, and distributed service integration."
            color="emerald"
          />
          <PhaseCard
            moduleId="MODULE_03"
            title="Optimization"
            description="Latency reduction, memory profiling, and stress testing for peak traffic reliability."
            color="violet"
          />
          <PhaseCard
            moduleId="MODULE_04"
            title="Deployment"
            description="CI/CD automation, Kubernetes orchestration, and proactive system monitoring."
            color="amber"
          />
        </div>
      </div>
    </section>
  );
};

export default Approach;
