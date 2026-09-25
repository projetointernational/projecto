import Image from 'next/image';
import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { MotionSection } from '@/components/ui/MotionSection';
import { CheckCircle2, ShieldCheck, Users, Layers } from 'lucide-react';
import { SiteSettings, AboutContent, ProcessContent } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let settings: SiteSettings | null = null;
  let about: AboutContent | null = null;
  let processContent: ProcessContent | null = null;

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
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    processContent = processData;
  } catch (err) {
    console.error('[AboutPage] Error fetching about data:', err);
  }

  const eyebrow = about?.subtitle || 'ABOUT PROJETO';
  const heading = about?.title || 'One Project. One Coordinated Partner.';
  const narrative =
    about?.narrative ||
    'Projeto International supports construction, interior and related projects through procurement and project coordination.\n\nFrom sourcing verified quality materials to coordinating the right licensed professionals, contractors and execution teams, we act as your central project partner to ensure transparency, cost efficiency, and timely delivery.';

  // Desktop Image: Only if desktop image exists
  const desktopImageUrl =
    about?.main_image_url && about.main_image_url.trim() !== ''
      ? about.main_image_url.trim()
      : settings?.navigation_labels?.section_images?.about_section_image &&
        settings.navigation_labels.section_images.about_section_image.trim() !== ''
      ? settings.navigation_labels.section_images.about_section_image.trim()
      : null;

  // Mobile Image: Strictly and exclusively from the dedicated mobile image field in Admin.
  // NEVER fall back to desktopImageUrl or main_image_url!
  const rawMobileImage =
    settings?.navigation_labels?.section_images?.about_mobile_section_image &&
    settings.navigation_labels.section_images.about_mobile_section_image.trim() !== ''
      ? settings.navigation_labels.section_images.about_mobile_section_image.trim()
      : about?.mobile_image_url && about.mobile_image_url.trim() !== ''
      ? about.mobile_image_url.trim()
      : null;

  // Explicit check: mobile image only exists if rawMobileImage is provided AND does NOT match desktop image
  const mobileImageUrl =
    rawMobileImage && rawMobileImage !== desktopImageUrl
      ? rawMobileImage
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
        phone={settings?.phone}
      />

      <main className="flex-1">
        {/* Story & Philosophy Section */}
        <section className="py-12 sm:py-20 bg-off-white border-b border-sand/60">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* Desktop / Tablet Left Column: 4:5 Portrait Image, proportionally sized to match content height */}
              {desktopImageUrl ? (
                <div className="hidden md:flex md:col-span-5 items-center justify-center lg:justify-start">
                  <div className="relative w-full max-w-[280px] sm:max-w-[310px] lg:max-w-[340px] xl:max-w-[360px] aspect-[4/5] rounded-sm overflow-hidden bg-sand shadow-sm border border-sand/60">
                    <Image
                      src={desktopImageUrl}
                      alt={heading}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 310px, 360px"
                    />
                  </div>
                </div>
              ) : null}

              {/* Right Column: Narrative & Positioning */}
              <div className={`${desktopImageUrl ? 'md:col-span-7' : 'md:col-span-12 max-w-3xl'} space-y-6`}>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                  <span className="text-[11px] uppercase tracking-[0.22em] text-olive font-semibold">
                    {eyebrow}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-near-black font-normal leading-tight">
                  {heading}
                </h1>
                <div className="w-12 h-0.5 bg-warm-beige" />
                <p className="text-sm text-near-black/80 font-light leading-relaxed whitespace-pre-line">
                  {narrative}
                </p>

                {/* Mobile Only: 16:9 Landscape Image placed BELOW the complete content */}
                {/* Renders ONLY if dedicated mobileImageUrl exists; NEVER falls back to desktop image */}
                {mobileImageUrl ? (
                  <div className="block md:hidden pt-4">
                    <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-sand shadow-sm border border-sand/60">
                      <Image
                        src={mobileImageUrl}
                        alt={heading}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Approved Stats (only if present) */}
            {about?.stats && about.stats.length > 0 && (
              <div className="pt-8 border-t border-sand/60">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {about.stats.map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-serif text-3xl sm:text-4xl text-olive font-normal">
                        {stat.value}
                      </span>
                      <p className="text-xs uppercase tracking-wider text-warm-grey font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </MotionSection>
        </section>

        {/* Positioning & Core Pillars */}
        <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl mb-12 sm:mb-16">
              <span className="text-[11px] uppercase tracking-[0.2em] text-warm-grey font-medium block mb-2">
                Our Operating Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-near-black font-normal">
                How We Add Value to Your Project
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
                <div className="w-10 h-10 rounded-sm bg-white border border-sand/80 flex items-center justify-center text-olive">
                  <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-near-black font-normal">
                  Structured Procurement
                </h3>
                <p className="text-xs text-near-black/75 font-light leading-relaxed">
                  Transparent vendor comparisons, volume pricing negotiations, and verified quality materials aligned with your Bill of Quantities (BOQ).
                </p>
              </div>

              <div className="p-8 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
                <div className="w-10 h-10 rounded-sm bg-white border border-sand/80 flex items-center justify-center text-olive">
                  <Users className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-near-black font-normal">
                  Central Coordination
                </h3>
                <p className="text-xs text-near-black/75 font-light leading-relaxed">
                  Connecting and aligning architects, engineers, contractors, and suppliers so that everyone works with shared clarity and accountability.
                </p>
              </div>

              <div className="p-8 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
                <div className="w-10 h-10 rounded-sm bg-white border border-sand/80 flex items-center justify-center text-olive">
                  <Layers className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-near-black font-normal">
                  Delivery & Progress Follow-up
                </h3>
                <p className="text-xs text-near-black/75 font-light leading-relaxed">
                  Active tracking of lead times, milestone progress, and just-in-time delivery to prevent on-site delays and costly miscommunication.
                </p>
              </div>
            </div>
          </MotionSection>
        </section>

        {/* Mission & Vision */}
        {(about?.mission_text || about?.vision_text) && (
          <section className="py-16 sm:py-24 bg-off-white">
            <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {about?.mission_text && (
                  <div className="p-8 sm:p-12 bg-white rounded-sm border border-sand/70 space-y-4 shadow-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
                      Our Mission
                    </span>
                    <h3 className="font-serif text-2xl text-near-black font-normal">
                      Clarity, Reliability & Seamless Execution
                    </h3>
                    <p className="text-sm text-near-black/75 font-light leading-relaxed">
                      {about.mission_text}
                    </p>
                  </div>
                )}

                {about?.vision_text && (
                  <div className="p-8 sm:p-12 bg-white rounded-sm border border-sand/70 space-y-4 shadow-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-warm-beige font-semibold">
                      Our Vision
                    </span>
                    <h3 className="font-serif text-2xl text-near-black font-normal">
                      The Trusted Project Partner
                    </h3>
                    <p className="text-sm text-near-black/75 font-light leading-relaxed">
                      {about.vision_text}
                    </p>
                  </div>
                )}
              </div>
            </MotionSection>
          </section>
        )}

        <EnquiryCta
          eyebrow="CONNECT WITH PROJETO"
          heading="Have a Project in Mind?"
          description="Tell us what you need. We'll help coordinate the next step."
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
