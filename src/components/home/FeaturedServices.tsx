'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Wrench } from 'lucide-react';
import { Service } from '@/lib/supabase/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/services/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

interface FeaturedServicesProps {
  services: Service[];
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services }) => {
  return (
    <section className="py-10 sm:py-16 bg-off-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            subtitle="Core Disciplines"
            title="Comprehensive Construction And Structural Services"
            description="From initial ground testing and architectural coordination to turnkey milestone completion, we provide end-to-end master builder expertise."
          />
          <Link
            href="/services"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] font-semibold text-olive hover:text-olive-hover transition-colors space-x-1.5 shrink-0"
          >
            <span>All Disciplines</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Services Grid or Architectural Empty State */}
        {services.length === 0 ? (
          <EmptyState
            title="Services Directory Updating"
            description="Our specialized construction disciplines and architectural capabilities are currently being updated."
            icon={Wrench}
            actionHref="/contact"
            actionLabel="Consult With Us"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
