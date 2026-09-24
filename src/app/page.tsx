import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TwoCoreServices } from '@/components/home/TwoCoreServices';
import { ProcurementProcess } from '@/components/home/ProcurementProcess';
import { CoordinationSection } from '@/components/home/CoordinationSection';
import { WorkflowSection } from '@/components/home/WorkflowSection';
import { AudienceSection } from '@/components/home/AudienceSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ClientsSection } from '@/components/home/ClientsSection';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import {
  SiteSettings,
  HeroContent,
  AboutContent,
  ProcessContent,
  Service,
  Project,
  Strength,
  Client,
  EditorialFeature as EditorialFeatureType,
} from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let settings: SiteSettings | null = null;
  let hero: HeroContent | null = null;
  let about: AboutContent | null = null;
  let allProcesses: ProcessContent[] = [];
  let services: Service[] = [];
  let editorialFeature: EditorialFeatureType | null = null;
  let projects: Project[] = [];
  let audienceCards: Strength[] = [];
  let clients: Client[] = [];

  try {
    const supabase = createPublicServerClient();

    // 1. Site settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    // 2. Hero content
    const { data: heroData } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    hero = heroData;

    // 3. About content (used for Section 02 visual image & identity)
    const { data: aboutData } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    about = aboutData;

    // 4. Process collections (Procurement, Coordination Support, Workflow)
    const { data: processData } = await supabase
      .from('process_content')
      .select('*')
      .eq('is_active', true);
    allProcesses = processData || [];

    // 5. Services (Procurement, Project Coordination, etc.)
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    services = servicesData || [];

    // 6. Editorial showcase feature
    const { data: featureData } = await supabase
      .from('editorial_feature')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    editorialFeature = featureData;

    // 7. Selected projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(6);
    projects = projectsData || [];

    // 8. Audience cards / Who We Work With (from strengths table)
    const { data: strengthsData } = await supabase
      .from('strengths')
      .select('*')
      .order('display_order', { ascending: true });
    audienceCards = strengthsData || [];

    // 9. Clients / Partners
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true });
    if (!clientsError && clientsData) {
      clients = clientsData;
    }
  } catch (error) {
    console.error('[HomePage] Supabase fetch warning:', error);
  }

  // Identify specific process collections from Admin data
  const procurementProcess =
    allProcesses.find((p) => p.subtitle?.toUpperCase() === 'PROCUREMENT') ||
    allProcesses[0] ||
    null;

  const coordinationSupport =
    allProcesses.find((p) => p.subtitle?.toUpperCase() === 'COORDINATION SUPPORT') ||
    allProcesses[1] ||
    null;

  const workflowProcess =
    allProcesses.find(
      (p) =>
        p.subtitle?.toUpperCase() === 'PROJECT WORKFLOW' ||
        p.title?.toLowerCase().includes('completion')
    ) ||
    allProcesses[2] ||
    null;

  const procurementService = services.find((s) => s.slug === 'procurement');
  const coordinationService = services.find((s) => s.slug === 'project-coordination');

  // Resolved admin-controlled section images
  const sectionTwoImage =
    about?.main_image_url ||
    settings?.navigation_labels?.section_images?.about_section_image ||
    null;

  const sectionThreeImage =
    procurementService?.image_url ||
    settings?.navigation_labels?.section_images?.procurement_section_image ||
    null;

  const sectionRoleImage =
    settings?.navigation_labels?.section_images?.role_section_image ||
    null;

  const heroMobileImage =
    settings?.navigation_labels?.section_images?.hero_mobile_background_image ||
    null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
        phone={settings?.phone}
      />

      <main className="flex-1">
        {/* Section 01: Hero */}
        <HeroSection content={hero} mobileImageUrl={heroMobileImage} />

        {/* Section 02: Two Core Services (Procurement & Project Coordination) */}
        {services.length > 0 && (
          <TwoCoreServices
            services={services}
            subtitle={about?.subtitle || "ABOUT PROJETO"}
            title={about?.title || "One Project. One Coordinated Partner."}
            imageUrl={sectionTwoImage}
          />
        )}

        {/* Section 03: Procurement Process (Split Layout with Supporting Image & 6 Steps + Support Scope) */}
        {procurementProcess && (
          <ProcurementProcess
            processData={procurementProcess}
            procurementService={procurementService}
            imageUrl={sectionThreeImage}
          />
        )}

        {/* Section 04: Project Coordination Ecosystem & Coordination Support */}
        <CoordinationSection
          coordinationService={coordinationService}
          coordinationSupport={coordinationSupport}
          feature={editorialFeature}
        />

        {/* Section 05: Core Project Workflow (7 Stages + Supporting Note) */}
        {workflowProcess && <WorkflowSection workflowData={workflowProcess} />}

        {/* Section 06: Who We Work With (Audience Cards - Split Layout with Supporting Image) */}
        {audienceCards.length > 0 && (
          <AudienceSection
            audienceCards={audienceCards}
            subtitle="WHO WE WORK WITH"
            title="Built Around Your Role in the Project."
            imageUrl={sectionRoleImage}
          />
        )}

        {/* Section 07: Selected Projects & Case Studies */}
        {projects.length > 0 && (
          <FeaturedProjects
            projects={projects}
            subtitle="PORTFOLIO"
            title="Selected Projects & Case Studies"
            description="A curated selection of projects demonstrating our procurement, coordination and project support capabilities."
          />
        )}

        {/* Section 08: Verified Clients / Partners */}
        {clients.length > 0 && <ClientsSection clients={clients} />}

        {/* Section 09: Final CTA Block */}
        <EnquiryCta
          eyebrow="GET STARTED"
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
