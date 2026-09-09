import Image from 'next/image';
import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { ProcessSection } from '@/components/home/ProcessSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { MotionSection } from '@/components/ui/MotionSection';
import { Info } from 'lucide-react';
import { SiteSettings, AboutContent, ProcessContent, Strength } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let settings: SiteSettings | null = null;
  let about: AboutContent | null = null;
  let processContent: ProcessContent | null = null;
  let strengths: Strength[] = [];

  try {
    const supabase = createPublicServerClient();

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    const { data: aboutData } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    about = aboutData;

    const { data: processData } = await supabase
      .from('process_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (processData && processData.is_active !== false) {
      processContent = processData;
    }

    const { data: strengthsData } = await supabase
      .from('strengths')
      .select('*')
      .order('display_order', { ascending: true });
    strengths = strengthsData || [];
  } catch (err) {
    console.error('[AboutPage] Error fetching about data:', err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
      />

      <main className="flex-1">
        {about ? (
          <>
            {/* Story & Visuals */}
            <section className="py-10 sm:py-8 bg-off-white">
              <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12 sm:space-y-16 lg:space-y-20">
                {/* Top Row: Left Image, Right Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  {/* Left Column: Visual Imagery */}
                  <div className="lg:col-span-6">
                    {about.main_image_url ? (
                      <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand shadow-sm">
                        <Image
                          src={about.main_image_url}
                          alt="Architectural Execution"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] rounded-sm bg-sand/50 flex items-center justify-center text-warm-grey text-xs tracking-wider">
                        Main About Visual Pending
                      </div>
                    )}
                  </div>

                  {/* Right Column: Philosophy & Narrative */}
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-xs uppercase text-warm-grey">
                      Our Philosophy
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-near-black font-normal leading-tight">
                      {about.title}
                    </h2>
                    <p className="text-sm text-near-black/80 font-light leading-relaxed whitespace-pre-line">
                      {about.narrative}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Left Content (Stats), Right Image */}
                {(about.secondary_image_url || (about.stats && about.stats.length > 0)) && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pt-8 sm:pt-10 lg:pt-12 border-t border-sand/60">
                    {/* Left Column: Stats Content */}
                    <div className="lg:col-span-6 space-y-6">
                      {about.stats && about.stats.length > 0 && (
                        <div className="grid grid-cols-2 gap-6 sm:gap-8">
                          {about.stats.map((stat, idx) => (
                            <div key={idx} className="space-y-1 flex flex-col items-center text-center sm:items-start sm:text-left">
                              <span className="font-serif text-3xl sm:text-4xl font-normal text-olive">
                                {stat.value}
                              </span>
                              <p className="text-xs uppercase tracking-wider text-warm-grey font-medium">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Secondary Image */}
                    {about.secondary_image_url && (
                      <div className="lg:col-span-6">
                        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-sm overflow-hidden bg-sand shadow-sm">
                          <Image
                            src={about.secondary_image_url}
                            alt="Craftsmanship & Detail"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </MotionSection>
            </section>

            {/* What We Do / Process Section */}
            {processContent && <ProcessSection content={processContent} />}

            {/* Mission & Vision */}
            {(about.mission_text || about.vision_text) && (
              <section className="sm:py-16 py-10">
                <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {about.mission_text && (
                      <div className="p-4 sm:p-12 bg-sand/40 rounded-sm space-y-4">
                        <span className="text-xs uppercase tracking-[0.2em] text-olive font-medium">
                          Our Mission
                        </span>
                        <h3 className="font-serif text-2xl text-near-black font-normal">
                          Honest Craftsmanship & Structural Permanence
                        </h3>
                        <p className="text-sm text-warm-grey font-light leading-relaxed">
                          {about.mission_text}
                        </p>
                      </div>
                    )}

                    {about.vision_text && (
                      <div className="p-4 sm:p-12 bg-sand/40 rounded-sm space-y-4">
                        <span className="text-xs uppercase tracking-[0.2em] text-warm-beige font-medium">
                          Our Vision
                        </span>
                        <h3 className="font-serif text-2xl text-near-black font-normal">
                          Shaping Modern Landscapes Responsibly
                        </h3>
                        <p className="text-sm text-warm-grey font-light leading-relaxed">
                          {about.vision_text}
                        </p>
                      </div>
                    )}
                  </div>
                </MotionSection>
              </section>
            )}
          </>
        ) : (
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20">
            <EmptyState
              title="About Narrative Updating"
              description="Our architectural studio profile and company ethos are currently being updated."
              icon={Info}
              actionHref="/contact"
              actionLabel="Contact Studio"
            />
          </MotionSection>
        )}

        <EnquiryCta />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
