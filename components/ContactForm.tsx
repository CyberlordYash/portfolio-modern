"use client";

import React, { useState } from "react";
import { Rise } from "@/components/ui/Reveal";

/* ══════════════════════════════════════════════════════════════════
   CONTACT FORM — delivered via Netlify Forms

   No API route, no email service account, no secret keys anywhere in
   this codebase. Netlify watches for a POST carrying a `form-name`
   field matching a form it has registered, and relays it straight to
   an email notification configured in the Netlify dashboard — the
   whole backend is infrastructure you already have by hosting here,
   not code this project has to run or a credential it has to hold.

   ── The one piece of setup this doesn't do for you ──
   Netlify only emails a notification if one is turned on. After the
   first deploy: Netlify dashboard → this site → Forms → the "contact"
   form → Settings → add an email notification. Nothing in the repo
   can flip that switch — it lives in Netlify's UI, not in code.

   ── Why the submission is a manual fetch, not a plain <form action> ──
   A plain HTML form submission is a full page navigation, which would
   blow away the whole single-page app and its scroll state. Posting
   with fetch() to the same endpoint Netlify intercepts keeps the
   visitor on the page and lets this show a real success state instead
   of a reload.

   ── Why public/__forms.html exists ──
   Netlify detects a form by scanning the *static* HTML in the build
   output at deploy time — it isn't watching what this component
   renders in the browser. A hidden, genuinely static duplicate of this
   form's fields lives at public/__forms.html purely so Netlify's
   crawler has something unambiguous to register. If a field is ever
   added here, it has to be added there too, with an identical `name`,
   or Netlify will discard it as an unrecognised field.
══════════════════════════════════════════════════════════════════ */

type Status = "idle" | "sending" | "sent" | "error";

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

const FIELD =
  "w-full border-b border-rule bg-transparent py-3 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-ink";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Netlify's spam trap: a field real visitors never see or fill, that
  // bots filling every input blindly will. Anything in it and Netlify
  // silently drops the submission rather than notifying anyone.
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          name,
          email,
          message,
          "bot-field": botField,
        }),
      });
      // Netlify's own endpoint returns 200 even for a spam-trapped
      // submission — it accepts the request either way and drops it
      // internally, so a non-2xx here means the request itself failed
      // (offline, blocked), not that the message was rejected.
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <Rise>
        <div className="border-t border-ink pt-6">
          <p className="h3">Got it — thanks.</p>
          <p className="copy mt-2 text-sm">
            I read these myself and reply within a day or two.
          </p>
        </div>
      </Rise>
    );
  }

  return (
    <Rise>
      <form
        name="contact"
        onSubmit={handleSubmit}
        className="border-t border-ink pt-6"
      >
        {/* Netlify reads this to match the submission to the form it
            registered from public/__forms.html — without it, a fetch
            POST with the right fields still gets rejected as
            belonging to no known form. */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Off-screen, not display:none — screen readers should still
            skip it (a sighted bot ignores CSS anyway; this is for the
            rare visitor using assistive tech who'd otherwise have a
            confusing extra field read aloud). */}
        <p className="sr-only">
          <label>
            Leave this field empty
            <input
              tabIndex={-1}
              autoComplete="off"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
            />
          </label>
        </p>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <label className="block">
            <span className="micro">Name</span>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${FIELD} mt-2`}
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="micro">Email</span>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${FIELD} mt-2`}
              placeholder="you@example.com"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="micro">Message</span>
            <textarea
              name="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${FIELD} mt-2 resize-none`}
              placeholder="What's this about?"
            />
          </label>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-3 bg-ink px-7 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-transform duration-500 ease-out hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {status === "sending" ? "Sending…" : "Send message"}
            {status !== "sending" && <span>↗</span>}
          </button>

          {status === "error" && (
            <span className="micro text-mark">
              Didn&apos;t go through — try the email link below instead.
            </span>
          )}
        </div>
      </form>
    </Rise>
  );
}
