import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import { SiteSettings } from '@/lib/supabase/types';

interface FooterProps {
  settings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const companyName = settings?.company_name || 'PROJECTO';
  const description =
    settings?.company_description ||
    'Specialized architectural construction, luxury residential developments, and commercial structural engineering built with uncompromising craftsmanship.';
  const email = settings?.email || 'contact@projecto.com';
  const phone = settings?.phone || '+1 (555) 234-5678';
  const address =
    settings?.address || '450 Architectural Boulevard, Suite 800, New York, NY 10018';

  return (
    <footer className="bg-near-black text-off-white pt-20 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Narrative */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.2em] font-normal text-off-white uppercase">
                {companyName}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-warm-beige mt-1 font-sans">
                Construction & Structural Engineering
              </span>
            </Link>
            <p className="text-sm text-warm-grey font-light leading-relaxed max-w-sm">
              {description}
            </p>
            <div className="pt-2 flex items-center space-x-4 text-warm-grey">
              <a
                href={settings?.social_links?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-warm-beige transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href={settings?.social_links?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-warm-beige transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href={settings?.social_links?.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-warm-beige transition-colors p-1"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/" className="text-off-white/80 hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-off-white/80 hover:text-white transition-colors">
                  Company Ethos & Legacy
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-off-white/80 hover:text-white transition-colors">
                  Capabilities & Disciplines
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-off-white/80 hover:text-white transition-colors">
                  Completed Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-off-white/80 hover:text-white transition-colors">
                  Consultation & Contact
                </Link>
              </li>
              <li>
                <Link href="/enquire" className="text-olive-light hover:text-warm-beige transition-colors flex items-center">
                  <span>Start an Enquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={1.5} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Directives */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
              Headquarters
            </h4>
            <div className="space-y-3 text-sm text-off-white/80 font-light">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-warm-beige shrink-0 mt-1" strokeWidth={1.5} />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-warm-beige shrink-0" strokeWidth={1.5} />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-warm-beige shrink-0" strokeWidth={1.5} />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            {settings?.working_hours && (
              <p className="text-xs text-warm-grey pt-2 font-mono">
                {settings.working_hours}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-grey space-y-4 sm:space-y-0">
          <p>© {currentYear} {companyName}. All architectural rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-warm-grey/60">Crafted with architectural precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
