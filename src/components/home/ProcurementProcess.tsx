'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ProcessContent, Service } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { motion } from 'framer-motion';

interface ProcurementProcessProps {
  processData?: ProcessContent | null;
  procurementService?: Service | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
}

export const ProcurementProcess: React.FC<ProcurementProcessProps> = ({
  processData,
  procurementService,
  imageUrl,
  mobileImageUrl,
}) => {
  if (processData && processData.is_active === false) {
    return null;
  }

  const eyebrow = processData?.subtitle || 'PROCUREMENT';
  const heading = processData?.title || 'From Requirement to Delivery. Coordinated.';
  const description =
    processData?.description ||
    'From BOQ-based procurement and vendor selection to negotiation, purchasing and delivery coordination, Projeto helps simplify the procurement process.';

  const steps =
    Array.isArray(processData?.steps) && processData!.steps.length > 0
      ? processData!.steps
      : [];

  const supportItems =
    Array.isArray(procurementService?.features) && procurementService!.features.length > 0
      ? procurementService!.features
      : [];

  const resolvedDesktopImage = imageUrl || procurementService?.image_url || '';
  const resolvedMobileImage = mobileImageUrl || resolvedDesktopImage || '';

  return (
    <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        {/* Split Layout: Left Image (approx 45%), Right Content & 7 Steps (approx 55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-stretch">
          {/* LEFT COLUMN: Large Supporting Project / Procurement Image (approx 45%) — 4:3 Desktop, 16:9 Mobile */}
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[340px] rounded-sm overflow-hidden border border-sand/80 shadow-2xs group bg-sand/30"
            >
              {resolvedDesktopImage && (
                <Image
                  src={resolvedDesktopImage}
                  alt={heading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className={`${resolvedMobileImage && resolvedMobileImage !== resolvedDesktopImage ? 'hidden lg:block' : ''} object-cover transition-transform duration-700 group-hover:scale-105`}
                  loading="lazy"
                />
              )}
              {resolvedMobileImage && resolvedMobileImage !== resolvedDesktopImage && (
                <Image
                  src={resolvedMobileImage}
                  alt={heading}
                  fill
                  sizes="100vw"
                  className="block lg:hidden object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              {/* Subtle architectural vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 via-transparent to-transparent opacity-80" />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Heading, Description & 6 Process Steps (approx 55%) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 order-1 lg:order-2">
            <div>
              {/* Header */}
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

            {/* 7 Steps Process Grid: 1 Single Row on Desktop (7 cols), 2-Col Grid on Mobile with 07 Centered */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-1.5 xl:gap-2 pt-2">
              {steps.map((step, idx) => {
                const isLastOdd = idx === 6 || (idx === steps.length - 1 && steps.length % 2 !== 0);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`group relative bg-white rounded-sm border border-sand/70 shadow-2xs flex flex-col justify-between items-center text-center transition-colors duration-200 hover:border-olive/60 hover:bg-[#FAF9F5] p-3 sm:p-3.5 lg:px-1 lg:py-2.5 xl:px-1.5 xl:py-3 min-h-[135px] sm:min-h-[140px] lg:min-h-[140px] h-full ${
                      isLastOdd ? 'col-span-2 lg:col-span-1' : 'col-span-1'
                    }`}
                  >
                    <div className="flex flex-col items-center w-full space-y-2 lg:space-y-1.5">
                      {/* Icon */}
                      <div className="w-8 h-8 lg:w-7 lg:h-7 xl:w-7.5 xl:h-7.5 rounded-full bg-sand/40 text-olive flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-colors duration-200">
                        <IconResolver
                          name={step.icon_name || 'FileText'}
                          className="w-4 h-4 lg:w-3.5 lg:h-3.5"
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Step Number */}
                      <span className="text-[10px] font-mono font-medium text-warm-grey leading-none">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Step Title - Natural word wrapping only, complete words without letter-by-letter breaking */}
                    <div className="w-full flex-1 flex items-center justify-center min-h-[30px] lg:min-h-[28px] xl:min-h-[32px] px-0.5 my-auto">
                      <h4 className="font-sans text-[11px] sm:text-xs lg:text-[8.5px] xl:text-[9.5px] font-semibold text-near-black uppercase tracking-[-0.02em] lg:tracking-[-0.03em] leading-[1.2] text-center w-full break-normal whitespace-normal">
                        {step.title}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Procurement Support Offerings Grid */}
        {supportItems.length > 0 && (
          <div className="bg-white p-6 sm:p-10 rounded-sm border border-sand/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-sand/60">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-8">
              {supportItems.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 py-0.5">
                  <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-xs sm:text-sm text-near-black/85 font-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
