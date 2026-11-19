"use client";

import { useEffect, useState } from "react";

// Lets home-screen entrances wait for PageLoader to finish instead of playing behind it.
const EVENT = "page-loader:done";
let done = false;

export function signalLoaderDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(EVENT));
}

export function useLoaderDone() {
  const [ready, setReady] = useState(done);

  useEffect(() => {
    if (done) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  return ready;
}
