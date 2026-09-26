"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Rise } from "@/components/ui/Reveal";
import { ErrorLine, FIELD, PageFoot, PageHead, SOLID, TopBar } from "@/components/ui/Folio";
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

const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
const readTime = (s: string) => `${Math.max(1, Math.ceil(words(s) / 220))} min read`;

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
  const [openId, setOpenId] = useState<string | null>(null);

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
        setRequestError("Unable to load posts right now.");
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
      if (!res.ok) {
        setLoginError(true);
        return;
      }
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
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      /* ignored */
    }
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
      if (res.status === 401) {
        setIsAdmin(false);
        setShowAdminLogin(true);
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { posts?: BlogPost[] };
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setDraft(createInitialDraft());
    } catch {
      setRequestError("Unable to save this post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.status === 401) {
        setIsAdmin(false);
        setShowAdminLogin(true);
        return;
      }
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

  const draftWords = words(draft.content);
  const canSave =
    !isSubmitting && draft.title.trim() && draft.summary.trim() && draft.content.trim();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="shell py-10 md:py-14">
        {/* ── Top bar ── */}
        <TopBar>
          {isAdmin ? (
            <button type="button" onClick={handleAdminLogout} className="elink micro text-ink">
              Exit admin ×
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdminLogin((c) => !c)}
              className="elink micro"
            >
              Admin
            </button>
          )}
        </TopBar>

        <PageHead
          mark="W"
          label="Writing"
          line1="Field notes"
          line2="from the engine room."
          meta={
            <>
              <span className="micro num">
                {isLoading ? "Syncing…" : `${String(sortedPosts.length).padStart(2, "0")} posts`}
              </span>
              <span className="micro">Backend · Distributed systems · HFT</span>
            </>
          }
          intro="Things I learn building trading systems and the infrastructure under them — written down so I stop re-learning them."
        />

        {/* ── Admin login ── */}
        <AnimatePresence initial={false}>
          {showAdminLogin && !isAdmin && (
            <motion.form
              key="login"
              onSubmit={handleAdminUnlock}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mb-16 grid grid-cols-1 gap-6 border-t border-ink pt-6 md:grid-cols-12">
                <span className="micro md:col-span-4">Admin access</span>
                <div className="md:col-span-8">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="Password"
                    autoFocus
                    className={`${FIELD} font-mono text-sm`}
                  />
                  {loginError && (
                    <div className="mt-3">
                      <ErrorLine>Access denied — wrong password.</ErrorLine>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || !password.trim()}
                    className={`${SOLID} mt-6`}
                  >
                    {isSubmitting ? "Checking…" : "Unlock ↗"}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Editor ── */}
        {isAdmin && (
          <Rise>
            <section className="mb-20 grid grid-cols-1 gap-6 border-t border-ink pt-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <span className="micro">{draft.id ? "Editing post" : "New post"}</span>
                {draftWords > 0 && (
                  <p className="micro num mt-2">
                    {draftWords} words · {readTime(draft.content)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 md:col-span-8">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                  placeholder="Title"
                  className={`${FIELD} display`}
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                />
                <textarea
                  value={draft.summary}
                  onChange={(e) => setDraft((c) => ({ ...c, summary: e.target.value }))}
                  rows={2}
                  placeholder="One-line summary for the index"
                  className={`${FIELD} resize-none text-[0.9375rem] leading-relaxed`}
                />
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft((c) => ({ ...c, content: e.target.value }))}
                  rows={12}
                  placeholder="Write the post…"
                  className={`${FIELD} resize-y text-[0.9375rem] leading-[1.8]`}
                />
                <div className="mt-2 flex flex-wrap gap-3">
                  <button type="button" onClick={handleSubmit} disabled={!canSave} className={SOLID}>
                    {isSubmitting ? "Saving…" : draft.id ? "Update post ↗" : "Publish ↗"}
                  </button>
                  {draft.id && (
                    <button
                      type="button"
                      onClick={() => setDraft(createInitialDraft())}
                      disabled={isSubmitting}
                      className="btn-line"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </section>
          </Rise>
        )}

        {requestError && (
          <div className="mb-8">
            <ErrorLine>{requestError}</ErrorLine>
          </div>
        )}

        {/* ── Index ── */}
        <Rise className="mb-6 flex items-baseline justify-between gap-4">
          <span className="micro">Index</span>
          <span className="micro">Newest first</span>
        </Rise>

        <div className="border-t border-rule">
          {isLoading ? (
            <p className="micro border-b border-rule py-16 text-center">Loading posts…</p>
          ) : sortedPosts.length === 0 ? (
            <div className="border-b border-rule py-20 text-center">
              <p className="display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
                <span className="ink-italic">Nothing filed yet.</span>
              </p>
              <p className="micro mt-4">
                {isAdmin ? "Use the editor above to publish the first one." : "Check back soon."}
              </p>
            </div>
          ) : (
            sortedPosts.map((post, i) => {
              const open = openId === post.id;
              const editing = draft.id === post.id;
              return (
                <Rise key={post.id} delay={Math.min(i, 6) * 0.04}>
                  <article className="border-b border-rule">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : post.id)}
                      aria-expanded={open}
                      className="group grid w-full grid-cols-1 gap-x-10 gap-y-3 py-8 text-left md:grid-cols-12 md:py-10"
                    >
                      <div className="flex items-baseline gap-4 md:col-span-3 md:flex-col md:gap-2">
                        <span className="micro num">
                          {String(sortedPosts.length - i).padStart(2, "0")}
                        </span>
                        <span className="micro num">{formatDate(post.publishedAt)}</span>
                        {i === 0 && (
                          <span className="micro" style={{ color: "var(--mark)" }}>
                            Latest
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-7">
                        <h2
                          className="display transition-transform duration-500 ease-out group-hover:translate-x-1"
                          style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}
                        >
                          {post.title}
                          {editing && <span className="ink-italic text-ink3"> — editing</span>}
                        </h2>
                        <p className="copy mt-4">{post.summary}</p>
                      </div>

                      <div className="flex items-baseline justify-between gap-4 md:col-span-2 md:flex-col md:items-end">
                        <span className="micro num">{readTime(post.content)}</span>
                        <span
                          aria-hidden
                          className="text-lg text-ink transition-transform duration-500 ease-out"
                          style={{ transform: open ? "rotate(45deg)" : "none" }}
                        >
                          +
                        </span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-x-10 pb-12 md:grid-cols-12">
                            <div className="md:col-span-7 md:col-start-4">
                              <div className="border-l border-ink pl-6">
                                <p className="whitespace-pre-wrap text-[1.0625rem] leading-[1.85] tracking-[-0.005em] text-ink2">
                                  {post.content}
                                </p>
                              </div>
                              {post.updatedAt !== post.publishedAt && (
                                <p className="micro num mt-6">Updated {formatDate(post.updatedAt)}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isAdmin && (
                      <div className="flex justify-end gap-6 pb-6">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              id: post.id,
                              title: post.title,
                              summary: post.summary,
                              content: post.content,
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="elink micro text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          disabled={isSubmitting}
                          className="elink micro disabled:opacity-40"
                          style={{ color: "var(--mark)" }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                </Rise>
              );
            })
          )}
        </div>

        <PageFoot label="Writing" />
      </div>
    </main>
  );
}
