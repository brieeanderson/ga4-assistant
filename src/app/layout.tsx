import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import Image from "next/image";
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
  title: "GA4 Setup Audit - Verify Your GA4 Fundamentals",
  description: "Professional GA4 auditing tool that ensures you get the most reliable data.",
  authors: [{ name: "Brie E Anderson" }],
  viewport: "width=device-width, initial-scale=1",
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
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased bg-gray-950 text-white`}>
        <header className="bg-black border-b border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center px-4 py-3">
            <a href="https://beastanalyticsco.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
              <Image 
                src="/beast-logo.svg" 
                alt="BEAST Analytics Logo" 
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
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
