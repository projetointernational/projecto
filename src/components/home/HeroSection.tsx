import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroContent } from '@/lib/supabase/types';

interface HeroSectionProps {
  content?: HeroContent | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  if (!content) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center bg-sand/30 px-6 sm:px-12 py-24">
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
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-end pb-20 pt-32 overflow-hidden bg-near-black">
      {/* Background Architectural Imagery */}
      {content.background_image_url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={content.background_image_url}
            alt="Hero Architectural Milestone"
            fill
            priority
            className="object-cover object-center brightness-[0.70] contrast-[1.05]"
            sizes="100vw"
          />
          {/* Subtle gradient overlay to enhance editorial contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/50 to-transparent" />
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="max-w-3xl space-y-6">
          {content.subheadline && (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-warm-beige" />
              <span className="text-xs uppercase tracking-[0.25em] text-warm-beige font-medium">
                {content.subheadline}
              </span>
            </div>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-off-white leading-[1.1] tracking-tight">
            {content.headline}
          </h1>

          {content.intro_text && (
            <p className="text-base sm:text-lg text-off-white/80 font-light max-w-2xl leading-relaxed">
              {content.intro_text}
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              href={content.cta_primary_link || '/projects'}
              variant="olive"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
            >
              {content.cta_primary_text || 'Explore our projects'}
            </Button>

            <Button
              href={content.cta_secondary_link || '/contact'}
              variant="outline"
              size="lg"
              className="text-off-white border-white/30 hover:bg-white hover:text-near-black hover:border-white"
              icon={<ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />}
            >
              {content.cta_secondary_text || 'Get in touch'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
