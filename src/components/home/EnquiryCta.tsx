'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export const EnquiryCta: React.FC = () => {
  return (
    <section className="pt-8 pb-0 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-0 sm:px-8 lg:px-12"
      >
        <div className="bg-olive-hover px-5 py-10 sm:p-16 lg:p-20 rounded-none sm:rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[10px] sm:text-xs uppercase text-white tracking-wider font-medium">
                Initiate Consultation
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-white font-normal leading-[1.2] sm:leading-tight">
              Ready to construct your vision with master-builder precision?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-light max-w-xl leading-relaxed">
              Connect with our structural directors to discuss site feasibility, architectural execution plans, and initial project cost models.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-4 shrink-0">
            <Button
              href="/enquire"
              variant="beige"
              size="lg"
              className="text-xs sm:text-base py-3 sm:py-4 px-5 sm:px-8"
              icon={<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              Start an Enquiry
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="text-xs sm:text-base py-3 sm:py-4 px-5 sm:px-8 border-white/50 text-white hover:bg-white hover:!text-near-black hover:border-white"
              icon={<ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />}
            >
              Contact Directory
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
