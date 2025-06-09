import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap'
});

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
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased bg-gray-950 text-white`}>
        <header className="bg-black border-b border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center px-4 py-3">
            <a href="https://beastanalyticsco.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
              <img src="/beast-logo.svg" alt="BEAST Analytics Logo" className="h-10 w-auto" />
              <div>
                <span className="text-2xl font-bebas tracking-wide text-white">GA4Wise</span>
                <br />
                <span className="text-xs text-gray-400 group-hover:text-accent-red transition-colors">
                  by <span className="underline">BEAST Analytics</span>
                </span>
              </div>
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
