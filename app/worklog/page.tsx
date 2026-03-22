"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import WorkJournal from "@/components/WorkJournal";

export default function WorklogPage() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const response = await fetch("/api/admin/auth", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to verify access");
        }

        const data = (await response.json()) as { authorized?: boolean };
        setIsUnlocked(Boolean(data.authorized));
      } catch (error) {
        console.error(error);
        setIsUnlocked(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    void loadAuthState();
  }, []);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setHasError(false);

      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setHasError(true);
        return;
      }

      setIsUnlocked(true);
      setPassword("");
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUnlocked(false);
      setPassword("");
      setHasError(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-black dark:text-slate-200 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-blue-400/40 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Portfolio
            </Link>

            {isUnlocked && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-400/40 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-red-200"
              >
                <LogOut className="h-4 w-4" />
                Lock Worklog
              </button>
            )}
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
            <BriefcaseBusiness className="h-3.5 w-3.5" />
            Worklog
          </div>
        </div>

        {isCheckingAuth ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-cyan-50 px-4 py-10 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8">
            <div className="relative z-10 mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-8">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-cyan-600 dark:text-cyan-300" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                Verifying access
              </p>
            </div>
          </section>
        ) : isUnlocked ? (
          <WorkJournal onUnauthorized={() => setIsUnlocked(false)} />
        ) : (
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-cyan-50 px-4 py-10 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:26px_26px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

            <div className="relative z-10 mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-slate-500">
                    Access Control
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                    Worklog
                  </h1>
                  <p className="mt-2 max-w-md font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    I store my work tasks here. You can&apos;t access it.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-500">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (hasError) {
                        setHasError(false);
                      }
                    }}
                    placeholder="Enter access code"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />
                </label>

                {hasError && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-red-500 dark:text-red-300">
                    Invalid password. Try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-700 transition hover:border-cyan-500/50 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:border-cyan-300/50 dark:hover:bg-cyan-400/15"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Unlock Worklog
                </button>
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
