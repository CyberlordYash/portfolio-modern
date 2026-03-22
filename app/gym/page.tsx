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
type TaskKey = keyof Omit<GymChecklist, "date">;

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
    restDay: false,
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

const workoutItems = [
  { key: "protein", label: "Taken Protein" },
  { key: "creatine", label: "Taken Creatine" },
  { key: "running", label: "Running" },
  { key: "weightLifting", label: "Weight Lifting" },
  { key: "abs", label: "Abs" },
] as const;

const allItems = [
  ...workoutItems,
  { key: "restDay", label: "Rest Day" },
] as const;

function getCompletedCount(entry: GymChecklist | GymEntry) {
  if (entry.restDay) {
    return workoutItems.length;
  }

  return workoutItems.filter((item) => entry[item.key]).length;
}

function getProgressState(completedCount: number) {
  if (completedCount >= 5) {
    return {
      stroke: "stroke-emerald-500 dark:stroke-emerald-400",
      text: "text-emerald-700 dark:text-emerald-300",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.18)]",
    };
  }

  if (completedCount >= 3) {
    return {
      stroke: "stroke-amber-500 dark:stroke-amber-400",
      text: "text-amber-700 dark:text-amber-300",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.18)]",
    };
  }

  return {
    stroke: "stroke-red-500 dark:stroke-red-400",
    text: "text-red-700 dark:text-red-300",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.18)]",
  };
}

export default function GymPage() {
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [checklist, setChecklist] = useState<GymChecklist>(
    createInitialChecklist(),
  );
  const [entries, setEntries] = useState<GymEntry[]>([]);
  const [requestError, setRequestError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const completedCount = useMemo(
    () => getCompletedCount(checklist),
    [checklist],
  );

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch(
          `/api/gym?date=${encodeURIComponent(selectedDate)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load gym tracker");
        }

        const data = (await response.json()) as {
          entries?: GymEntry[];
          entry?: GymEntry | null;
          admin?: boolean;
        };

        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setIsAdmin(Boolean(data.admin));
        setChecklist(
          data.entry
            ? {
                date: data.entry.date,
                protein: data.entry.protein,
                creatine: data.entry.creatine,
                running: data.entry.running,
                weightLifting: data.entry.weightLifting,
                abs: data.entry.abs,
                restDay: data.entry.restDay,
              }
            : createInitialChecklist(selectedDate),
        );
      } catch (error) {
        console.error(error);
        setRequestError("Unable to load gym tracker right now.");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    void loadEntries();
  }, [selectedDate]);

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

      setIsAdmin(true);
      setShowAdminLogin(false);
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
      setIsAdmin(false);
      setPassword("");
      setHasError(false);
      setShowAdminLogin(false);
    }
  };

  const toggleTask = (task: TaskKey) => {
    setChecklist((current) => {
      if (task === "restDay") {
        const nextRestDay = !current.restDay;

        return {
          ...current,
          protein: nextRestDay ? false : current.protein,
          creatine: nextRestDay ? false : current.creatine,
          running: nextRestDay ? false : current.running,
          weightLifting: nextRestDay ? false : current.weightLifting,
          abs: nextRestDay ? false : current.abs,
          restDay: nextRestDay,
        };
      }

      return {
        ...current,
        [task]: !current[task],
        restDay: false,
      };
    });
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
        setIsAdmin(false);
        setShowAdminLogin(true);
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
          restDay: data.entry.restDay,
        });
      }
    } catch (error) {
      console.error(error);
      setRequestError("Unable to save today's gym ticks right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressState = getProgressState(completedCount);

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

            {isAdmin ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-400/40 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-red-200"
              >
                <LogOut className="h-4 w-4" />
                Exit Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLogin((current) => !current)}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.25em] text-red-700 transition hover:border-red-500/40 hover:text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200 dark:hover:text-red-100"
              >
                <LockKeyhole className="h-4 w-4" />
                Admin Login
              </button>
            )}
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
            <Dumbbell className="h-3.5 w-3.5" />
            Gym
          </div>
        </div>

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
                    Daily progress.
                  </h2>
                  <p className="max-w-2xl font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
                    I store my daily progress here. You can only see it.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
                <StatCard
                  label="Done"
                  value={checklist.restDay ? "REST" : `${completedCount}/5`}
                  helper={formatDate(selectedDate)}
                />
                <StatCard
                  label="Saved Days"
                  value={String(entries.length).padStart(2, "0")}
                  helper="Tracked"
                />
              </div>
            </div>

            {showAdminLogin && !isAdmin && (
              <div className="mb-6 rounded-[1.75rem] border border-red-500/20 bg-white/75 p-5 backdrop-blur-xl dark:bg-white/[0.03]">
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                      Admin Access
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      Unlock gym
                    </h2>
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (hasError) {
                        setHasError(false);
                      }
                    }}
                    placeholder="Enter admin password"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                  />

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
            )}

            {requestError && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-300">
                {requestError}
              </div>
            )}

            {isCheckingAuth ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-red-600 dark:text-red-300" />
                <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                  Loading gym
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-6">
                  <div className="flex flex-col items-center gap-6">
                    <ProgressRing
                      completedCount={completedCount}
                      isRestDay={checklist.restDay}
                    />

                    <div className="w-full">
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
                    </div>

                    <div className="w-full space-y-3">
                      {allItems.map((item) => {
                        const checked = checklist[item.key];
                        const isDisabled = !isAdmin;

                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => (isAdmin ? toggleTask(item.key) : null)}
                            disabled={isDisabled}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                              checked
                                ? "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200"
                                : "border-slate-200 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-black/30 dark:text-slate-300"
                            } ${isDisabled ? "cursor-default" : ""}`}
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

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-red-700 transition hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200"
                      >
                        {isSubmitting ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Save Day
                      </button>
                    )}
                  </div>
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
                      public
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
                        const count = getCompletedCount(entry);
                        const state = getProgressState(count);

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
                                restDay: entry.restDay,
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
                              <p className={`mt-1 font-mono text-[10px] uppercase tracking-[0.22em] ${state.text}`}>
                                {entry.restDay ? "rest day" : `${count}/5 complete`}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <MiniRing
                                completedCount={count}
                                isRestDay={entry.restDay}
                              />
                              <div className="grid grid-cols-6 gap-1">
                                {allItems.map((item) => (
                                  <span
                                    key={item.key}
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      entry[item.key]
                                        ? item.key === "restDay"
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                        : "bg-slate-200 dark:bg-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
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

function ProgressRing({
  completedCount,
  isRestDay,
}: {
  completedCount: number;
  isRestDay: boolean;
}) {
  const total = 5;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = (completedCount / total) * circumference;
  const state = getProgressState(completedCount);

  return (
    <div className={`relative flex h-44 w-44 items-center justify-center rounded-full bg-white/70 dark:bg-white/[0.03] ${state.glow}`}>
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="stroke-slate-200 dark:stroke-white/10"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={state.stroke}
          strokeWidth="10"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${state.text}`}>
          {isRestDay ? "REST" : `${completedCount}/5`}
        </span>
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          {isRestDay ? "Recovery" : "Daily Progress"}
        </span>
      </div>
    </div>
  );
}

function MiniRing({
  completedCount,
  isRestDay,
}: {
  completedCount: number;
  isRestDay: boolean;
}) {
  const total = 5;
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = (completedCount / total) * circumference;
  const state = getProgressState(completedCount);

  return (
    <div className="relative h-10 w-10">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-slate-200 dark:stroke-white/10"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={state.stroke}
          strokeWidth="4"
          fill="none"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-[9px] font-mono ${state.text}`}>
        {isRestDay ? "R" : completedCount}
      </div>
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
