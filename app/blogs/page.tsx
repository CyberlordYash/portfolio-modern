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
  Save,
  ShieldCheck,
  Trash2,
  X,
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
  if (Number.isNaN(parsed.getTime())) return value;
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
      [...posts].sort(
        (a, b) =>
          b.publishedAt.localeCompare(a.publishedAt) ||
          b.updatedAt.localeCompare(a.updatedAt),
      ),
    [posts],
  );

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setRequestError("");
        const res = await fetch("/api/blogs", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { posts?: BlogPost[]; admin?: boolean };
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setIsAdmin(Boolean(data.admin));
      } catch {
        setRequestError("Unable to load blog posts right now.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleAdminUnlock = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setLoginError(false);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setLoginError(true); return; }
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword("");
    } catch {
      setLoginError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    try { await fetch("/api/admin/auth", { method: "DELETE" }); } catch { /* ignored */ }
    setIsAdmin(false);
    setDraft(createInitialDraft());
    setShowAdminLogin(false);
    setPassword("");
    setLoginError(false);
  };

  const handleSubmit = async () => {
    const title = draft.title.trim();
    const summary = draft.summary.trim();
    const content = draft.content.trim();
    if (!title || !summary || !content) return;
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id, title, summary, content }),
      });
      if (res.status === 401) { setIsAdmin(false); setShowAdminLogin(true); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { posts?: BlogPost[] };
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setDraft(createInitialDraft());
    } catch {
      setRequestError("Unable to save this blog post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.status === 401) { setIsAdmin(false); setShowAdminLogin(true); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { posts?: BlogPost[] };
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setDraft((cur) => (cur.id === id ? createInitialDraft() : cur));
    } catch {
      setRequestError("Unable to delete this post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0;

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      
      <div className="shell relative z-10 py-16 md:py-24">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="btn-line"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Portfolio
            </Link>

            {isAdmin ? (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="btn-line"
              >
                <LogOut className="h-3.5 w-3.5" />
                Exit Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLogin((c) => !c)}
                className="btn-line"
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                Admin
              </button>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-ink/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70">
            <BookOpenText className="h-3 w-3" />
            Field Notes
          </div>
        </div>

        {/* ── Main card ── */}
        <section className="relative overflow-hidden rounded-2xl border border-rule bg-transparent">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgb(var(--ink-rgb) / 0.04),transparent_45%),radial-gradient(circle_at_85%_85%,rgb(var(--ink-rgb) / 0.03),transparent_45%)]" />
          <div className="pointer-events-none absolute -right-6 top-4 opacity-[0.055]">
            <PenSvg className="h-48 w-48 text-ink" />
          </div>

          <div className="relative z-10 px-4 py-8 md:px-8 md:py-10">
            {/* ── Title row ── */}
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-ink/[0.05] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.38em] text-ink/70">
                  <BookOpenText className="h-3 w-3" />
                  Sys · Blog Feed
                </div>
                <h1 className="font-Orbitron text-3xl font-bold tracking-tight text-ink md:text-[2.6rem]">
                  Blogs
                </h1>
                <p className="max-w-md text-sm text-ink/50 md:text-base">
                  Notes, learnings, and thoughts — written for the public.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:min-w-[288px]">
                <StatCard
                  label="Posts"
                  value={String(sortedPosts.length).padStart(2, "0")}
                  helper={isLoading ? "Syncing..." : "Published"}
                  color="indigo"
                />
                <StatCard
                  label="Admin"
                  value={isAdmin ? "ON" : "OFF"}
                  helper={isAdmin ? "Unlocked" : "Locked"}
                  color="violet"
                />
              </div>
            </div>

            {/* ── Admin login ── */}
            {showAdminLogin && !isAdmin && (
              <div className="mb-6 rounded-xl border border-ink/15 bg-ink/[0.025] p-5">
                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                      Admin Access
                    </p>
                    <h2 className="mt-1.5 font-Orbitron text-lg font-semibold text-ink">
                      Unlock Editor
                    </h2>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="Enter admin password"
                    className="w-full rounded-xl border border-rule bg-transparent px-4 py-3 font-mono text-sm text-ink/90 outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-1 focus:ring-ink/20"
                  />
                  {loginError && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
                      Access denied — invalid password.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || !password.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    Authenticate
                  </button>
                </form>
              </div>
            )}

            {/* ── Admin editor ── */}
            {isAdmin && (
              <div className="mb-6 rounded-xl border border-ink/15 bg-ink/[0.025] p-5 md:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                      Admin Editor
                    </p>
                    <h2 className="mt-1.5 font-Orbitron text-base font-semibold text-ink">
                      {draft.id ? "Edit Post" : "New Post"}
                    </h2>
                  </div>
                  <div
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] ${
                      draft.id
                        ? "border-ink/15 bg-ink/[0.06] text-ink/70"
                        : "border-ink/15 bg-ink/[0.06] text-ink/70"
                    }`}
                  >
                    {draft.id ? "Edit" : "Create"}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft((cur) => ({ ...cur, title: e.target.value }))}
                    placeholder="Blog title..."
                    className="w-full rounded-xl border border-rule bg-transparent px-4 py-3 text-sm text-ink/90 outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-1 focus:ring-ink/10"
                  />

                  <textarea
                    value={draft.summary}
                    onChange={(e) => setDraft((cur) => ({ ...cur, summary: e.target.value }))}
                    rows={3}
                    placeholder="Short summary shown on the post card..."
                    className="w-full resize-none rounded-xl border border-rule bg-transparent px-4 py-3 text-sm leading-relaxed text-ink/75 outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-1 focus:ring-ink/10"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                        Content
                      </span>
                      {wordCount > 0 && (
                        <span className="font-mono text-[9px] text-ink/30">
                          {wordCount}w
                        </span>
                      )}
                    </div>
                    <textarea
                      value={draft.content}
                      onChange={(e) => setDraft((cur) => ({ ...cur, content: e.target.value }))}
                      rows={10}
                      placeholder="Write your full blog post here..."
                      className="w-full resize-none rounded-xl border border-rule bg-transparent px-4 py-4 text-sm leading-relaxed text-ink/75 outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-1 focus:ring-ink/10"
                    />
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting ||
                        !draft.title.trim() ||
                        !draft.summary.trim() ||
                        !draft.content.trim()
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : draft.id ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <PlusCircle className="h-4 w-4" />
                      )}
                      {draft.id ? "Update Post" : "Publish Post"}
                    </button>

                    {draft.id && (
                      <button
                        type="button"
                        onClick={() => setDraft(createInitialDraft())}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/15 bg-transparent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50 transition hover:border-ink/25 hover:text-ink/75 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {requestError && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
                {requestError}
              </div>
            )}

            {/* ── Posts list ── */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="rounded-xl border border-dashed border-rule bg-transparent px-5 py-16 text-center">
                  <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-ink" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30">
                    Loading posts...
                  </p>
                </div>
              ) : sortedPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-rule px-5 py-16 text-center">
                  <BookOpenText className="mx-auto h-6 w-6 text-ink/30" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30">
                    No posts yet
                  </p>
                  <p className="mt-2 text-xs text-ink/30">
                    {isAdmin ? "Use the editor above to publish your first post." : "Check back soon."}
                  </p>
                </div>
              ) : (
                sortedPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`group relative rounded-xl border transition-all ${
                      draft.id === post.id
                        ? "border-ink/30 bg-ink/[0.05]"
                        : "border-rule bg-ink/[0.02] hover:border-rule"
                    }`}
                  >
                    {/* Left accent bar */}
                    <div
                      className={`absolute left-0 top-5 bottom-5 w-[2px] rounded-full transition-all ${
                        draft.id === post.id
                          ? "bg-ink"
                          : "bg-ink/[0.05] group-hover:bg-ink/40"
                      }`}
                    />

                    <div className="p-5 md:p-6">
                      {/* Post header */}
                      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center rounded-lg border border-ink/15 bg-ink/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/70">
                              Post {String(index + 1).padStart(2, "0")}
                            </div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink/30">
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                          <h2 className="font-Orbitron text-xl font-bold leading-snug text-ink md:text-2xl">
                            {post.title}
                          </h2>
                        </div>

                        {isAdmin && (
                          <div className="flex flex-shrink-0 items-center gap-1.5">
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
                              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-transparent px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/50 transition hover:border-ink/40 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-40"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(post.id)}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-transparent px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/50 transition hover:border-red-600/40 hover:bg-red-950/20 hover:text-red-600 dark:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink/60 md:text-base">
                        {post.summary}
                      </p>

                      {/* Content */}
                      <div className="rounded-xl border border-ink/10 bg-transparent px-5 py-4">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-ink/60">
                          {post.content}
                        </p>
                      </div>
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

function StatCard({
  label,
  value,
  helper,
  color,
}: {
  label: string;
  value: string;
  helper: string;
  color: "indigo" | "violet";
}) {
  const border = color === "indigo" ? "border-ink/15" : "border-ink/15";
  const bg = color === "indigo" ? "bg-ink/[0.04]" : "bg-ink/[0.04]";
  const valColor = color === "indigo" ? "text-ink" : "text-ink";
  return (
    <div className={`rounded-xl border p-4 ${border} ${bg}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-ink/30">
        {label}
      </p>
      <p className={`mt-2.5 font-Orbitron text-xl font-bold ${valColor}`}>{value}</p>
      <p className="mt-1.5 truncate text-xs text-ink/40">{helper}</p>
    </div>
  );
}

function PenSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <rect x="20" y="20" width="160" height="160" rx="6" stroke="currentColor" strokeWidth="1" />
      <rect x="50" y="50" width="100" height="100" rx="4" stroke="currentColor" strokeWidth="1" />
      {/* Pen nib shape */}
      <path d="M80 80 L120 80 L120 110 L100 130 L80 110 Z" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="130" x2="100" y2="150" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="80" x2="80" y2="65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="120" y1="80" x2="120" y2="65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="65" x2="120" y2="65" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="95" x2="100" y2="115" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      {/* Corner dots */}
      <circle cx="20" cy="20" r="4" fill="currentColor" />
      <circle cx="180" cy="20" r="4" fill="currentColor" />
      <circle cx="20" cy="180" r="4" fill="currentColor" />
      <circle cx="180" cy="180" r="4" fill="currentColor" />
      {/* Circuit lines */}
      <line x1="20" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="1.2" />
      <line x1="150" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1.2" />
      <line x1="100" y1="20" x2="100" y2="50" stroke="currentColor" strokeWidth="1.2" />
      <line x1="56" y1="56" x2="66" y2="66" stroke="currentColor" strokeWidth="1" />
      <line x1="144" y1="56" x2="134" y2="66" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
