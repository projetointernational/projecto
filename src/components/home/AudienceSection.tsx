'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Strength } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface AudienceSectionProps {
  audienceCards: Strength[];
  subtitle?: string;
  title?: string;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  audienceCards,
  subtitle = 'WHO WE WORK WITH',
  title = 'Built Around Your Role in the Project.',
}) => {
  if (!audienceCards || audienceCards.length === 0) {
    return null;
  }

  // Determine link target based on card title
  const getCardLink = (cardTitle: string) => {
    const t = cardTitle.toLowerCase();
    if (t.includes('architect') || t.includes('designer')) {
      return { href: '/services/for-architects-designers', label: 'FOR ARCHITECTS' };
    }
    if (t.includes('builder') || t.includes('contractor')) {
      return { href: '/services/for-builders-contractors', label: 'FOR CONTRACTORS' };
    }
    return { href: '/contact', label: 'DISCUSS PROJECT' };
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-sand/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header with 2-line break as in screenshot */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="flex items-center space-x-2.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
              {subtitle}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-near-black font-normal tracking-tight leading-[1.15]">
            Built Around Your Role in the<br />Project.
          </h2>
        </div>

        {/* 4 Crisp White Architectural Cards (Exact Image 4 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceCards.map((card, idx) => {
            const linkInfo = getCardLink(card.title);

            return (
              <motion.div
                key={card.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group flex flex-col justify-between p-8 sm:p-10 bg-white border border-sand/80 hover:border-olive/50 transition-all duration-300 shadow-2xs"
              >
                <div>
                  {/* Top Index */}
                  <span className="text-xs font-mono text-warm-grey font-medium block">
                    0{idx + 1}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-near-black mt-6 mb-4 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-near-black/75 font-light leading-relaxed mb-8">
                    {card.description}
                  </p>
                </div>

                {/* Divider Line & CTA Link */}
                <div className="pt-6 border-t border-sand/60">
                  <Link
                    href={linkInfo.href}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-olive group-hover:text-near-black transition-colors uppercase tracking-wider"
                  >
                    <span>{linkInfo.label}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                    />
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
