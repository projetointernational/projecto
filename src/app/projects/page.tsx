import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectsDirectory } from '@/components/projects/ProjectsDirectory';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { SiteSettings, Project, Category } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  let settings: SiteSettings | null = null;
  let projects: Project[] = [];
  let categories: Category[] = [];

  try {
    const supabase = createPublicServerClient();

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    categories = categoriesData || [];

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    projects = projectsData || [];
  } catch (err) {
    console.error('[ProjectsPage] Error fetching projects:', err);
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
        <section className=" py-20 sm:py-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeading
              subtitle="Portfolio Directory"
              title="Architectural Works & Completed Projects"
              description="A curated survey of our luxury residential, commercial, and structural engineering projects completed across regions."
            />
          </div>
        </section>

        {/* Catalog Section */}
        <section className="py-20 sm:py-28 bg-off-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <ProjectsDirectory projects={projects} categories={categories} />
          </div>
        </section>

        <EnquiryCta />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
