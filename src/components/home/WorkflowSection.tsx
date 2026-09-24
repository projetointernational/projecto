'use client';

import React from 'react';
import { ProcessContent } from '@/lib/supabase/types';
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

  const steps =
    workflowData?.steps && workflowData.steps.length > 0
      ? workflowData.steps
      : [
          { title: 'REQUIREMENT', description: 'Understanding project objectives, scope, and deliverables' },
          { title: 'PLANNING', description: 'Structuring milestones, resource allocation, and schedules' },
          { title: 'BUILD THE TEAM', description: 'Assembling qualified professionals and contractors' },
          { title: 'PROCUREMENT', description: 'Material sourcing, vendor comparison, and supply' },
          { title: 'EXECUTION COORDINATION', description: 'Aligning contractors and vendors on-site' },
          { title: 'PROGRESS FOLLOW-UP', description: 'Continuous monitoring, communication, and issue resolution' },
          { title: 'COMPLETION', description: 'Final inspection, handover coordination, and closure' },
        ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading with 2-line break as in screenshot */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="flex items-center space-x-2.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-near-black font-normal tracking-tight leading-[1.15]">
            From Requirement to<br />Completion.
          </h2>
        </div>

        {/* 7 Columns Editorial Layout (Exact Image 3 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-6">
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
