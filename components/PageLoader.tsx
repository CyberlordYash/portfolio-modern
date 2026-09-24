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
        /* A colophon, not a splash: the name set small in the corner
           where the masthead is about to appear, and a rule that draws
           across the page while the fonts settle. */
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col justify-end bg-paper pb-14"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="shell">
            <motion.div
              className="rule rule-strong mb-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="flex items-baseline justify-between gap-4"
            >
              <span className="micro meta-ink">Yash Sachan</span>
              <span className="micro">Software Engineer</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
