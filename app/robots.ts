import type { MetadataRoute } from "next";

/* ══════════════════════════════════════════════════════════════════
   ROBOTS.TXT

   Nothing pointed crawlers at a sitemap and nothing told them the two
   password-protected pages exist purely to keep people out — an
   omission, not a deliberate choice, and worth closing.

   /worklog and /gym are disallowed here. They sit behind a password,
   so a crawler can only ever see the lock screen — indexing that
   would put a content-free page into search results under this site's
   name, which helps no one. Their own route metadata below also sets
   a `noindex` meta tag: robots.txt only asks crawlers not to fetch a
   URL, it doesn't stop one already indexed from staying that way, so
   the two together are what actually keeps them out of results.

   The `/api/` block excludes backend routes that return JSON, not
   pages — nothing for a search index to do with them. /blogs is left
   open deliberately: it's the one page meant to be found.
══════════════════════════════════════════════════════════════════ */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/worklog", "/gym", "/api/"],
    },
    sitemap: "https://yashsachan.com/sitemap.xml",
  };
}
