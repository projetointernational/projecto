'use client';

import React from 'react';
import { ProcessContent, WorkflowStep } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { motion } from 'framer-motion';

interface ProcessSectionProps {
  content?: ProcessContent | null;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ content }) => {
  if (!content) return null;

  const steps: WorkflowStep[] = Array.isArray(content.steps)
    ? content.steps
    : typeof content.steps === 'string'
      ? (() => {
        try {
          return JSON.parse(content.steps);
        } catch {
          return [];
        }
      })()
      : [];

  const hasContent = Boolean(content.title || steps.length > 0);
  if (!hasContent) return null;

  const gridColsClass =
    steps.length === 1
      ? 'md:grid-cols-1'
      : steps.length === 2
        ? 'md:grid-cols-2'
        : steps.length === 4
          ? 'md:grid-cols-4'
          : 'md:grid-cols-3';

  return (
    <section className="py-10 sm:pt-20 sm:pb-16 bg-off-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-5 space-y-4">
            {content.subtitle && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-warm-grey">
                  {content.subtitle}
                </span>
              </div>
            )}

            <h2 className="font-serif text-2xl sm:text-3xl text-near-black font-normal leading-tight">
              {content.title}
            </h2>

            {content.description && (
              <p className="text-sm text-warm-grey font-light leading-relaxed max-w-md">
                {content.description}
              </p>
            )}
          </div>

          {/* Right Column: Workflow Steps with thin vertical dividers */}
          {steps.length > 0 && (
            <div className="lg:col-span-7">
              <div className={`grid grid-cols-2 ${gridColsClass} gap-6 md:gap-0 md:divide-x md:divide-sand`}>
                {steps.map((step, idx) => {
                  const isLastOdd = steps.length % 2 !== 0 && idx === steps.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`py-2 md:py-0 md:px-6 first:md:pl-0 last:md:pr-0 flex flex-col justify-start space-y-3 ${isLastOdd ? 'col-span-2 md:col-span-1' : ''
                        }`}
                    >
                      <div className="text-warm-beige">
                        <IconResolver
                          name={step.icon_name}
                          className="w-10 h-10 text-warm-beige"
                          strokeWidth={1.25}
                        />
                      </div>

                      <h3 className="font-serif text-sm text-near-black font-medium">
                        {step.title}
                      </h3>

                      <p className="text-xs text-warm-grey font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
