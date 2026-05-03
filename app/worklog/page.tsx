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
    const check = async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { authorized?: boolean };
        setIsUnlocked(Boolean(data.authorized));
      } catch {
        setIsUnlocked(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    void check();
  }, []);

  const handleUnlock = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setHasError(false);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setHasError(true); return; }
      setIsUnlocked(true);
      setPassword("");
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch("/api/admin/auth", { method: "DELETE" }); } catch { /* ignored */ }
    setIsUnlocked(false);
    setPassword("");
    setHasError(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black-100 px-4 py-6 text-white md:px-8 md:py-8">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_10%,rgba(34,211,238,0.07),transparent),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(99,102,241,0.07),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Portfolio
            </Link>

            {isUnlocked && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 transition hover:border-red-400/40 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                Lock
              </button>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
            <BriefcaseBusiness className="h-3 w-3" />
            Worklog
          </div>
        </div>

        {/* Content */}
        {isCheckingAuth ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-cyan-500" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-slate-600">
                Verifying session...
              </p>
            </div>
          </div>
        ) : isUnlocked ? (
          <WorkJournal onUnauthorized={() => setIsUnlocked(false)} />
        ) : (
          /* Lock screen */
          <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[rgba(10,15,28,0.6)] backdrop-blur-sm">
            {/* Decorations */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.05),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.05),transparent_50%)]" />
            <div className="pointer-events-none absolute -right-8 top-8 opacity-[0.06]">
              <LockCircuitSvg className="h-52 w-52 text-cyan-400" />
            </div>
            <div className="pointer-events-none absolute -left-6 bottom-8 opacity-[0.05]">
              <LockCircuitSvg className="h-36 w-36 text-violet-400" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-10">
              {/* Lock icon */}
              <div className="mb-8 flex justify-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06]"
                  style={{ boxShadow: "0 0 40px rgba(34,211,238,0.12), 0 0 80px rgba(34,211,238,0.05)" }}
                >
                  <LockKeyhole className="h-8 w-8 text-cyan-400" />
                </div>
              </div>

              <div className="mb-8 text-center space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-slate-600">
                  Access Control · Private
                </p>
                <h1 className="font-Orbitron text-3xl font-bold tracking-tight text-white">
                  Worklog
                </h1>
                <p className="font-Quicksand text-sm text-slate-500">
                  My daily work journal. Restricted access.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="Enter access code"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3.5 font-mono text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />

                {hasError && (
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-red-400">
                    Access denied — invalid code.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300 transition hover:bg-cyan-500/15 hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-40"
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
          </div>
        )}
      </div>
    </main>
  );
}

function LockCircuitSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <rect x="20" y="20" width="160" height="160" rx="6" stroke="currentColor" strokeWidth="1" />
      <rect x="50" y="50" width="100" height="100" rx="4" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" />
      <line x1="150" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="20" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="150" x2="100" y2="180" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="88" y="98" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M92 98V93a8 8 0 0116 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="4" fill="currentColor" />
      <circle cx="180" cy="20" r="4" fill="currentColor" />
      <circle cx="20" cy="180" r="4" fill="currentColor" />
      <circle cx="180" cy="180" r="4" fill="currentColor" />
      <line x1="56" y1="56" x2="66" y2="66" stroke="currentColor" strokeWidth="1" />
      <line x1="144" y1="56" x2="134" y2="66" stroke="currentColor" strokeWidth="1" />
      <line x1="56" y1="144" x2="66" y2="134" stroke="currentColor" strokeWidth="1" />
      <line x1="144" y1="144" x2="134" y2="134" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
