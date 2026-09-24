'use client';

import React from 'react';
import { ProcessContent } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { motion } from 'framer-motion';

interface WorkflowSectionProps {
  workflowData?: ProcessContent | null;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ workflowData }) => {
  if (workflowData && workflowData.is_active === false) {
    return null;
  }

  const eyebrow = workflowData?.subtitle || 'PROJECT WORKFLOW';
  const heading = workflowData?.title || 'From Requirement to Completion.';

  const defaultStepIcons = ['FileText', 'Compass', 'Users', 'Package', 'Wrench', 'Layers', 'CheckCircle2'];

  const steps =
    Array.isArray(workflowData?.steps) && workflowData!.steps.length > 0
      ? workflowData!.steps
      : [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center space-x-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-near-black font-normal tracking-tight leading-[1.15]">
            {heading}
          </h2>
        </div>

        {/* Mobile / Tablet Responsive 2-Column Grid (Cards 01-06 in 3x2, Card 07 full-width) */}
        <div className="grid grid-cols-2 lg:hidden gap-3 sm:gap-4">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const iconName = step.icon_name || defaultStepIcons[idx % defaultStepIcons.length];

            if (isLast) {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="col-span-2 flex items-center justify-between p-4 sm:p-5 bg-white border border-sand/80 rounded-xs shadow-2xs group hover:border-olive/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-sand/35 text-olive flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-colors duration-200">
                      <IconResolver name={iconName} className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs sm:text-[13px] font-semibold text-near-black uppercase tracking-wider truncate">
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="text-[10px] sm:text-[11px] text-near-black/75 font-light leading-relaxed truncate sm:whitespace-normal">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl text-warm-grey/35 font-light shrink-0 select-none">
                    0{idx + 1}
                  </span>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="col-span-1 flex flex-col justify-between p-4 sm:p-5 bg-white border border-sand/80 rounded-xs shadow-2xs group hover:border-olive/50 transition-colors h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-sand/35 text-olive flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-colors duration-200">
                      <IconResolver name={iconName} className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl text-warm-grey/35 font-light select-none">
                      0{idx + 1}
                    </span>
                  </div>

                  <h4 className="font-serif text-xs sm:text-[13px] font-semibold text-near-black uppercase tracking-wider leading-snug mb-1.5">
                    {step.title}
                  </h4>

                  {step.description && (
                    <p className="text-[10.5px] sm:text-xs text-near-black/75 font-light leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 7 Columns Editorial Layout (Desktop - Preserved) */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-6 xl:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="flex flex-col space-y-2 group"
            >
              {/* Huge, Light, Elegant Gray Numeral */}
              <span className="font-serif text-5xl lg:text-6xl text-warm-grey/40 font-light select-none group-hover:text-olive/70 transition-colors">
                0{idx + 1}
              </span>

              {/* Bold Uppercase Step Title */}
              <h3 className="font-serif text-xs sm:text-sm font-semibold text-near-black uppercase tracking-[0.14em] leading-snug group-hover:text-olive transition-colors pt-1">
                {step.title}
              </h3>

              {/* Step Description */}
              {step.description && (
                <p className="text-xs text-warm-grey font-light leading-relaxed pt-1">
                  {step.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
