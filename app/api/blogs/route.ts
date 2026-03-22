import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { BlogPost, readBlogPosts, writeBlogPosts } from "@/lib/blog-store";

type BlogPayload = {
  id?: string;
  title?: string;
  summary?: string;
  content?: string;
};

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((first, second) =>
    second.publishedAt.localeCompare(first.publishedAt) ||
    second.updatedAt.localeCompare(first.updatedAt),
  );
}

function validatePost(payload: BlogPayload) {
  const title = payload.title?.trim() ?? "";
  const summary = payload.summary?.trim() ?? "";
  const content = payload.content?.trim() ?? "";

  if (!title || !summary || !content) {
    return null;
  }

  return { title, summary, content };
}

export async function GET() {
  const posts = sortPosts(await readBlogPosts());
  const admin = await isAdminAuthorized();

  return NextResponse.json(
    { posts, admin },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const payload = (await request.json()) as BlogPayload;
  const validated = validatePost(payload);

  if (!validated) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const existingPosts = await readBlogPosts();
  const timestamp = new Date().toISOString();
  const postId = payload.id?.trim();

  const nextPosts = postId
    ? existingPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              ...validated,
              updatedAt: timestamp,
            }
          : post,
      )
    : [
        {
          id: crypto.randomUUID(),
          ...validated,
          publishedAt: timestamp,
          updatedAt: timestamp,
        },
        ...existingPosts,
      ];

  if (postId && !nextPosts.some((post) => post.id === postId)) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sortedPosts = sortPosts(nextPosts);
  await writeBlogPosts(sortedPosts);

  return NextResponse.json(
    { posts: sortedPosts, admin: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json(
      { error: "Missing post id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const existingPosts = await readBlogPosts();
  const nextPosts = existingPosts.filter((post) => post.id !== id);

  if (nextPosts.length === existingPosts.length) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sortedPosts = sortPosts(nextPosts);
  await writeBlogPosts(sortedPosts);

  return NextResponse.json(
    { posts: sortedPosts, admin: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
