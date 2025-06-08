import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GA4 Analytics Audit - Enhanced Custom Dimensions & Metrics Analysis",
  description: "Professional GA4 and GTM website auditing tool with custom dimensions, metrics, event create rules detection, and Search Console integration analysis.",
  keywords: [
    "GA4 audit",
    "Google Analytics 4",
    "GTM audit",
    "Google Tag Manager",
    "custom dimensions",
    "custom metrics",
    "Search Console integration",
    "analytics audit",
    "website tracking"
  ],
  authors: [{ name: "GA4 Assistant Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "GA4 Analytics Audit - Custom Dimensions & Metrics Analysis",
    description: "Get a comprehensive 30-point GA4 audit including custom dimensions, metrics, and Search Console integration status.",
    type: "website",
    siteName: "GA4 Assistant"
  },
  twitter: {
    card: "summary_large_image",
    title: "GA4 Analytics Audit - Enhanced Analysis",
    description: "Professional GA4 audit with custom dimensions and metrics analysis"
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
      </head>
      <body className="antialiased bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
