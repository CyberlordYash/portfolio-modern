"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mask, Rise } from "@/components/ui/Reveal";
import { ErrorLine, FIELD, PageFoot, SOLID, TopBar } from "@/components/ui/Folio";
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
      if (!res.ok) {
        setHasError(true);
        return;
      }
      setIsUnlocked(true);
      setPassword("");
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      /* ignored */
    }
    setIsUnlocked(false);
    setPassword("");
    setHasError(false);
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="shell py-10 md:py-14">
        <TopBar>
          {isUnlocked ? (
            <button type="button" onClick={handleLogout} className="elink micro text-ink">
              Lock ×
            </button>
          ) : (
            <span className="micro">Private</span>
          )}
        </TopBar>

        {isCheckingAuth ? (
          <p className="micro py-40 text-center">Verifying session…</p>
        ) : isUnlocked ? (
          <WorkJournal onUnauthorized={() => setIsUnlocked(false)} />
        ) : (
          <section className="grid min-h-[70vh] grid-cols-1 content-center gap-12 py-20 md:grid-cols-12">
            <div className="md:col-span-7">
              <Rise>
                <div className="flex items-center gap-3">
                  <span className="sec-num">L</span>
                  <span className="micro">— Worklog · Restricted</span>
                </div>
              </Rise>
              <h1 className="display mt-7" style={{ fontSize: "var(--t-h1)" }}>
                <Mask delay={0.05}>The worklog</Mask>
                <Mask delay={0.14}>
                  <span className="ink-italic">is locked.</span>
                </Mask>
              </h1>
              <Rise delay={0.22}>
                <p className="copy mt-8">
                  A private daily journal of what got built, what broke, and what I
                  learned fixing it.
                </p>
              </Rise>
            </div>

            <Rise delay={0.28} className="md:col-span-4 md:col-start-9 md:self-end">
              <form onSubmit={handleUnlock} className="border-t border-ink pt-6">
                <label className="micro" htmlFor="worklog-code">
                  Access code
                </label>
                <input
                  id="worklog-code"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="••••••"
                  autoFocus
                  className={`${FIELD} mt-2 font-mono text-sm`}
                />
                {hasError && (
                  <div className="mt-3">
                    <ErrorLine>Access denied — wrong code.</ErrorLine>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className={`${SOLID} mt-6 w-full`}
                >
                  {isSubmitting ? "Checking…" : "Unlock ↗"}
                </button>
              </form>
            </Rise>
          </section>
        )}

        <PageFoot label="Worklog" />
      </div>
    </main>
  );
}
