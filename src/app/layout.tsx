import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Projecto — Architectural Construction & Engineering Excellence',
  description:
    'Enduring architectural construction, commercial landmarks, and bespoke luxury residential builds crafted with uncompromising precision.',
  keywords: [
    'Construction',
    'Architecture',
    'Luxury Residential',
    'Commercial Development',
    'Engineering',
    'Projecto',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — loaded via CDN to avoid next/font/google Turbopack bug */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Define CSS variables for font families */}
        <style>{`
          :root {
            --font-playfair: 'Playfair Display', Georgia, serif;
            --font-montserrat: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        `}</style>
        {/* Preconnect to Cloudinary CDN — eliminates DNS + TLS setup on first image request */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect to Supabase — eliminates connection overhead on first API call */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
          </>
        )}
      </head>
      <body
        className="min-h-screen bg-off-white text-near-black antialiased flex flex-col font-sans selection:bg-olive selection:text-white"
        suppressHydrationWarning
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
