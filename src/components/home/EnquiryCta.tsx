import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const EnquiryCta: React.FC = () => {
  return (
    <section className="py-24 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#B49A6A] p-10 sm:p-16 lg:p-20 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-xs uppercase text-white tracking-wider font-medium">
                Initiate Consultation
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              Ready to construct your vision with master-builder precision?
            </h2>
            <p className="text-sm text-white/90 font-light max-w-xl leading-relaxed">
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
              className="border-white/50 text-white hover:bg-white hover:!text-near-black hover:border-white"
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
