"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsStars } from "react-icons/bs";

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
    <AnimatePresence>
      {show && (
        <motion.div
          variants={loaderVariants}
          initial="initial"
          animate="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300"
        >
          {/* Glowing icon */}
          <motion.div
            variants={iconVariants}
            animate="pulse"
            className="p-5 rounded-full bg-blue-100 dark:bg-blue-900/30 shadow-xl"
          >
            <BsStars className="text-blue-600 dark:text-blue-300 w-10 h-10" />
          </motion.div>

          {/* Fading text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-sm font-mono text-gray-500 dark:text-gray-400 animate-pulse"
          >
            Loading portfolio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
