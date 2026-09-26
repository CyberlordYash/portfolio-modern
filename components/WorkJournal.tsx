"use client";

import { useEffect, useMemo, useState } from "react";
import { Rise } from "@/components/ui/Reveal";
import { ErrorLine, FIELD, PageHead, SOLID } from "@/components/ui/Folio";
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
        (a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
      ),
    [entries],
  );

  const latestEntry = sortedEntries[0];
  const wordCount = draft.note.trim() ? draft.note.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setRequestError("");
        const res = await fetch("/api/worklog", { cache: "no-store" });
        if (res.status === 401) {
          onUnauthorized?.();
          return;
        }
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { entries?: WorklogEntry[] };
        setEntries(Array.isArray(data.entries) ? data.entries : []);
      } catch {
        setRequestError("Unable to load the worklog right now.");
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
      if (res.status === 401) {
        onUnauthorized?.();
        return;
      }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      setRequestError("");
      const res = await fetch(`/api/worklog?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.status === 401) {
        onUnauthorized?.();
        return;
      }
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
    <>
      <PageHead
        mark="L"
        label="Worklog"
        line1="What got built,"
        line2="day by day."
        meta={
          <>
            <span className="micro num">
              {isLoading ? "Syncing…" : `${String(sortedEntries.length).padStart(2, "0")} entries`}
            </span>
            <span className="micro num">
              {latestEntry ? `Last · ${formatDisplayDate(latestEntry.date)}` : "No entries yet"}
            </span>
          </>
        }
      />

      {/* ── Editor ── */}
      <Rise>
        <section className="mb-20 grid grid-cols-1 gap-6 border-t border-ink pt-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="micro">{draft.id ? "Editing entry" : "New entry"}</span>
            {wordCount > 0 && <p className="micro num mt-2">{wordCount} words</p>}
          </div>
          <div className="flex flex-col gap-4 md:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr]">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((c) => ({ ...c, date: e.target.value }))}
                className={`${FIELD} font-mono text-sm`}
              />
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))}
                placeholder="Headline — e.g. cut order-ack p99 by 40%"
                className={`${FIELD} text-[1.0625rem]`}
              />
            </div>
            <textarea
              value={draft.note}
              onChange={(e) => setDraft((c) => ({ ...c, note: e.target.value }))}
              placeholder="What you built, what blocked you, what shipped…"
              rows={8}
              className={`${FIELD} resize-y text-[0.9375rem] leading-[1.8]`}
            />
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !draft.title.trim() || !draft.note.trim()}
                className={SOLID}
              >
                {isSubmitting ? "Saving…" : draft.id ? "Update entry ↗" : "Save entry ↗"}
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

      {requestError && (
        <div className="mb-8">
          <ErrorLine>{requestError}</ErrorLine>
        </div>
      )}

      {/* ── Timeline ── */}
      <Rise className="mb-6 flex items-baseline justify-between gap-4">
        <span className="micro">Timeline</span>
        <span className="micro">Newest first</span>
      </Rise>

      <div className="border-t border-rule">
        {isLoading ? (
          <p className="micro border-b border-rule py-16 text-center">Syncing…</p>
        ) : sortedEntries.length === 0 ? (
          <div className="border-b border-rule py-20 text-center">
            <p className="display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              <span className="ink-italic">Nothing logged yet.</span>
            </p>
            <p className="micro mt-4">Save the first entry above.</p>
          </div>
        ) : (
          sortedEntries.map((entry, i) => (
            <Rise key={entry.id} delay={Math.min(i, 6) * 0.04}>
              <article
                className={`grid grid-cols-1 gap-x-10 gap-y-3 border-b border-rule py-8 md:grid-cols-12 ${
                  draft.id === entry.id ? "bg-paper2" : ""
                }`}
              >
                <div className="flex items-baseline gap-4 md:col-span-3 md:flex-col md:gap-2">
                  <span className="micro num text-ink">{formatDisplayDate(entry.date)}</span>
                  <span className="micro num">{formatTimestamp(entry.updatedAt)}</span>
                </div>
                <div className="md:col-span-7">
                  <h3 className="h3">{entry.title}</h3>
                  <p className="copy mt-3 whitespace-pre-wrap text-[0.9375rem]">{entry.note}</p>
                </div>
                <div className="flex gap-6 md:col-span-2 md:flex-col md:items-end md:gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    disabled={isSubmitting}
                    className="elink micro text-ink disabled:opacity-40"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={isSubmitting}
                    className="elink micro disabled:opacity-40"
                    style={{ color: "var(--mark)" }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            </Rise>
          ))
        )}
      </div>
    </>
  );
}
