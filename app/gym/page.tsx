"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Dumbbell,
  Flame,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Moon,
  ShieldCheck,
  Zap,
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
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

const workoutItems = [
  { key: "protein" as const, label: "Protein", icon: "⚡" },
  { key: "creatine" as const, label: "Creatine", icon: "🔬" },
  { key: "running" as const, label: "Running", icon: "🏃" },
  { key: "weightLifting" as const, label: "Weights", icon: "💪" },
  { key: "abs" as const, label: "Abs", icon: "🎯" },
];

const allItems = [
  ...workoutItems,
  { key: "restDay" as const, label: "Rest Day", icon: "🌙" },
];

function getCompletedCount(entry: GymChecklist | GymEntry) {
  if (entry.restDay) return workoutItems.length;
  return workoutItems.filter((item) => entry[item.key]).length;
}

type ProgressState = {
  stroke: string;
  text: string;
  glow: string;
  glowFaint: string;
  label: string;
  bg: string;
  border: string;
};

function getProgressState(completedCount: number, isRestDay = false): ProgressState {
  if (isRestDay) {
    return {
      stroke: "#ffffff",
      text: "text-ink/70",
      glow: "rgb(var(--ink-rgb) / 0.2)",
      glowFaint: "rgb(var(--ink-rgb) / 0.06)",
      label: "Rest",
      bg: "bg-ink/[0.06]",
      border: "border-ink/20",
    };
  }
  if (completedCount >= 5) {
    return {
      stroke: "#ffffff",
      text: "text-ink",
      glow: "rgb(var(--ink-rgb) / 0.35)",
      glowFaint: "rgb(var(--ink-rgb) / 0.12)",
      label: "Perfect",
      bg: "bg-ink/[0.08]",
      border: "border-ink/30",
    };
  }
  if (completedCount >= 3) {
    return {
      stroke: "#ffffff",
      text: "text-ink/85",
      glow: "rgb(var(--ink-rgb) / 0.25)",
      glowFaint: "rgb(var(--ink-rgb) / 0.09)",
      label: "Going",
      bg: "bg-ink/[0.06]",
      border: "border-ink/20",
    };
  }
  return {
    stroke: "#ffffff",
    text: "text-ink/60",
    glow: "rgb(var(--ink-rgb) / 0.18)",
    glowFaint: "rgb(var(--ink-rgb) / 0.06)",
    label: "Started",
    bg: "bg-ink/[0.05]",
    border: "border-ink/15",
  };
}

function computeStreak(entries: GymEntry[]): number {
  if (entries.length === 0) return 0;
  const dateSet = new Set(entries.map((e) => e.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const cursor = new Date(today);
  while (true) {
    const ds = cursor.toISOString().split("T")[0];
    if (ds && dateSet.has(ds)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getLast7Days(
  entries: GymEntry[],
): Array<{ date: string; status: "done" | "rest" | "missed" }> {
  const dateMap = new Map(entries.map((e) => [e.date, e]));
  const result: Array<{ date: string; status: "done" | "rest" | "missed" }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0] ?? "";
    const entry = dateMap.get(ds);
    if (entry) {
      result.push({ date: ds, status: entry.restDay ? "rest" : "done" });
    } else {
      result.push({ date: ds, status: "missed" });
    }
  }
  return result;
}

export default function GymPage() {
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [checklist, setChecklist] = useState<GymChecklist>(createInitialChecklist());
  const [entries, setEntries] = useState<GymEntry[]>([]);
  const [requestError, setRequestError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const completedCount = useMemo(() => getCompletedCount(checklist), [checklist]);
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const last7Days = useMemo(() => getLast7Days(entries), [entries]);
  const progressState = getProgressState(completedCount, checklist.restDay);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/gym?date=${encodeURIComponent(selectedDate)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as {
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
      } catch {
        setRequestError("Unable to load gym tracker right now.");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    void load();
  }, [selectedDate]);

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
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword("");
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch("/api/admin/auth", { method: "DELETE" }); } catch { /* ignored */ }
    setIsAdmin(false);
    setPassword("");
    setHasError(false);
    setShowAdminLogin(false);
  };

  const toggleTask = (task: TaskKey) => {
    setChecklist((cur) => {
      if (task === "restDay") {
        const next = !cur.restDay;
        return {
          ...cur,
          protein: next ? false : cur.protein,
          creatine: next ? false : cur.creatine,
          running: next ? false : cur.running,
          weightLifting: next ? false : cur.weightLifting,
          abs: next ? false : cur.abs,
          restDay: next,
        };
      }
      return { ...cur, [task]: !cur[task], restDay: false };
    });
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch("/api/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checklist),
      });
      if (res.status === 401) { setIsAdmin(false); setShowAdminLogin(true); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { entries?: GymEntry[]; entry?: GymEntry };
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
    } catch {
      setRequestError("Unable to save today's gym entry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onClick={handleLogout}
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

          <div className="flex flex-wrap items-center gap-2.5">
            {streak > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/20 bg-ink/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/85">
                <Flame className="h-3 w-3" />
                {streak}d streak
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-ink/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
              Gym Tracker
            </div>
          </div>
        </div>

        {/* ── Main card ── */}
        <section className="relative overflow-hidden rounded-2xl border border-rule bg-transparent">
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgb(var(--ink-rgb) / 0.04),transparent_45%),radial-gradient(circle_at_85%_85%,rgb(var(--ink-rgb) / 0.04),transparent_45%)]" />
          {/* Decorative SVGs */}
          <div className="pointer-events-none absolute -right-6 top-4 opacity-[0.06]">
            <CircuitSvg className="h-48 w-48 text-ink" />
          </div>
          <div className="pointer-events-none absolute -left-4 bottom-6 opacity-[0.05]">
            <HexSvg className="h-36 w-36 text-ink" />
          </div>

          <div className="relative z-10 px-4 py-8 md:px-8 md:py-10">
            {/* ── Title row ── */}
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-ink/[0.05] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.38em] text-ink/70">
                  <Dumbbell className="h-3 w-3" />
                  Sys · Gym Log
                </div>

                <h1 className="font-Orbitron text-3xl font-bold tracking-tight text-ink md:text-[2.6rem]">
                  Daily Progress
                </h1>

                <p className="max-w-md text-sm text-ink/50 md:text-base">
                  My workout tracking system — public view, admin edit.
                </p>

                {/* 7-day heat row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-ink/30">
                    7d
                  </span>
                  {last7Days.map((day) => (
                    <div
                      key={day.date}
                      title={`${formatDate(day.date)} · ${day.status}`}
                      className={`h-5 w-5 rounded-md transition-all ${
                        day.status === "done"
                          ? "bg-ink/80 shadow-[0_0_7px_rgb(var(--ink-rgb) / 0.5)]"
                          : day.status === "rest"
                            ? "bg-ink/40 shadow-[0_0_7px_rgb(var(--ink-rgb) / 0.3)]"
                            : "border border-rule bg-ink/[0.04]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3 md:min-w-[288px]">
                <StatCard
                  label="Today"
                  value={checklist.restDay ? "REST" : `${completedCount}/5`}
                  helper={formatDate(selectedDate)}
                  color="cyan"
                />
                <StatCard
                  label="Log Days"
                  value={String(entries.length).padStart(2, "0")}
                  helper="Tracked"
                  color="violet"
                />
              </div>
            </div>

            {/* ── Admin login ── */}
            {showAdminLogin && !isAdmin && (
              <div className="mb-6 rounded-xl border border-ink/15 bg-ink/[0.025] p-5">
                <form onSubmit={handleUnlock} className="space-y-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                      Admin Access
                    </p>
                    <h2 className="mt-1.5 font-Orbitron text-lg font-semibold text-ink">
                      Unlock System
                    </h2>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="Enter admin password"
                    className="w-full rounded-xl border border-ink/10 bg-transparent px-4 py-3 font-mono text-sm text-ink/90 outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-1 focus:ring-ink/20"
                  />
                  {hasError && (
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

            {requestError && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
                {requestError}
              </div>
            )}

            {/* ── Main grid ── */}
            {isCheckingAuth ? (
              <div className="rounded-xl border border-dashed border-rule bg-transparent px-5 py-16 text-center">
                <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-ink" />
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-ink/40">
                  Initializing...
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
                {/* ── Left panel ── */}
                <div className="rounded-xl border border-rule bg-ink/[0.02] p-5 md:p-6">
                  <div className="flex flex-col items-center gap-6">
                    <ProgressRing
                      completedCount={completedCount}
                      isRestDay={checklist.restDay}
                    />

                    {/* Date picker */}
                    <div className="w-full">
                      <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                        Date
                      </p>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          const d = e.target.value;
                          setSelectedDate(d);
                          setChecklist(createInitialChecklist(d));
                        }}
                        className="mt-2 w-full rounded-xl border border-rule bg-transparent px-4 py-3 font-mono text-sm text-ink/75 outline-none transition focus:border-ink/40 focus:ring-1 focus:ring-ink/10"
                      />
                    </div>

                    {/* Checklist */}
                    <div className="w-full space-y-2">
                      {allItems.map((item) => {
                        const checked = checklist[item.key];
                        const isRest = item.key === "restDay";
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => (isAdmin ? toggleTask(item.key) : undefined)}
                            disabled={!isAdmin}
                            className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                              checked
                                ? isRest
                                  ? "border-ink/20 bg-ink/[0.05] shadow-[0_0_14px_rgb(var(--ink-rgb) / 0.05)]"
                                  : "border-ink/30 bg-ink/[0.08] shadow-[0_0_14px_rgb(var(--ink-rgb) / 0.06)]"
                                : "border-rule bg-ink/[0.015] hover:border-rule"
                            } ${!isAdmin ? "cursor-default" : "cursor-pointer"}`}
                          >
                            <span
                              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-xs transition-all ${
                                checked
                                  ? isRest
                                    ? "border-ink/30 bg-ink/15 text-ink/80"
                                    : "border-ink/40 bg-ink/20 text-ink"
                                  : "border-rule bg-ink/[0.03] text-ink/40"
                              }`}
                            >
                              {checked ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <span className="text-[11px]">{item.icon}</span>
                              )}
                            </span>
                            <span
                              className={`text-sm font-semibold transition-colors ${
                                checked
                                  ? isRest
                                    ? "text-ink/80"
                                    : "text-ink"
                                  : "text-ink/50 group-hover:text-ink/75"
                              }`}
                            >
                              {item.label}
                            </span>
                            {checked && (
                              <span className="ml-auto opacity-60">
                                {isRest ? (
                                  <Moon className="h-3 w-3 text-ink/70" />
                                ) : (
                                  <Zap className="h-3 w-3 text-ink" />
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isSubmitting ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Save Entry
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Right panel: History ── */}
                <div className="rounded-xl border border-rule bg-ink/[0.02] p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-ink/40">
                        Log
                      </p>
                      <h3 className="mt-1.5 font-Orbitron text-lg font-semibold text-ink">
                        History
                      </h3>
                    </div>
                    <div className="rounded-lg border border-rule bg-ink/[0.03] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/40">
                      public
                    </div>
                  </div>

                  <div className="max-h-[460px] space-y-2 overflow-y-auto pr-0.5">
                    {entries.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-rule px-5 py-14 text-center">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/30">
                          No entries yet
                        </p>
                      </div>
                    ) : (
                      entries.map((entry) => {
                        const count = getCompletedCount(entry);
                        const state = getProgressState(count, entry.restDay);
                        const isSelected = selectedDate === entry.date;
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
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                              isSelected
                                ? `${state.border} ${state.bg}`
                                : "border-rule bg-ink/[0.015] hover:border-rule"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink">
                                {formatDate(entry.date)}
                              </p>
                              <p
                                className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] ${state.text}`}
                              >
                                {entry.restDay ? "rest day" : `${count}/5 done`}
                              </p>
                            </div>
                            <div className="ml-3 flex flex-shrink-0 items-center gap-3">
                              <MiniRing
                                completedCount={count}
                                isRestDay={entry.restDay}
                              />
                              <div className="grid grid-cols-6 gap-1">
                                {allItems.map((item) => (
                                  <span
                                    key={item.key}
                                    className={`h-2 w-2 rounded-sm transition-all ${
                                      entry[item.key]
                                        ? item.key === "restDay"
                                          ? "bg-ink/50 shadow-[0_0_4px_rgb(var(--ink-rgb) / 0.4)]"
                                          : "bg-ink shadow-[0_0_4px_rgb(var(--ink-rgb) / 0.5)]"
                                        : "bg-ink/[0.07]"
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
  color,
}: {
  label: string;
  value: string;
  helper: string;
  color: "cyan" | "violet";
}) {
  const border = color === "cyan" ? "border-ink/15" : "border-ink/10";
  const bg = color === "cyan" ? "bg-ink/[0.05]" : "bg-ink/[0.03]";
  const valColor = color === "cyan" ? "text-ink" : "text-ink/70";
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

function ProgressRing({
  completedCount,
  isRestDay,
}: {
  completedCount: number;
  isRestDay: boolean;
}) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (completedCount / 5) * circumference;
  const state = getProgressState(completedCount, isRestDay);

  return (
    <div
      className="relative flex h-44 w-44 items-center justify-center rounded-full"
      style={{
        boxShadow: `0 0 40px ${state.glow}, 0 0 80px ${state.glowFaint}`,
      }}
    >
      <div className="absolute inset-0 rounded-full border border-rule" />
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
        {/* Track ring */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="rgb(var(--ink-rgb) / 0.05)"
          strokeWidth="8"
          fill="none"
        />
        {/* Segment tick marks */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * 2 * Math.PI;
          const x1 = 80 + (radius - 3) * Math.cos(angle);
          const y1 = 80 + (radius - 3) * Math.sin(angle);
          const x2 = 80 + (radius + 7) * Math.cos(angle);
          const y2 = 80 + (radius + 7) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgb(var(--ink-rgb) / 0.1)"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Progress arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          stroke={state.stroke}
          strokeWidth="8"
          fill="none"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-Orbitron text-2xl font-bold text-ink"
          style={{ textShadow: `0 0 20px ${state.stroke}` }}
        >
          {isRestDay ? "REST" : `${completedCount}/5`}
        </span>
        <span className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.4em] text-ink/40">
          {state.label}
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
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const progress = (completedCount / 5) * circumference;
  const state = getProgressState(completedCount, isRestDay);
  return (
    <div className="relative h-8 w-8">
      <svg className="h-8 w-8 -rotate-90" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r={radius} stroke="rgb(var(--ink-rgb) / 0.07)" strokeWidth="3" fill="none" />
        <circle
          cx="17"
          cy="17"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          stroke={state.stroke}
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold ${state.text}`}>
        {isRestDay ? "R" : completedCount}
      </div>
    </div>
  );
}

function CircuitSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <rect x="20" y="20" width="160" height="160" rx="6" stroke="currentColor" strokeWidth="1" />
      <rect x="50" y="50" width="100" height="100" rx="4" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" />
      <line x1="150" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="20" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <line x1="100" y1="150" x2="100" y2="180" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="5" fill="currentColor" />
      <circle cx="20" cy="20" r="5" fill="currentColor" />
      <circle cx="180" cy="20" r="5" fill="currentColor" />
      <circle cx="20" cy="180" r="5" fill="currentColor" />
      <circle cx="180" cy="180" r="5" fill="currentColor" />
      <line x1="56" y1="56" x2="68" y2="68" stroke="currentColor" strokeWidth="1" />
      <line x1="144" y1="56" x2="132" y2="68" stroke="currentColor" strokeWidth="1" />
      <line x1="56" y1="144" x2="68" y2="132" stroke="currentColor" strokeWidth="1" />
      <line x1="144" y1="144" x2="132" y2="132" stroke="currentColor" strokeWidth="1" />
      <rect x="90" y="44" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="44" y="90" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="148" y="90" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="90" y="148" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function HexSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
      <polygon points="70,8 122,38 122,102 70,132 18,102 18,38" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="70,28 104,48 104,88 70,108 36,88 36,48" stroke="currentColor" strokeWidth="1" />
      <polygon points="70,48 88,58 88,82 70,92 52,82 52,58" stroke="currentColor" strokeWidth="1" />
      <circle cx="70" cy="70" r="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="70" y1="8" x2="70" y2="28" stroke="currentColor" strokeWidth="1" />
      <line x1="122" y1="38" x2="104" y2="48" stroke="currentColor" strokeWidth="1" />
      <line x1="122" y1="102" x2="104" y2="88" stroke="currentColor" strokeWidth="1" />
      <line x1="70" y1="132" x2="70" y2="108" stroke="currentColor" strokeWidth="1" />
      <line x1="18" y1="102" x2="36" y2="88" stroke="currentColor" strokeWidth="1" />
      <line x1="18" y1="38" x2="36" y2="48" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
