'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Strength } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { motion } from 'framer-motion';

interface AudienceSectionProps {
  audienceCards: Strength[];
  subtitle?: string;
  title?: string;
  imageUrl?: string | null;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  audienceCards,
  subtitle = 'WHO WE WORK WITH',
  title = 'Built Around Your Role in the Project.',
  imageUrl,
}) => {
  if (!audienceCards || audienceCards.length === 0) {
    return null;
  }

  // Determine link target based on card title
  const getCardLink = (cardTitle: string) => {
    const t = cardTitle.toLowerCase();
    if (t.includes('architect') || t.includes('designer')) {
      return { href: '/services/for-architects-designers', label: 'EXPLORE SUPPORT' };
    }
    if (t.includes('builder') || t.includes('contractor')) {
      return { href: '/services/for-builders-contractors', label: 'EXPLORE SUPPORT' };
    }
    if (t.includes('developer')) {
      return { href: '/services/procurement', label: 'EXPLORE SUPPORT' };
    }
    return { href: '/contact', label: 'EXPLORE SUPPORT' };
  };

  const resolvedImage = imageUrl || '';

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Connected composition: Heading on top left, 4 cards in one horizontal row, and right image starting at heading level with card 4 overlapping */}
        <div className="relative">
          {/* Header */}
          <div className="max-w-xl lg:max-w-2xl mb-8 sm:mb-10">
            <div className="flex items-center space-x-2.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
                {subtitle}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-near-black font-normal tracking-tight leading-[1.16]">
              {title}
            </h2>
          </div>

          {/* Desktop Right-Side Image: Aligned at top with heading level, extends down to bottom of cards */}
          {resolvedImage && (
            <div className="hidden lg:block absolute top-0 right-0 w-[38%] xl:w-[36%] h-[110%] rounded-sm overflow-hidden border border-sand/80 shadow-2xs group bg-sand/30 z-0">
              <Image
                src={resolvedImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={false}
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/50 via-transparent to-transparent opacity-75" />

              {/* Top-Right Architectural Badge (Matches Reference Image) */}
              <div className="absolute top-5 right-5 z-10 bg-near-black/85 backdrop-blur-xs px-3.5 py-2.5 rounded-xs border border-white/10 text-right">
                <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-warm-beige leading-tight font-medium">
                  STRONGER<br />PROJECTS<br />TOGETHER
                </span>
              </div>
            </div>
          )}

          {/* 4 Cards Grid: Single Horizontal Row on Desktop (w-[78%] so Card 4 overlaps into the right image), 2-Col Grid on Mobile */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-3 xl:gap-4 lg:w-[78%] xl:w-[76%] items-stretch">
            {audienceCards.slice(0, 4).map((card, idx) => {
              const linkInfo = getCardLink(card.title);

              return (
                <motion.div
                  key={card.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 lg:p-4 xl:p-5 bg-[#FAF9F5]/80 backdrop-blur-md border border-sand/80 hover:border-olive/60 hover:bg-[#FAF9F5]/92 transition-all duration-300 shadow-2xs rounded-xs h-full"
                >
                  <div className="space-y-4">
                    {/* Top Icon & Index */}
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#EAE6DE]/80 text-near-black/75 flex items-center justify-center group-hover:bg-olive group-hover:text-white transition-colors duration-200">
                        <IconResolver
                          name={card.icon_name || 'Building2'}
                          className="w-4 h-4"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-warm-grey font-medium">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-sm sm:text-base lg:text-[13px] xl:text-sm font-semibold uppercase tracking-wider text-near-black leading-snug">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs lg:text-[11px] xl:text-xs text-near-black/75 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Divider Line & CTA Link */}
                  <div className="pt-4 border-t border-sand/60 mt-5">
                    <Link
                      href={linkInfo.href}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-olive group-hover:text-near-black transition-colors uppercase tracking-wider"
                    >
                      <span>{linkInfo.label}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile / Tablet Supporting Image (Below cards on screens < lg) */}
          {resolvedImage && (
            <div className="lg:hidden mt-8 w-full h-[260px] sm:h-[320px] rounded-sm overflow-hidden border border-sand/80 shadow-2xs relative bg-sand/30">
              <Image
                src={resolvedImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={false}
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/50 via-transparent to-transparent opacity-75" />

              {/* Top-Right Architectural Badge */}
              <div className="absolute top-5 right-5 z-10 bg-near-black/85 backdrop-blur-xs px-3.5 py-2.5 rounded-xs border border-white/10 text-right">
                <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-warm-beige leading-tight font-medium">
                  STRONGER<br />PROJECTS<br />TOGETHER
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
