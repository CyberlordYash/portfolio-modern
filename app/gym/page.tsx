"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Rise } from "@/components/ui/Reveal";
import { ErrorLine, FIELD, PageFoot, PageHead, SOLID, TopBar } from "@/components/ui/Folio";
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

function weekday(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(parsed);
}

const workoutItems = [
  { key: "protein" as const, label: "Protein" },
  { key: "creatine" as const, label: "Creatine" },
  { key: "running" as const, label: "Running" },
  { key: "weightLifting" as const, label: "Weights" },
  { key: "abs" as const, label: "Abs" },
];

const allItems = [...workoutItems, { key: "restDay" as const, label: "Rest day" }];

function getCompletedCount(entry: GymChecklist | GymEntry) {
  if (entry.restDay) return workoutItems.length;
  return workoutItems.filter((item) => entry[item.key]).length;
}

function statusLabel(count: number, rest: boolean) {
  if (rest) return "Rest";
  if (count >= 5) return "Perfect";
  if (count >= 3) return "Going";
  if (count > 0) return "Started";
  return "Not yet";
}

function computeStreak(entries: GymEntry[]): number {
  if (entries.length === 0) return 0;
  const dateSet = new Set(entries.map((e) => e.date));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;
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

function getLast7Days(entries: GymEntry[]) {
  const dateMap = new Map(entries.map((e) => [e.date, e]));
  const result: Array<{ date: string; status: "done" | "rest" | "missed" }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0] ?? "";
    const entry = dateMap.get(ds);
    result.push({ date: ds, status: entry ? (entry.restDay ? "rest" : "done") : "missed" });
  }
  return result;
}

const toChecklist = (e: GymEntry): GymChecklist => ({
  date: e.date,
  protein: e.protein,
  creatine: e.creatine,
  running: e.running,
  weightLifting: e.weightLifting,
  abs: e.abs,
  restDay: e.restDay,
});

function Segments({ count, rest, size = "lg" }: { count: number; rest: boolean; size?: "lg" | "sm" }) {
  return (
    <div className={`grid grid-cols-5 ${size === "lg" ? "h-3 gap-1.5" : "h-1.5 w-20 gap-0.5"}`}>
      {workoutItems.map((_, i) => (
        <span
          key={i}
          className="transition-colors duration-500"
          style={{
            background: rest
              ? "var(--ink-3)"
              : i < count
                ? "var(--ink)"
                : "var(--rule)",
          }}
        />
      ))}
    </div>
  );
}

export default function GymPage() {
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const weekHits = last7Days.filter((d) => d.status !== "missed").length;

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
        setChecklist(data.entry ? toChecklist(data.entry) : createInitialChecklist(selectedDate));
      } catch {
        setRequestError("Unable to load the tracker right now.");
      } finally {
        setIsLoading(false);
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
      if (!res.ok) {
        setHasError(true);
        return;
      }
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
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      /* ignored */
    }
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
      if (res.status === 401) {
        setIsAdmin(false);
        setShowAdminLogin(true);
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { entries?: GymEntry[]; entry?: GymEntry };
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      if (data.entry) setChecklist(toChecklist(data.entry));
    } catch {
      setRequestError("Unable to save this entry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { k: "Selected day", v: checklist.restDay ? "Rest" : `${completedCount}/5` },
    { k: "Streak", v: `${String(streak).padStart(2, "0")}d` },
    { k: "This week", v: `${weekHits}/7` },
    { k: "Days logged", v: String(entries.length).padStart(2, "0") },
  ];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="shell py-10 md:py-14">
        <TopBar>
          {isAdmin ? (
            <button type="button" onClick={handleLogout} className="elink micro text-ink">
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
          mark="G"
          label="Training"
          line1="Showing up"
          line2="is the program."
          meta={
            <>
              <span className="micro num">
                {streak > 0 ? `${streak} day streak` : "Streak starts today"}
              </span>
              <span className="micro">Public view · admin edit</span>
            </>
          }
          intro="The same discipline as the day job, applied to the body: small inputs, logged daily, compounding."
        />

        {/* ── Admin login ── */}
        <AnimatePresence initial={false}>
          {showAdminLogin && !isAdmin && (
            <motion.form
              key="login"
              onSubmit={handleUnlock}
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
                      if (hasError) setHasError(false);
                    }}
                    placeholder="Password"
                    autoFocus
                    className={`${FIELD} font-mono text-sm`}
                  />
                  {hasError && (
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

        {requestError && (
          <div className="mb-8">
            <ErrorLine>{requestError}</ErrorLine>
          </div>
        )}

        {/* ── Stats ── */}
        <dl className="grid grid-cols-2 gap-x-10 gap-y-8 border-y border-rule py-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Rise key={s.k} delay={i * 0.05}>
              <dt className="micro">{s.k}</dt>
              <dd className="display num mt-3" style={{ fontSize: "clamp(1.8rem, 3.6vw, 3rem)" }}>
                {s.v}
              </dd>
            </Rise>
          ))}
        </dl>

        {/* ── Last 7 days ── */}
        <Rise className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="micro">Last seven days</span>
            <span className="micro">■ Trained · ▨ Rest · □ Missed</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((d) => (
              <div key={d.date} title={`${formatDate(d.date)} · ${d.status}`}>
                <div
                  className="h-10 border md:h-14"
                  style={{
                    borderColor: d.status === "missed" ? "var(--rule)" : "var(--ink)",
                    background:
                      d.status === "done"
                        ? "var(--ink)"
                        : d.status === "rest"
                          ? "repeating-linear-gradient(135deg, var(--ink) 0 1px, transparent 1px 6px)"
                          : "transparent",
                  }}
                />
                <span className="micro mt-2 block text-center">{weekday(d.date)}</span>
              </div>
            ))}
          </div>
        </Rise>

        {isLoading ? (
          <p className="micro py-24 text-center">Loading…</p>
        ) : (
          <div className="mt-20 grid grid-cols-1 gap-x-14 gap-y-16 lg:grid-cols-12">
            {/* ── Day ── */}
            <section className="lg:col-span-5">
              <Rise className="flex items-baseline justify-between gap-4">
                <span className="micro">The day</span>
                <span className="micro">{isAdmin ? "Editable" : "Read only"}</span>
              </Rise>

              <div className="mt-4 border-t border-ink pt-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const d = e.target.value;
                    setSelectedDate(d);
                    setChecklist(createInitialChecklist(d));
                  }}
                  className={`${FIELD} font-mono text-sm`}
                />

                <div className="mt-8 flex items-end justify-between gap-4">
                  <span className="display num" style={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}>
                    {checklist.restDay ? (
                      <span className="ink-italic">Rest</span>
                    ) : (
                      <>
                        {completedCount}
                        <span className="text-ink3">/5</span>
                      </>
                    )}
                  </span>
                  <span className="micro pb-3">
                    {statusLabel(completedCount, checklist.restDay)}
                  </span>
                </div>
                <div className="mt-4">
                  <Segments count={completedCount} rest={checklist.restDay} />
                </div>

                <ul className="mt-10 border-t border-rule">
                  {allItems.map((item) => {
                    const checked = checklist[item.key];
                    return (
                      <li key={item.key} className="border-b border-rule">
                        <button
                          type="button"
                          onClick={() => (isAdmin ? toggleTask(item.key) : undefined)}
                          disabled={!isAdmin}
                          aria-pressed={checked}
                          className={`group flex w-full items-center justify-between gap-4 py-4 text-left ${
                            isAdmin ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <span className="flex items-center gap-4">
                            <span
                              className="grid h-4 w-4 place-items-center border transition-colors duration-300"
                              style={{
                                borderColor: checked ? "var(--ink)" : "var(--rule-strong)",
                                background: checked ? "var(--ink)" : "transparent",
                              }}
                            >
                              {checked && (
                                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                                  <path
                                    d="M2 6.5 5 9l5-6"
                                    fill="none"
                                    stroke="var(--paper)"
                                    strokeWidth={1.8}
                                  />
                                </svg>
                              )}
                            </span>
                            <span
                              className={`text-[1.0625rem] tracking-[-0.01em] transition-colors ${
                                checked ? "text-ink" : "text-ink2"
                              } ${item.key === "restDay" ? "ink-italic" : ""}`}
                            >
                              {item.label}
                            </span>
                          </span>
                          <span className="micro">{checked ? "Done" : "—"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className={`${SOLID} mt-8 w-full`}
                  >
                    {isSubmitting ? "Saving…" : "Save entry ↗"}
                  </button>
                )}
              </div>
            </section>

            {/* ── History ── */}
            <section className="lg:col-span-7">
              <Rise className="flex items-baseline justify-between gap-4">
                <span className="micro">History</span>
                <span className="micro num">{entries.length} days</span>
              </Rise>

              <div className="mt-4 max-h-[640px] overflow-y-auto border-t border-ink">
                {entries.length === 0 ? (
                  <p className="py-16 text-center">
                    <span className="display ink-italic" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                      Nothing logged yet.
                    </span>
                  </p>
                ) : (
                  entries.map((entry) => {
                    const count = getCompletedCount(entry);
                    const selected = selectedDate === entry.date;
                    return (
                      <button
                        key={entry.date}
                        type="button"
                        onClick={() => {
                          setSelectedDate(entry.date);
                          setChecklist(toChecklist(entry));
                        }}
                        className={`group grid w-full grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-rule px-2 py-4 text-left transition-colors hover:bg-paper2 ${
                          selected ? "bg-paper2" : ""
                        }`}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="micro w-8">{weekday(entry.date)}</span>
                          <span className="num text-[0.9375rem] text-ink transition-transform duration-500 ease-out group-hover:translate-x-1">
                            {formatDate(entry.date)}
                          </span>
                        </span>
                        <Segments count={count} rest={entry.restDay} size="sm" />
                        <span className="micro num w-16 text-right">
                          {entry.restDay ? "Rest" : `${count}/5`}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        )}

        <PageFoot label="Training" />
      </div>
    </main>
  );
}
