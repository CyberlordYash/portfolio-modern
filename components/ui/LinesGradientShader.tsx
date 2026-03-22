"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

type LinesGradientShaderProps = {
  className?: string;
  lineColor?: string;
  accentColor?: string;
  secondaryAccentColor?: string;
  lineCount?: number;
  showBackdrop?: boolean;
  children?: React.ReactNode;
};

const defaultLinePath =
  "M650 18C590 28 545 82 492 106C430 136 378 82 322 114C256 152 214 242 142 284C84 318 40 372 -18 408";

export function LinesGradientShader({
  className,
  lineColor = "rgba(148, 163, 184, 0.18)",
  accentColor = "rgba(59, 130, 246, 0.28)",
  secondaryAccentColor = "rgba(34, 211, 238, 0.2)",
  lineCount = 14,
  showBackdrop = true,
  children,
}: LinesGradientShaderProps) {
  const lines = Array.from({ length: lineCount }, (_, index) => ({
    id: index,
    yOffset: index * 28,
    opacity: 0.92 + (index % 2) * 0.08,
    duration: 8 + (index % 5) * 1.6,
    delay: index * 0.22,
    scale: 0.92 + (index % 3) * 0.05,
  }));

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem]",
        showBackdrop ? "border border-white/10 bg-slate-950" : "bg-transparent",
        className,
      )}
    >
      {showBackdrop ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 20%, ${accentColor}, transparent 28%),
              radial-gradient(circle at 80% 30%, ${secondaryAccentColor}, transparent 26%),
              linear-gradient(180deg, rgba(15, 23, 42, 0.25), rgba(2, 6, 23, 0.88))
            `,
          }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 opacity-100">
        <svg
          viewBox="0 0 640 420"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lines-gradient-shader-stroke" x1="0%" x2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="20%" stopColor={lineColor} />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="80%" stopColor={lineColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="lines-gradient-shader-glow" x1="0%" x2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="45%" stopColor={accentColor} />
              <stop offset="70%" stopColor={secondaryAccentColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="lines-gradient-shader-blur">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {lines.map((line) => (
            <motion.g
              key={line.id}
              initial={{ x: 20, opacity: line.opacity }}
              animate={{
                x: [0, -18, 0],
                opacity: [line.opacity, 1, line.opacity],
              }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: line.delay,
              }}
              transform={`translate(0 ${line.yOffset}) scale(${line.scale} 1)`}
            >
              <path
                d={defaultLinePath}
                stroke="url(#lines-gradient-shader-glow)"
                strokeWidth="20"
                filter="url(#lines-gradient-shader-blur)"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={defaultLinePath}
                stroke="url(#lines-gradient-shader-stroke)"
                strokeWidth="3.6"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>
          ))}
        </svg>
      </div>

      {showBackdrop ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.45)_60%,rgba(2,6,23,0.8))]" />
      ) : null}

      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

export default LinesGradientShader;
