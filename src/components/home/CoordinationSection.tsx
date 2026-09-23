'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Users, Check, Shield } from 'lucide-react';
import { ProcessContent, Service, EditorialFeature } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface CoordinationSectionProps {
  coordinationService?: Service | null;
  coordinationSupport?: ProcessContent | null;
  feature?: EditorialFeature | null;
}

export const CoordinationSection: React.FC<CoordinationSectionProps> = ({
  coordinationService,
  coordinationSupport,
  feature,
}) => {
  const eyebrow = feature?.subtitle || 'PROJECT COORDINATION';
  const heading =
    feature?.title || 'The Right People. The Right Resources. One Coordinated Process.';
  const description =
    feature?.description ||
    coordinationService?.short_description ||
    'Projeto can coordinate the professionals, contractors, vendors and execution teams required to progress a project, according to the client\'s requirements and agreed scope.';

  // Resource tags / ecosystem from service features or editorial feature highlights
  const ecosystemItems =
    coordinationService?.features && coordinationService.features.length > 0
      ? coordinationService.features
      : (feature?.highlights as string[]) || [
          'Architects',
          'Structural / Civil Engineers',
          'Interior Designers',
          'MEP Consultants',
          'Vaasthu Consultants where required',
          'Main and specialist contractors',
          'Material suppliers and vendors',
          'Civil construction teams',
          'Interior and finishing teams',
          'Electrical and plumbing teams',
          'Landscaping teams',
          'Other specialist project resources',
        ];

  // 9 Coordination milestones from coordinationSupport or defaults
  const milestones =
    coordinationSupport?.steps && coordinationSupport.steps.length > 0
      ? coordinationSupport.steps
      : [
          { title: 'Requirement Understanding', description: 'Aligning scope & goals' },
          { title: 'Professional / Team Coordination', description: 'Aligning consultants' },
          { title: 'Design & Planning Coordination', description: 'Coordinating blueprints' },
          { title: 'Procurement Coordination', description: 'Material flow management' },
          { title: 'Vendor & Contractor Coordination', description: 'Briefs & schedules' },
          { title: 'Execution Follow-up', description: 'Tracking site progress' },
          { title: 'Material & Delivery Coordination', description: 'Just-in-time delivery' },
          { title: 'Progress & Communication Follow-up', description: 'Continuous reporting' },
          { title: 'Handover Coordination', description: 'Seamless project completion' },
        ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Part: The Coordination Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight leading-tight">
              {heading}
            </h2>
            <p className="text-sm text-near-black/75 font-light leading-relaxed">
              {description}
            </p>
            <div className="pt-2">
              <Link
                href="/services/project-coordination"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-olive hover:text-near-black transition-colors"
              >
                <span>Explore Project Coordination</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>

            {/* Legal Notice Callout */}
            <div className="p-4 bg-sand/30 rounded-sm border border-sand flex items-start space-x-3 text-xs text-warm-grey font-light leading-relaxed">
              <Shield className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
              <span>
                Projeto acts as a coordination partner. All licensed architectural, engineering, and specialist services are performed by appropriately qualified and registered professionals.
              </span>
            </div>
          </div>

          {/* Right: Coordination Resources Tags */}
          <div className="lg:col-span-7 bg-sand/20 p-8 sm:p-10 rounded-sm border border-sand/70">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-sand/60">
              <span className="text-[11px] uppercase tracking-[0.2em] text-warm-grey font-medium">
                Coordination Ecosystem
              </span>
              <Users className="w-4 h-4 text-olive" strokeWidth={1.5} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ecosystemItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2.5 p-3 rounded-sm bg-white border border-sand/60 text-xs text-near-black font-medium hover:border-olive/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-olive shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Part: Coordination Support Steps */}
        <div className="bg-sand/15 p-8 sm:p-12 rounded-sm border border-sand/70">
          <div className="max-w-3xl mb-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-warm-grey font-medium block mb-2">
              Execution Support
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-near-black font-normal">
              Coordination That Keeps the Project Moving.
            </h3>
            <p className="text-xs text-warm-grey font-light mt-1">
              From requirement definition through final handover, active coordination avoids project friction and communication gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="p-5 bg-white rounded-sm border border-sand/60 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                      0{idx + 1}
                    </span>
                    <Check className="w-3.5 h-3.5 text-olive/60" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-sm font-medium text-near-black leading-snug pt-1">
                    {step.title}
                  </h4>
                </div>
                {step.description && (
                  <p className="text-xs text-warm-grey font-light pt-2 mt-2 border-t border-sand/40">
                    {step.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
