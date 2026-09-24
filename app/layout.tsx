import type { Metadata, Viewport } from "next";
import { Inter_Tight, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import SmoothScroll from "@/components/SmoothScroll";

/* ── Type pairing ────────────────────────────────────────────────
   Two faces, and the contrast between them is the whole system.

   Inter Tight is the grotesk, and it is loaded *with its italics* on
   purpose: headings are set as a roman first line answered by an
   italic second line, so the italic is structural here rather than
   decorative. Light weights (300) carry the display sizes — the
   earlier pass used 600 uppercase, which read as a poster shouting.

   Space Mono handles every piece of marginalia: nav, section labels,
   dates, indices, captions. It is a quirky face rather than a neutral
   one, which is deliberate — a perfectly plain mono next to a plain
   grotesk gives a page no voice at all.

   Quicksand and Orbitron are gone. Legacy call sites naming them are
   aliased onto the grotesk in globals.css, so the sub-pages stay
   styled while the remaining sections are converted. */
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

// 1. Dynamic Viewport Configuration
// One theme, so one chrome colour — this used to be a light/dark pair
// fixed up at runtime by the solar provider.
export const viewport: Viewport = {
  themeColor: "#F2F2F3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// 2. SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Yash Sachan | Software Engineer",
    template: "%s | Yash Sachan", // Allows sub-pages to look like "Projects | Yash Sachan"
  },
  description:
    "Software Engineer specializing in High-Performance Backend Systems, Golang, and HFT Infrastructure. Building scalable distributed systems at Zanskar Research.",
  keywords: [
    "Yash Sachan",
    "Backend Engineer",
    "Software Engineer",
    "Golang Developer",
    "HFT Engineer",
    "Spring Boot",
    "Distributed Systems",

    "High Frequency Trading",
    "HFT",
    "API Development",
    "IIIT Sonepat",
    "Zanskar Research",
    "Java Spring Boot",
  ],
  authors: [{ name: "Yash Sachan", url: "https://yashsachan.com" }],
  creator: "Yash Sachan",
  metadataBase: new URL("https://yashsachan.com"),

  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yash Sachan | Backend & Systems Engineer",
    description: "Specializing in Golang, HFT, and Low-Latency Infrastructure.",
    url: "https://yashsachan.com",
    siteName: "Yash Sachan Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Sachan | Software Engineer",
    description: "Backend Developer specializing in Golang and HFT Systems.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* No `dark` class and no solar pre-paint script. The palette is a
       constant now, so there is nothing to resolve before first paint —
       which also removes the blocking inline script that used to sit
       ahead of the body. */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${mono.variable} font-sans antialiased`}
      >
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <PageLoader />
        <SmoothScroll>
          <main className="relative z-10">{children}</main>
        </SmoothScroll>

        {/* Structured Data: Professional Person Schema */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Yash Sachan",
              url: "https://yashsachan.com",
              jobTitle: "Software Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Zanskar Research",
              },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "IIIT Sonepat",
              },
              description:
                "Software Engineer focused on Backend, HFT, and distributed systems.",
              sameAs: [
                "https://github.com/cyberlordyash",
                "https://www.linkedin.com/in/yashsachan321/",
                "https://leetcode.com/u/yashsachan/",
              ],
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-KNCPRRLQFR`}
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KNCPRRLQFR');
            `,
          }}
        />
      </body>
    </html>
  );
}
