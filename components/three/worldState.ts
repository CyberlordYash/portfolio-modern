/* Shared, allocation-free state bridging the DOM scroll container and the
   R3F frame loop. Updated by passive listeners, read every frame. */

export const worldState = {
  /* raw scroll progress 0..1 of #main-scroll */
  scrollTarget: 0,
  /* damped value the camera actually uses */
  scroll: 0,
  /* pointer in NDC-ish space, damped in the rig */
  pointerX: 0,
  pointerY: 0,
};

export function attachWorldTrackers(): () => void {
  const el = document.getElementById("main-scroll");

  const onScroll = () => {
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    worldState.scrollTarget = max > 0 ? el.scrollTop / max : 0;
  };

  const onPointer = (e: PointerEvent) => {
    worldState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    worldState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  onScroll();
  el?.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    el?.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
  };
}
