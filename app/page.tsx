"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/utils/cn";

import Approach from "@/components/Approach";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Skills from "@/components/Skills";
import TerminalSnake from "./TerminalSnake";
import { Mask, Rise, EASE } from "@/components/ui/Reveal";

const SkillsGraph = dynamic(() => import("./SkillsGraph"), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
   Gone from this file: the fixed WebGL market world, the parametric
   SVG HUD frame with its notch geometry and scroll-traced stroke, the
   altitude telemetry readout, the solar theme dial, the full-viewport
   dot grid, and the inner `overflow-y: auto` scroll container.

   That last removal is the one that mattered most — putting the page
   back on native document scroll is what allows Lenis to drive it,
   and Lenis is most of the "polish" in this pass.

   What structures the page now is the tone rhythm: full-bleed blocks
   that alternate light and dark ground. Grouped rather than striped —
   six blocks across nine sections — so it reads as chapters instead
   of a zebra.
══════════════════════════════════════════════════════════════════ */

const MASTHEAD_H = 60;

/* ── Chrome colours, resolved in JS ────────────────────────────────
   The nav is the one element on the page that must be legible at
   every scroll position, so it does not go through the CSS token
   chain the sections use. That chain has two failure modes the rest
   of the page can absorb and the nav cannot: `text-accent` compiles
   to `hsl(var(--accent))` because shadcn's base layer owns `--accent`
   and expects HSL, which makes it an invalid colour; and the derived
   `--ink-*` steps only re-resolve inside a `[data-tone]` container,
   so any ordering surprise leaves the header reading stale values.

   Concrete hex, switched off the observed tone, has neither problem. */
const CHROME = {
  light: { fg: "#0B0B0C", dim: "rgba(11,11,12,0.52)", mark: "#1A32FF" },
  dark: { fg: "#F1F1F2", dim: "rgba(241,241,242,0.55)", mark: "#687CFF" },
} as const;

const links = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function go(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
}

/* Which nav entry is current, and what tone is passing under the
   masthead. Two observers, because they answer different questions:
   the first wants the section occupying the middle of the screen, the
   second wants whatever is directly beneath a 60px-tall fixed bar. */
function usePageState() {
  const [active, setActive] = useState("");
  const [tone, setTone] = useState<"light" | "dark">("light");
  /* The element currently under the masthead — tracked as a *node*,
     not as a tone value. See the MutationObserver below for why. */
  const [toneEl, setToneEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Threshold detection never fires for sections taller than the
    // viewport, so the band is defined by rootMargin instead.
    const activeObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.href.slice(1));
      if (el) activeObs.observe(el);
    });

    /* A thin band pinned just under the masthead. Whichever tone block
       crosses it owns the masthead's colours.

       Observes `[data-tone-block]`, NOT `[data-tone]` — the masthead
       and the mobile index both carry `data-tone` themselves (that is
       how they get their own palette), so querying the bare attribute
       made the nav an input to the detector that decides the nav's
       colour. Marking the page's tone containers with a separate
       attribute keeps the chrome out of its own measurement. */
    const toneObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setToneEl(e.target as HTMLElement);
        }),
      { threshold: 0, rootMargin: `-${MASTHEAD_H}px 0px -92% 0px` },
    );
    document
      .querySelectorAll("[data-tone-block]")
      .forEach((el) => toneObs.observe(el));

    return () => {
      activeObs.disconnect();
      toneObs.disconnect();
    };
  }, []);

  /* ── Why this is not just read in the observer above ──────────────
     Intersection callbacks fire when intersection *changes*. The hero
     is a 240vh track whose tone flips from light to dark partway down
     — and it stays under the masthead the entire time it does so. No
     intersection boundary is crossed, so no callback fires, and the
     masthead kept whatever tone it last happened to read. Scrolling
     down turned it white and scrolling back up left it white, because
     nothing ever told it otherwise.

     So the observer now records *which node* owns the masthead, and a
     MutationObserver watches that node's `data-tone` for changes. The
     two answer different questions: which region, and what tone. */
  useEffect(() => {
    if (!toneEl) return;

    const read = () => {
      const t = toneEl.dataset.tone;
      if (t === "dark" || t === "light") setTone(t);
    };

    read(); // the region may already be mid-flip when it takes over
    const mo = new MutationObserver(read);
    mo.observe(toneEl, { attributes: true, attributeFilter: ["data-tone"] });
    return () => mo.disconnect();
  }, [toneEl]);

  return { active, tone };
}

/* ── Masthead ──────────────────────────────────────────────────────
   Transparent, so the tone blocks read as full-bleed and nothing is
   clipped behind a bar. Its colours are driven from the observer
   rather than `mix-blend-mode: difference`: blending would invert the
   accent underline into an arbitrary colour, and it fails silently
   (white on white) the moment an ancestor creates a stacking context. */
function Masthead({
  active,
  tone,
  menuOpen,
  onMenuToggle,
}: {
  active: string;
  tone: "light" | "dark";
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const c = CHROME[tone];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{ height: MASTHEAD_H, background: "transparent" }}
    >
      <div
        className="shell flex h-full items-center justify-between gap-6"
        style={{ color: c.fg }}
      >
        <a href="#home" onClick={go("home")} className="group flex items-baseline">
          <span className="font-mono text-sm font-bold lowercase tracking-tight">
            yash sachan
          </span>
          <span className="ml-1 text-[0.6rem]" style={{ color: c.mark }}>
            ●
          </span>
        </a>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={go(id)}
                    aria-current={isActive ? "true" : undefined}
                    className="relative block px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300"
                    style={{ color: isActive ? c.fg : c.dim }}
                  >
                    <span style={{ color: c.mark }}>/</span>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-mark"
                        className="absolute inset-x-3 bottom-1 h-px"
                        style={{ background: c.mark }}
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href="mailto:yashsachan321@gmail.com"
          className="elink hidden font-mono text-[0.6875rem] uppercase tracking-[0.14em] md:block"
        >
          Email ↗
        </a>

        {/* ── Mobile trigger ───────────────────────────────────────
            Replaces the bottom tab bar the previous build used. Two
            rules that cross into an X — the state of the menu is the
            state of the icon, so nothing else has to announce it.
            44px square: the minimum comfortable touch target. */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative -mr-2 grid h-11 w-11 place-items-center md:hidden"
        >
          <motion.span
            className="absolute block h-px w-6"
            style={{ background: c.fg }}
            animate={{ y: menuOpen ? 0 : -4, rotate: menuOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="absolute block h-px w-6"
            style={{ background: c.fg }}
            animate={{ y: menuOpen ? 0 : 4, rotate: menuOpen ? -45 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </button>
      </div>
    </header>
  );
}

/* ── Mobile index ──────────────────────────────────────────────────
   The only nav in thumb reach, and all five entries fit here where a
   top rail would have had to drop two. */
/* ── Mobile menu ───────────────────────────────────────────────────
   A full-screen overlay, not a bottom tab bar.

   The tab bar it replaces cost 52px of every screen permanently — on
   a 700px-tall phone that is 7% of the viewport surrendered to five
   words, in a design whose whole argument is scale and emptiness. An
   overlay costs nothing until it is asked for.

   Set to the dark ground regardless of page tone: a menu is a mode,
   and it should feel like the page has been replaced rather than
   tinted. */
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  /* Lock the page while the overlay is up, or the content behind it
     scrolls under your finger. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes it — the trigger scrolls out of reach once open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-menu"
          data-tone="dark"
          className="fixed inset-0 z-40 flex flex-col justify-end px-6 pb-16 pt-24 md:hidden"
          style={{ background: "#0C0C0D" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="flex flex-col">
            {links.map((link, i) => {
              const id = link.href.slice(1);
              return (
                <li
                  key={link.href}
                  className="overflow-hidden border-b"
                  style={{ borderColor: "rgba(241,241,242,0.16)" }}
                >
                  <motion.a
                    href={link.href}
                    onClick={(e) => {
                      go(id)(e);
                      onClose();
                    }}
                    className="flex items-baseline gap-4 py-5"
                    style={{ color: "#F1F1F2" }}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.65,
                      delay: 0.06 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span
                      className="font-mono text-[0.6875rem]"
                      style={{ color: CHROME.dark.mark }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="display"
                      style={{ fontSize: "clamp(2rem, 11vw, 3.5rem)" }}
                    >
                      {link.label}
                    </span>
                  </motion.a>
                </li>
              );
            })}
          </ul>

          <motion.a
            href="mailto:yashsachan321@gmail.com"
            className="mt-12 font-mono text-[0.6875rem] uppercase tracking-[0.18em]"
            style={{ color: "rgba(241,241,242,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            yashsachan321@gmail.com ↗
          </motion.a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* ── Section head ──────────────────────────────────────────────────
   Boxed numeral, em dash, wide-tracked label — then a two-line
   heading where the second line turns italic. Repeated at the top of
   every section; the running count is the spine of the document. */
function SectionHead({
  n,
  label,
  line1,
  line2,
  note,
}: {
  n: string;
  label: string;
  line1: string;
  line2: string;
  note?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Rise>
        <div className="flex items-center gap-3">
          <span className="sec-num">{n}</span>
          <span className="micro">— {label}</span>
        </div>
      </Rise>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="display" style={{ fontSize: "var(--t-h1)" }}>
          <Mask delay={0.05}>{line1}</Mask>
          <Mask delay={0.14}>
            <span className="ink-italic">{line2}</span>
          </Mask>
        </h2>
        {note && (
          <Rise delay={0.2}>
            <span className="micro">{note}</span>
          </Rise>
        )}
      </div>
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("shell scroll-mt-24 py-24 md:py-36", className)}
    >
      {children}
    </section>
  );
}

/* A full-bleed tone block. Sets the ground for everything inside it,
   including the sections not yet converted — they use text-ink and
   bg-paper, which are tone-aware, so they invert for free. */
function Tone({
  tone,
  children,
}: {
  tone: "light" | "dark";
  children: React.ReactNode;
}) {
  /* `data-tone-block` marks this as a *measurable* region for the
     masthead's tone detector. `data-tone` alone would not do: the nav
     carries that attribute too, and would end up measuring itself. */
  return (
    <div data-tone={tone} data-tone-block className="relative">
      {children}
    </div>
  );
}

export default function Home() {
  const { active, tone } = usePageState();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* While the menu is open the masthead is sitting on the
          overlay, not on the page — and the overlay is always dark.
          Feeding it the page's tone left the close button rendering
          near-black on a near-black ground: present, focusable, and
          completely invisible. The menu's own tone wins whenever it
          is up. */}
      <Masthead
        active={active}
        tone={menuOpen ? "dark" : tone}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((o) => !o)}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* No bottom padding any more — the tab bar that needed it has
          been replaced by an overlay, giving every mobile screen back
          52px it was permanently surrendering. */}
      <div>
        {/* ── Hero ────────────────────────────────────────────────
            Owns its own tone: it starts light and scroll-converts to
            dark across a 240vh track. No <Tone> wrapper — the hero
            animates the tone tokens directly. */}
        <div id="home">
          <Hero />
        </div>

        {/* ── Block A · dark ──────────────────────────────────────
            Must be dark, and must follow the hero immediately. The
            hero's track ends on a dark ground; anything light here
            would snap the page back to white the instant the sticky
            stage unpins, and throw away the whole conversion.

            Projects belong in this block for a second reason:
            screenshots are bright objects, so they read as lit panels
            against dark rather than pale rectangles on a pale page. */}
        <Tone tone="dark">
          {/* No SectionHead: the hero resolves "01 — Experience" onto
              its dark stage as the tribar dissolves, so this section
              picks up mid-sentence and the entries simply continue in
              the black. Rendering it again here showed the heading
              twice, a screen apart. */}
          <Section id="work" className="!pt-0">
            <Experience />
          </Section>

          {/* No SectionHead here — this section's heading shares a row
              with the project index, so RecentProjects renders it. */}
          <Section id="projects">
            <RecentProjects />
          </Section>
        </Tone>

        {/* ── Block B · light ─────────────────────────────────── */}
        <Tone tone="light">
          <Section id="stack">
            <SectionHead
              n="03"
              label="Toolkit"
              line1="What I reach"
              line2="for first."
              /* No count here. Skills renders one derived from its own
                 data; a second, hand-typed copy just goes stale — this
                 one already said 19 tools when there were 20. */
              note="Go · distributed systems · retrieval"
            />
            <Skills />
            <div className="mt-20">
              <SkillsGraph />
            </div>
            <div className="mt-20">
              <TerminalSnake />
            </div>
          </Section>
        </Tone>

        {/* ── Block D · dark ──────────────────────────────────── */}
        <Tone tone="dark">
          <Section id="about">
            <SectionHead
              n="04"
              label="Background"
              line1="Briefly,"
              line2="about me."
              note="Greater Noida → Bengaluru"
            />
            <Grid />
          </Section>
        </Tone>

        {/* ── Block E · light ─────────────────────────────────── */}
        <Tone tone="light">
          <Section id="credentials">
            <SectionHead
              n="05"
              label="Credentials"
              line1="Paper that"
              line2="backs it up."
            />
            <Certificates />
          </Section>

          <Section id="approach">
            <SectionHead
              n="06"
              label="Method"
              line1="How I go"
              line2="about it."
            />
            <Approach />
          </Section>
        </Tone>

        {/* ── Block F · dark ──────────────────────────────────── */}
        <Tone tone="dark">
          <div id="contact">
            <Footer />
          </div>
        </Tone>
      </div>
    </div>
  );
}
