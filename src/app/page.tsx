import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { StrengthsSection } from '@/components/home/StrengthsSection';
import { EnquiryCta } from '@/components/home/EnquiryCta';
import { SiteSettings, HeroContent, AboutContent, Service, Project, Strength } from '@/lib/supabase/types';

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  let settings: SiteSettings | null = null;
  let hero: HeroContent | null = null;
  let about: AboutContent | null = null;
  let services: Service[] = [];
  let projects: Project[] = [];
  let strengths: Strength[] = [];

  try {
    const supabase = createPublicServerClient();

    // Fetch site settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    // Fetch hero
    const { data: heroData } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    hero = heroData;

    // Fetch about summary
    const { data: aboutData } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    about = aboutData;

    // Fetch services
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(6);
    services = servicesData || [];

    // Fetch featured projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(6);
    projects = projectsData || [];

    // Fetch strengths
    const { data: strengthsData } = await supabase
      .from('strengths')
      .select('*')
      .order('display_order', { ascending: true });
    strengths = strengthsData || [];
  } catch (error) {
    console.error('[HomePage] Supabase fetch warning:', error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        navLabels={settings?.navigation_labels}
      />
      <main className="flex-1">
        <HeroSection content={hero} />
        {about && <IntroSection about={about} />}
        <FeaturedServices services={services} />
        <FeaturedProjects projects={projects} />
        {strengths.length > 0 && <StrengthsSection strengths={strengths} />}
        <EnquiryCta />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
