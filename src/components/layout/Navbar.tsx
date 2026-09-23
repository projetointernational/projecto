'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteSettings } from '@/lib/supabase/types';

interface NavbarProps {
  companyName?: string;
  logoUrl?: string | null;
  navLabels?: SiteSettings['navigation_labels'];
  phone?: string;
  whatsapp?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyName = 'PROJECTO',
  logoUrl,
  navLabels,
  phone,
  whatsapp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    setOpenDropdown(null);
  }, [pathname]);

  // Dynamic Navigation menu items from Admin CMS or structured defaults
  const menuItems = navLabels?.menu && navLabels.menu.length > 0
    ? navLabels.menu.filter((item) => item.active !== false)
    : [
        { label: navLabels?.home || 'Home', href: '/', active: true },
        { label: navLabels?.about || 'About', href: '/about', active: true },
        {
          label: navLabels?.services || 'Services',
          href: '/services',
          active: true,
          dropdown: [
            { label: 'Procurement', href: '/services/procurement', active: true },
            { label: 'Project Coordination', href: '/services/project-coordination', active: true },
            { label: 'Materials / Project Supplies', href: '/services/materials-project-supplies', active: true },
            { label: 'For Architects & Designers', href: '/services/for-architects-designers', active: true },
            { label: 'For Builders & Contractors', href: '/services/for-builders-contractors', active: true },
            { label: 'How We Work', href: '/services/how-we-work', active: true },
          ],
        },
        { label: navLabels?.projects || 'Projects', href: '/projects', active: true },
        { label: navLabels?.contact || 'Contact', href: '/contact', active: true },
      ];

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleMobileExpand = (label: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const whatsappNum = navLabels?.whatsapp_number || whatsapp || '919072873225';
  const phoneNum = navLabels?.phone_number || phone || '+91 9072873225';

  return (
    <header
      className={`sticky top-0 z-50 py-3 sm:py-3.5 transition-shadow duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
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
              <span className="text-[9px] uppercase tracking-[0.25em] text-warm-grey -mt-0.5 font-sans">
                Procurement & Project Coordination
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7">
          {menuItems.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive =
              pathname === item.href ||
              (hasDropdown && item.dropdown?.some((sub) => pathname === sub.href));
            const isMenuOpen = openDropdown === item.label;

            if (hasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 text-xs uppercase tracking-[0.16em] font-medium transition-colors duration-200 relative py-2 ${
                      isActive ? 'text-olive font-semibold' : 'text-near-black/80 hover:text-olive'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180 text-olive' : 'text-near-black/50'
                      }`}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-olive" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute left-0 top-full pt-2 w-72 z-50"
                      >
                        <div className="bg-white rounded-sm shadow-xl border border-sand/80 py-2.5 px-1 divide-y divide-sand/40">
                          <div className="px-3 pb-2 mb-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-warm-grey font-medium">
                              Our Capabilities
                            </span>
                          </div>
                          <div className="py-1 space-y-0.5">
                            {item.dropdown
                              ?.filter((sub) => sub.active !== false)
                              .map((sub) => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className={`flex items-center justify-between px-3.5 py-2 rounded-sm text-xs transition-colors ${
                                      isSubActive
                                        ? 'bg-sand/40 text-olive font-medium'
                                        : 'text-near-black hover:bg-sand/30 hover:text-olive'
                                    }`}
                                  >
                                    <span>{sub.label}</span>
                                    {isSubActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                                    )}
                                  </Link>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors duration-200 relative py-1 ${
                  isActive ? 'text-olive font-semibold' : 'text-near-black/80 hover:text-olive'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-olive" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Quick Actions & CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {whatsappNum && (
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              title="Chat on WhatsApp"
              className="p-2 text-near-black hover:text-[#25D366] transition-colors rounded-sm hover:bg-sand/30"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}

          {phoneNum && (
            <a
              href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
              title="Call Direct"
              className="p-2 text-near-black hover:text-olive transition-colors rounded-sm hover:bg-sand/30"
              aria-label="Phone"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}

          <Button
            href="/contact"
            variant="olive"
            size="sm"
            icon={<ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
          >
            {navLabels?.enquire || 'Discuss Your Project'}
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
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item, idx) => {
                const hasDropdown = item.dropdown && item.dropdown.length > 0;
                const isExpanded = !!mobileExpanded[item.label];
                const isActive =
                  pathname === item.href ||
                  (hasDropdown && item.dropdown?.some((sub) => pathname === sub.href));

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="w-full"
                  >
                    {hasDropdown ? (
                      <div className="border-b border-sand/40 pb-2">
                        <button
                          type="button"
                          onClick={() => toggleMobileExpand(item.label)}
                          className="w-full flex items-center justify-between text-left py-2 text-sm uppercase tracking-wider font-medium text-near-black hover:text-olive"
                        >
                          <span className={isActive ? 'text-olive font-semibold' : ''}>
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-olive' : 'text-warm-grey'
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2 pt-1 pb-2 border-l-2 border-olive/30 ml-2"
                            >
                              <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-xs uppercase tracking-wider text-warm-grey hover:text-olive font-medium py-1"
                              >
                                Overview ({item.label})
                              </Link>
                              {item.dropdown
                                ?.filter((sub) => sub.active !== false)
                                .map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-xs uppercase tracking-wider py-1 transition-colors ${
                                      pathname === sub.href
                                        ? 'text-olive font-semibold'
                                        : 'text-near-black/70 hover:text-olive'
                                    }`}
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block text-sm uppercase tracking-wider font-medium py-2 border-b border-sand/40 transition-colors ${
                          isActive ? 'text-olive font-semibold' : 'text-near-black hover:text-olive'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Actions: WhatsApp, Call, Discuss Project */}
            <div className="pt-2 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-sm bg-[#25D366]/10 text-[#128C7E] font-medium text-xs tracking-wider uppercase border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${phoneNum.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-sm bg-sand/60 text-near-black font-medium text-xs tracking-wider uppercase border border-sand hover:bg-sand transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  <span>Call Us</span>
                </a>
              </div>

              <Button
                href="/contact"
                variant="olive"
                size="md"
                className="w-full text-center"
                icon={<ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />}
                onClick={() => setIsOpen(false)}
              >
                {navLabels?.enquire || 'Discuss Your Project'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
