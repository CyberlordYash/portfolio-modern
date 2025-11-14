"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvanRevealEffect";

const Approach = () => {
  return (
    <section className="py-1 w-full mx-auto mt-2 p-6 rounded-2xl bg-white dark:bg-black">
      <div className="my-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center">
        {/* PHASE 1 */}
        <Card
          title="System Design & Architecture"
          icon={<AceternityIcon order="Phase 1" />}
          description="I define core requirements, design scalable system architecture, choose databases, messaging queues, caching layers, and ensure low-latency, fault-tolerant design."
        >
          <CanvasRevealEffect
            animationSpeed={5.2}
            containerClassName="bg-blue-900"
          />
          <DotsBackground />
        </Card>

        {/* PHASE 2 */}
        <Card
          title="API Development & Infrastructure"
          icon={<AceternityIcon order="Phase 2" />}
          description="I build high-performance REST/gRPC APIs, set up database schemas, configure cloud environments, implement authentication, and integrate distributed services."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-800"
          />
          <DotsBackground />
        </Card>

        {/* PHASE 3 */}
        <Card
          title="Performance Optimization"
          icon={<AceternityIcon order="Phase 3" />}
          description="I optimize latency, memory usage, goroutine scheduling, caching strategy, load balancing, and run stress tests to ensure reliability under peak traffic."
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-purple-800"
          />
          <DotsBackground />
        </Card>

        {/* PHASE 4 */}
        <Card
          title="Deployment & Monitoring"
          icon={<AceternityIcon order="Phase 4" />}
          description="Finally, I set up CI/CD pipelines, deploy on cloud/Kubernetes, implement observability, logging, alerting, and ensure a smooth production rollout."
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-sky-700"
          />
          <DotsBackground />
        </Card>
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
      className="border border-black/10 dark:border-white/20 group/canvas-card flex items-center justify-center
      max-w-sm w-full mx-auto p-4 relative lg:h-[20rem] rounded-3xl overflow-hidden bg-white dark:bg-neutral-950"
    >
      {/* Corner Icons */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      {/* Hover Overlay */}
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

      {/* Content */}
      <div className="relative z-20">
        <div
          className="text-center group-hover/canvas-card:-translate-y-4 
        absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 
        group-hover/canvas-card:opacity-0 transition duration-200 w-full 
        mx-auto flex items-center justify-center"
        >
          {icon}
        </div>

        <h2
          className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 
        relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white 
        group-hover/canvas-card:-translate-y-2 transition duration-200 text-center text-2xl"
        >
          {title}
        </h2>

        <p
          className="text-sm dark:text-neutral-200 opacity-0 group-hover/canvas-card:opacity-100 
        relative z-10 mt-4 font-normal group-hover/canvas-card:text-white 
        group-hover/canvas-card:-translate-y-2 transition duration-200 text-center px-2"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const DotsBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.5)_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
);

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button
        className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-lg 
      hover:shadow-2xl hover:shadow-white/10 transition duration-200 
      border border-slate-600 font-bold"
      >
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <span className="relative z-20">{order}</span>
      </button>
    </div>
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
