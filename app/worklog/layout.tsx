import type { Metadata } from "next";

/* Password-protected — a crawler can only ever reach the lock screen,
   so indexing it puts a content-free page into search results under
   this site's name. `noindex, nofollow` here is what actually keeps
   it out once found; `disallow` in robots.ts only asks a crawler not
   to fetch the URL, which does nothing for a page already indexed. */
export const metadata: Metadata = {
  title: "Worklog",
  robots: { index: false, follow: false },
};

export default function WorklogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
