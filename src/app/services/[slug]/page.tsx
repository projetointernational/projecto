import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { MotionSection } from '@/components/ui/MotionSection';
import { IconResolver } from '@/components/ui/IconResolver';
import { CheckCircle2, ArrowRight, Shield, Layers, Users, Sparkles } from 'lucide-react';
import { SiteSettings, Service, ProcessContent } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const supabase = createPublicServerClient();

  // 1. Fetch site settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  // 2. Fetch the specific service by slug
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!service) {
    notFound();
  }

  // 3. Fetch process collections if applicable (e.g. for procurement or how-we-work)
  const { data: processCollections } = await supabase
    .from('process_content')
    .select('*')
    .eq('is_active', true);

  const processes = processCollections || [];
  const procurementProcess = processes.find(
    (p) => p.subtitle?.toUpperCase() === 'PROCUREMENT'
  );
  const workflowProcess = processes.find(
    (p) =>
      p.subtitle?.toUpperCase() === 'PROJECT WORKFLOW' ||
      p.title?.toLowerCase().includes('completion')
  );
  const coordinationProcess = processes.find(
    (p) => p.subtitle?.toUpperCase() === 'COORDINATION SUPPORT'
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
        phone={settings?.phone}
      />

      <main className="flex-1">
        {/* Service Hero Banner */}
        <section className="py-14 sm:py-24 bg-near-black text-off-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warm-beige" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-warm-beige font-mono">
                  {slug.toUpperCase().replace(/-/g, ' ')}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
                {service.title}
              </h1>
              <p className="text-sm sm:text-base text-off-white/80 font-light leading-relaxed max-w-2xl pt-2">
                {service.full_description || service.short_description}
              </p>
              <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-sm bg-olive text-white text-xs uppercase tracking-widest font-semibold hover:bg-olive-hover transition-colors"
                >
                  <span>
                    {slug === 'procurement'
                      ? 'Discuss Your Procurement Requirement'
                      : slug === 'for-architects-designers'
                      ? 'Partner with Projeto'
                      : 'Discuss Your Project'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-sm border border-white/20 text-off-white text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-colors"
                >
                  All Capabilities
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Offerings & Discipline Scope */}
        {service.features && service.features.length > 0 && (
          <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
            <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
              <div className="max-w-3xl mb-12 sm:mb-16">
                <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-2">
                  Scope of Support
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-near-black font-normal">
                  {slug === 'materials-project-supplies'
                    ? 'Project Supply Categories'
                    : slug === 'project-coordination'
                    ? 'A Central Coordination Point for Your Project'
                    : 'Key Deliverables & Responsibilities'}
                </h2>
                {slug === 'materials-project-supplies' && (
                  <p className="text-xs text-warm-grey font-light mt-2">
                    Materials and supplies are offered as part of our structured project procurement offering, not as an open retail catalogue.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {service.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-6 bg-sand/20 rounded-sm border border-sand/70 hover:border-olive/40 transition-colors space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center space-x-2 text-olive">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={1.5} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-warm-grey">
                        Item 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-serif text-sm sm:text-lg font-medium text-near-black leading-snug break-normal">
                      {feature}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Legal Notice for Coordination */}
              {slug === 'project-coordination' && (
                <div className="mt-12 p-5 bg-sand/30 rounded-sm border border-sand flex items-start space-x-3 text-xs text-warm-grey leading-relaxed">
                  <Shield className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>
                    Important Legal Positioning: Projeto acts as a project coordinator and procurement partner. All licensed architectural, engineering, and specialist services are performed by appropriately qualified and certified professionals.
                  </span>
                </div>
              )}
            </MotionSection>
          </section>
        )}

        {/* Dedicated Process Display: If Procurement */}
        {slug === 'procurement' && procurementProcess && (
          <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60">
            <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
              <div className="max-w-3xl mb-12 sm:mb-16">
                <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-2">
                  {procurementProcess.subtitle || 'PROCUREMENT PROCESS'}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-near-black font-normal">
                  {procurementProcess.title || 'From Requirement to Delivery. Coordinated.'}
                </h2>
                {procurementProcess.description && (
                  <p className="text-xs text-warm-grey font-light mt-2">
                    {procurementProcess.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {procurementProcess.steps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-5 bg-white rounded-sm border border-sand/70 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-warm-beige bg-near-black px-2 py-0.5 rounded-sm inline-block mb-2 sm:mb-3">
                        0{idx + 1}
                      </span>
                      <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-near-black mb-1.5 sm:mb-2 break-normal">
                        {step.title}
                      </h4>
                    </div>
                    {step.description && (
                      <p className="text-[10.5px] sm:text-[11px] text-warm-grey font-light pt-2 border-t border-sand/40 break-normal">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </MotionSection>
          </section>
        )}

        {/* Dedicated Process Display: If How We Work */}
        {slug === 'how-we-work' && workflowProcess && (
          <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60">
            <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
              <div className="max-w-3xl mb-12 sm:mb-16">
                <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-2">
                  {workflowProcess.subtitle || 'WORKFLOW'}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-near-black font-normal">
                  {workflowProcess.title || 'From Requirement to Completion.'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-10">
                {workflowProcess.steps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-5 bg-white rounded-sm border border-sand/70 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-warm-beige bg-near-black px-2 py-0.5 rounded-sm inline-block mb-2 sm:mb-3">
                        0{idx + 1}
                      </span>
                      <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-near-black mb-1.5 sm:mb-2 break-normal">
                        {step.title}
                      </h4>
                    </div>
                    {step.description && (
                      <p className="text-[10.5px] sm:text-[11px] text-warm-grey font-light pt-2 border-t border-sand/40 break-normal">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {workflowProcess.description && (
                <div className="p-4 sm:p-5 bg-sand/30 rounded-sm border border-sand/80 text-center max-w-3xl mx-auto">
                  <p className="text-xs text-warm-grey font-light italic leading-relaxed">
                    &ldquo;{workflowProcess.description}&rdquo;
                  </p>
                </div>
              )}
            </MotionSection>
          </section>
        )}

        {/* Dedicated Display: If Project Coordination */}
        {slug === 'project-coordination' && coordinationProcess && (
          <section className="py-16 sm:py-24 bg-off-white border-b border-sand/60">
            <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
              <div className="max-w-3xl mb-12 sm:mb-16">
                <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-2">
                  {coordinationProcess.subtitle || 'COORDINATION SUPPORT'}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-near-black font-normal">
                  {coordinationProcess.title || 'Coordination That Keeps the Project Moving.'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {coordinationProcess.steps?.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-5 bg-white rounded-sm border border-sand/60 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-warm-beige bg-near-black px-2 py-0.5 rounded-sm inline-block">
                        0{idx + 1}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-medium text-near-black leading-snug break-normal">
                        {step.title}
                      </h4>
                    </div>
                    {step.description && (
                      <p className="text-[10.5px] sm:text-xs text-warm-grey font-light pt-2 mt-1.5 sm:mt-2 border-t border-sand/40 break-normal">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </MotionSection>
          </section>
        )}

        {/* Final CTA */}
        <EnquiryCta
          eyebrow="PROJECT CONSULTATION"
          heading={
            slug === 'materials-project-supplies'
              ? "Can't find what you need?"
              : 'Ready to Coordinate Your Project?'
          }
          description={
            slug === 'materials-project-supplies'
              ? 'Send us your project requirement or Bill of Quantities (BOQ). We will help identify and source the right materials.'
              : 'Tell us what you are working on and the support you need. We will help identify the right next step.'
          }
          primaryCtaText={
            slug === 'materials-project-supplies'
              ? 'SEND PROJECT REQUIREMENT'
              : 'DISCUSS YOUR PROJECT'
          }
          primaryCtaLink={`/contact?service=${encodeURIComponent(service.title)}`}
          secondaryCtaText="ALL SERVICES"
          secondaryCtaLink="/services"
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
