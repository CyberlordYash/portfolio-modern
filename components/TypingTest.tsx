"use client";

import {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/components/ui/Reveal";
import { SOLID } from "@/components/ui/Folio";

/* ══════════════════════════════════════════════════════════════════
   TYPING TEST

   Monkeytype-style engine. Scoring follows the usual convention:
   - WPM counts only characters in correctly typed words (+ their
     spaces), divided by 5, per minute.
   - Raw counts every typed character, right or wrong.
   - Accuracy is correct keystrokes / all keystrokes, so fixing a
     typo with backspace still costs you.

   Input goes through one hidden <input> so mobile keyboards work;
   the visible words are pure presentation.
══════════════════════════════════════════════════════════════════ */

type Mode = "time" | "words";
type Phase = "idle" | "running" | "done";
type Config = { mode: Mode; amount: number; punctuation: boolean; numbers: boolean };
type Sample = { t: number; wpm: number; raw: number; errors: number };
type Result = {
  wpm: number;
  raw: number;
  acc: number;
  consistency: number;
  seconds: number;
  chars: { correct: number; incorrect: number; extra: number; missed: number };
  samples: Sample[];
  isBest: boolean;
};

const TIME_OPTIONS = [15, 30, 60, 120];
const WORD_OPTIONS = [10, 25, 50, 100];
const ERR = "#E5484D";
const CONFIG_KEY = "typing:config";
const BEST_KEY = "typing:best";

const WORDS = (
  "the be of and a to in he have it that for they with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line city light water music story learn study question fast market code build simple river paper mind friend power night company answer idea level travel young"
).split(" ");

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

function generateWords(count: number, opts: { punctuation: boolean; numbers: boolean }, prev = "") {
  const out: string[] = [];
  let last = prev;
  for (let i = 0; i < count; i++) {
    let w = WORDS[Math.floor(Math.random() * WORDS.length)] ?? "the";
    if (w === last.replace(/[^a-z]/gi, "").toLowerCase()) w = WORDS[(WORDS.indexOf(w) + 7) % WORDS.length] ?? w;
    if (opts.numbers && Math.random() < 0.12) {
      w = String(Math.floor(Math.random() * (Math.random() < 0.5 ? 100 : 10000)));
    }
    if (opts.punctuation) {
      if (last === "" || /[.?!]$/.test(last)) w = cap(w);
      const r = Math.random();
      if (r < 0.08) w += ",";
      else if (r < 0.13) w += ".";
      else if (r < 0.15) w += "?";
      else if (r < 0.165) w += "!";
      else if (r < 0.18) w += ";";
      else if (r < 0.19) w += ":";
      else if (r < 0.21) w = `"${w}"`;
      else if (r < 0.22) w = `(${w})`;
      else if (r < 0.23) w += "-";
    }
    out.push(w);
    last = w;
  }
  return out;
}

function countChars(words: string[], typed: string[], input: string) {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;
  let wordChars = 0; // chars in fully correct words, incl. trailing space
  let raw = 0;

  typed.forEach((t, i) => {
    const w = words[i] ?? "";
    raw += t.length + 1;
    if (t === w) wordChars += w.length + 1;
    const len = Math.max(t.length, w.length);
    for (let j = 0; j < len; j++) {
      if (j >= w.length) extra++;
      else if (j >= t.length) missed++;
      else if (t[j] === w[j]) correct++;
      else incorrect++;
    }
  });

  const current = words[typed.length] ?? "";
  raw += input.length;
  if (current.startsWith(input)) wordChars += input.length;
  for (let j = 0; j < input.length; j++) {
    if (j >= current.length) extra++;
    else if (input[j] === current[j]) correct++;
    else incorrect++;
  }

  return { correct, incorrect, extra, missed, wordChars, raw };
}

const perMin = (chars: number, ms: number) => (ms > 0 ? chars / 5 / (ms / 60000) : 0);

function consistencyOf(values: number[]) {
  if (values.length < 2) return 100;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
  return Math.max(0, Math.min(100, 100 * (1 - sd / mean)));
}

const configKey = (c: Config) =>
  `${c.mode}-${c.amount}${c.punctuation ? "-p" : ""}${c.numbers ? "-n" : ""}`;

export default function TypingTest() {
  const [config, setConfig] = useState<Config>({
    mode: "time",
    amount: 30,
    punctuation: false,
    numbers: false,
  });
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [focused, setFocused] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState<Record<string, number>>({});
  const [caret, setCaret] = useState({ x: 0, y: 0, h: 0 });
  const [shift, setShift] = useState(0);
  const [lastKeyAt, setLastKeyAt] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef(0);
  const keys = useRef({ total: 0, errors: 0 });
  const samplesRef = useRef<Sample[]>([]);
  const latest = useRef({ words, typed, input, config, best });
  latest.current = { words, typed, input, config, best };

  /* ── Persisted config + personal bests ── */
  useEffect(() => {
    try {
      const c = localStorage.getItem(CONFIG_KEY);
      if (c) setConfig((cur) => ({ ...cur, ...(JSON.parse(c) as Partial<Config>) }));
      const b = localStorage.getItem(BEST_KEY);
      if (b) setBest(JSON.parse(b) as Record<string, number>);
    } catch {
      /* ignored */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
      /* ignored */
    }
  }, [config]);

  const reset = useCallback(
    (reuse?: string[]) => {
      setWords(
        reuse ??
          generateWords(config.mode === "time" ? 120 : config.amount, {
            punctuation: config.punctuation,
            numbers: config.numbers,
          }),
      );
      setTyped([]);
      setInput("");
      setPhase("idle");
      setElapsed(0);
      setResult(null);
      setShift(0);
      keys.current = { total: 0, errors: 0 };
      samplesRef.current = [];
    },
    [config],
  );

  useEffect(() => reset(), [reset]);

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  const restart = (reuse?: string[]) => {
    reset(reuse);
    focusInput();
  };

  /* ── Finish ── */
  const finish = useCallback((ms: number, finalTyped: string[], finalInput: string) => {
    const { words: w, config: c, best: b } = latest.current;
    const chars = countChars(w, finalTyped, finalInput);
    const { total, errors } = keys.current;
    const samples = samplesRef.current;
    const wpm = perMin(chars.wordChars, ms);
    const key = configKey(c);
    const isBest = wpm > 0 && wpm > (b[key] ?? 0);

    if (isBest) {
      const next = { ...b, [key]: Math.round(wpm) };
      setBest(next);
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(next));
      } catch {
        /* ignored */
      }
    }

    setResult({
      wpm,
      raw: perMin(chars.raw, ms),
      acc: total > 0 ? ((total - errors) / total) * 100 : 0,
      consistency: consistencyOf(samples.map((s) => s.raw)),
      seconds: ms / 1000,
      chars: {
        correct: chars.correct,
        incorrect: chars.incorrect,
        extra: chars.extra,
        missed: chars.missed,
      },
      samples,
      isBest,
    });
    setPhase("done");
    inputRef.current?.blur();
  }, []);

  /* ── Clock + per-second samples ── */
  useEffect(() => {
    if (phase !== "running") return;
    let lastSecond = 0;
    let lastErrors = 0;
    let lastRaw = 0;
    const id = window.setInterval(() => {
      const { words: w, typed: t, input: i, config: c } = latest.current;
      const limit = c.mode === "time" ? c.amount * 1000 : Infinity;
      const ms = Math.min(performance.now() - startRef.current, limit);
      setElapsed(ms);

      const sec = Math.floor(ms / 1000);
      if (sec > lastSecond) {
        const chars = countChars(w, t, i);
        const errors = keys.current.errors;
        samplesRef.current.push({
          t: sec,
          wpm: perMin(chars.wordChars, ms),
          raw: ((chars.raw - lastRaw) / 5) * (60 / (sec - lastSecond)),
          errors: errors - lastErrors,
        });
        lastSecond = sec;
        lastErrors = errors;
        lastRaw = chars.raw;
      }

      if (ms >= limit) finish(limit, t, i);
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, finish]);

  /* ── Caret + line scrolling ── */
  useLayoutEffect(() => {
    const word = activeWordRef.current;
    const box = boxRef.current;
    if (!word || !box) return;
    const letters = word.querySelectorAll<HTMLElement>("[data-l]");
    const first = box.querySelector<HTMLElement>("[data-w]");
    const i = input.length;
    const l = letters[Math.min(i, letters.length - 1)];
    if (!l) return;
    const x = i < letters.length ? l.offsetLeft : l.offsetLeft + l.offsetWidth;
    setCaret({ x, y: l.offsetTop, h: l.offsetHeight });
    const lineH = word.offsetHeight;
    const top = word.offsetTop - (first?.offsetTop ?? 0);
    setShift(Math.max(0, top - lineH));
  }, [input, typed.length, words]);

  useEffect(() => {
    const onResize = () => setWords((w) => [...w]);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Type anywhere to focus ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "done") return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === " ") e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") nextRef.current?.focus({ preventScroll: true });
  }, [phase]);

  /* ── Input handling ── */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (phase === "done" || words.length === 0) return;
    const value = e.target.value;
    const target = words[typed.length] ?? "";

    if (phase === "idle") {
      if (!value.trim()) return;
      startRef.current = performance.now();
      keys.current = { total: 0, errors: 0 };
      samplesRef.current = [];
      setPhase("running");
    }
    setLastKeyAt(Date.now());

    if (value.endsWith(" ")) {
      const attempt = value.slice(0, -1);
      if (attempt === "") return;
      keys.current.total++;
      if (attempt !== target) keys.current.errors++;
      const nextTyped = [...typed, attempt];
      setTyped(nextTyped);
      setInput("");
      if (config.mode === "words" && nextTyped.length >= words.length) {
        finish(performance.now() - startRef.current, nextTyped, "");
      } else if (config.mode === "time" && nextTyped.length > words.length - 40) {
        setWords((w) => [...w, ...generateWords(80, config, w[w.length - 1])]);
      }
      return;
    }

    if (value.length > input.length) {
      for (let i = input.length; i < value.length; i++) {
        keys.current.total++;
        if (value[i] !== target[i]) keys.current.errors++;
      }
    }
    const capped = value.slice(0, target.length + 12);
    setInput(capped);

    if (config.mode === "words" && typed.length === words.length - 1 && capped === target) {
      finish(performance.now() - startRef.current, typed, capped);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      restart();
      return;
    }
    if (e.key === "Escape") {
      restart();
      return;
    }
    if (e.key === "Backspace" && input === "" && typed.length > 0) {
      const prev = typed.length - 1;
      if (typed[prev] !== words[prev]) {
        e.preventDefault();
        setInput(typed[prev] ?? "");
        setTyped((t) => t.slice(0, -1));
      }
    }
  };

  const setOption = (patch: Partial<Config>) => {
    setConfig((c) => ({ ...c, ...patch }));
    focusInput();
  };

  /* ── Live numbers ── */
  const live = countChars(words, typed, input);
  const liveWpm = phase === "running" && elapsed > 1000 ? Math.round(perMin(live.wordChars, elapsed)) : 0;
  const progress =
    config.mode === "time"
      ? String(Math.max(0, Math.ceil(config.amount - elapsed / 1000)))
      : `${typed.length}/${config.amount}`;
  const typing = Date.now() - lastKeyAt < 600;
  const personalBest = best[configKey(config)];
  const options = config.mode === "time" ? TIME_OPTIONS : WORD_OPTIONS;

  return (
    <section aria-label="Typing speed test" className="flex flex-1 flex-col py-8">
      {/* ── Config ── */}
      <div
        className={`flex flex-wrap items-center justify-center gap-3 transition-opacity duration-500 ${
          phase === "running" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex gap-5 bg-[var(--surface-2)] px-5 py-3">
          <Toggle active={config.punctuation} onClick={() => setOption({ punctuation: !config.punctuation })}>
            @ punctuation
          </Toggle>
          <Toggle active={config.numbers} onClick={() => setOption({ numbers: !config.numbers })}>
            # numbers
          </Toggle>
        </div>
        <div className="flex gap-5 bg-[var(--surface-2)] px-5 py-3">
          <Toggle active={config.mode === "time"} onClick={() => setOption({ mode: "time", amount: 30 })}>
            ◷ time
          </Toggle>
          <Toggle active={config.mode === "words"} onClick={() => setOption({ mode: "words", amount: 25 })}>
            A words
          </Toggle>
        </div>
        <div className="flex gap-5 bg-[var(--surface-2)] px-5 py-3">
          {options.map((n) => (
            <Toggle key={n} active={config.amount === n} onClick={() => setOption({ amount: n })}>
              {n}
            </Toggle>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {phase !== "done" || !result ? (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-1 flex-col justify-center py-10"
          >
            {/* ── Live bar ── */}
            <div className="flex h-12 items-baseline justify-between gap-6">
              <span className="flex items-baseline gap-6">
                <span
                  className="display num transition-opacity"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--mark)", opacity: phase === "running" ? 1 : 0.35 }}
                >
                  {phase === "running" ? progress : config.mode === "time" ? config.amount : `0/${config.amount}`}
                </span>
                {phase === "running" && <span className="micro num">{liveWpm} wpm</span>}
              </span>
              <span className="micro num">{personalBest ? `PB ${personalBest} wpm` : "No PB yet"}</span>
            </div>

            {/* ── Words ── */}
            <div
              className="relative mt-4 cursor-text select-none font-mono"
              style={{ fontSize: "clamp(1.3rem, 2.4vw, 2rem)" }}
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onPaste={(e) => e.preventDefault()}
                aria-label="Type the words shown"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="absolute left-0 top-0 h-px w-px opacity-0"
              />

              <div
                className={`h-[6.6em] overflow-hidden transition-[filter,opacity] duration-300 ${
                  focused ? "" : "opacity-40 blur-[3px]"
                }`}
              >
                <div
                  ref={boxRef}
                  className="relative flex flex-wrap transition-transform duration-200 ease-out"
                  style={{ transform: `translateY(-${shift}px)` }}
                >
                  {words.map((w, wi) => {
                    const active = wi === typed.length;
                    const t = wi < typed.length ? typed[wi] ?? "" : active ? input : null;
                    const wrong = wi < typed.length && t !== w;
                    const extra = t && t.length > w.length ? t.slice(w.length) : "";
                    return (
                      <span
                        key={wi}
                        data-w
                        ref={active ? activeWordRef : undefined}
                        className="mr-[0.6em] inline-block h-[2.2em] leading-[2.2em]"
                        style={wrong ? { textDecoration: `underline ${ERR}`, textUnderlineOffset: "0.3em" } : undefined}
                      >
                        {w.split("").map((c, ci) => {
                          let color = "var(--ink-3)";
                          if (t !== null && ci < t.length) color = t[ci] === c ? "var(--ink)" : ERR;
                          return (
                            <span key={ci} data-l style={{ color }}>
                              {c}
                            </span>
                          );
                        })}
                        {extra.split("").map((c, ci) => (
                          <span key={`x${ci}`} data-l style={{ color: ERR, opacity: 0.6 }}>
                            {c}
                          </span>
                        ))}
                      </span>
                    );
                  })}

                  {words.length > 0 && focused && (
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute left-0 top-0 w-[2px] rounded-full transition-transform duration-100 ease-out ${
                        typing ? "" : "animate-pulse"
                      }`}
                      style={{
                        background: "var(--mark)",
                        height: caret.h,
                        transform: `translate(${caret.x}px, ${caret.y}px)`,
                      }}
                    />
                  )}
                </div>
              </div>

              {!focused && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="micro text-ink">Click here or start typing</span>
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => restart()}
                aria-label="Restart test"
                title="Restart test"
                className="px-4 py-2 text-2xl text-ink3 transition-colors hover:text-ink"
              >
                ↻
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-live="polite"
            className="flex flex-1 flex-col justify-center py-10"
          >
            <ResultView result={result} config={config} />
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button ref={nextRef} type="button" onClick={() => restart()} className={SOLID}>
                Next test ↗
              </button>
              <button type="button" onClick={() => restart(words)} className="elink micro self-center">
                Repeat this test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="micro flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span>
          <Kbd>tab</Kbd> — restart test
        </span>
        <span>
          <Kbd>esc</Kbd> — reset
        </span>
      </div>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mr-1 bg-[var(--surface-3)] px-1.5 py-0.5 font-mono normal-case text-ink">{children}</kbd>;
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="micro transition-colors hover:text-ink"
      style={{ color: active ? "var(--mark)" : undefined }}
    >
      {children}
    </button>
  );
}

function ResultView({ result, config }: { result: Result; config: Config }) {
  const stats = [
    { k: "Raw", v: Math.round(result.raw) },
    {
      k: "Characters",
      v: `${result.chars.correct}/${result.chars.incorrect}/${result.chars.extra}/${result.chars.missed}`,
      title: "correct / incorrect / extra / missed",
    },
    { k: "Consistency", v: `${Math.round(result.consistency)}%` },
    { k: "Time", v: `${result.seconds.toFixed(result.seconds < 10 ? 1 : 0)}s` },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="flex gap-10 lg:col-span-3 lg:flex-col lg:gap-6">
        <div>
          <span className="micro">wpm</span>
          <div className="display num" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", color: "var(--mark)" }}>
            {Math.round(result.wpm)}
          </div>
          {result.isBest && <span className="micro text-ink">★ New personal best</span>}
        </div>
        <div>
          <span className="micro">acc</span>
          <div className="display num" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            {Math.round(result.acc)}%
          </div>
        </div>
      </div>

      <div className="lg:col-span-9">
        <Chart samples={result.samples} />
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-6 md:grid-cols-5">
          <div>
            <dt className="micro">Test</dt>
            <dd className="num mt-2 text-ink">
              {config.mode} {config.amount}
              {config.punctuation ? " · @" : ""}
              {config.numbers ? " · #" : ""}
            </dd>
          </div>
          {stats.map((s) => (
            <div key={s.k} title={s.title}>
              <dt className="micro">{s.k}</dt>
              <dd className="num mt-2 text-ink">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function Chart({ samples }: { samples: Sample[] }) {
  if (samples.length < 2) {
    return <div className="micro grid h-40 place-items-center border border-rule">Too short to chart</div>;
  }
  const W = 600;
  const H = 160;
  const P = 8;
  const maxT = samples[samples.length - 1]?.t ?? 1;
  const maxV = Math.max(10, ...samples.map((s) => Math.max(s.wpm, s.raw))) * 1.1;
  const x = (t: number) => P + ((t - 1) / Math.max(1, maxT - 1)) * (W - 2 * P);
  const y = (v: number) => H - P - (v / maxV) * (H - 2 * P);
  const line = (key: "wpm" | "raw") => samples.map((s) => `${x(s.t).toFixed(1)},${y(s[key]).toFixed(1)}`).join(" ");

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none" role="img" aria-label="WPM over time">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="var(--rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
        <polyline points={line("raw")} fill="none" stroke="var(--ink-3)" strokeWidth={1.5} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <polyline points={line("wpm")} fill="none" stroke="var(--mark)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        {samples
          .filter((s) => s.errors > 0)
          .map((s) => (
            <line
              key={s.t}
              x1={x(s.t)}
              x2={x(s.t)}
              y1={y(s.raw)}
              y2={y(s.raw)}
              stroke={ERR}
              strokeWidth={6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
      </svg>
      <figcaption className="micro mt-3 flex flex-wrap gap-x-6 gap-y-1">
        <span style={{ color: "var(--mark)" }}>— wpm</span>
        <span>- - raw</span>
        <span style={{ color: ERR }}>● errors</span>
        <span className="ml-auto num">peak {Math.round(Math.max(...samples.map((s) => s.wpm)))} wpm</span>
      </figcaption>
    </figure>
  );
}
