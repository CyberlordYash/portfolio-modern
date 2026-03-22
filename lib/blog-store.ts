import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
};

const STORE_NAME = "portfolio-blogs";
const STORE_KEY = "posts";
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "blogs.json");

function getBlobsConfig() {
  const siteID =
    process.env.NETLIFY_BLOBS_SITE_ID ??
    process.env.NETLIFY_SITE_ID ??
    process.env.SITE_ID;
  const token =
    process.env.NETLIFY_BLOBS_TOKEN ??
    process.env.NETLIFY_AUTH_TOKEN ??
    process.env.NETLIFY_TOKEN;

  if (siteID && token) {
    return { siteID, token };
  }

  return null;
}

function isNetlifyRuntime() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.CONTEXT ||
      process.env.URL ||
      getBlobsConfig(),
  );
}

function shouldUseLocalFileStore() {
  return process.env.NODE_ENV !== "production" && !isNetlifyRuntime();
}

function getBlogStore() {
  const blobsConfig = getBlobsConfig();

  if (blobsConfig) {
    return getStore(STORE_NAME, blobsConfig);
  }

  if (isNetlifyRuntime()) {
    return getStore(STORE_NAME);
  }

  return null;
}

export async function readBlogPosts() {
  const store = getBlogStore();

  if (store) {
    const posts = await store.get(STORE_KEY, { type: "json" });
    return Array.isArray(posts) ? (posts as BlogPost[]) : [];
  }

  if (!shouldUseLocalFileStore()) {
    throw new Error(
      "Blog storage is not configured. Set NETLIFY_BLOBS_SITE_ID and NETLIFY_BLOBS_TOKEN in production.",
    );
  }

  try {
    const file = await readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(file) as BlogPost[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeBlogPosts(posts: BlogPost[]) {
  const store = getBlogStore();

  if (store) {
    await store.setJSON(STORE_KEY, posts);
    return;
  }

  if (!shouldUseLocalFileStore()) {
    throw new Error(
      "Blog storage is not configured. Set NETLIFY_BLOBS_SITE_ID and NETLIFY_BLOBS_TOKEN in production.",
    );
  }

  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(LOCAL_DATA_FILE, JSON.stringify(posts, null, 2), "utf8");
}
