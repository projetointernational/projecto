import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  // Only load weights actually used in the UI (removed 300 — not measurably different from 400 at small sizes)
  weight: ['400', '500', '600', '700'],
});

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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
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
