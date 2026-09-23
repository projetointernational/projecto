'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Strength } from '@/lib/supabase/types';
import { motion } from 'framer-motion';
import { IconResolver } from '@/components/ui/IconResolver';

interface AudienceSectionProps {
  audienceCards: Strength[];
  subtitle?: string;
  title?: string;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  audienceCards,
  subtitle = 'WHO WE WORK WITH',
  title = 'Tailored Support for Every Project Stakeholder',
}) => {
  if (!audienceCards || audienceCards.length === 0) {
    return null;
  }

  // Determine link target based on card title
  const getCardLink = (cardTitle: string) => {
    const t = cardTitle.toLowerCase();
    if (t.includes('architect') || t.includes('designer')) {
      return { href: '/services/for-architects-designers', label: 'For Architects' };
    }
    if (t.includes('builder') || t.includes('contractor')) {
      return { href: '/services/for-builders-contractors', label: 'For Contractors' };
    }
    return { href: '/contact', label: 'Discuss Project' };
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold">
              {subtitle}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight">
            {title}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceCards.map((card, idx) => {
            const linkInfo = getCardLink(card.title);

            return (
              <motion.div
                key={card.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="group flex flex-col justify-between p-6 sm:p-7 rounded-sm bg-sand/20 hover:bg-sand/35 border border-sand/80 hover:border-olive/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-sm bg-white border border-sand/80 flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-white transition-colors duration-200">
                    <IconResolver name={card.icon_name || 'Building2'} className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-near-black">
                    {card.title}
                  </h3>

                  <p className="text-xs text-near-black/75 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-sand/50">
                  <Link
                    href={linkInfo.href}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-olive group-hover:text-near-black transition-colors uppercase tracking-wider"
                  >
                    <span>{linkInfo.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
