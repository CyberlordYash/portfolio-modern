"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mask, Rise } from "@/components/ui/Reveal";
import ContactForm from "@/components/ContactForm";

/* ══════════════════════════════════════════════════════════════════
   CONTACT / FOOTER

   The closing screen, and the largest type on the site after the hero
   word. A contact section that whispers is a contact section nobody
   uses, so the email is the whole composition: set at display scale,
   clickable, with copy-to-clipboard beside it.

   Below it, the coordinates a recruiter actually needs — role,
   location, timezone, response time — and the outbound links.
══════════════════════════════════════════════════════════════════ */

const EMAIL = "yashsachan321@gmail.com";

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard is unavailable over plain HTTP and in some embedded
      // webviews. The mailto: link beside this still works, so failing
      // quietly is better than an error the visitor can't act on.
    }
  };

  return (
    <footer className="shell py-24 md:py-36">
      <Rise>
        <div className="flex items-center gap-3">
          <span className="sec-num">07</span>
          <span className="micro">— Contact</span>
        </div>
      </Rise>

      {/* ══ The ask ═══════════════════════════════════════════════ */}
      <div className="mt-12 md:mt-16">
        <h2 className="display" style={{ fontSize: "var(--t-h1)" }}>
          <Mask>Got something that needs</Mask>
          <Mask delay={0.07}>
            <span className="ink-italic">to stay up?</span>
          </Mask>
        </h2>

        <Rise delay={0.18}>
          <p className="copy mt-8 max-w-[46ch] text-[1.05rem]">
            I&apos;m open to backend and infrastructure roles, and happy to
            talk through anything involving latency, throughput, or systems
            that have outgrown their original design.
          </p>
        </Rise>
      </div>

      {/* ══ Form ══════════════════════════════════════════════════
          A second way in, not a replacement for the email link below
          it — some visitors would rather type a message right here
          than open their mail client. Delivered through Netlify
          Forms; see components/ContactForm.tsx for how. */}
      <div className="mt-14 md:mt-16">
        <ContactForm />
      </div>

      {/* ══ Email ═════════════════════════════════════════════════
          Sized in vw so it runs near the full measure — the single
          biggest element in the footer, because it is the only thing
          in it with an action attached. */}
      <div className="mt-16 border-y border-rule py-10 md:mt-20 md:py-14">
        <Rise>
          <a
            href={`mailto:${EMAIL}`}
            className="display-wide group block text-ink"
            style={{ fontSize: "clamp(1.35rem, 6.2vw, 6rem)" }}
          >
            <span className="relative inline-block">
              {EMAIL}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            </span>
          </a>
        </Rise>

        <Rise delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <button
              type="button"
              onClick={copyEmail}
              className="elink micro text-ink"
              aria-live="polite"
            >
              {copied ? "Copied ✓" : "Copy address"}
            </button>
            <a
              href="https://www.linkedin.com/in/yashsachan321/"
              target="_blank"
              rel="noopener noreferrer"
              className="elink micro text-ink"
            >
              Message on LinkedIn ↗
            </a>
          </div>
        </Rise>
      </div>

      {/* ══ Coordinates ═══════════════════════════════════════════ */}
      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        {COORDINATES.map((c, i) => (
          <Rise key={c.label} delay={i * 0.05}>
            <dt className="micro">{c.label}</dt>
            <dd className="mt-2 text-sm leading-snug text-ink">{c.value}</dd>
          </Rise>
        ))}
      </div>

      {/* ══ The rest of the site ══════════════════════════════════
          These three pages had no inbound link anywhere — reachable
          only by typing the URL. The footer is where site-level
          navigation belongs, and it keeps the masthead down to the
          five sections of this page. */}
      <div className="mt-16 border-t border-rule pt-6">
        <Rise>
          <span className="micro">Elsewhere on this site</span>
        </Rise>

        <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
          {PAGES.map((p, i) => (
            <Rise key={p.href} delay={i * 0.05} as="li">
              <Link href={p.href} className="group flex items-baseline gap-3">
                <span className="elink h3 text-ink">{p.label}</span>
                <span className="micro">{p.note}</span>
              </Link>
            </Rise>
          ))}
        </ul>
      </div>

      {/* ══ Colophon ══════════════════════════════════════════════ */}
      <div className="mt-20 flex flex-col gap-6 border-t border-rule pt-6 md:flex-row md:items-baseline md:justify-between">
        <span className="micro">
          © {new Date().getFullYear()} Yash Sachan
        </span>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="elink micro text-ink"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <span className="micro">Built with Next.js — no template</span>
      </div>
    </footer>
  );
};

const PAGES = [
  { label: "Writing", href: "/blogs", note: "Public" },
  { label: "Worklog", href: "/worklog", note: "Private" },
  { label: "Gym", href: "/gym", note: "Private" },
];

const COORDINATES = [
  { label: "Role", value: "Software Engineer, Zanskar Securities" },
  { label: "Location", value: "Bengaluru, India" },
  { label: "Timezone", value: "IST · UTC +5:30" },
  { label: "Response", value: "Within 24 hours" },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/CyberlordYash" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yashsachan321/" },
  { label: "LeetCode", href: "https://leetcode.com/u/yashsachan/" },
  { label: "CodeChef", href: "https://www.codechef.com/users/cyberlordyash" },
];

export default Footer;
