'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Users, Check } from 'lucide-react';
import { Service } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface TwoCoreServicesProps {
  services: Service[];
  subtitle?: string;
  title?: string;
}

export const TwoCoreServices: React.FC<TwoCoreServicesProps> = ({
  services,
  subtitle = 'WHAT WE DO',
  title = 'One Project. One Coordinated Partner.',
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
        'We help you source the materials your project needs through structured procurement, vendor comparison, product sourcing and supply coordination.',
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
        'We coordinate professionals, contractors, vendors and execution teams according to your project requirements and agreed scope.',
      defaultCta: 'EXPLORE PROJECT COORDINATION',
      href: '/services/project-coordination',
      icon: Users,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-olive" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold">
              {subtitle}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal tracking-tight">
            {title}
          </h2>
        </div>

        {/* 2 Core Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const item = card.data;
            const cardTitle = item?.title || card.defaultTitle;
            const cardDesc = item?.short_description || card.defaultDesc;
            const features = item?.features || [];

            return (
              <motion.div
                key={card.verticalNum}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-sand/20 hover:bg-sand/35 border border-sand/80 hover:border-olive/40 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Vertical Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-widest text-warm-beige bg-near-black px-2.5 py-1 rounded-sm">
                      {card.verticalNum} — {card.verticalName}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-olive/10 text-olive flex items-center justify-center group-hover:bg-olive group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl sm:text-3xl text-near-black font-normal leading-snug">
                      {cardTitle}
                    </h3>
                    <p className="text-sm text-near-black/75 font-light leading-relaxed">
                      {cardDesc}
                    </p>
                  </div>

                  {/* Key Highlights / Features if present */}
                  {features.length > 0 && (
                    <div className="pt-2 border-t border-sand/60">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-warm-grey">
                        {features.slice(0, 4).map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center space-x-2">
                            <Check className="w-3.5 h-3.5 text-olive shrink-0" strokeWidth={2} />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-8">
                  <Link
                    href={card.href}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-olive group-hover:text-near-black transition-colors"
                  >
                    <span>{card.defaultCta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
