import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { MotionSection } from '@/components/ui/MotionSection';
import { MapPin, Mail, Phone, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { SiteSettings, ContactPageContent } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
  let settings: SiteSettings | null = null;
  let contactContent: ContactPageContent | null = null;

  try {
    const supabase = createPublicServerClient();

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    const { data: contactData } = await supabase
      .from('contact_page')
      .select('*')
      .limit(1)
      .maybeSingle();
    contactContent = contactData;
  } catch (err) {
    console.error('[ContactPage] Error fetching contact content:', err);
  }

  const email = settings?.email || 'projetointernational@gmail.com';
  const phone = settings?.phone || '+91 9072873225';
  const address = settings?.address || 'Kochi, Kerala';
  const workingHours = settings?.working_hours || 'Monday - Saturday: 9:00 AM - 6:00 PM';
  const whatsappNum = settings?.navigation_labels?.whatsapp_number || '919072873225';
  const formOptions = settings?.navigation_labels?.form_options;

  const heading = contactContent?.heading || 'Discuss Your Project';
  const description =
    contactContent?.intro_text ||
    "Tell us what you're working on and the support you need. We'll help identify the right next step.";

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
              subtitle="PROJECT ENQUIRY"
              title={heading}
              description={description}
            />
          </MotionSection>
        </section>

        {/* Contact Content & Form */}
        <section className="py-12 sm:py-20 bg-white">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Quick Connect (Call/WhatsApp) & Details */}
              <div className="lg:col-span-5 space-y-8">
                {/* Prominent WhatsApp & Call Buttons (Mobile & Desktop) */}
                <div className="p-6 bg-sand/30 rounded-sm border border-sand space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-olive font-semibold block">
                    Direct Priority Channels
                  </span>
                  <h3 className="font-serif text-xl text-near-black font-normal">
                    Need an immediate discussion?
                  </h3>
                  <p className="text-xs text-near-black/70 font-light leading-relaxed">
                    Connect directly with our procurement and coordination directors via WhatsApp or phone.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-sm bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1ebd5b] transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" strokeWidth={2} />
                      <span>WhatsApp Us</span>
                    </a>

                    <a
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-sm bg-near-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-near-black/80 transition-colors shadow-xs"
                    >
                      <Phone className="w-4 h-4" strokeWidth={1.5} />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>

                {/* Office Directory */}
                <div className="space-y-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-warm-grey font-medium block">
                    Office & Operations
                  </span>

                  <div className="space-y-3 text-sm text-near-black">
                    <div className="flex items-start space-x-3.5 p-4 bg-sand/15 rounded-sm border border-sand/50">
                      <MapPin className="w-4 h-4 text-olive shrink-0 mt-1" strokeWidth={1.5} />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium block">
                          Location
                        </span>
                        <p className="font-medium text-xs sm:text-sm mt-0.5">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-4 bg-sand/15 rounded-sm border border-sand/50">
                      <Mail className="w-4 h-4 text-olive shrink-0 mt-1" strokeWidth={1.5} />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium block">
                          Email
                        </span>
                        <a href={`mailto:${email}`} className="font-medium text-xs sm:text-sm mt-0.5 hover:text-olive">
                          {email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-4 bg-sand/15 rounded-sm border border-sand/50">
                      <Clock className="w-4 h-4 text-olive shrink-0 mt-1" strokeWidth={1.5} />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium block">
                          Working Hours
                        </span>
                        <p className="font-medium text-xs sm:text-sm mt-0.5">{workingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Card */}
              <div className="lg:col-span-7 bg-sand/15 p-6 sm:p-10 rounded-sm border border-sand/70">
                <div className="mb-8">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-1">
                    Project Brief
                  </span>
                  <h3 className="font-serif text-2xl text-near-black font-normal">
                    Submit Project Enquiry
                  </h3>
                  <p className="text-xs text-warm-grey font-light mt-1">
                    Tell us your project requirements and we will connect you with the right solution.
                  </p>
                </div>
                <EnquiryForm formOptions={formOptions} />
              </div>
            </div>
          </MotionSection>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
