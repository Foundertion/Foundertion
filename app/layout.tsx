import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://foundertion.vercel.app"),
  verification: {
    google: "HM9se7lQ_lx-GAitEKRTfxgjbFuy0rnP7JdCpqOrark",
  },
  title: {
    default: "Foundertion — Your AI Co-Founder",
    template: "%s | Foundertion",
  },
  description: "Auto-detect language. Validate ideas, create business plans, pitch scripts, and landing page copy in seconds. Built for solo founders worldwide.",
  keywords: ["solo founder", "startup", "AI co-founder", "business validation", "pitch deck", "MVP"],
  authors: [{ name: "Foundertion" }],
  alternates: { canonical: "/" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Foundertion",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "AI co-founder for solo entrepreneurs — validate ideas, generate business plans, pitch scripts, and landing page copy in seconds.",
  url: "https://foundertion.vercel.app",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "Foundertion" },
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
        <meta name='impact-site-verification' content='550ec25a-330f-4724-a756-fee2e525d228' />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
</head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      <Analytics /></body>
    </html>
  );
}