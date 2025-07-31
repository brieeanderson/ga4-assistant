import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "GA4 Setup Audit - Verify Your GA4 Fundamentals",
  description: "Professional GA4 auditing tool that ensures you get the most reliable data.",
  authors: [{ name: "Brie E Anderson" }],
  robots: "index, follow",
  openGraph: {
    title: "GA4 Setup Audit - Verify Your GA4 Fundamentals",
    description: "Professional GA4 auditing tool that ensures you get the most reliable data.",
    type: "website",
    siteName: "GA4Wise"
  },
  twitter: {
    card: "summary_large_image",
    title: "GA4 Setup Audit - Verify Your GA4 Fundamentals",
    description: "Professional GA4 auditing tool that ensures you get the most reliable data."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
