import type { Metadata } from "next";

/* `page.tsx` in this folder is "use client" — it fetches posts from an
   API and renders the admin write/delete UI — and a client component
   cannot export `metadata`. A layout can, and Next.js merges a route
   segment's layout metadata with its page regardless of which one is
   the client boundary. This is the only way this route gets its own
   title and description instead of silently inheriting the root
   layout's, which describes the whole portfolio, not the blog. */
export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on backend engineering, distributed systems, and building for high-frequency trading — from Yash Sachan.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Writing | Yash Sachan",
    description:
      "Notes on backend engineering, distributed systems, and building for high-frequency trading.",
    url: "https://yashsachan.com/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
