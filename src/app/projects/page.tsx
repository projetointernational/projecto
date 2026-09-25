import { getSiteSettings, getAllProjects, getCategories } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsDirectory } from '@/components/projects/ProjectsDirectory';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { MotionSection } from '@/components/ui/MotionSection';

export const revalidate = 60;

export default async function ProjectsPage() {
  const [settings, categories, projects] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getAllProjects(),
  ]);

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
              subtitle="PORTFOLIO & CASE STUDIES"
              title="Selected Projects & Case Studies"
              description="A curated selection of projects supported through procurement, coordination and related project requirements."
            />
          </MotionSection>
        </section>

        {/* Catalog Section */}
        <section className="py-12 sm:py-16 bg-white">
          <MotionSection className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <ProjectsDirectory projects={projects} categories={categories} />
          </MotionSection>
        </section>

        <EnquiryCta
          eyebrow="GET STARTED"
          heading="Have a Similar Project in Mind?"
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
