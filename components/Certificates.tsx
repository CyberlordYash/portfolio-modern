"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Tabs } from "./ui/Tab";
import { IconExternalLink, IconCheck } from "@tabler/icons-react";

import Certificate1 from "../public/web.jpg";
import Certificate2 from "../public/dsa.jpg";
import Certificate3 from "../public/node.jpg";
import Certificate4 from "../public/aws.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const certMeta = {
  web: {
    cardGrad: "from-[#080420] via-[#110835] to-[#060318]",
    blob1: "bg-violet-500/35",
    blob2: "bg-indigo-400/25",
    badge: "from-violet-500 to-indigo-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_20px_80px_rgba(139,92,246,0.3)]",
    border: "border-violet-500/20",
    topLine: "via-violet-400/60",
    topStrip: "bg-violet-400",
    platform: "Udemy",
    platformColor: "from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-300",
    tabGrad: "from-violet-500 to-indigo-500",
    tabGlow: "shadow-violet-500/30",
    moduleLabel: "text-violet-400",
    scanColor: "rgba(167,139,250,0.08)",
  },
  dsa: {
    cardGrad: "from-[#020c28] via-[#051840] to-[#020a1c]",
    blob1: "bg-cyan-500/35",
    blob2: "bg-blue-400/25",
    badge: "from-cyan-500 to-blue-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(6,182,212,0.3),0_20px_80px_rgba(6,182,212,0.3)]",
    border: "border-cyan-500/20",
    topLine: "via-cyan-400/60",
    topStrip: "bg-cyan-400",
    platform: "Udemy",
    platformColor: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
    tabGrad: "from-cyan-500 to-blue-500",
    tabGlow: "shadow-cyan-500/30",
    moduleLabel: "text-cyan-400",
    scanColor: "rgba(34,211,238,0.08)",
  },
  node: {
    cardGrad: "from-[#021a0c] via-[#052a14] to-[#020f08]",
    blob1: "bg-emerald-500/35",
    blob2: "bg-teal-400/25",
    badge: "from-emerald-500 to-teal-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_20px_80px_rgba(16,185,129,0.3)]",
    border: "border-emerald-500/20",
    topLine: "via-emerald-400/60",
    topStrip: "bg-emerald-400",
    platform: "Udemy",
    platformColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
    tabGrad: "from-emerald-500 to-teal-500",
    tabGlow: "shadow-emerald-500/30",
    moduleLabel: "text-emerald-400",
    scanColor: "rgba(52,211,153,0.08)",
  },
  aws: {
    cardGrad: "from-[#1c0e00] via-[#2a1500] to-[#120900]",
    blob1: "bg-amber-500/35",
    blob2: "bg-orange-400/25",
    badge: "from-amber-500 to-orange-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(245,158,11,0.3),0_20px_80px_rgba(245,158,11,0.3)]",
    border: "border-amber-500/20",
    topLine: "via-amber-400/60",
    topStrip: "bg-amber-400",
    platform: "AWS Credly",
    platformColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
    tabGrad: "from-amber-500 to-orange-500",
    tabGlow: "shadow-amber-500/30",
    moduleLabel: "text-amber-400",
    scanColor: "rgba(251,191,36,0.08)",
  },
};

const CertCard = ({
  title,
  link,
  image,
  metaKey,
  num,
}: {
  title: string;
  link: string;
  image: any;
  metaKey: keyof typeof certMeta;
  num: string;
}) => {
  const m = certMeta[metaKey];
  return (
    <div
      className={`group w-full h-full overflow-hidden relative rounded-none bg-gradient-to-br ${m.cardGrad} border ${m.border} transition-all duration-500 ${m.glow} flex flex-col`}
    >
      {/* Colored top strip — 2px editorial */}
      <div className={`absolute inset-x-0 top-0 z-30 h-[2px] ${m.topStrip}`} />

      {/* Scan line overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        style={{ mixBlendMode: "screen" }}
      >
        <style>{`
          @keyframes certScan_${metaKey} {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
        `}</style>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "60px",
            background: `linear-gradient(to bottom, transparent, ${m.scanColor}, transparent)`,
            animation: `certScan_${metaKey} 4s linear infinite`,
          }}
        />
      </div>

      {/* Ambient blobs */}
      <div
        className={`pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full blur-[100px] ${m.blob1} transition-all duration-700 group-hover:scale-125`}
      />
      <div
        className={`pointer-events-none absolute -bottom-16 right-16 h-56 w-56 rounded-full blur-[80px] ${m.blob2} transition-all duration-700 group-hover:scale-110`}
      />

      {/* Large number watermark */}
      <div
        className="pointer-events-none absolute bottom-4 right-6 select-none font-black leading-none text-white/[0.04]"
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "150px" }}
      >
        {num}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between p-7 md:p-10 pb-0">
        <div className="flex flex-col gap-3">
          {/* Module label */}
          <span className={`font-mono text-[8px] uppercase tracking-[0.4em] ${m.moduleLabel}`}>
            {`CERT_${num} // VERIFIED`}
          </span>

          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm w-fit">
            <div className={`flex h-4 w-4 items-center justify-center bg-gradient-to-r ${m.badge}`}>
              <IconCheck size={9} className="text-white" stroke={3} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/50">
              Verified Certificate
            </span>
          </div>

          {/* Platform badge */}
          <span
            className={`inline-flex w-fit border bg-gradient-to-r ${m.platformColor} px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm`}
          >
            {m.platform}
          </span>

          {/* Title */}
          <div>
            <h3
              className="font-black uppercase leading-tight text-white"
              style={{
                fontFamily: "var(--font-orbitron)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* External link */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-shrink-0 ml-4 flex items-center gap-1.5 bg-gradient-to-r ${m.badge} px-4 py-2.5 font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        >
          <IconExternalLink size={13} />
          View
        </a>
      </div>

      {/* Certificate image */}
      <div className="relative z-10 flex flex-1 items-end justify-center px-7 pt-6 md:px-10">
        <div className="relative w-full">
          <div
            className={`absolute inset-x-4 -bottom-2 h-16 bg-gradient-to-r ${m.badge} opacity-20 blur-xl`}
          />
          <Image
            src={image}
            alt={title}
            width={1000}
            height={700}
            className="relative w-full object-cover object-top shadow-[0_-24px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ maxHeight: "55%" }}
          />
        </div>
      </div>
    </div>
  );
};

const Certificates = () => {
  const tabs = [
    {
      title: "Web Dev",
      value: "web",
      content: (
        <CertCard
          title="Web Development Bootcamp"
          link="https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/"
          image={Certificate1}
          metaKey="web"
          num="01"
        />
      ),
    },
    {
      title: "DSA C++",
      value: "dsa",
      content: (
        <CertCard
          title="Data Structures & Algorithms"
          link="https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/"
          image={Certificate2}
          metaKey="dsa"
          num="02"
        />
      ),
    },
    {
      title: "Node.js",
      value: "node",
      content: (
        <CertCard
          title="Backend Engineering with Node.js"
          link="https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/"
          image={Certificate3}
          metaKey="node"
          num="03"
        />
      ),
    },
    {
      title: "AWS",
      value: "aws",
      content: (
        <CertCard
          title="AWS Cloud Practitioner"
          link="https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq"
          image={Certificate4}
          metaKey="aws"
          num="04"
        />
      ),
    },
  ];

  return (
    <section
      id="certificates"
      className="relative w-full overflow-hidden py-16 bg-[#ffffff] dark:bg-[#090909] transition-colors duration-500 md:py-24"
    >
      <div className="relative mx-auto max-w-[90vw] px-4 2xl:max-w-[1400px]">

        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 border border-black/15 dark:border-white/15
            bg-[#ffffff] dark:bg-[#090909] px-4 py-1.5 mb-5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-black dark:bg-white"
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-black dark:text-white">
              CREDENTIALS_VAULT
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
            Certificates
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/45 dark:text-white/45">
              {tabs.length} Verified Records
            </span>
            <div className="h-px w-12 bg-black/20 dark:bg-white/20" />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-[34rem] md:h-[48rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start"
        >
          <Tabs
            tabs={tabs}
            containerClassName="mb-6 gap-1 flex-wrap"
            tabClassName="m-1 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.3em]
              text-black/50 border border-black/15 bg-transparent
              hover:border-black/40 hover:text-black hover:bg-black/[0.04]
              transition-all duration-200
              dark:text-white/40 dark:border-white/[0.1] dark:bg-transparent
              dark:hover:border-white/30 dark:hover:text-white dark:hover:bg-white/[0.06]"
            activeTabClassName="!border-black !text-black !bg-black/[0.07] dark:!border-white dark:!text-white dark:!bg-white/[0.1]"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Certificates;
