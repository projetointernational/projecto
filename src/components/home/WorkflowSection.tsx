'use client';

import React from 'react';
import { ProcessContent } from '@/lib/supabase/types';
import { motion } from 'framer-motion';
import { IconResolver } from '@/components/ui/IconResolver';

interface WorkflowSectionProps {
  workflowData?: ProcessContent | null;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ workflowData }) => {
  if (workflowData && workflowData.is_active === false) {
    return null;
  }

  const eyebrow = workflowData?.subtitle || 'CORE PROJECT WORKFLOW';
  const heading = workflowData?.title || 'From Requirement to Completion.';
  const supportingNote =
    workflowData?.description ||
    'The sequence may vary by project. Projeto acts as a central coordination point based on the project\'s requirements and agreed scope.';

  const steps =
    workflowData?.steps && workflowData.steps.length > 0
      ? workflowData.steps
      : [
          { title: 'REQUIREMENT', description: 'Scope understanding', icon_name: 'FileText' },
          { title: 'PLANNING', description: 'Milestones & schedules', icon_name: 'Compass' },
          { title: 'BUILD THE TEAM', description: 'Professionals & contractors', icon_name: 'Users' },
          { title: 'PROCUREMENT', description: 'Materials & vendor sourcing', icon_name: 'Package' },
          { title: 'EXECUTION COORDINATION', description: 'On-site team alignment', icon_name: 'Wrench' },
          { title: 'PROGRESS FOLLOW-UP', description: 'Monitoring & reporting', icon_name: 'Layers' },
          { title: 'COMPLETION', description: 'Handover & closing', icon_name: 'CheckCircle2' },
        ];

  return (
    <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight">
            {heading}
          </h2>
        </div>

        {/* Workflow Pipeline */}
        <div className="relative mb-12">
          {/* Desktop Stepper */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-5 rounded-sm border border-sand/70 shadow-sm flex flex-col justify-between hover:border-olive transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-medium text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                      0{idx + 1}
                    </span>
                    <div className="text-warm-grey group-hover:text-olive transition-colors">
                      <IconResolver name={step.icon_name} className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h4 className="font-serif text-xs font-semibold text-near-black uppercase tracking-wider mb-2 leading-snug">
                    {step.title}
                  </h4>
                </div>
                {step.description && (
                  <p className="text-[11px] text-warm-grey font-light leading-relaxed pt-2 border-t border-sand/40">
                    {step.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Horizontal Carousel */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-5 px-5 snap-x">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="shrink-0 w-64 bg-white p-5 rounded-sm border border-sand/70 shadow-sm flex flex-col justify-between snap-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-medium text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                      0{idx + 1}
                    </span>
                    <IconResolver name={step.icon_name} className="w-4 h-4 text-warm-grey" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-near-black uppercase tracking-wider mb-2">
                    {step.title}
                  </h4>
                </div>
                {step.description && (
                  <p className="text-xs text-warm-grey font-light leading-relaxed pt-2 border-t border-sand/40">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Note */}
        {supportingNote && (
          <div className="p-4 sm:p-5 bg-sand/30 rounded-sm border border-sand/80 text-center max-w-3xl mx-auto">
            <p className="text-xs text-warm-grey font-light italic leading-relaxed">
              &ldquo;{supportingNote}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
