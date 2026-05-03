"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CalendarDays,
  LoaderCircle,
  PencilLine,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { WorklogEntry } from "@/lib/worklog-store";

type DraftEntry = {
  id: string | null;
  date: string;
  title: string;
  note: string;
};

const createInitialDraft = (): DraftEntry => ({
  id: null,
  date: getTodayDate(),
  title: "",
  note: "",
});

function getTodayDate() {
  return new Date().toISOString().split("T")[0] ?? "";
}

function formatDisplayDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function WorkJournal({ onUnauthorized }: { onUnauthorized?: () => void }) {
  const [entries, setEntries] = useState<WorklogEntry[]>([]);
  const [draft, setDraft] = useState<DraftEntry>(createInitialDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
      ),
    [entries],
  );

  const latestEntry = sortedEntries[0];
  const totalUpdates = sortedEntries.length;
  const wordCount = draft.note.trim() ? draft.note.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setRequestError("");
        const res = await fetch("/api/worklog", { cache: "no-store" });
        if (res.status === 401) { onUnauthorized?.(); return; }
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { entries?: WorklogEntry[] };
        setEntries(Array.isArray(data.entries) ? data.entries : []);
      } catch {
        setRequestError("Unable to load your worklog right now.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [onUnauthorized]);

  const handleSubmit = async () => {
    const title = draft.title.trim();
    const note = draft.note.trim();
    if (!title || !note) return;
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch("/api/worklog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id, date: draft.date, title, note }),
      });
      if (res.status === 401) { onUnauthorized?.(); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { entries?: WorklogEntry[] };
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      setDraft(createInitialDraft());
    } catch {
      setRequestError("Unable to save this entry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: WorklogEntry) => {
    setDraft({ id: entry.id, date: entry.date, title: entry.title, note: entry.note });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch(`/api/worklog?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.status === 401) { onUnauthorized?.(); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { entries?: WorklogEntry[] };
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      setDraft((cur) => (cur.id === id ? createInitialDraft() : cur));
    } catch {
      setRequestError("Unable to delete this entry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[rgba(10,15,28,0.6)] backdrop-blur-sm">
      {/* Inner ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.04),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,0.04),transparent_45%)]" />

      <div className="relative z-10 px-4 py-8 md:px-8 md:py-10">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.05] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.38em] text-cyan-400">
              <BriefcaseBusiness className="h-3 w-3" />
              Sys · Work Log
            </div>
            <h2 className="font-Orbitron text-3xl font-bold tracking-tight text-white md:text-[2.6rem]">
              Daily Notes
            </h2>
            <p className="max-w-md font-Quicksand text-sm text-slate-500 md:text-base">
              My private work journal — captured daily, secured by auth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[288px]">
            <StatCard
              label="Entries"
              value={String(totalUpdates).padStart(2, "0")}
              helper={isLoading ? "Syncing..." : "Saved"}
              color="cyan"
            />
            <StatCard
              label="Last Entry"
              value={latestEntry ? formatDisplayDate(latestEntry.date) : "--"}
              helper={latestEntry ? latestEntry.title : "No notes yet"}
              color="violet"
            />
          </div>
        </div>

        {requestError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-red-400">
            {requestError}
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Editor panel */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-slate-600">
                  Entry Editor
                </p>
                <h3 className="mt-1.5 font-Orbitron text-base font-semibold text-white">
                  {draft.id ? "Editing Entry" : "New Entry"}
                </h3>
              </div>
              <div
                className={`rounded-lg border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] ${
                  draft.id
                    ? "border-amber-500/20 bg-amber-500/[0.06] text-amber-300"
                    : "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                }`}
              >
                {draft.id ? "Edit" : "Ready"}
              </div>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-slate-600">
                  Date
                </span>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) =>
                      setDraft((cur) => ({ ...cur, date: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-3 pl-10 pr-4 font-mono text-sm text-slate-300 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-slate-600">
                  Headline
                </span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((cur) => ({ ...cur, title: e.target.value }))
                  }
                  placeholder="Optimized order execution pipeline..."
                  className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 font-Quicksand text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-slate-600">
                    Notes
                  </span>
                  {wordCount > 0 && (
                    <span className="font-mono text-[9px] text-slate-700">
                      {wordCount}w
                    </span>
                  )}
                </div>
                <textarea
                  value={draft.note}
                  onChange={(e) =>
                    setDraft((cur) => ({ ...cur, note: e.target.value }))
                  }
                  placeholder="What you built, blockers handled, key outcomes..."
                  rows={9}
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/40 px-4 py-4 font-Quicksand text-sm leading-relaxed text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !draft.title.trim() || !draft.note.trim()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {draft.id ? "Update" : "Save Entry"}
                </button>

                {draft.id && (
                  <button
                    type="button"
                    onClick={() => setDraft(createInitialDraft())}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 transition hover:border-white/[0.14] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timeline panel */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-slate-600">
                  Timeline
                </p>
                <h3 className="mt-1.5 font-Orbitron text-base font-semibold text-white">
                  Work Log
                </h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                online
              </div>
            </div>

            <div className="max-h-[560px] space-y-3 overflow-y-auto pr-0.5">
              {isLoading ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] px-5 py-14 text-center">
                  <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-cyan-500" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-700">
                    Syncing...
                  </p>
                </div>
              ) : sortedEntries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] px-5 py-14 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-700">
                    No entries yet
                  </p>
                  <p className="mt-2 font-Quicksand text-xs text-slate-700">
                    Save your first entry to see it here.
                  </p>
                </div>
              ) : (
                sortedEntries.map((entry, index) => (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className={`group relative rounded-xl border p-4 transition-all ${
                      draft.id === entry.id
                        ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1]"
                    }`}
                  >
                    {/* Left accent bar */}
                    <div
                      className={`absolute left-0 top-4 bottom-4 w-[2px] rounded-full transition-all ${
                        draft.id === entry.id ? "bg-cyan-400" : "bg-white/[0.06] group-hover:bg-cyan-500/30"
                      }`}
                    />

                    <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5 min-w-0">
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-cyan-400">
                          <CalendarDays className="h-3 w-3" />
                          {formatDisplayDate(entry.date)}
                        </div>
                        <h4 className="font-Quicksand text-sm font-semibold text-white leading-snug">
                          {entry.title}
                        </h4>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(entry)}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 transition hover:border-cyan-500/30 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <PencilLine className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 transition hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap font-Quicksand text-xs leading-relaxed text-slate-500">
                      {entry.note}
                    </p>

                    <div className="mt-3 border-t border-white/[0.05] pt-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-700">
                      Synced · {formatTimestamp(entry.updatedAt)}
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const border = color === "cyan" ? "border-cyan-500/15" : "border-violet-500/15";
  const bg = color === "cyan" ? "bg-cyan-500/[0.04]" : "bg-violet-500/[0.04]";
  const valColor = color === "cyan" ? "text-cyan-300" : "text-violet-300";
  return (
    <div className={`rounded-xl border p-4 ${border} ${bg}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-slate-700">
        {label}
      </p>
      <p className={`mt-2.5 font-Orbitron text-lg font-bold ${valColor} truncate`}>
        {value}
      </p>
      <p className="mt-1.5 truncate font-Quicksand text-xs text-slate-600">{helper}</p>
    </div>
  );
}
