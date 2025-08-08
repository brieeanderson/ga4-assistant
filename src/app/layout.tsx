import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  title: "GA4 Helper - Professional GA4 Configuration Audit Tool",
  description: "Comprehensive Google Analytics 4 audit tool that ensures optimal setup, reliable data collection, and actionable insights.",
  authors: [{ name: "Brie E Anderson" }],
  robots: "index, follow",
  openGraph: {
    title: "GA4 Helper - Professional GA4 Configuration Audit Tool",
    description: "Comprehensive Google Analytics 4 audit tool that ensures optimal setup, reliable data collection, and actionable insights.",
    type: "website",
    siteName: "GA4 Helper"
  },
  twitter: {
    card: "summary_large_image",
    title: "GA4 Helper - Professional GA4 Configuration Audit Tool",
    description: "Comprehensive Google Analytics 4 audit tool that ensures optimal setup, reliable data collection, and actionable insights."
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WKVD32JW');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.variable} antialiased bg-brand-black-soft text-white`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WKVD32JW"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {children}
      </body>
    </html>
  );
}
