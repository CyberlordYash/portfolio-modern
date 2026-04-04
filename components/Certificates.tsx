"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Tabs } from "./ui/Tab";
import { IconCertificate, IconExternalLink, IconCheck } from "@tabler/icons-react";

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

/* ── Per-cert visual identity ── */
const certMeta = {
  web: {
    cardGrad: "from-[#080420] via-[#110835] to-[#060318]",
    blob1: "bg-violet-500/35",
    blob2: "bg-indigo-400/25",
    badge: "from-violet-500 to-indigo-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.3),0_20px_80px_rgba(139,92,246,0.3)]",
    border: "border-violet-500/20",
    topLine: "via-violet-400/60",
    platform: "Udemy",
    platformColor: "from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-300",
    tabGrad: "from-violet-500 to-indigo-500",
    tabGlow: "shadow-violet-500/30",
  },
  dsa: {
    cardGrad: "from-[#020c28] via-[#051840] to-[#020a1c]",
    blob1: "bg-cyan-500/35",
    blob2: "bg-blue-400/25",
    badge: "from-cyan-500 to-blue-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(6,182,212,0.3),0_20px_80px_rgba(6,182,212,0.3)]",
    border: "border-cyan-500/20",
    topLine: "via-cyan-400/60",
    platform: "Udemy",
    platformColor: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
    tabGrad: "from-cyan-500 to-blue-500",
    tabGlow: "shadow-cyan-500/30",
  },
  node: {
    cardGrad: "from-[#021a0c] via-[#052a14] to-[#020f08]",
    blob1: "bg-emerald-500/35",
    blob2: "bg-teal-400/25",
    badge: "from-emerald-500 to-teal-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_20px_80px_rgba(16,185,129,0.3)]",
    border: "border-emerald-500/20",
    topLine: "via-emerald-400/60",
    platform: "Udemy",
    platformColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
    tabGrad: "from-emerald-500 to-teal-500",
    tabGlow: "shadow-emerald-500/30",
  },
  aws: {
    cardGrad: "from-[#1c0e00] via-[#2a1500] to-[#120900]",
    blob1: "bg-amber-500/35",
    blob2: "bg-orange-400/25",
    badge: "from-amber-500 to-orange-500",
    glow: "hover:shadow-[0_0_0_1px_rgba(245,158,11,0.3),0_20px_80px_rgba(245,158,11,0.3)]",
    border: "border-amber-500/20",
    topLine: "via-amber-400/60",
    platform: "AWS Credly",
    platformColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
    tabGrad: "from-amber-500 to-orange-500",
    tabGlow: "shadow-amber-500/30",
  },
};

/* ── Certificate card ── */
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
      className={`group w-full h-full overflow-hidden relative rounded-[2.5rem] bg-gradient-to-br ${m.cardGrad} border ${m.border} transition-all duration-500 ${m.glow} flex flex-col`}
    >
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent ${m.topLine} to-transparent`}
      />

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
        style={{ fontSize: "150px" }}
      >
        {num}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between p-7 md:p-10 pb-0">
        <div className="flex flex-col gap-3">
          {/* Verified badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-1.5 backdrop-blur-sm w-fit">
            <div className={`flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r ${m.badge}`}>
              <IconCheck size={9} className="text-white" stroke={3} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/50">
              Verified Certificate
            </span>
          </div>

          {/* Platform badge */}
          <span
            className={`inline-flex w-fit rounded-full border bg-gradient-to-r ${m.platformColor} px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm`}
          >
            {m.platform}
          </span>

          {/* Title */}
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 mb-1">
              Cert_{num}
            </p>
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight md:text-3xl">
              {title}
            </h3>
          </div>
        </div>

        {/* External link */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-shrink-0 ml-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r ${m.badge} px-4 py-2.5 font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        >
          <IconExternalLink size={13} />
          View
        </a>
      </div>

      {/* Certificate image */}
      <div className="relative z-10 flex flex-1 items-end justify-center px-7 pt-6 md:px-10">
        <div className="relative w-full">
          {/* Glow under image */}
          <div
            className={`absolute inset-x-4 -bottom-2 h-16 rounded-t-2xl bg-gradient-to-r ${m.badge} opacity-20 blur-xl`}
          />
          <Image
            src={image}
            alt={title}
            width={1000}
            height={700}
            className="relative w-full rounded-t-2xl object-cover object-top shadow-[0_-24px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ maxHeight: "55%" }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Section ── */
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
      className="relative w-full overflow-hidden py-20 bg-white dark:bg-[#020617] transition-colors duration-500 md:py-32"
    >
      {/* Atmospheric blobs */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/[0.07] to-transparent blur-[140px] dark:from-indigo-600/[0.12]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-cyan-600/[0.07] to-transparent blur-[140px] dark:from-cyan-600/[0.12]" />

      <div className="relative mx-auto max-w-[85vw] px-4 2xl:max-w-[1400px]">

        {/* ── Section Header ── */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                Verified Credentials
              </span>
              <div className="h-[2px] w-5 rounded-full bg-gradient-to-r from-yellow-400 to-transparent" />
            </div>

            <h2
              className="font-black tracking-tight leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            >
              <span className="bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-300 dark:to-yellow-300">
                Certificates
              </span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Proof of skills, backed by real coursework
            </p>
          </div>

          {/* Count badge */}
          <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/8 to-orange-500/8 px-4 py-2 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            </span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {tabs.length} certificates
            </span>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
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
            tabClassName="m-1 px-5 py-2.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-200 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 dark:text-white/50 dark:border-white/[0.07] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:hover:text-white/90"
            activeTabClassName="!bg-slate-800 !text-white dark:!bg-white/15 dark:!text-white"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Certificates;
