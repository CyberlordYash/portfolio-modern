import type { Metadata } from "next";
import TypingTest from "@/components/TypingTest";
import { PageFoot, TopBar } from "@/components/ui/Folio";

/* Server component on purpose: the test itself is client-only, but
   everything a crawler should read — headings, explanatory copy, the
   FAQ, structured data — ships as static HTML around it. */

const PAGE_URL = "https://yashsachan.com/typing";
const TITLE = "Typing Speed Test – Free WPM & Accuracy Test Online";
const DESCRIPTION =
  "Take a free online typing speed test. Measure your words per minute (WPM), accuracy and consistency in a clean, Monkeytype-style typing test — 15, 30, 60 or 120 second and word-count modes, with punctuation and numbers.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "typing test",
    "typing speed test",
    "wpm test",
    "words per minute test",
    "free typing test",
    "online typing test",
    "1 minute typing test",
    "60 second typing test",
    "typing speed checker",
    "check typing speed",
    "typing accuracy test",
    "keyboard typing test",
    "typing practice",
    "monkeytype",
    "monkeytype alternative",
    "typing test with punctuation",
  ],
  alternates: { canonical: "/typing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const SPEEDS = [
  { range: "Below 30", label: "Beginner", note: "Hunting for keys; accuracy matters more than speed here." },
  { range: "30 – 45", label: "Average", note: "Where most people land. Comfortable for everyday work." },
  { range: "45 – 65", label: "Above average", note: "Touch typing, rarely looking at the keyboard." },
  { range: "65 – 90", label: "Fast", note: "Fast enough for professional typing and transcription." },
  { range: "90+", label: "Very fast", note: "Competitive typist territory." },
];

const TIPS = [
  "Keep your fingers on the home row — ASDF and JKL; — and return to it after every key.",
  "Look at the screen, not the keyboard. It feels slower for a week, then it's much faster.",
  "Chase accuracy first. Speed follows; every backspace costs more than a slow keystroke.",
  "Type in short daily sessions. Ten focused minutes beat an hour once a week.",
  "Practise with punctuation and numbers on — real text has both.",
];

const FAQ = [
  {
    q: "How is typing speed (WPM) calculated?",
    a: "Words per minute counts every five characters as one word. This test counts only characters in correctly typed words (plus the spaces after them), divides by five, and divides by the minutes elapsed. Raw WPM counts every character you typed, including mistakes.",
  },
  {
    q: "What is a good typing speed?",
    a: "The average typing speed is roughly 40 WPM. Anything above 60 WPM is considered fast, and professional typists usually sit between 70 and 90 WPM with 95%+ accuracy.",
  },
  {
    q: "How is accuracy measured?",
    a: "Accuracy is the share of your keystrokes that were correct. Correcting a typo with backspace still counts the original mistake, so accuracy reflects how cleanly you typed, not just the final text.",
  },
  {
    q: "What does consistency mean?",
    a: "Consistency measures how steady your raw speed was from second to second. A higher percentage means an even rhythm; a low one means bursts and pauses.",
  },
  {
    q: "Is this typing test free?",
    a: "Yes — free, no sign-up, no ads. Your personal bests are stored in your browser only.",
  },
  {
    q: "How is this different from Monkeytype?",
    a: "It uses the same minimal approach — time and word modes, punctuation and numbers, live WPM and a per-second chart — in a lightweight page with nothing to install or log into.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Typing Speed Test",
      url: PAGE_URL,
      description: DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Yash Sachan", url: "https://yashsachan.com" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://yashsachan.com" },
        { "@type": "ListItem", position: 2, name: "Typing Speed Test", item: PAGE_URL },
      ],
    },
  ],
};

function SectionHead({ mark, label, title }: { mark: string; label: string; title: string }) {
  return (
    <div className="mb-8 border-t border-ink pt-6">
      <div className="flex items-center gap-3">
        <span className="sec-num">{mark}</span>
        <span className="micro">— {label}</span>
      </div>
      <h2 className="display mt-5" style={{ fontSize: "var(--t-h2)" }}>
        {title}
      </h2>
    </div>
  );
}

export default function TypingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* First screen: compact heading + the test, nothing else. */}
      <div className="shell flex min-h-[100svh] flex-col pt-6 md:pt-8">
        <TopBar>
          <span className="micro">Free · no sign-up</span>
        </TopBar>

        <header className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="display" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)" }}>
            Typing speed test <span className="ink-italic text-ink3">— how fast are you?</span>
          </h1>
          <span className="micro">WPM · accuracy · consistency</span>
        </header>

        <TypingTest />
      </div>

      <div className="shell pb-10 md:pb-14">
        <p className="copy border-t border-rule pt-10">
          A free, minimal typing test in the spirit of Monkeytype. Start typing to begin — the clock
          starts on your first keystroke. Check your words per minute, accuracy and rhythm, then
          beat your personal best.
        </p>

        <div className="mt-20 grid grid-cols-1 gap-x-14 gap-y-24 lg:grid-cols-12">
          <section className="lg:col-span-6">
            <SectionHead mark="01" label="Method" title="How the typing test works" />
            <div className="copy space-y-5">
              <p>
                Pick a <strong>timed test</strong> (15, 30, 60 or 120 seconds) or a{" "}
                <strong>word-count test</strong> (10, 25, 50 or 100 words). Turn on punctuation or
                numbers for a harder, more realistic run.
              </p>
              <p>
                Type the words as they appear and press space to move on. Mistakes are marked
                in red; you can backspace into a previous word if it has an error. When you
                finish you get your <strong>WPM</strong>, <strong>raw WPM</strong>,{" "}
                <strong>accuracy</strong>, <strong>consistency</strong> and a second-by-second chart.
              </p>
              <p>
                Press <kbd className="font-mono">Tab</kbd> to restart instantly, or{" "}
                <kbd className="font-mono">Esc</kbd> to reset.
              </p>
            </div>
          </section>

          <section className="lg:col-span-6">
            <SectionHead mark="02" label="Benchmarks" title="What is a good typing speed?" />
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-ink">
                  <th className="micro py-3 font-normal">WPM</th>
                  <th className="micro py-3 font-normal">Level</th>
                  <th className="micro hidden py-3 font-normal md:table-cell">What it means</th>
                </tr>
              </thead>
              <tbody>
                {SPEEDS.map((s) => (
                  <tr key={s.range} className="border-b border-rule">
                    <td className="num py-4 pr-4 text-ink">{s.range}</td>
                    <td className="py-4 pr-4 text-ink">{s.label}</td>
                    <td className="hidden py-4 text-ink2 md:table-cell">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="lg:col-span-6">
            <SectionHead mark="03" label="Practice" title="How to type faster" />
            <ol className="border-t border-rule">
              {TIPS.map((t, i) => (
                <li key={t} className="flex gap-6 border-b border-rule py-4">
                  <span className="micro num pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink2">{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="lg:col-span-6">
            <SectionHead mark="04" label="FAQ" title="Typing test questions" />
            <div className="border-t border-rule">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-rule py-4">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 text-ink">
                    <h3 className="text-[1.0625rem] tracking-[-0.01em]">{f.q}</h3>
                    <span className="micro transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink2">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <PageFoot label="Typing test" />
      </div>
    </div>
  );
}
