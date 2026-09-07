import React from 'react';
import { AboutContent } from '@/lib/supabase/types';

interface IntroSectionProps {
  about?: AboutContent | null;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ about }) => {
  if (!about) return null;

  return (
    <section className="py-24 sm:pt-32 bg-off-white sm:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Label / Accent column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span className="text-xs uppercase text-warm-grey">
                {about.subtitle || 'About Projecto'}
              </span>
            </div>
            <h2 className="font-serif text-2xl text-near-black font-normal leading-snug">
              {about.title}
            </h2>
          </div>

          {/* Narrative & Stats column */}
          <div className="lg:col-span-8 space-y-8">
            <p className="text-sm text-near-black/80 font-light leading-relaxed">
              {about.narrative}
            </p>

            {/* Architectural Stats Grid */}
            {about.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-sand">
                {about.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1 flex flex-col items-center text-center">
                    <span className="font-serif text-3xl sm:text-4xl font-normal text-olive">
                      {stat.value}
                    </span>
                    <p className="text-xs uppercase tracking-wider text-warm-grey font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
