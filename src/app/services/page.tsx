import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from '@/components/services/ServiceCard';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { EmptyState } from '@/components/ui/EmptyState';
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
      />

      <main className="flex-1">
        {/* Banner */}
        <section className=" py-20 sm:py-6">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeading
              subtitle="Disciplines & Capabilities"
              title="End-to-End Architectural Construction Services"
              description="From ground-breaking structural works to meticulous interior detailing, explore our full spectrum of master builder services."
            />
          </div>
        </section>

        {/* Services List */}
        <section className="py-24 sm:py-16 bg-off-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {services.length === 0 ? (
              <EmptyState
                title="Capabilities Directory Updating"
                description="Our structural and architectural service offerings are currently being updated. Contact our design desk for details."
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
          </div>
        </section>

        <EnquiryCta />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
