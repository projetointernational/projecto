import React from 'react';
import { Strength } from '@/lib/supabase/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconResolver } from '@/components/ui/IconResolver';

interface StrengthsSectionProps {
  strengths: Strength[];
}

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-near-black text-off-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          theme="dark"
          subtitle="Why Projecto"
          title="The Standard in Architectural Execution"
          description="We combine structural rigor, material discernment, and relentless job-site discipline to deliver buildings that stand the test of time."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {strengths.map((item, idx) => (
            <div
              key={item.id}
              className="p-8 bg-dark-surface/60 rounded-sm flex flex-col justify-between space-y-6 hover:bg-dark-surface transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-sm bg-olive/20 text-warm-beige flex items-center justify-center">
                  <IconResolver name={item.icon_name} className="w-6 h-6 text-warm-beige" strokeWidth={1.25} />
                </div>
                <h3 className="font-serif text-xl font-normal text-off-white">
                  {item.title}
                </h3>
                <p className="text-sm text-warm-grey font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] uppercase tracking-widest text-warm-beige/60 font-mono">
                Pillar 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
