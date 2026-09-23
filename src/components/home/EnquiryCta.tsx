'use client';

import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface EnquiryCtaProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const EnquiryCta: React.FC<EnquiryCtaProps> = ({
  eyebrow = 'GET STARTED',
  heading = 'Have a Project in Mind?',
  description = "Tell us what you need. We'll help coordinate the next step.",
  primaryCtaText = 'DISCUSS YOUR PROJECT',
  primaryCtaLink = '/contact',
  secondaryCtaText = 'REQUEST PROCUREMENT SUPPORT',
  secondaryCtaLink = '/services/procurement',
}) => {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
      >
        <div className="bg-near-black px-6 py-12 sm:p-16 lg:p-20 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-beige" />
              <span className="text-[10px] sm:text-xs uppercase text-warm-beige tracking-[0.2em] font-medium">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-off-white font-normal leading-[1.2] sm:leading-tight">
              {heading}
            </h2>
            <p className="text-xs sm:text-sm text-off-white/80 font-light max-w-xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button
              href={primaryCtaLink}
              variant="olive"
              size="lg"
              className="text-xs sm:text-sm py-3.5 px-6"
              icon={<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              {primaryCtaText}
            </Button>
            <Button
              href={secondaryCtaLink}
              variant="outline"
              size="lg"
              className="text-xs sm:text-sm py-3.5 px-6 border-white/30 text-off-white hover:bg-white hover:!text-near-black hover:border-white"
              icon={<ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              {secondaryCtaText}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
