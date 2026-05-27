import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foundertion — Your AI Co-Founder",
  description: "Auto-detect language. Validate ideas, create business plans, pitch scripts, and landing page copy in seconds. Built for solo founders worldwide.",
  keywords: ["solo founder", "startup", "AI co-founder", "business validation", "pitch deck", "MVP"],
  authors: [{ name: "Foundertion" }],
  openGraph: {
    title: "Foundertion — Your AI Co-Founder",
    description: "Validate your business idea in any language. Get validation, roadmap, pitch script & landing copy in seconds.",
    url: "https://foundertion.vercel.app",
    siteName: "Foundertion",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Foundertion - AI Co-Founder" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundertion — Your AI Co-Founder",
    description: "Stop overthinking. Start shipping. AI-powered tools for solo founders.",
    images: ["/og-image.png"],
    creator: "@foundertion",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0d1f17" />
        <meta name="theme-color" content="#0d1f17" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}