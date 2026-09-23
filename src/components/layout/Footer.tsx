import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import { SiteSettings } from '@/lib/supabase/types';
import Image from 'next/image';

interface FooterProps {
  settings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const companyName = settings?.company_name || 'PROJECTO';
  const tagline = settings?.tagline || 'One Project. One Coordinated Partner.';
  const description =
    settings?.company_description ||
    'Projeto International supports construction, interior and related projects through procurement and project coordination.';
  const email = settings?.email || 'projetointernational@gmail.com';
  const phone = settings?.phone || '+91 9072873225';
  const address = settings?.address || 'Kochi, Kerala';
  const whatsapp = settings?.social_links?.whatsapp || 'https://wa.me/919072873225';

  return (
    <footer className="bg-black text-off-white pt-20 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand & Narrative */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <Image src="/logo/logo-footer.png" alt={companyName} width={80} height={80} />
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-warm-beige font-mono">
              {tagline}
            </p>
            <p className="text-sm text-warm-grey font-light leading-relaxed max-w-sm">
              {description}
            </p>
            <div className="pt-2 flex items-center space-x-4 text-warm-grey">
              {settings?.social_links?.instagram && (
                <a
                  href={settings.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-warm-beige transition-colors p-1"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
              )}
              {settings?.social_links?.linkedin && (
                <a
                  href={settings.social_links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-warm-beige transition-colors p-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                </a>
              )}
              {settings?.social_links?.twitter && (
                <a
                  href={settings.social_links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-warm-beige transition-colors p-1"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" strokeWidth={1.5} />
                </a>
              )}
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#25D366] transition-colors p-1"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Core Verticals & Capabilities */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
              Core Verticals
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/services/procurement" className="text-off-white/80 hover:text-white transition-colors">
                  01 — Procurement
                </Link>
              </li>
              <li>
                <Link href="/services/project-coordination" className="text-off-white/80 hover:text-white transition-colors">
                  02 — Project Coordination
                </Link>
              </li>
              <li>
                <Link href="/services/materials-project-supplies" className="text-off-white/80 hover:text-white transition-colors">
                  Materials & Supplies
                </Link>
              </li>
              <li>
                <Link href="/services/for-architects-designers" className="text-off-white/80 hover:text-white transition-colors">
                  For Architects & Designers
                </Link>
              </li>
              <li>
                <Link href="/services/for-builders-contractors" className="text-off-white/80 hover:text-white transition-colors">
                  For Builders & Contractors
                </Link>
              </li>
              <li>
                <Link href="/services/how-we-work" className="text-off-white/80 hover:text-white transition-colors">
                  How We Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/" className="text-off-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-off-white/80 hover:text-white transition-colors">
                  About Projeto
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-off-white/80 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-off-white/80 hover:text-white transition-colors">
                  Selected Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-olive-light hover:text-warm-beige transition-colors flex items-center">
                  <span>Discuss Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={1.5} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Directives */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
              Central Office
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
              <p className="text-xs text-warm-grey pt-1 font-mono">
                {settings.working_hours}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-grey gap-4">
          <p>© {currentYear} {companyName}. Procurement & Project Coordination. All rights reserved.</p>
          <p className="text-warm-grey/80">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  );
};
