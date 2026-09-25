'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroContent } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  content?: HeroContent | null;
  mobileImageUrl?: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content, mobileImageUrl }) => {
  if (!content) {
    return (
      <section className="relative h-[calc(100svh-68px)] sm:h-[calc(100dvh-76px)] min-h-[calc(100svh-68px)] sm:min-h-[calc(100dvh-76px)] flex items-center justify-center bg-sand/30 px-6 sm:px-12 py-12">
        <div className="max-w-xl text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
            PROJETO INTERNATIONAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-near-black font-normal">
            Procurement &amp; Project<br />Coordination, <span className="text-olive">Simplified.</span>
          </h1>
          <p className="text-sm text-near-black/80 font-light">
            From sourcing the right materials to coordinating the right people, we help you keep your project on track with efficiency and transparency.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="olive" size="sm">
              Discuss Your Project
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Dynamic headline formatter: splits into balanced lines and highlights accent words or the final punchline word
  const formatHeadline = (headline: string) => {
    if (!headline) return null;

    // 1. Determine lines: respect explicit newlines if entered by admin, or split naturally
    let lines: string[] = [];
    if (headline.includes('\n')) {
      lines = headline.split('\n').map((l) => l.trim()).filter(Boolean);
    } else {
      const words = headline.trim().split(/\s+/);
      const ampIndex = words.findIndex((w) => w === '&');

      if (ampIndex > 0 && ampIndex + 1 < words.length - 1) {
        // e.g. "Procurement & Project" on line 1, rest on line 2
        lines = [
          words.slice(0, ampIndex + 2).join(' '),
          words.slice(ampIndex + 2).join(' '),
        ];
      } else if (words.length >= 4) {
        const mid = Math.ceil(words.length / 2);
        lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
      } else {
        lines = [headline];
      }
    }

    // 2. Format words: highlight explicit accents (*word* or [word]), "simplified", or the last word of the headline
    return (
      <>
        {lines.map((line, lineIdx) => {
          const isLastLine = lineIdx === lines.length - 1;
          const words = line.split(/\s+/);

          return (
            <span key={lineIdx} className="block">
              {words.map((word, wordIdx) => {
                const isLastWordOfHeadline = isLastLine && wordIdx === words.length - 1;
                const hasExplicitAccent =
                  (word.startsWith('*') && word.endsWith('*') && word.length > 2) ||
                  (word.startsWith('[') && word.endsWith(']') && word.length > 2);
                const isSimplified =
                  word.toLowerCase().replace(/[^a-z]/g, '') === 'simplified';

                let cleanWord = word;
                if (hasExplicitAccent) {
                  cleanWord = word.slice(1, -1);
                }

                if (isLastWordOfHeadline || hasExplicitAccent || isSimplified) {
                  return (
                    <React.Fragment key={wordIdx}>
                      <span className="text-olive">{cleanWord}</span>
                      {wordIdx < words.length - 1 ? ' ' : ''}
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={wordIdx}>
                    {cleanWord}
                    {wordIdx < words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <section className="relative h-[calc(100svh-68px)] sm:h-[calc(100dvh-76px)] min-h-[calc(100svh-68px)] sm:min-h-[calc(100dvh-76px)] flex items-end pb-6 sm:pb-14 pt-12 sm:pt-20 overflow-hidden bg-white">
      {/* Background Architectural Imagery (Desktop & Mobile Responsive) */}
      {mobileImageUrl ? (
        <div className="absolute inset-0 z-0">
          <div className="block sm:hidden relative w-full h-full">
            <Image
              src={mobileImageUrl}
              alt="Hero Architectural Milestone Mobile"
              fill
              priority
              className="object-cover object-[65%_top]"
              sizes="100vw"
            />
          </div>
          {content.background_image_url && (
            <div className="hidden sm:block relative w-full h-full">
              <Image
                src={content.background_image_url}
                alt="Hero Architectural Milestone"
                fill
                priority
                className="object-cover object-[center_bottom] lg:object-[82%_bottom] xl:object-[85%_bottom]"
                sizes="100vw"
              />
            </div>
          )}
        </div>
      ) : (
        content.background_image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={content.background_image_url}
              alt="Hero Architectural Milestone"
              fill
              priority
              className="object-cover object-[65%_top] sm:object-[center_bottom] lg:object-[82%_bottom] xl:object-[85%_bottom]"
              sizes="100vw"
            />
          </div>
        )
      )}

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full mb-2 sm:mb-12 lg:mb-20 xl:mb-24"
      >
        <div className="max-w-3xl space-y-2.5 sm:space-y-4">
          {/* Eyebrow / Subheadline */}
          {content.subheadline && (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-olive" />
              <span className="text-[9px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-olive font-semibold font-mono">
                {content.subheadline}
              </span>
            </div>
          )}

          {/* Heading in Dark / Near-Black breaking into 2 lines */}
          <h1 className="font-serif text-xl sm:text-3xl lg:text-[52px] font-normal text-near-black leading-[1.2] sm:leading-[1.14] tracking-tight max-w-xl sm:max-w-2xl">
            {formatHeadline(content.headline)}
          </h1>

          {/* Intro Paragraph in Near-Black */}
          {content.intro_text && (
            <p className="text-xs sm:text-[13px] lg:text-sm text-near-black/80 font-light max-w-lg sm:max-w-xl leading-relaxed pt-0.5">
              {content.intro_text}
            </p>
          )}

          {/* Call to Actions */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
            <Button
              href={content.cta_primary_link || '/contact'}
              variant="olive"
              size="lg"
              className="text-xs sm:text-sm py-3 sm:py-3.5 px-6 sm:px-8 w-full sm:w-auto justify-center"
              icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              {content.cta_primary_text || 'DISCUSS YOUR PROJECT'}
            </Button>

            <Button
              href={content.cta_secondary_link || '/services/procurement'}
              variant="outline"
              size="lg"
              className="text-xs sm:text-sm py-3 sm:py-3.5 px-6 sm:px-8 text-near-black border-near-black/40 hover:bg-near-black hover:!text-white hover:border-near-black bg-white/90 shadow-2xs w-full sm:w-auto justify-center"
              icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              {content.cta_secondary_text || 'REQUEST PROCUREMENT SUPPORT'}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
