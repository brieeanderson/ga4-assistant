import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Add these font imports
const bebasNeue = localFont({
  src: './fonts/BebasNeue-Regular.woff2',
  variable: '--font-bebas-neue',
  display: 'swap',
});

const inter = localFont({
  src: './fonts/Inter-Variable.woff2', 
  variable: '--font-inter',
  display: 'swap',
});

// Or use Google Fonts instead:
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
