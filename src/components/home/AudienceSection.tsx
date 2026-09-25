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
  mobileImageUrl?: string | null;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  audienceCards,
  subtitle = 'WHO WE WORK WITH',
  title = 'Built Around Your Role in the Project.',
  imageUrl,
  mobileImageUrl,
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

  const resolvedDesktopImage = imageUrl || '';
  const resolvedMobileImage = mobileImageUrl || imageUrl || '';

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12">
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

          {/* Desktop Right-Side Image: Aligned at top with heading level, 1:1 Aspect Ratio */}
          {resolvedDesktopImage && (
            <div className="hidden lg:block absolute top-0 right-0 w-[38%] xl:w-[36%] aspect-square rounded-sm overflow-hidden border border-sand/80 shadow-2xs group bg-sand/30 z-0">
              <Image
                src={resolvedDesktopImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={false}
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/50 via-transparent to-transparent opacity-75" />
            </div>
          )}

          {/* 4 Cards Grid: 2 boxes in 1 row on mobile (grid-cols-2), 1 row of 4 boxes on desktop (lg:grid-cols-4 lg:w-[78%] overlapping background image with glass effect) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-3 xl:gap-4 auto-rows-fr lg:w-[78%] xl:w-[76%] items-stretch">
            {audienceCards.slice(0, 4).map((card, idx) => {
              const linkInfo = getCardLink(card.title);
              const defaultIcons = ['Building2', 'Compass', 'HardHat', 'Layers'];
              const iconName = card.icon_name || defaultIcons[idx % defaultIcons.length];

              return (
                <motion.div
                  key={card.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative flex flex-col justify-between h-full min-h-[235px] sm:min-h-[260px] lg:min-h-0 p-3.5 sm:p-5 lg:p-4 xl:p-5 bg-white lg:bg-[#FAF9F5]/85 lg:backdrop-blur-md border border-sand/80 hover:border-olive/60 lg:hover:bg-[#FAF9F5]/95 transition-all duration-300 shadow-2xs rounded-xs text-left"
                >
                  <div className="space-y-2.5 sm:space-y-3.5 flex-1 flex flex-col">
                    {/* Top Row: Left Icon, Right Number */}
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF9F5] border border-sand/80 flex items-center justify-center text-warm-grey shrink-0 group-hover:border-olive/40 transition-colors">
                        <IconResolver
                          name={iconName}
                          className="w-4 h-4 text-warm-grey"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-[11px] sm:text-xs font-mono text-warm-grey/60 font-medium">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="min-h-[28px] sm:min-h-[36px] lg:min-h-0 flex items-start pt-1">
                      <h3 className="font-sans font-bold text-xs sm:text-base text-near-black uppercase tracking-wider leading-snug">
                        {card.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[10.5px] sm:text-xs text-warm-grey font-light leading-relaxed flex-1">
                      {card.description}
                    </p>
                  </div>

                  {/* Divider Line & CTA Link */}
                  <div className="pt-3 sm:pt-4 border-t border-sand/60 mt-auto">
                    <Link
                      href={linkInfo.href}
                      className="inline-flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-near-black group-hover:text-olive transition-colors uppercase tracking-wider"
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

          {/* Mobile / Tablet Supporting Image (Below cards on screens < lg) — 16:9 Aspect Ratio */}
          {resolvedMobileImage && (
            <div className="lg:hidden mt-8 w-full aspect-[16/9] rounded-sm overflow-hidden border border-sand/80 shadow-2xs relative bg-sand/30">
              <Image
                src={resolvedMobileImage}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={false}
              />
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/50 via-transparent to-transparent opacity-75" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
