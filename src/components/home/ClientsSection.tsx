'use client';

import React from 'react';
import Image from 'next/image';
import { Client } from '@/lib/supabase/types';
import { motion } from 'framer-motion';

interface ClientsSectionProps {
  clients: Client[];
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({ clients }) => {
  // Strict rule: do not add mock data or fallback data. Only display when admin has added clients.
  if (!clients || clients.length === 0) {
    return null;
  }

  // Duplicate items to ensure a seamless continuous loop regardless of how many clients exist
  const repeatCount = Math.max(4, Math.ceil(16 / clients.length));
  const marqueeItems = Array.from({ length: repeatCount }, () => clients).flat();

  return (
    <section className="py-10 sm:py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-10 sm:mb-12 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {/* <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive" /> */}
          {/* <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-warm-grey">
            Trusted Partnerships
          </span> */}
        </div>

        {/* Hardcoded proper heading as requested */}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-near-black uppercase">
          OUR CLIENTS
        </h2>
        <p className="mt-3 text-xs sm:text-[13px] text-warm-grey font-light leading-relaxed max-w-xl mx-auto">
          Trusted by leading developers, commercial enterprises, and partners to deliver architectural excellence.
        </p>
      </div>

      {/* Marquee ticker container with gradient fade edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade mask */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10"
          aria-hidden="true"
        />
        {/* Right fade mask */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10"
          aria-hidden="true"
        />

        {/* Scrolling track moving Right to Left */}
        <div className="animate-marquee-rtl flex items-center gap-6 sm:gap-8 py-2">
          {marqueeItems.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="group shrink-0 w-44 sm:w-56 h-20 sm:h-24 bg-white/80 backdrop-blur-sm border border-warm-grey/15 rounded-sm flex items-center justify-center p-4 shadow-xs transition-all duration-300 hover:bg-white hover:border-olive/30 hover:shadow-sm"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={client.logo_url}
                  alt="Client Logo"
                  width={160}
                  height={64}
                  className="max-h-12 sm:max-h-14 w-auto object-contain transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      </motion.div>
    </section>
  );
};
