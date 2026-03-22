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

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function WorkJournal({
  onUnauthorized,
}: {
  onUnauthorized?: () => void;
}) {
  const [entries, setEntries] = useState<WorklogEntry[]>([]);
  const [draft, setDraft] = useState<DraftEntry>(createInitialDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((first, second) =>
        second.date.localeCompare(first.date) ||
        second.updatedAt.localeCompare(first.updatedAt),
      ),
    [entries],
  );

  const latestEntry = sortedEntries[0];
  const totalUpdates = sortedEntries.length;

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true);
        setRequestError("");

        const response = await fetch("/api/worklog", { cache: "no-store" });

        if (response.status === 401) {
          onUnauthorized?.();
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load worklog entries");
        }

        const data = (await response.json()) as { entries?: WorklogEntry[] };
        setEntries(Array.isArray(data.entries) ? data.entries : []);
      } catch (error) {
        console.error(error);
        setRequestError("Unable to load your online notes right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEntries();
  }, [onUnauthorized]);

  const handleSubmit = async () => {
    const title = draft.title.trim();
    const note = draft.note.trim();

    if (!title || !note) {
      return;
    }

    try {
      setIsSubmitting(true);
      setRequestError("");

      const response = await fetch("/api/worklog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draft.id,
          date: draft.date,
          title,
          note,
        }),
      });

      if (response.status === 401) {
        onUnauthorized?.();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to save entry");
      }

      const data = (await response.json()) as { entries?: WorklogEntry[] };
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      setDraft(createInitialDraft());
    } catch (error) {
      console.error(error);
      setRequestError("Unable to save this note right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: WorklogEntry) => {
    setDraft({
      id: entry.id,
      date: entry.date,
      title: entry.title,
      note: entry.note,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");

      const response = await fetch(`/api/worklog?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        onUnauthorized?.();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to delete entry");
      }

      const data = (await response.json()) as { entries?: WorklogEntry[] };
      setEntries(Array.isArray(data.entries) ? data.entries : []);
      setDraft((currentDraft) =>
        currentDraft.id === id ? createInitialDraft() : currentDraft,
      );
    } catch (error) {
      console.error(error);
      setRequestError("Unable to delete this note right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-cyan-50 px-4 py-8 text-slate-900 dark:border-white/[0.06] dark:bg-gradient-to-br dark:from-slate-950 dark:via-black dark:to-slate-950 dark:text-slate-200 md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:26px_26px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Daily Work Vault
            </div>
            <div className="space-y-2">
              <h2 className="bg-gradient-to-b from-slate-950 to-slate-500 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-500 md:text-5xl">
                Company updates, saved online.
              </h2>
              <p className="max-w-2xl font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">
                Log what you shipped, fixed, or learned each day. Entries are
                now stored through your backend, so they stay available after
                deployment and across devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
            <StatsCard
              label="Entries"
              value={String(totalUpdates).padStart(2, "0")}
              helper={isLoading ? "Syncing..." : "Stored online"}
            />
            <StatsCard
              label="Last Update"
              value={latestEntry ? formatDisplayDate(latestEntry.date) : "--"}
              helper={latestEntry ? latestEntry.title : "No notes yet"}
            />
          </div>
        </div>

        {requestError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-red-600 dark:text-red-300">
            {requestError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                  Entry Editor
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {draft.id ? "Refine existing note" : "Capture today's work"}
                </h3>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                {draft.id ? "Edit Mode" : "Ready"}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-500">
                  Date
                </span>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        date: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-11 pr-4 font-mono text-sm text-slate-800 outline-none transition focus:border-blue-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-500">
                  Headline
                </span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Ex: Optimized order execution service"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 font-Quicksand text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-500">
                  Daily Note
                </span>
                <textarea
                  value={draft.note}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      note: event.target.value,
                    }))
                  }
                  placeholder="Write what you built, blockers you handled, and key outcomes..."
                  rows={8}
                  className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-white/90 px-4 py-4 font-Quicksand text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500/50 dark:border-white/10 dark:bg-black/40 dark:text-slate-200 dark:placeholder:text-slate-600"
                />
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !draft.title.trim() || !draft.note.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-blue-700 transition hover:border-blue-500/60 hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:border-blue-400/60 dark:hover:bg-blue-500/20"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {draft.id ? "Update Entry" : "Save Entry"}
                </button>

                <button
                  type="button"
                  onClick={() => setDraft(createInitialDraft())}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/80 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-700 transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06]"
                >
                  Reset Draft
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] md:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
                  Stored Notes
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  Worklog timeline
                </h3>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500 dark:border-white/10 dark:bg-black/30 dark:text-slate-400">
                backend-sync
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                  <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-cyan-600 dark:text-cyan-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Syncing notes
                  </p>
                  <p className="mt-2 font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Loading your worklog from the server.
                  </p>
                </div>
              ) : sortedEntries.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-black/20">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    No entries saved yet
                  </p>
                  <p className="mt-2 font-Quicksand text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Start with today&apos;s update and it will appear here
                    automatically.
                  </p>
                </div>
              ) : (
                sortedEntries.map((entry, index) => (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 transition hover:border-cyan-500/30 hover:bg-cyan-50/60 dark:border-white/10 dark:bg-black/30 dark:hover:border-cyan-400/30 dark:hover:bg-black/40"
                  >
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-700 dark:border-cyan-400/15 dark:bg-cyan-400/10 dark:text-cyan-200">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDisplayDate(entry.date)}
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {entry.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(entry)}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 transition hover:border-blue-500/40 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-blue-400/40 dark:hover:text-blue-200"
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 transition hover:border-red-500/40 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-red-400/40 dark:hover:text-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap font-Quicksand text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {entry.note}
                    </p>

                    <div className="mt-4 border-t border-slate-200 pt-3 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 dark:border-white/5">
                      Synced {formatTimestamp(entry.updatedAt)}
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

function StatsCard({
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
