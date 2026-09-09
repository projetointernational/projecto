'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  companyName?: string;
  logoUrl?: string | null;
  navLabels?: {
    home?: string;
    about?: string;
    services?: string;
    projects?: string;
    contact?: string;
    enquire?: string;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyName = 'PROJECTO',
  logoUrl,
  navLabels,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => {
            if (!prev && y > 35) return true;
            if (prev && y < 10) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { href: '/', label: navLabels?.home || 'Home' },
    { href: '/about', label: navLabels?.about || 'About' },
    { href: '/services', label: navLabels?.services || 'Services' },
    { href: '/projects', label: navLabels?.projects || 'Projects' },
    { href: '/contact', label: navLabels?.contact || 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 py-3 sm:py-3.5 transition-shadow duration-200 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm'
        : 'bg-white'
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={companyName}
              onError={() => setLogoError(true)}
              className="h-11 sm:h-12 w-auto max-w-[200px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.18em] font-normal text-near-black uppercase">
                {companyName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-warm-grey -mt-1 font-sans">
                Construction & Architecture
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors duration-200 relative py-1 ${isActive
                  ? 'text-olive font-semibold'
                  : 'text-near-black/80 hover:text-olive'
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-olive" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            href="/enquire"
            variant="olive"
            size="sm"
            icon={<ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
          >
            {navLabels?.enquire || 'Start Enquiry'}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-near-black hover:text-olive focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" strokeWidth={1.25} /> : <Menu className="w-6 h-6" strokeWidth={1.25} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden bg-off-white px-6 pt-5 pb-8 space-y-6 border-t border-sand overflow-hidden"
          >
            <nav className="flex flex-col items-center justify-center space-y-3 text-center">
              {links.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.07,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="w-full text-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`inline-block text-sm uppercase tracking-widest font-medium py-1.5 transition-colors ${
                        isActive ? 'text-olive font-semibold' : 'text-near-black hover:text-olive'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: links.length * 0.07,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="pt-2 flex flex-col items-center justify-center w-full"
            >
              <Button
                href="/enquire"
                variant="olive"
                size="md"
                className="w-full max-w-xs text-center"
                icon={<ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />}
                onClick={() => setIsOpen(false)}
              >
                {navLabels?.enquire || 'Start Enquiry'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
