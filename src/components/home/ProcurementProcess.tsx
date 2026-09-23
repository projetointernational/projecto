'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ProcessContent, Service } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface ProcurementProcessProps {
  processData?: ProcessContent | null;
  procurementService?: Service | null;
}

export const ProcurementProcess: React.FC<ProcurementProcessProps> = ({
  processData,
  procurementService,
}) => {
  if (processData && processData.is_active === false) {
    return null;
  }

  const eyebrow = processData?.subtitle || 'PROCUREMENT';
  const heading = processData?.title || 'From Requirement to Delivery. Coordinated.';
  const description =
    processData?.description ||
    'A structured, end-to-end procurement process designed to ensure material compliance, cost efficiency, and on-time site deliveries.';

  const steps =
    processData?.steps && processData.steps.length > 0
      ? processData.steps
      : [
          { title: 'BOQ / REQUIREMENT', description: 'Requirement review' },
          { title: 'VENDOR SELECTION', description: 'Verified suppliers' },
          { title: 'COMPARISON', description: 'Rate & spec evaluation' },
          { title: 'NEGOTIATION', description: 'Commercial terms' },
          { title: 'PROCUREMENT', description: 'Order placement' },
          { title: 'DELIVERY', description: 'Site logistics' },
          { title: 'COORDINATION', description: 'Supply alignment' },
        ];

  const supportItems =
    procurementService?.features && procurementService.features.length > 0
      ? procurementService.features
      : [
          'Project material procurement',
          'Procurement consultancy and management',
          'BOQ-based procurement',
          'Vendor identification and comparison',
          'Product sourcing and selection support',
          'Price negotiation',
          'Purchase coordination',
          'Delivery and supply coordination',
          'Project-specific/custom sourcing',
        ];

  return (
    <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
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
          {description && (
            <p className="text-sm text-near-black/75 font-light leading-relaxed mt-4 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* 7-Step Process Horizontal Stepper / Cards */}
        <div className="mb-16">
          {/* Desktop flow */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative bg-white p-5 rounded-sm border border-sand/70 shadow-sm flex flex-col justify-between group hover:border-olive/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-medium text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                      0{idx + 1}
                    </span>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-warm-grey/50 group-hover:text-olive transition-colors" />
                    )}
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

          {/* Mobile / Tablet scrollable cards */}
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
                    <span className="text-[10px] text-warm-grey uppercase tracking-widest font-mono">
                      Step {idx + 1}/0{steps.length}
                    </span>
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

        {/* Procurement Support Offerings Grid */}
        <div className="bg-white p-8 sm:p-12 rounded-sm border border-sand/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-sand/60">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-warm-grey font-medium block mb-1">
                Capability Scope
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-near-black font-normal">
                Procurement Support Services
              </h3>
            </div>
            <Link
              href="/services/procurement"
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-olive hover:text-near-black transition-colors"
            >
              <span>Explore Full Procurement Scope</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            {supportItems.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 py-1">
                <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs sm:text-sm text-near-black/85 font-light">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
