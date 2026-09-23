import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/services/ServiceCard';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { EmptyState } from '@/components/ui/EmptyState';
import { MotionSection } from '@/components/ui/MotionSection';
import { Wrench } from 'lucide-react';
import { SiteSettings, Service } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicesPage() {
  let settings: SiteSettings | null = null;
  let services: Service[] = [];

  try {
    const supabase = createPublicServerClient();

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    services = servicesData || [];
  } catch (err) {
    console.error('[ServicesPage] Error fetching services:', err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
        phone={settings?.phone}
      />

      <main className="flex-1">
        {/* Banner */}
        <section className="py-12 sm:py-16 bg-off-white border-b border-sand/60">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <SectionHeading
              subtitle="CAPABILITIES & DISCIPLINES"
              title="Procurement & Project Coordination Services"
              description="From sourcing verified project materials to coordinating professionals and execution teams, explore our full spectrum of project support."
            />
          </MotionSection>
        </section>

        {/* Services List */}
        <section className="py-16 sm:py-20 bg-white">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            {services.length === 0 ? (
              <EmptyState
                title="Capabilities Directory Updating"
                description="Our procurement and coordination offerings are currently being updated. Contact our desk for details."
                icon={Wrench}
                actionHref="/contact"
                actionLabel="Inquire About Capabilities"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </MotionSection>
        </section>

        <EnquiryCta
          eyebrow="GET STARTED"
          heading="Discuss Your Project Scope"
          description="Tell us what you're working on and the support you need. We'll help identify the right next step."
          primaryCtaText="DISCUSS YOUR PROJECT"
          primaryCtaLink="/contact"
          secondaryCtaText="REQUEST PROCUREMENT SUPPORT"
          secondaryCtaLink="/services/procurement"
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
