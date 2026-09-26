"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { EASE } from "@/components/ui/Reveal";
import Streaks from "@/components/ui/Streaks";
/* Brand glyphs come from react-icons' Simple Icons set (already a
   dependency) rather than being hand-drawn here — one import, correct
   marks, and they track upstream when a brand refreshes its logo. */
import { SiGithub, SiLinkedin, SiLeetcode, SiCodechef } from "react-icons/si";

/* ══════════════════════════════════════════════════════════════════
   HERO — the light-to-dark conversion

   The hero is a 240vh scroll track holding a sticky 100vh stage. As
   you scroll that track, three things happen on one timeline:

     1. the slab stack grows and rises
     2. the ground interpolates from paper to near-black
     3. the object dissolves into the ground it just created

   The trick that makes it read as one event rather than three is
   *what* gets animated: not a background colour, but the tone tokens
   themselves — `--paper-rgb`, `--ink-rgb`, `--accent-rgb`. Every
   descendant derives its colour from those by alpha, so the word, the
   statement, the rules and the status bar all invert together, in
   step, for free. Nothing has a hard-coded colour to fall out of sync.

   The ranges deliberately overlap. The ground starts darkening while
   the object is still growing, and the object only fades once the
   ground is already dark behind it — so it appears to be swallowed by
   the dark rather than crossfaded with it.

   The track ends dark, and the section after it is dark, so the
   handoff is invisible: the conversion doesn't snap back.
══════════════════════════════════════════════════════════════════ */

/* The mark is real 3D geometry — see components/three/Tribar3D.tsx.
   ssr:false because it needs a WebGL context; it fades in on mount, so
   there is nothing to show while it loads. */
const Tribar3D = dynamic(() => import("@/components/three/Tribar3D"), {
  ssr: false,
});

/* Builds a space-separated `R G B` motion template from a scroll
   progress value. Space-separated because the tone tokens feed
   `rgb(var(--ink-rgb) / <alpha>)`, which is what lets every derived
   step keep its alpha through the transition. */
function useRgbTrack(
  p: MotionValue<number>,
  range: number[],
  from: [number, number, number],
  to: [number, number, number],
) {
  const r = useTransform(p, range, [from[0], to[0]]);
  const g = useTransform(p, range, [from[1], to[1]]);
  const b = useTransform(p, range, [from[2], to[2]]);
  return useMotionTemplate`${r} ${g} ${b}`;
}

const Hero = () => {
  const track = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  /* ── The tone timeline ──────────────────────────────────────── */
  const GROUND = [0.28, 0.72];
  const paperRgb = useRgbTrack(
    scrollYProgress,
    GROUND,
    [242, 242, 243],
    [12, 12, 13],
  );
  const inkRgb = useRgbTrack(
    scrollYProgress,
    GROUND,
    [11, 11, 12],
    [241, 241, 242],
  );
  const accentRgb = useRgbTrack(
    scrollYProgress,
    GROUND,
    [26, 50, 255],
    [104, 124, 255],
  );
  const bg = useMotionTemplate`rgb(${paperRgb})`;

  /* The object's growth, tone crossing and dissolve all live inside
     the 3D scene — it samples this same MotionValue in its render
     loop. Driving them from here would mean scaling a raster canvas
     with a CSS transform, and the mark would arrive at the dark frame
     visibly soft. */

  /* ── The copy ───────────────────────────────────────────────── */
  // Everything textual clears out before the object reaches full size,
  // so the middle of the track is the conversion on its own.
  const wordOpacity = useTransform(scrollYProgress, [0, 0.22, 0.46], [1, 1, 0]);
  const wordScale = useTransform(scrollYProgress, [0, 0.46], [1, 1.12]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.16, 0.38], [1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.38], [0, 40]);

  /* ── What the dark is for ───────────────────────────────────────
     The conversion shouldn't just arrive at a black screen and stop —
     an empty dark frame reads as a loading state. So the next
     section's heading resolves onto the stage as the object
     dissolves, which is what turns the transition into a hand-off:
     the dark isn't the end of the hero, it's the beginning of Work.

     Starts at 0.74 — after the ground ramp finishes at 0.72, so the
     type never fades up against a mid-grey background. */
  const nextOpacity = useTransform(scrollYProgress, [0.74, 0.93], [0, 1]);
  const nextY = useTransform(scrollYProgress, [0.74, 1], [56, 0]);

  /* The masthead reads `data-tone` off its ancestors, so the stage has
     to declare which side of the transition it is on. Flipped at the
     midpoint of the ground ramp rather than continuously — it drives a
     class, not a colour. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const isDark = v > (GROUND[0] + GROUND[1]) / 2;
    setDark((d) => (d === isDark ? d : isDark));
  });

  /* A frame counter, rendered straight from the MotionValue. Passing a
     MotionValue as a child updates the text node directly — no state,
     so the page doesn't re-render on every scroll frame. */
  const frame = useTransform(scrollYProgress, (v) =>
    String(Math.round(v * 100)).padStart(3, "0"),
  );

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    /* Shorter track on phones. 240vh is a little over two extra
       screens of scrolling before any content arrives — tolerable with
       a mouse wheel, tedious with a thumb. The whole conversion still
       plays out, just over less distance. */
    <div ref={track} className="relative h-[170vh] md:h-[240vh]">
      <motion.div
        data-tone={dark ? "dark" : "light"}
        /* Measurable by the masthead's tone detector — the hero is the
           one region whose tone changes mid-scroll, so the nav has to
           track it. */
        data-tone-block
        /* The three tone tokens are the animation. Everything inside
           inherits from them, so no child needs its own transition. */
        /* Cast through `unknown`: React's CSSProperties types
           backgroundColor as a string, but framer accepts a
           MotionValue here and resolves it per frame without a
           re-render. Custom properties are untyped either way. */
        style={
          {
            "--paper-rgb": paperRgb,
            "--ink-rgb": inkRgb,
            "--accent-rgb": accentRgb,
            backgroundColor: bg,
          } as unknown as React.CSSProperties
        }
        className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-28 md:pb-10 md:pt-32"
      >
        {/* ══ Streaks ══════════════════════════════════════════════
            Behind everything (z-0) and fading out on the same curve as
            the copy, so the dark phase of the conversion stays clean.
            They read as atmosphere in the light phase and would read
            as clutter over the dissolve. */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: copyOpacity }}
        >
          <Streaks />
        </motion.div>

        {/* ══ Name + mark ══════════════════════════════════════════
            The name is split so the mark sits in the gap between the
            two halves rather than on top of a single word.

            YASH rides up, SACHAN drops down, and each is nudged
            *inward* past the gap so its innermost letter slides under
            the object. The canvas paints above them (z-10), so that
            overlap reads as the letters tucking behind it — the type
            and the object share one space instead of sitting in
            separate boxes, which is the point of the composition.

            The offsets are in `em` rather than px on purpose: they
            scale with the clamped font size, so the overlap stays
            proportionally identical from a phone to a widescreen
            instead of drifting apart or colliding. */}
        <div className="relative flex flex-1 items-center">
          {/* ── The real heading ─────────────────────────────────────
              Exactly one h1 on the page, holding the plain name with
              no layout tricks. It exists purely for crawlers and
              screen readers.

              Both blocks below render "Yash Sachan" too, but as
              `<h1>` elements each — one hidden below lg, the other
              above it. CSS visibility doesn't remove an element from
              the accessibility tree or the DOM search engines parse,
              so that was two h1s at every viewport, just with one of
              them display:none. A page's primary heading signal
              wants to be singular; this makes it so without changing
              which markup is visible. */}
          <h1 className="sr-only">Yash Sachan</h1>

          {/* ── Landscape: the two halves flank the mark ───────────
              Sized so the pair plus the gap very nearly meet both
              gutters; each half is nudged inward so its innermost
              letter tucks under the object. aria-hidden: the name is
              already announced by the h1 above; this is decorative
              typography repeating it. */}
          <motion.p
            aria-hidden="true"
            className="display-wide relative z-0 hidden w-full items-center justify-center lg:flex"
            /* The mark stays ~470px wide, so the *type* has to make
               room for it rather than the other way round.

               Previously: 9vw of gap minus a 0.26em inward nudge on
               each half left roughly 32px of real space for a 470px
               object — which is why it sat squarely on "SA".

               Now the gap is sized to the mark (~416px once there is
               room) and the face is dropped from 13.5vw to 11vw so the
               two words plus that gap still fit the measure. The 0.10em
               nudge leaves ~45px of overlap per side: about a quarter
               of a letter, which reads as contact rather than
               occlusion. */
            /* ── One ratio, every width ────────────────────────────
               The gap is `em`, not a second clamp. That is the whole
               trick for large screens: expressed in em it is a fixed
               multiple of the face size, so name, gap and mark keep
               the exact proportions they have on a laptop whether the
               display is 1024 or 2560 wide. Two independent clamps
               drifted apart — the type kept growing while the mark
               stayed pinned at 470px, and by 2560 the object was
               swallowing whole letters again.

               1.63em is measured off the composition that works, not
               chosen: 333px of gap at a 204px face. The cap is raised
               to 18rem so the name still fills a very large display
               rather than floating in the middle of one. */
            style={{
              fontSize: "clamp(2.4rem, 13.5vw, 18rem)",
              gap: "1.63em",
              opacity: wordOpacity,
              scale: wordScale,
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE }}
              /* Nudged inward far enough that the H crosses under the
                 mark's left edge. In em, so the overlap holds its
                 proportion as the clamped face size changes. */
              style={{ translateX: "0.24em", translateY: "-0.15em" }}
            >
              Yash
            </motion.span>

            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.12, ease: EASE }}
              /* Mirrored: the S crosses under the mark's right edge. */
              style={{ translateX: "-0.24em", translateY: "0.15em" }}
            >
              Sachan
            </motion.span>
          </motion.p>

          {/* ── Portrait: the halves stack and the mark sits over them ─
              Side by side, each half would be ~5vw and the whole
              composition would collapse into a strip. Stacked, the
              name runs at 22vw and deliberately overflows the gutters
              — it is cropped by the viewport rather than fitted to it,
              which is what keeps the scale on a phone.

              Opposed alignment (left, then right) preserves the
              diagonal of the landscape version, so the mark still has
              a seam to sit across. aria-hidden for the same reason as
              the landscape block above: the h1 already announced the
              name once. */}
          <motion.p
            aria-hidden="true"
            className="display-wide relative z-0 flex w-full flex-col lg:hidden"
            /* The gap is what makes the stacked version work. At the
               0.82 line-height `display-wide` sets, the two lines sit
               almost touching and the mark lands squarely across the
               join — covering the end of YASH and the start of
               SACHAN at once. Opening a gap gives it the middle to
               occupy instead, so it separates the two names rather
               than obscuring both.

               In em, so the separation scales with the 22vw face
               rather than collapsing on a small phone. */
            style={{
              fontSize: "22vw",
              gap: "0.42em",
              opacity: wordOpacity,
              scale: wordScale,
            }}
          >
            <motion.span
              className="block self-start"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE }}
              style={{ translateX: "-0.04em" }}
            >
              Yash
            </motion.span>

            <motion.span
              className="block self-end"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.12, ease: EASE }}
              style={{ translateX: "0.04em" }}
            >
              Sachan
            </motion.span>
          </motion.p>
        </div>

        {/* ══ The mark ═════════════════════════════════════════════
            Covers the whole stage rather than sitting in a sized box.
            It has to: the object grows to ~9× during the conversion,
            and a canvas constrained to a 22rem well would simply clip
            it. At full bleed the geometry scales inside a canvas
            that's already viewport-sized, so it stays sharp and has
            somewhere to go.

            z-10 puts it in front of the word — the collision between
            the two is the composition, not a backdrop. Only the CSS
            fade-in lives here; growth, tone and dissolve are all
            driven inside the scene from `scrollYProgress`. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
        >
          {/* Inner div carries the horizontal correction, not the
              motion wrapper above — framer owns `transform` on that
              element and would overwrite it. See `.mark-offset`. */}
          <div className="mark-offset h-full w-full">
            <Tribar3D className="!h-full !w-full" progress={scrollYProgress} />
          </div>
        </motion.div>

        {/* ══ Statement ════════════════════════════════════════ */}
        <motion.div
          className="shell relative z-20"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <motion.p
            className="display max-w-[22ch] text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: EASE }}
            style={{ fontSize: "clamp(1.35rem, 2.6vw, 2.35rem)" }}
          >
            I build backend systems that stay fast under load.
            <br />
            <span className="accent-italic">and correct while they do.</span>
          </motion.p>
        </motion.div>

        {/* ══ Hand-off: the Work heading, on the dark ══════════════
            Overlays the same stage the object just vacated, rather
            than sitting below it — so the heading occupies the space
            the tribar cleared, and the dark frame is never empty.

            pointer-events-none throughout: it is pure type, and
            leaving it interactive would put an invisible hit area
            over the hero for the first three-quarters of the scroll. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 flex items-center"
          style={{ opacity: nextOpacity }}
        >
          <motion.div className="shell w-full" style={{ y: nextY }}>
            <div className="flex items-center gap-3">
              <span className="sec-num">01</span>
              <span className="micro">— Experience</span>
            </div>
            <p className="display mt-7" style={{ fontSize: "var(--t-h1)" }}>
              Where the
              <br />
              <span className="ink-italic">work happened.</span>
            </p>
          </motion.div>
        </motion.div>

        {/* ══ Status bar ═══════════════════════════════════════
            Deliberately *not* faded out with the rest of the copy: it
            is the readout for the transition, so it has to survive
            the whole track. */}
        <div className="shell relative z-40 mt-12 md:mt-16">
          {/* The scroll cue that used to sit on the right is gone. It
              told the reader to do the one thing a long page already
              invites, and it occupied the most valuable slot in the
              hero — last thing read, bottom-right. The profile links
              earn that slot: they are the only outbound action the
              hero offers.

              Glyph *and* label, not glyph alone: GitHub and LinkedIn
              read instantly, L`eetCode and CodeChef do not, and those
              two carry the competitive-programming record. The label
              also gives each link a real hit area rather than a 15px
              square. */}
          {/* One row on desktop: caption left, links right — the
              arrangement the short caption used to give for free.

              The four threads are ~95 characters, long enough that a
              wrapping row broke onto two lines and carried the profile
              links down with it. `flex-nowrap` holds the single line
              and the caption truncates instead, so the links keep the
              bottom-right slot at every width. Below md it still wraps,
              because there genuinely isn't room. */}
          <div className="statusbar flex-wrap gap-y-4 md:flex-nowrap">
            <span className="micro flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 md:flex-nowrap">
              <span className="min-w-0 md:truncate">
                {THREADS.join("  ·  ")}
              </span>
              {/* Mounted-only: a server-rendered clock is wrong the
                  instant it reaches the client. */}
              <span className="hidden num shrink-0 sm:inline">
                {time ? `IST ${time}` : ""}
              </span>
              {/* Rendering the MotionValue as a child updates the text
                  node directly — the counter runs without re-rendering
                  the component on every scroll frame. */}
              <motion.span className="num shrink-0 opacity-60">
                {frame}
              </motion.span>
            </span>

            <ul className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 md:flex-nowrap">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — opens in a new tab`}
                    className="group flex items-center gap-2 py-1 text-ink transition-colors duration-300 hover:text-mark"
                  >
                    <s.Icon
                      aria-hidden
                      className="h-[14px] w-[14px] transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                    />
                    <span className="micro text-current">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* The four strands the work actually runs on. Plain labels, joined
   with a middot — the numbering and `////` separators were tried and
   dropped: they reintroduced the old HUD texture into a bar whose
   whole job is to stay quiet. */
const THREADS = [
  "Distributed systems",
  "Performance engineering",
  "Cloud native infra",
  "Backend architecture",
];

/* Ordered by how much a hiring reader is likely to act on them:
   source first, then profile, then the competitive-programming
   record. */
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/CyberlordYash", Icon: SiGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yashsachan321/",
    Icon: SiLinkedin,
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/yashsachan/",
    Icon: SiLeetcode,
  },
  {
    label: "CodeChef",
    href: "https://www.codechef.com/users/cyberlordyash",
    Icon: SiCodechef,
  },
];

export default Hero;
