import type { MetadataRoute } from "next";

/* ══════════════════════════════════════════════════════════════════
   SITEMAP

   /worklog and /gym are left out on purpose — they're the same two
   password-protected pages excluded in robots.ts, and listing a URL
   in a sitemap is an explicit "please index this," the opposite of
   what those two want.

   Individual blog posts are also absent, and that's a real gap
   rather than an oversight: every post is fetched at runtime into one
   client-rendered /blogs page, with no per-post URL to put in a
   sitemap even if this file wanted to list one. `readBlogPosts()`
   could supply titles and dates today, but not slugs — there's
   nothing to link to. Closing that gap means giving posts real routes
   (`/blogs/[slug]`) with their own server-rendered metadata, which is
   a feature, not a config change, and belongs in its own pass.
══════════════════════════════════════════════════════════════════ */

const BASE_URL = "https://yashsachan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
