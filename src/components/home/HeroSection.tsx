'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroContent } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  content?: HeroContent | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  if (!content) {
    return (
      <section className="relative h-[calc(100vh-72px)] sm:h-[calc(100vh-82px)] h-[calc(100dvh-72px)] sm:h-[calc(100dvh-82px)] min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-82px)] min-h-[calc(100dvh-72px)] sm:min-h-[calc(100dvh-82px)] flex items-center justify-center bg-sand/30 px-6 sm:px-12 py-12">
        <div className="max-w-xl text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Architectural Excellence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-near-black font-normal">
            Constructing Enduring Landmarks
          </h1>
          <p className="text-sm text-warm-grey font-light">
            Specialized architectural construction and luxury engineering built with precision and timeless design.
          </p>
          <div className="pt-2">
            <Button href="/projects" variant="olive" size="sm">
              Explore Portfolio
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100vh-72px)] sm:h-[calc(100vh-82px)] h-[calc(100dvh-72px)] sm:h-[calc(100dvh-82px)] min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-82px)] min-h-[calc(100dvh-72px)] sm:min-h-[calc(100dvh-82px)] flex items-end pb-10 sm:pb-14 pt-16 sm:pt-20 overflow-hidden bg-near-black">
      {/* Background Architectural Imagery */}
      {content.background_image_url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={content.background_image_url}
            alt="Hero Architectural Milestone"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Gentle dark shade on the left content area only; right side remains bright and clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-near-black/75 via-near-black/35 via-50% to-transparent" />
        </div>
      )}

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full"
      >
        <div className="max-w-3xl space-y-3 sm:space-y-5">
          {content.subheadline && (
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warm-beige" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-warm-beige font-medium">
                {content.subheadline}
              </span>
            </div>
          )}

          <h1 className="font-serif text-2xl sm:text-4xl font-normal text-off-white leading-[1.2] sm:leading-[1.15] tracking-tight">
            {content.headline}
          </h1>

          {content.intro_text && (
            <p className="hidden sm:block text-sm text-off-white/80 font-light max-w-2xl leading-relaxed">
              {content.intro_text}
            </p>
          )}

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
            <Button
              href={content.cta_primary_link || '/projects'}
              variant="olive"
              size="lg"
              className="text-xs sm:text-base py-3 sm:py-4 px-5 sm:px-8"
              icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              {content.cta_primary_text || 'Explore our projects'}
            </Button>

            <Button
              href={content.cta_secondary_link || '/contact'}
              variant="outline"
              size="lg"
              className="text-xs sm:text-base py-3 sm:py-4 px-5 sm:px-8 text-off-white border-white/30 hover:bg-white hover:!text-near-black hover:border-white"
              icon={<ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              {content.cta_secondary_text || 'Get in touch'}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
