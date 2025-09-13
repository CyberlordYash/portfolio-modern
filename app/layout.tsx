import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yash Sachan | Software Engineer",
  description:
    "Portfolio of Yash Sachan – Software Engineer specializing in Backend Development, Golang, Java, Spring Boot, APIs, Cloud, and High-Frequency Trading (HFT).",
  keywords: [
    "Yash Sachan",
    "Portfolio",
    "Software Engineer",
    "Backend Developer",
    "Golang",
    "Spring Boot",
    "High Frequency Trading",
    "HFT",
    "API Development",
    "IIIT Sonepat",
    "Full Stack Developer",
  ],
  authors: [{ name: "Yash Sachan", url: "https://yashsachan.in" }],
  creator: "Yash Sachan",
  publisher: "Yash Sachan",
  metadataBase: new URL("https://yashsachan.in"),
  openGraph: {
    title: "Yash Sachan | Software Engineer Portfolio",
    description:
      "Explore the portfolio of Yash Sachan, a Software Engineer skilled in Golang, Java, Spring Boot, API design, and HFT systems.",
    url: "https://yashsachan.in",
    siteName: "Yash Sachan Portfolio",
    images: [
      {
        url: "https://yashsachan.in/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "Yash Sachan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yashsachan.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KNCPRRLQFR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KNCPRRLQFR');
            `,
          }}
        />

        {/* Schema.org structured data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Yash Sachan",
              url: "https://yashsachan.in",
              sameAs: [
                "https://www.linkedin.com/in/yashsachan",
                "https://github.com/yashsachan",
                "https://leetcode.com/yashsachan",
              ],
              jobTitle: "Software Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Zanskar Research",
              },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "IIIT Sonepat",
              },
              knowsAbout: [
                "Golang",
                "Spring Boot",
                "Java",
                "Backend Development",
                "High Frequency Trading",
                "API Development",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
