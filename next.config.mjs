/** @type {import('next').NextConfig} */
const nextConfig = {
  /* lets CI/agents build while `next dev` holds .next (Windows file locks) */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
