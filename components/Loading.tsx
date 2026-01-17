"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { IconTerminal2 } from "@tabler/icons-react";
import dynamic from "next/dynamic";

const BOOT_LOGS = [
  "Initializing core_kernel...",
  "Establishing secure_handshake...",
  "Loading architectural_assets...",
  "Checking production_logs...",
  "System Status: OPTIMAL",
];

const Loading = () => {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (logIndex < BOOT_LOGS.length) {
      const timeout = setTimeout(() => {
        setLogIndex((prev) => prev + 1);
      }, 250); // Speed of the boot logs
      return () => clearTimeout(timeout);
    }
  }, [logIndex]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono">
      <div className="w-full max-w-sm px-6">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
          <IconTerminal2 size={18} className="text-blue-500" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            System Boot Sequence
          </span>
        </div>

        {/* Boot Logs */}
        <div className="space-y-1 mb-8 h-24">
          {BOOT_LOGS.slice(0, logIndex).map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[12px] text-emerald-500/80"
            >
              <span className="text-neutral-600 mr-2">[{i}]</span>
              {log}
            </motion.div>
          ))}
        </div>

        {/* Brand Reveal */}
        <AnimatePresence>
          {logIndex >= BOOT_LOGS.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/10 pt-4"
            >
              <div className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Root Operator:
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                <EncryptedText text="YASH SACHAN" />
              </div>

              {/* Subtle Loading Bar */}
              <div className="mt-6 h-[2px] w-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-full w-full bg-blue-600"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Loading), { ssr: false });
