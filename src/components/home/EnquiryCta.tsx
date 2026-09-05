import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const EnquiryCta: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-off-white border-t border-sand">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-sand/40 p-10 sm:p-16 lg:p-20 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-warm-grey">
                Initiate Consultation
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-near-black font-normal leading-tight">
              Ready to construct your vision with master-builder precision?
            </h2>
            <p className="text-sm sm:text-base text-warm-grey font-light max-w-xl leading-relaxed">
              Connect with our structural directors to discuss site feasibility, architectural execution plans, and initial project cost models.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
            <Button
              href="/enquire"
              variant="olive"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
            >
              Start an Enquiry
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              icon={<ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />}
            >
              Contact Directory
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
