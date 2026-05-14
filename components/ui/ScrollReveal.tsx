"use client";
import React from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Word-by-word staggered reveal: each word fades + slides up.
// No overflow:hidden wrapper — that prevents whileInView from firing.
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: "45%" }}
            whileInView={{ opacity: 1, y: "0%" }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.75, delay: delay + i * stagger, ease }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

// Character-by-character stagger for mono uppercase labels
export function RevealChars({
  text,
  className,
  delay = 0,
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.22, delay: delay + i * stagger, ease: "easeOut" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

// Horizontal line that draws from left to right on scroll enter
export function DrawLine({
  delay = 0,
  className = "h-px bg-black/20 dark:bg-white/20",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 0.9, delay, ease }}
    />
  );
}

// Simple fade + slide-up wrapper for content blocks
export function FadeReveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
