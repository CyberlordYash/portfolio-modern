import type { Metadata, Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

// 1. Dynamic Viewport Configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
  authors: [{ name: "Yash Sachan", url: "https://yashsachan.in" }],
  creator: "Yash Sachan",
  metadataBase: new URL("https://yashsachan.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yash Sachan | Backend & Systems Engineer",
    description: "Specializing in Golang, HFT, and Low-Latency Infrastructure.",
    url: "https://yashsachan.com",
    siteName: "Yash Sachan Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yash Sachan - Systems Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Sachan | Software Engineer",
    description: "Backend Developer specializing in Golang and HFT Systems.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative z-10">{children}</main>

          {/* Structured Data: Professional Person Schema */}
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Yash Sachan",
                url: "https://yashsachan.in",
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
                  "https://github.com/yashsachan",
                  "https://linkedin.com/in/yashsachan",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
