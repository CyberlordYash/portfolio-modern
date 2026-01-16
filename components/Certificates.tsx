"use client";

import Image from "next/image";
import React from "react";
import { Tabs } from "./ui/Tab";
import { IconCertificate, IconExternalLink } from "@tabler/icons-react";

// Import your certificates
import Certificate1 from "../public/web.jpg";
import Certificate2 from "../public/dsa.jpg";
import Certificate3 from "../public/node.jpg";
import Certificate4 from "../public/aws.jpg";

const Certificates = () => {
  const tabs = [
    {
      title: "Web Dev",
      value: "web dev",
      content: (
        <TabContent
          title="Web Development Bootcamp"
          link="https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/"
          image={Certificate1}
          gradient="from-slate-900 via-indigo-950 to-slate-900"
        />
      ),
    },
    {
      title: "DSA C++",
      value: "services",
      content: (
        <TabContent
          title="Data Structures & Algorithms"
          link="https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/"
          image={Certificate2}
          gradient="from-slate-900 via-blue-950 to-slate-900"
        />
      ),
    },
    {
      title: "Node js",
      value: "node js",
      content: (
        <TabContent
          title="Backend Engineering with Node.js"
          link="https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/"
          image={Certificate3}
          gradient="from-slate-900 via-emerald-950 to-slate-900"
        />
      ),
    },
    {
      title: "AWS",
      value: "aws",
      content: (
        <TabContent
          title="AWS Cloud Practitioner"
          link="https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq"
          image={Certificate4}
          gradient="from-slate-900 via-orange-950 to-slate-900"
        />
      ),
    },
  ];

  return (
    <div
      className="py-20 w-full bg-white dark:bg-[#020617] transition-colors duration-500"
      id="certificates"
    >
      <div className="max-w-[85vw] 2xl:max-w-[1400px] mx-auto px-4">
        {/* Consistent Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Verified_Credentials
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter">
            Certi
            <span className="text-indigo-600 dark:text-indigo-500">
              ficates
            </span>
          </h2>
        </div>

        <div className="h-[30rem] md:h-[45rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start my-10">
          <Tabs
            tabs={tabs}
            containerClassName="mb-10"
            tabClassName="dark:bg-slate-900 border border-slate-200 dark:border-white/10"
            activeTabClassName="bg-indigo-600 dark:bg-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Tab Content Component for cleaner code
const TabContent = ({ title, link, image, gradient }: any) => {
  return (
    <div
      className={`w-full overflow-hidden relative h-full rounded-[2.5rem] p-8 md:p-12 text-white bg-gradient-to-br ${gradient} border border-white/10 shadow-2xl`}
    >
      <div className="flex justify-between items-start relative z-20">
        <div>
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <IconCertificate size={18} />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Official_Verify
            </span>
          </div>
          <p className="text-2xl md:text-4xl font-bold tracking-tight">
            {title}
          </p>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
        >
          <IconExternalLink size={24} />
        </a>
      </div>

      <div className="relative mt-12 h-full w-full">
        <Image
          src={image}
          alt={title}
          width={1000}
          height={1000}
          className="object-cover object-top h-[70%] md:h-[85%] w-[95%] rounded-t-2xl mx-auto shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    </div>
  );
};

export default Certificates;
