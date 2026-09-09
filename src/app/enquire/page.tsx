'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/lib/supabase/types';

function EnquiryContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service') || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Information & Reassurance */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs uppercase text-warm-grey block mb-2">
            Project Initiation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mb-4">
            Direct Estimating & Feasibility Channel
          </h2>
          <p className="text-sm text-warm-grey font-light leading-relaxed">
            All submitted enquiries are reviewed directly by our principal engineers and estimating directors. We maintain strict non-disclosure compliance for all submitted architectural plans.
          </p>
        </div>

        {/* Protocol Steps */}
        <div className="space-y-6 pt-4 border-t border-sand">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-sm bg-sand flex items-center justify-center text-olive shrink-0 text-xs font-mono font-bold">
              01
            </div>
            <div>
              <h4 className="text-sm font-medium text-near-black">Scope Review</h4>
              <p className="text-xs text-warm-grey font-light mt-1">
                Initial evaluation of architectural drawings, structural needs, and site conditions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-sm bg-sand flex items-center justify-center text-olive shrink-0 text-xs font-mono font-bold">
              02
            </div>
            <div>
              <h4 className="text-sm font-medium text-near-black">Direct Partner Call</h4>
              <p className="text-xs text-warm-grey font-light mt-1">
                Discussion of schedule milestones, procurement strategies, and budget allocations.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-sm bg-sand flex items-center justify-center text-olive shrink-0 text-xs font-mono font-bold">
              03
            </div>
            <div>
              <h4 className="text-sm font-medium text-near-black">Proposal & Contract</h4>
              <p className="text-xs text-warm-grey font-light mt-1">
                Transparent itemized bill of quantities and binding construction schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-sand/30 rounded-sm space-y-2">
          <div className="flex items-center space-x-2 text-olive">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-wider font-semibold">Strict Confidentiality</span>
          </div>
          <p className="text-xs text-warm-grey font-light leading-relaxed">
            We routinely execute mutual non-disclosure agreements prior to reviewing proprietary drawings or institutional investment packets.
          </p>
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="lg:col-span-7 bg-sand/20 p-8 sm:p-12 rounded-sm">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-olive font-medium block mb-1">
            Intake Questionnaire
          </span>
          <h3 className="font-serif text-2xl text-near-black font-normal">
            Project Specifications
          </h3>
        </div>
        <EnquiryForm initialService={service} />
      </div>
    </div>
  );
}

export default function EnquirePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (data) setSettings(data);
      } catch (err) {
        console.error('[EnquirePage] Failed to fetch settings:', err);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
      />

      <main className="flex-1">
        {/* Banner */}
        <section className=" py-10 sm:py-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <SectionHeading
              subtitle="Project Consultation"
              title="Start an Architectural Project Enquiry"
              description="Provide your project parameters to initiate a formal feasibility and estimation review with our senior engineering team."
            />
          </div>
        </section>

        {/* Content */}
        <section className="py-24 sm:py-16 bg-off-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <Suspense fallback={<LoadingSpinner text="Loading Enquiry Protocol..." />}>
              <EnquiryContent />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
