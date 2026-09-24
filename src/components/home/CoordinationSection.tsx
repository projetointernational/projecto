'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Hexagon } from 'lucide-react';
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
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const eyebrow = feature?.subtitle || 'PROJECT COORDINATION';
  const heading =
    feature?.title || 'The Right People. The Right Resources. One Coordinated Process.';
  const description =
    feature?.description ||
    coordinationService?.short_description ||
    'Projeto can coordinate the professionals, contractors, vendors and execution teams required to progress a project, according to the client\'s requirements and agreed scope.';

  // Disciplines from DB (editorial_feature.highlights)
  const highlightsList: string[] =
    Array.isArray(feature?.highlights) && feature!.highlights.length > 0
      ? feature!.highlights
      : [];

  const mid = Math.ceil(highlightsList.length / 2);
  const leftColumnNodes = highlightsList.slice(0, mid);
  const rightColumnNodes = highlightsList.slice(mid);

  // Coordination milestones — all from DB (coordinationSupport.steps)
  const supportEyebrow = coordinationSupport?.subtitle || 'COORDINATION SUPPORT';
  const supportHeading =
    coordinationSupport?.title || 'Coordination That Keeps the Project Moving.';

  const milestones: { title: string; description?: string }[] =
    Array.isArray(coordinationSupport?.steps) && coordinationSupport!.steps.length > 0
      ? coordinationSupport!.steps
      : [];

  return (
    <section className="py-20 sm:py-18 bg-white border-b border-sand/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* PART 1: Project Coordination Ecosystem (Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24 sm:mb-32">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
                {eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-near-black font-normal leading-[1.18] tracking-tight">
              {heading}
            </h2>

            <p className="text-sm sm:text-base text-near-black/75 font-light leading-relaxed">
              {description}
            </p>

            <div className="pt-2">
              <Link
                href="/services/project-coordination"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-olive hover:text-near-black transition-colors"
              >
                <span>EXPLORE PROJECT COORDINATION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>

            {/* Legal Notice Callout with Hexagon Icon */}
            <div className="p-4 sm:p-5 border border-sand/80 bg-off-white/40 rounded-sm flex items-start space-x-3.5 mt-8">
              <Hexagon className="w-4 h-4 text-warm-grey shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-xs text-warm-grey font-light leading-relaxed">
                Projeto acts as a coordination partner. All licensed architectural, engineering, and specialist services are performed by appropriately qualified and registered professionals.
              </span>
            </div>
          </div>

          {/* Right Column: Visual Coordination Ecosystem (Exact Image 1 layout) */}
          <div className="lg:col-span-7">
            <div className="relative w-full rounded-sm bg-off-white/30 border border-sand/80 p-6 sm:p-10 shadow-2xs overflow-hidden">
              {/* Subtle background radar/grid concentric rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                <div className="w-[360px] h-[360px] rounded-full border border-sand-dark/50" />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-sand-dark/40" />
                <div className="absolute w-[120px] h-[120px] rounded-full border border-sand-dark/30" />
                <div className="absolute w-full h-[1px] bg-sand/60" />
                <div className="absolute h-full w-[1px] bg-sand/60" />
              </div>

              {/* Central PROJETO Hub (Top Center of diagram) */}
              <div className="relative z-20 flex flex-col items-center justify-center mb-8">
                <div className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#171717] rounded-full text-warm-beige shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                  <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-warm-beige">
                    PROJETO
                  </span>
                </div>
                <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-warm-grey mt-2">
                  CENTRAL COORDINATION CORE
                </p>
              </div>

              {/* 12 Disciplines in 2 columns of 6 */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Left Column of 6 */}
                <div className="space-y-2.5 sm:space-y-3">
                  {leftColumnNodes.map((item, idx) => {
                    const nodeIndex = idx;
                    const isHovered = hoveredNode === nodeIndex;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredNode(nodeIndex)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-sm border transition-all duration-200 cursor-default ${
                          isHovered
                            ? 'bg-near-black text-white border-near-black shadow-xs'
                            : 'bg-white text-near-black border-sand/70 hover:border-olive/50'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isHovered ? 'bg-warm-beige' : 'bg-olive'
                          }`}
                        />
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column of 6 */}
                <div className="space-y-2.5 sm:space-y-3">
                  {rightColumnNodes.map((item, idx) => {
                    const nodeIndex = idx + 6;
                    const isHovered = hoveredNode === nodeIndex;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredNode(nodeIndex)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-sm border transition-all duration-200 cursor-default ${
                          isHovered
                            ? 'bg-near-black text-white border-near-black shadow-xs'
                            : 'bg-white text-near-black border-sand/70 hover:border-olive/50'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isHovered ? 'bg-warm-beige' : 'bg-olive'
                          }`}
                        />
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Line: Project Disciplines & Single Coordinated Point */}
              <div className="pt-6 mt-6 border-t border-sand/60 flex items-center justify-between text-[11px] text-warm-grey font-mono">
                <span>{highlightsList.length > 0 ? `${highlightsList.length} Project Disciplines` : 'Project Disciplines'}</span>
                <span>Single Coordinated Point of Contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: Coordination Support Cards Grid (Clean 3-col on Desktop, 2-col on Mobile) */}
        {milestones.length > 0 && (
          <div>
            <div className="max-w-3xl mb-8 sm:mb-12">
              <div className="flex items-center space-x-2.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-olive font-mono font-semibold">
                  {supportEyebrow}
                </span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight">
                {supportHeading}
              </h3>
            </div>

            {/* Cards Grid: 3 columns on Desktop, 2 columns on Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {milestones.map((step, idx) => {
                const isLastOdd = idx === milestones.length - 1 && milestones.length % 2 !== 0;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className={`group bg-white rounded-sm border border-sand/60 hover:border-olive/50 hover:shadow-xs transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4.5 lg:p-5 ${
                      isLastOdd ? 'col-span-2 md:col-span-1' : 'col-span-1'
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-warm-beige bg-near-black px-2 py-0.5 rounded-sm inline-block">
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm lg:text-[15px] font-medium text-near-black leading-snug group-hover:text-olive transition-colors break-normal">
                        {step.title}
                      </h4>
                    </div>

                    {step.description && (
                      <div className="border-t border-sand/40 pt-2 mt-2 sm:pt-2.5 sm:mt-2.5">
                        <p className="text-[10.5px] sm:text-xs text-warm-grey font-light leading-relaxed break-normal">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
