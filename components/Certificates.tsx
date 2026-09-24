"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import { Curtain, Rise } from "@/components/ui/Reveal";

import CertNism from "../public/nism-equity-derivatives.png";
import CertGo from "../public/go.jpg";
import CertWeb from "../public/web.jpg";
import CertDsa from "../public/dsa.jpg";
import CertNode from "../public/node.jpg";
import CertAws from "../public/aws.jpg";

/* ══════════════════════════════════════════════════════════════════
   CREDENTIALS

   Certificates shown, but presented rather than dumped.

   ── What made the first attempt look amateur ──
   It was `object-cover` on scans of six different shapes. Cover crops
   to fill, so each certificate was sliced differently — one lost its
   header, another its signature — and every scan's own white paper
   sat on the page's warm grey as a visible mismatched rectangle.
   Six inconsistent crops on six clashing grounds.

   ── The fix ──
   `object-contain` inside a fixed 4:3 frame on one shared tinted
   field. Nothing is cropped, every certificate is whole, and the
   letterboxing is identical on all six — so the differences between
   the scans stop reading as sloppiness and the row reads as a set.
   A hairline frame and generous inner padding do the rest: it looks
   like a document presented in a case, not a screenshot pasted in.

   Deliberately no hover-zoom on these. Scaling a document scan just
   makes it blurrier, and unlike a project screenshot there is no
   detail to invite anyone into.
══════════════════════════════════════════════════════════════════ */

type Cert = {
  num: string;
  title: string;
  issuer: string;
  category: string;
  year?: string;
  ref?: string;
  link?: string;
  image: StaticImageData;
};

function Card({ c, i }: { c: Cert; i: number }) {
  const body = (
    <>
      <Curtain delay={(i % 3) * 0.06}>
        <div className="border border-rule bg-paper2 p-3 md:p-4">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={c.image}
              alt={`${c.title} — certificate issued by ${c.issuer}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
              /* contain, never cover — see the header note */
              className="object-contain"
            />
          </div>
        </div>
      </Curtain>

      <Rise delay={0.08}>
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <span className="micro num">{c.num}</span>
          <span className="micro">{c.category}</span>
        </div>

        <h3 className="h3 mt-3 leading-snug">{c.title}</h3>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="micro">
            {c.issuer}
            {c.year && (
              <>
                <span className="px-2 opacity-40">·</span>
                <span className="num">{c.year}</span>
              </>
            )}
          </span>
          {c.link && (
            <span
              aria-hidden
              className="text-sm text-ink3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          )}
        </div>

        {c.ref && <p className="micro mt-2 opacity-60">{c.ref}</p>}
      </Rise>
    </>
  );

  // No verification URL → plain block. An <a> without an href is
  // focusable and leads nowhere.
  if (!c.link) return <div className="group">{body}</div>;

  return (
    <a
      href={c.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {body}
    </a>
  );
}

const Certificates = () => (
  <div>
    <Rise className="mb-10 flex items-baseline justify-between gap-4">
      <span className="micro">Certifications</span>
      <span className="micro num">{certs.length} total</span>
    </Rise>

    <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {certs.map((c, i) => (
        <li key={c.num}>
          <Card c={c} i={i} />
        </li>
      ))}
    </ul>
  </div>
);

/* Years only where they are legible on the certificate itself — an
   approximate date on a credentials page is worse than none. */
const certs: Cert[] = [
  {
    // First: the only regulator-issued credential, and the only one
    // directly relevant to the trading systems work.
    num: "01",
    title: "Equity Derivatives — NISM Series VIII",
    issuer: "NISM",
    category: "Securities markets",
    year: "2026",
    image: CertNism,
  },
  {
    num: "02",
    title: "Multithreading with Go",
    issuer: "Udemy",
    category: "Concurrency",
    year: "2026",
    ref: "UC-711CED98",
    link: "https://www.udemy.com/certificate/UC-711ced98-8cc0-4890-b170-370d51230530/",
    image: CertGo,
  },
  {
    num: "03",
    title: "Web Development Bootcamp",
    issuer: "Udemy",
    category: "Fullstack",
    year: "2024",
    ref: "UC-AA9D5A25",
    link: "https://www.udemy.com/certificate/UC-aa9d5a25-078e-4695-8145-09cd3ea1caea/",
    image: CertWeb,
  },
  {
    num: "04",
    title: "Data Structures & Algorithms",
    issuer: "Udemy",
    category: "Algorithms",
    ref: "UC-4E3ACD8C",
    link: "https://www.udemy.com/certificate/UC-4e3acd8c-5690-4074-90cf-c602419371d9/",
    image: CertDsa,
  },
  {
    num: "05",
    title: "Backend Engineering with Node.js",
    issuer: "Udemy",
    category: "Backend",
    ref: "UC-E1548ADE",
    link: "https://www.udemy.com/certificate/UC-e1548ade-aca5-40b4-a66c-d17e7230dbcc/",
    image: CertNode,
  },
  {
    num: "06",
    title: "AWS Cloud Practitioner",
    issuer: "AWS Credly",
    category: "Cloud",
    ref: "CREDLY-6886E2D2",
    link: "https://www.credly.com/badges/6886e2d2-89d9-4d4d-9a77-717c94f1fcdc/linked_in?t=rxjfrq",
    image: CertAws,
  },
];

export default Certificates;
