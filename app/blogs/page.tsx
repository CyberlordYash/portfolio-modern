"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  Edit3,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog-store";

type DraftPost = {
  id: string | null;
  title: string;
  summary: string;
  content: string;
};

const createInitialDraft = (): DraftPost => ({
  id: null,
  title: "",
  summary: "",
  content: "",
});

function formatDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [draft, setDraft] = useState<DraftPost>(createInitialDraft);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [loginError, setLoginError] = useState(false);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((first, second) =>
        second.publishedAt.localeCompare(first.publishedAt) ||
        second.updatedAt.localeCompare(first.updatedAt),
      ),
    [posts],
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setRequestError("");

        const response = await fetch("/api/blogs", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load blog posts");
        }

        const data = (await response.json()) as {
          posts?: BlogPost[];
          admin?: boolean;
        };

        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setIsAdmin(Boolean(data.admin));
      } catch (error) {
        console.error(error);
        setRequestError("Unable to load blog posts right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const handleAdminUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setLoginError(false);

      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setLoginError(true);
        return;
      }

      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword("");
    } catch (error) {
      console.error(error);
      setLoginError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdmin(false);
      setDraft(createInitialDraft());
      setShowAdminLogin(false);
      setPassword("");
      setLoginError(false);
    }
  };

  const handleSubmit = async () => {
    const title = draft.title.trim();
    const summary = draft.summary.trim();
    const content = draft.content.trim();

    if (!title || !summary || !content) {
      return;
    }

    try {
      setIsSubmitting(true);
      setRequestError("");

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draft.id,
          title,
          summary,
          content,
        }),
      });

      if (response.status === 401) {
        setIsAdmin(false);
        setShowAdminLogin(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to save blog post");
      }

      const data = (await response.json()) as { posts?: BlogPost[] };
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setDraft(createInitialDraft());
    } catch (error) {
      console.error(error);
      setRequestError("Unable to save this blog post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");

      const response = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        setIsAdmin(false);
        setShowAdminLogin(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to delete blog post");
      }

      const data = (await response.json()) as { posts?: BlogPost[] };
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setDraft((currentDraft) =>
        currentDraft.id === id ? createInitialDraft() : currentDraft,
      );
    } catch (error) {
      console.error(error);
      setRequestError("Unable to delete this blog post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-black dark:text-slate-200 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-amber-400/40 hover:text-amber-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-amber-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Portfolio
            </Link>

            {isAdmin ? (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-400/40 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-red-200"
              >
                <LogOut className="h-4 w-4" />
                Exit Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLogin((current) => !current)}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700 transition hover:border-amber-500/40 hover:text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:text-amber-100"
              >
                <LockKeyhole className="h-4 w-4" />
                Admin Login
              </button>
            )}
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
            <BookOpenText className="h-3.5 w-3.5" />
            Blogs
          </div>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-amber-50 px-4 py-8 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.08),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:26px_26px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

          <div className="relative z-10">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                  <BookOpenText className="h-3.5 w-3.5" />
                  Field Notes
                </div>
                <div className="space-y-2">
                  <h1 className="bg-gradient-to-b from-slate-950 to-slate-500 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-500 md:text-5xl">
                    Blogs for public.
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
                <BlogStat
                  label="Posts"
                  value={String(sortedPosts.length).padStart(2, "0")}
                  helper={isLoading ? "Syncing..." : "Live"}
                />
                <BlogStat
                  label="Admin"
                  value={isAdmin ? "ON" : "OFF"}
                  helper={isAdmin ? "Unlocked" : "Locked"}
                />
              </div>
            </div>

            {showAdminLogin && !isAdmin && (
              <div className="mb-6 rounded-[1.75rem] border border-amber-500/20 bg-white/75 p-5 backdrop-blur-xl dark:bg-white/[0.03]">
                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                      Admin Access
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      Unlock blogs
                    </h2>
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (loginError) {
                        setLoginError(false);
                      }
                    }}
                    placeholder="Enter admin password"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />

                  {loginError && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500 dark:text-red-300">
                      Invalid password. Try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !password.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700 transition hover:border-amber-500/50 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    Unlock Admin
                  </button>
                </form>
              </div>
            )}

            {isAdmin && (
              <div className="mb-6 rounded-[1.75rem] border border-amber-500/20 bg-white/75 p-5 backdrop-blur-xl dark:bg-white/[0.03] md:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                      Admin Editor
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      {draft.id ? "Edit blog post" : "Publish a new blog"}
                    </h2>
                  </div>
                  <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                    {draft.id ? "Edit Mode" : "Create Mode"}
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Blog title"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-Quicksand text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />

                  <textarea
                    value={draft.summary}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        summary: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Short summary shown on the blog card"
                    className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white/90 px-4 py-4 font-Quicksand text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />

                  <textarea
                    value={draft.content}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        content: event.target.value,
                      }))
                    }
                    rows={10}
                    placeholder="Write your full blog content here..."
                    className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white/90 px-4 py-4 font-Quicksand text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting ||
                        !draft.title.trim() ||
                        !draft.summary.trim() ||
                        !draft.content.trim()
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-amber-700 transition hover:border-amber-500/50 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
                    >
                      {isSubmitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4" />
                      )}
                      {draft.id ? "Update Blog" : "Publish Blog"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDraft(createInitialDraft())}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/80 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-700 transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
                    >
                      Reset Draft
                    </button>
                  </div>
                </div>
              </div>
            )}

            {requestError && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-300">
                {requestError}
              </div>
            )}

            <div className="grid gap-5">
              {isLoading ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                  <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-amber-600 dark:text-amber-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Loading blog posts
                  </p>
                </div>
              ) : sortedPosts.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    No blogs published yet
                  </p>
                  <p className="mt-2 font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    No posts yet.
                  </p>
                </div>
              ) : (
                sortedPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 transition hover:border-amber-500/30 hover:bg-amber-50/60 dark:border-white/10 dark:bg-black/30 dark:hover:border-amber-400/20 dark:hover:bg-black/40"
                  >
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-700 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-200">
                          Post {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {post.title}
                          </h2>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                            Published {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({
                                id: post.id,
                                title: post.title,
                                summary: post.summary,
                                content: post.content,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 transition hover:border-amber-500/40 hover:text-amber-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-amber-200"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-500/40 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="mb-4 max-w-3xl font-Quicksand text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {post.summary}
                    </p>

                    <div className="rounded-[1.5rem] border border-amber-500/10 bg-white/70 p-5 dark:bg-white/[0.02]">
                      <p className="whitespace-pre-wrap font-Quicksand text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {post.content}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BlogStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white md:text-xl">
        {value}
      </p>
      <p className="mt-2 truncate font-Quicksand text-xs text-slate-600 dark:text-slate-400">
        {helper}
      </p>
    </div>
  );
}
