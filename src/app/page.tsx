import {
  getSiteSettings,
  getHeroContent,
  getAboutContent,
  getProcessCollections,
  getServices,
  getEditorialFeature,
  getFeaturedProjects,
  getStrengths,
  getClients,
} from '@/lib/supabase/queries';
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

// ISR: revalidate every 60 seconds. Admin changes trigger /api/admin/revalidate
// to bust this cache immediately without waiting for the interval.
export const revalidate = 60;

export default async function HomePage() {
  // All queries run in parallel; React cache() deduplicates any repeated calls.
  const [
    settings,
    hero,
    about,
    allProcesses,
    services,
    editorialFeature,
    projects,
    audienceCards,
    clients,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroContent(),
    getAboutContent(),
    getProcessCollections(),
    getServices(),
    getEditorialFeature(),
    getFeaturedProjects(),
    getStrengths(),
    getClients(),
  ]);

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

  const sectionTwoMobileImage =
    (settings?.navigation_labels?.section_images?.about_mobile_section_image &&
     settings.navigation_labels.section_images.about_mobile_section_image.trim() !== '' &&
     settings.navigation_labels.section_images.about_mobile_section_image.trim() !== sectionTwoImage)
      ? settings.navigation_labels.section_images.about_mobile_section_image.trim()
      : null;

  const sectionThreeImage =
    procurementService?.image_url ||
    settings?.navigation_labels?.section_images?.procurement_section_image ||
    null;

  const sectionThreeMobileImage =
    settings?.navigation_labels?.section_images?.procurement_mobile_section_image ||
    null;

  const sectionRoleImage =
    settings?.navigation_labels?.section_images?.role_section_image ||
    null;

  const sectionRoleMobileImage =
    settings?.navigation_labels?.section_images?.role_mobile_section_image ||
    null;

  const heroMobileImage =
    settings?.navigation_labels?.section_images?.hero_mobile_background_image ||
    null;

  const coordinationDesktopImage =
    editorialFeature?.image_url && editorialFeature.image_url.trim() !== ''
      ? editorialFeature.image_url.trim()
      : settings?.navigation_labels?.section_images?.coordination_desktop_image &&
        settings.navigation_labels.section_images.coordination_desktop_image.trim() !== ''
      ? settings.navigation_labels.section_images.coordination_desktop_image.trim()
      : null;

  const coordinationMobileImage =
    settings?.navigation_labels?.section_images?.coordination_mobile_image &&
    settings.navigation_labels.section_images.coordination_mobile_image.trim() !== ''
      ? settings.navigation_labels.section_images.coordination_mobile_image.trim()
      : editorialFeature?.mobile_image_url && editorialFeature.mobile_image_url.trim() !== ''
      ? editorialFeature.mobile_image_url.trim()
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
        {/* Section 01: Hero */}
        <HeroSection content={hero} mobileImageUrl={heroMobileImage} />

        {/* Section 02: Two Core Services (Procurement & Project Coordination) */}
        {services.length > 0 && (
          <TwoCoreServices
            services={services}
            subtitle={about?.subtitle || "ABOUT PROJETO"}
            title={about?.title || "One Project. One Coordinated Partner."}
            imageUrl={sectionTwoImage}
            mobileImageUrl={sectionTwoMobileImage}
          />
        )}

        {/* Section 03: Procurement Process (Split Layout with Supporting Image & 6 Steps + Support Scope) */}
        {procurementProcess && (
          <ProcurementProcess
            processData={procurementProcess}
            procurementService={procurementService}
            imageUrl={sectionThreeImage}
            mobileImageUrl={sectionThreeMobileImage}
          />
        )}

        {/* Section 04: Project Coordination Ecosystem & Coordination Support */}
        <CoordinationSection
          coordinationService={coordinationService}
          coordinationSupport={coordinationSupport}
          feature={editorialFeature}
          desktopBackgroundImage={coordinationDesktopImage}
          mobileBackgroundImage={coordinationMobileImage}
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
            mobileImageUrl={sectionRoleMobileImage}
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
