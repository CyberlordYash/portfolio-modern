"use client";

import React from "react";
import Link from "next/link";
import { Mask, Rise } from "@/components/ui/Reveal";

export const FIELD =
  "w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-ink outline-none transition-colors placeholder:text-ink3 focus:border-ink";

export const SOLID =
  "inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";

export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-5">
      <Link href="/" className="elink micro text-ink">
        ← Portfolio
      </Link>
      {children}
    </div>
  );
}

export function PageHead({
  mark,
  label,
  line1,
  line2,
  meta,
  intro,
}: {
  mark: string;
  label: string;
  line1: string;
  line2: string;
  meta?: React.ReactNode;
  intro?: string;
}) {
  return (
    <header className="pb-16 pt-20 md:pb-24 md:pt-32">
      <Rise>
        <div className="flex items-center gap-3">
          <span className="sec-num">{mark}</span>
          <span className="micro">— {label}</span>
        </div>
      </Rise>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <h1 className="display" style={{ fontSize: "var(--t-h1)" }}>
          <Mask delay={0.05}>{line1}</Mask>
          <Mask delay={0.14}>
            <span className="ink-italic">{line2}</span>
          </Mask>
        </h1>
        {meta && (
          <Rise delay={0.2} className="flex flex-col items-start gap-2 md:items-end">
            {meta}
          </Rise>
        )}
      </div>

      {intro && (
        <Rise delay={0.26}>
          <p className="copy mt-10">{intro}</p>
        </Rise>
      )}
    </header>
  );
}

export function PageFoot({ label }: { label: string }) {
  return (
    <div className="mt-20 flex items-baseline justify-between gap-4 border-t border-rule pt-5">
      <span className="micro">Yash Sachan · {label}</span>
      <Link href="/" className="elink micro text-ink">
        Back to portfolio ↗
      </Link>
    </div>
  );
}

export function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="micro" style={{ color: "var(--mark)" }}>
      {children}
    </p>
  );
}
