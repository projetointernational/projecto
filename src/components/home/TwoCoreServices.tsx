'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Users } from 'lucide-react';
import { Service } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface TwoCoreServicesProps {
  services: Service[];
  subtitle?: string;
  title?: string;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
}

export const TwoCoreServices: React.FC<TwoCoreServicesProps> = ({
  services,
  subtitle = 'ABOUT PROJETO',
  title = 'One Project. One Coordinated Partner.',
  imageUrl,
  mobileImageUrl,
}) => {
  // Find the two core services: procurement & project-coordination (or take the first 2)
  const procurement =
    services.find((s) => s.slug === 'procurement') || services[0];
  const coordination =
    services.find((s) => s.slug === 'project-coordination') || services[1];

  const cards = [
    {
      data: procurement,
      verticalNum: '01',
      verticalName: 'PROCUREMENT',
      defaultTitle: 'Project Supplies & Procurement Consultancy',
      defaultDesc:
        'We help source, compare, negotiate and coordinate the materials that your project needs through a structured procurement process.',
      defaultCta: 'EXPLORE PROCUREMENT',
      href: '/services/procurement',
      icon: Package,
    },
    {
      data: coordination,
      verticalNum: '02',
      verticalName: 'PROJECT COORDINATION',
      defaultTitle: 'Complete Project Support',
      defaultDesc:
        'We coordinate professionals, contractors, suppliers and execution teams toward aligned project progress.',
      defaultCta: 'EXPLORE PROJECT COORDINATION',
      href: '/services/project-coordination',
      icon: Users,
    },
  ];

  // No hardcoded fallback: image only renders when CMS has one set
  const resolvedImage = imageUrl || null;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Layout: Left Column (Heading + 2 Cards), Right Column (Image spanning from heading level to cards on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT: Heading at the top + 2 Content Boxes below */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header - Aligned at top with the right-side image */}
            <div className="max-w-3xl mb-8 sm:mb-10">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold font-mono">
                  {subtitle}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight">
                {title}
              </h2>
            </div>

            {/* 2 Content Boxes Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 flex-1">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                const item = card.data;
                const cardTitle = item?.title || card.defaultTitle;
                const cardDesc = item?.short_description || card.defaultDesc;

                return (
                  <motion.div
                    key={card.verticalNum}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.12 }}
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-sm bg-[#FAF9F5] border border-sand/80 hover:border-olive/40 transition-all duration-300 shadow-2xs h-full"
                  >
                    <div className="space-y-4">
                      {/* Top Tag & Subtle Circle Icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-warm-beige bg-near-black px-2.5 py-1 rounded-xs uppercase font-medium">
                          {card.verticalNum} {card.verticalName}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-[#EAE6DE]/80 text-near-black/75 flex items-center justify-center group-hover:bg-olive group-hover:text-white transition-colors duration-300">
                          <Icon className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Title & Description (without tick lists) */}
                      <div className="space-y-2 pt-1">
                        <h3 className="font-serif text-lg sm:text-xl text-near-black font-medium leading-snug">
                          {cardTitle}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-near-black/75 font-light leading-relaxed">
                          {cardDesc}
                        </p>
                      </div>
                    </div>

                    {/* Card CTA Link */}
                    <div className="pt-6">
                      <Link
                        href={card.href}
                        className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-olive group-hover:text-near-black transition-colors"
                      >
                        <span>{card.defaultCta}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Clean Vertical Image Area starting at Heading Level on Desktop (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col h-full">
            {resolvedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative w-full h-full min-h-[280px] rounded-sm overflow-hidden border border-sand/80 shadow-2xs group bg-sand/20"
              >
                <Image
                  src={resolvedImage}
                  alt={title}
                  fill
                  sizes="(max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ) : null}
          </div>

          {/* Mobile Image: Only renders if dedicated mobileImageUrl exists; NEVER fallback to desktop image */}
          {mobileImageUrl ? (
            <div className="block lg:hidden w-full pt-4">
              <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-sand/20 border border-sand/80 shadow-2xs">
                <Image
                  src={mobileImageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
