"use client";

import { ReactLenis } from "lenis/react";

/* ══════════════════════════════════════════════════════════════════
   SMOOTH SCROLL

   Lenis intercepts wheel/touch input and drives the *real* document
   scroll position, rather than translating a wrapper element. That
   distinction is the reason it can be added here safely: the usual
   transform-based approach breaks `position: sticky` and
   `position: fixed`, and this page depends on both — the masthead is
   fixed, and the experience timeline is a sticky stack.

   It also means IntersectionObserver, scroll anchors and
   `scrollIntoView` all keep working unchanged.

   Prerequisite: the page must scroll natively. The old build nested
   everything inside an `overflow-y: auto` div (#main-scroll), which
   this would have had to be pointed at explicitly; that container is
   gone now and the document scrolls.
══════════════════════════════════════════════════════════════════ */

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        // ~1s to settle. Long enough to read as weight, short enough
        // that the page never feels like it is lagging behind input.
        lerp: 0.09,
        wheelMultiplier: 1,
        // Touch devices already have native inertia; doubling it up
        // feels broken, so Lenis stays off there.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
