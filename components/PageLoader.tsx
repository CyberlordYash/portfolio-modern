"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exit = () => setTimeout(() => setVisible(false), 800);

    const fallback = setTimeout(() => setVisible(false), 4000);

    if (document.readyState === "complete") {
      exit();
      clearTimeout(fallback);
    } else {
      window.addEventListener("load", () => { exit(); clearTimeout(fallback); }, { once: true });
    }

    return () => clearTimeout(fallback);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            style={{ fontFamily: "var(--font-quicksand, 'Quicksand', sans-serif)" }}
            className="text-white text-2xl sm:text-3xl font-light tracking-wide"
          >
            Hi, Welcome
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
