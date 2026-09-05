import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { SiteSettings, ContactPageContent } from '@/lib/supabase/types';

export const revalidate = 60;

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

  const email = settings?.email || 'contact@projecto.com';
  const phone = settings?.phone || '+1 (555) 234-5678';
  const address =
    settings?.address || '450 Architectural Boulevard, Suite 800, New York, NY 10018';
  const workingHours = settings?.working_hours || 'Monday - Friday: 8:00 AM - 6:00 PM';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        navLabels={settings?.navigation_labels}
      />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-sand/30 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeading
              subtitle="Contact Directory"
              title={contactContent?.heading || 'Let us build your next landmark together.'}
              description={
                contactContent?.intro_text ||
                'Whether initiating a ground-up development, architectural renovation, or specialized structural consultation, our senior engineering partners are ready to review your blueprints.'
              }
            />
          </div>
        </section>

        {/* Contact Content & Form */}
        <section className="py-24 sm:py-32 bg-off-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Left Contact Directory */}
              <div className="lg:col-span-5 space-y-10">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-warm-grey block mb-2">
                    Executive Headquarters
                  </span>
                  <h3 className="font-serif text-2xl text-near-black font-normal mb-4">
                    Office & Estimating Studio
                  </h3>
                  <p className="text-sm text-warm-grey font-light leading-relaxed">
                    Our central studio hosts engineering reviews, material sample inspections, and client planning consultations.
                  </p>
                </div>

                <div className="space-y-6 text-sm text-near-black">
                  <div className="flex items-start space-x-4 p-4 bg-sand/30 rounded-sm">
                    <MapPin className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.25} />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-warm-grey font-medium block">
                        Location
                      </span>
                      <p className="font-medium mt-0.5">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-sand/30 rounded-sm">
                    <Mail className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.25} />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-warm-grey font-medium block">
                        Direct Inquiries
                      </span>
                      <a href={`mailto:${email}`} className="font-medium mt-0.5 hover:text-olive">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-sand/30 rounded-sm">
                    <Phone className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.25} />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-warm-grey font-medium block">
                        Direct Line
                      </span>
                      <a href={`tel:${phone}`} className="font-medium mt-0.5 hover:text-olive">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-sand/30 rounded-sm">
                    <Clock className="w-5 h-5 text-olive shrink-0 mt-0.5" strokeWidth={1.25} />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-warm-grey font-medium block">
                        Operating Hours
                      </span>
                      <p className="font-medium mt-0.5">{workingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Card */}
              <div className="lg:col-span-7 bg-sand/20 p-8 sm:p-12 rounded-sm">
                <div className="mb-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-olive font-medium block mb-1">
                    Direct Contact
                  </span>
                  <h3 className="font-serif text-2xl text-near-black font-normal">
                    Submit Project Inquiry
                  </h3>
                </div>
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
