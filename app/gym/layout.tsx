import type { Metadata } from "next";

/* Same reasoning as app/worklog/layout.tsx: password-protected, so a
   crawler only ever sees the lock screen, and `noindex` is what keeps
   that out of search results. */
export const metadata: Metadata = {
  title: "Gym Log",
  robots: { index: false, follow: false },
};

export default function GymLayout({ children }: { children: React.ReactNode }) {
  return children;
}
