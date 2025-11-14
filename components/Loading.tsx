"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsStars } from "react-icons/bs";
import { EncryptedText } from "@/components/ui/encrypted-text";
import dynamic from "next/dynamic";
const loaderVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
};

const iconVariants = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      repeat: Infinity,
      duration: 1.8,
      ease: "easeInOut",
    },
  },
};

const Loading = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto flex max-w-lg items-center justify-center text-white">
      <EncryptedText flipDelayMs={18000} text="Yash Sachan" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Loading), { ssr: false });
