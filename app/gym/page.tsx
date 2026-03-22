"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Dumbbell,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import type { GymEntry } from "@/lib/gym-store";

type GymChecklist = Omit<GymEntry, "updatedAt">;

function getTodayDate() {
  return new Date().toISOString().split("T")[0] ?? "";
}

function createInitialChecklist(date = getTodayDate()): GymChecklist {
  return {
    date,
    protein: false,
    creatine: false,
    running: false,
    weightLifting: false,
    abs: false,
  };
}

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

const checklistItems = [
  { key: "protein", label: "Taken Protein" },
  { key: "creatine", label: "Taken Creatine" },
  { key: "running", label: "Running" },
  { key: "weightLifting", label: "Weight Lifting" },
  { key: "abs", label: "Abs" },
] as const;

export default function GymPage() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [checklist, setChecklist] = useState<GymChecklist>(
    createInitialChecklist(),
  );
  const [entries, setEntries] = useState<GymEntry[]>([]);
  const [requestError, setRequestError] = useState("");

  const completedCount = useMemo(
    () => checklistItems.filter((item) => checklist[item.key]).length,
    [checklist],
  );

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

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const loadEntries = async () => {
      try {
        setRequestError("");

        const response = await fetch(
          `/api/gym?date=${encodeURIComponent(selectedDate)}`,
          { cache: "no-store" },
        );

        if (response.status === 401) {
          setIsUnlocked(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load gym tracker");
        }

        const data = (await response.json()) as {
          entries?: GymEntry[];
          entry?: GymEntry | null;
        };

        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setChecklist(
          data.entry
            ? {
                date: data.entry.date,
                protein: data.entry.protein,
                creatine: data.entry.creatine,
                running: data.entry.running,
                weightLifting: data.entry.weightLifting,
                abs: data.entry.abs,
              }
            : createInitialChecklist(selectedDate),
        );
      } catch (error) {
        console.error(error);
        setRequestError("Unable to load gym tracker right now.");
      }
    };

    void loadEntries();
  }, [isUnlocked, selectedDate]);

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

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setRequestError("");

      const response = await fetch("/api/gym", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checklist),
      });

      if (response.status === 401) {
        setIsUnlocked(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to save gym tracker");
      }

      const data = (await response.json()) as {
        entries?: GymEntry[];
        entry?: GymEntry;
      };

      setEntries(Array.isArray(data.entries) ? data.entries : []);
      if (data.entry) {
        setChecklist({
          date: data.entry.date,
          protein: data.entry.protein,
          creatine: data.entry.creatine,
          running: data.entry.running,
          weightLifting: data.entry.weightLifting,
          abs: data.entry.abs,
        });
      }
    } catch (error) {
      console.error(error);
      setRequestError("Unable to save today's gym ticks right now.");
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
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-400/40 hover:text-red-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-red-200"
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
                Lock Gym
              </button>
            )}
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
            <Dumbbell className="h-3.5 w-3.5" />
            Gym
          </div>
        </div>

        {isCheckingAuth ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-red-50 px-4 py-10 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8">
            <div className="relative z-10 mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-8">
              <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-red-600 dark:text-red-300" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                Verifying access
              </p>
            </div>
          </section>
        ) : !isUnlocked ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-red-50 px-4 py-10 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.12),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:26px_26px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

            <div className="relative z-10 mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-slate-500">
                    Access Control
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                    Gym
                  </h1>
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-red-700 transition hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200 dark:hover:border-red-300/50 dark:hover:bg-red-400/15"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Unlock Gym
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-red-50 px-4 py-8 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 md:px-8 md:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.12),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:26px_26px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute -right-10 top-8 opacity-40 dark:opacity-20">
              <GymDumbbellVector className="h-28 w-28 text-red-500/40 dark:text-red-400/35" />
            </div>
            <div className="pointer-events-none absolute bottom-10 left-2 opacity-30 dark:opacity-15">
              <GymPlateVector className="h-24 w-24 text-red-500/35 dark:text-red-400/30" />
            </div>
            <div className="pointer-events-none absolute right-1/3 top-24 hidden opacity-25 lg:block dark:opacity-10">
              <GymKettlebellVector className="h-20 w-20 text-red-500/30 dark:text-red-400/25" />
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                    <Dumbbell className="h-3.5 w-3.5" />
                    Gym
                  </div>
                  <div className="space-y-2">
                    <h2 className="bg-gradient-to-b from-slate-950 to-slate-500 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-500 md:text-5xl">
                      Daily checklist.
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
                  <StatCard
                    label="Done"
                    value={`${completedCount}/5`}
                    helper="Today"
                  />
                  <StatCard
                    label="Saved Days"
                    value={String(entries.length).padStart(2, "0")}
                    helper="Tracked"
                  />
                </div>
              </div>

              {requestError && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-300">
                  {requestError}
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-6">
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                    Date
                  </p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      const nextDate = event.target.value;
                      setSelectedDate(nextDate);
                      setChecklist(createInitialChecklist(nextDate));
                    }}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition focus:border-red-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200"
                  />

                  <div className="mt-6 space-y-3">
                    {checklistItems.map((item) => {
                      const checked = checklist[item.key];

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setChecklist((current) => ({
                              ...current,
                              [item.key]: !current[item.key],
                            }))
                          }
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                            checked
                              ? "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200"
                              : "border-slate-200 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-black/30 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                              checked
                                ? "border-red-500/30 bg-red-500/15"
                                : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]"
                            }`}
                          >
                            {checked ? <Check className="h-4 w-4" /> : null}
                          </span>
                          <span className="font-Quicksand text-sm font-semibold">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-red-700 transition hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Save Day
                  </button>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                        History
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                        Saved days
                      </h3>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500 dark:border-white/10 dark:bg-black/30 dark:text-slate-400">
                      online
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entries.length === 0 ? (
                      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          No gym days yet
                        </p>
                      </div>
                    ) : (
                      entries.map((entry) => {
                        const count = checklistItems.filter(
                          (item) => entry[item.key],
                        ).length;

                        return (
                          <button
                            key={entry.date}
                            type="button"
                            onClick={() => {
                              setSelectedDate(entry.date);
                              setChecklist({
                                date: entry.date,
                                protein: entry.protein,
                                creatine: entry.creatine,
                                running: entry.running,
                                weightLifting: entry.weightLifting,
                                abs: entry.abs,
                              });
                            }}
                            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                              selectedDate === entry.date
                                ? "border-red-500/30 bg-red-500/10"
                                : "border-slate-200 bg-white/80 hover:border-red-500/20 dark:border-white/10 dark:bg-black/30"
                            }`}
                          >
                            <div>
                              <p className="font-Quicksand text-sm font-semibold text-slate-900 dark:text-white">
                                {formatDate(entry.date)}
                              </p>
                              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                {count}/5 complete
                              </p>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              {checklistItems.map((item) => (
                                <span
                                  key={item.key}
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    entry[item.key]
                                      ? "bg-red-500"
                                      : "bg-slate-200 dark:bg-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
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

function GymDumbbellVector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="18" y="42" width="10" height="36" rx="4" fill="currentColor" />
      <rect x="32" y="34" width="12" height="52" rx="4" fill="currentColor" />
      <rect x="48" y="54" width="24" height="12" rx="4" fill="currentColor" />
      <rect x="76" y="34" width="12" height="52" rx="4" fill="currentColor" />
      <rect x="92" y="42" width="10" height="36" rx="4" fill="currentColor" />
    </svg>
  );
}

function GymPlateVector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke="currentColor"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r="18"
        stroke="currentColor"
        strokeWidth="8"
      />
      <path
        d="M60 12V28M60 92V108M12 60H28M92 60H108"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GymKettlebellVector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M42 42C42 30 49 22 60 22C71 22 78 30 78 42"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M34 50C34 43.373 39.373 38 46 38H74C80.627 38 86 43.373 86 50V58C86 68.953 93 71.796 93 84C93 99.464 78.464 108 60 108C41.536 108 27 99.464 27 84C27 71.796 34 68.953 34 58V50Z"
        fill="currentColor"
      />
    </svg>
  );
}
