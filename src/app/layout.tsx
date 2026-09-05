import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

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
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-off-white text-near-black antialiased flex flex-col font-sans selection:bg-olive selection:text-white">
        {children}
      </body>
    </html>
  );
}
