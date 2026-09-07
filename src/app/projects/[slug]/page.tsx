import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicServerClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, User, Maximize2 } from 'lucide-react';
import { SiteSettings, Project } from '@/lib/supabase/types';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  let settings: SiteSettings | null = null;
  let project: Project | null = null;
  let relatedProjects: Project[] = [];

  try {
    const supabase = createPublicServerClient();

    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    settings = settingsData;

    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    project = projectData;

    if (project) {
      // Fetch related projects in same category or general
      const { data: relatedData } = await supabase
        .from('projects')
        .select('*')
        .neq('id', project.id)
        .limit(3);
      relatedProjects = relatedData || [];
    }
  } catch (err) {
    console.error('[ProjectDetailPage] Fetch error:', err);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        companyName={settings?.company_name}
        logoUrl={settings?.logo_url}
        navLabels={settings?.navigation_labels}
      />

      <main className="flex-1">
        {/* Navigation Breadcrumb */}
        <div className="bg-sand/30 py-6 border-b border-sand">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center text-xs uppercase tracking-wider text-warm-grey hover:text-near-black transition-colors space-x-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Back to Works Directory</span>
            </Link>

            {project.category_name && (
              <span className="text-xs uppercase tracking-widest text-olive font-medium">
                {project.category_name}
              </span>
            )}
          </div>
        </div>

        {/* Project Header */}
        <section className="py-16 sm:py-24 bg-off-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-near-black font-normal leading-tight">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-warm-grey font-light leading-relaxed">
                {project.short_description}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 my-10 border-y border-sand">
              {project.location && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-warm-grey flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
                    <span>Location</span>
                  </span>
                  <p className="text-sm font-medium text-near-black">{project.location}</p>
                </div>
              )}

              {project.year && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-warm-grey flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
                    <span>Year Completed</span>
                  </span>
                  <p className="text-sm font-medium text-near-black">{project.year}</p>
                </div>
              )}

              {project.client && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-warm-grey flex items-center space-x-1">
                    <User className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
                    <span>Client / Partner</span>
                  </span>
                  <p className="text-sm font-medium text-near-black">{project.client}</p>
                </div>
              )}

              {project.area && (
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-warm-grey flex items-center space-x-1">
                    <Maximize2 className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
                    <span>Gross Area</span>
                  </span>
                  <p className="text-sm font-medium text-near-black">{project.area}</p>
                </div>
              )}
            </div>

            {/* Main Milestone Imagery */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-sm overflow-hidden bg-sand mb-16 shadow-sm">
              <Image
                src={project.main_image_url}
                alt={project.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>

            {/* Detailed Narrative & Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
              <div className="lg:col-span-8 space-y-6">
                <span className="text-xs uppercase text-warm-grey">
                  Architectural Narrative & Scope
                </span>
                <div className="text-base sm:text-lg text-near-black/85 font-light leading-relaxed whitespace-pre-line space-y-4">
                  {project.full_description || project.short_description}
                </div>
              </div>

              <div className="lg:col-span-4 p-8 bg-sand/30 rounded-sm space-y-6">
                <h3 className="font-serif text-xl text-near-black font-normal">
                  Inquire on Similar Works
                </h3>
                <p className="text-xs sm:text-sm text-warm-grey leading-relaxed font-light">
                  Seeking structural engineering or master-builder execution for a project of similar scope?
                </p>
                <Button
                  href={`/enquire?service=${encodeURIComponent(project.title)}`}
                  variant="olive"
                  size="md"
                  className="w-full"
                  icon={<ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />}
                >
                  Consult on this Scope
                </Button>
              </div>
            </div>

            {/* Gallery Images */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="space-y-8 mb-24">
                <div className="border-t border-sand pt-12">
                  <span className="text-xs uppercase text-warm-grey block mb-3">
                    Project Gallery
                  </span>
                  <h2 className="font-serif text-3xl text-near-black font-normal">
                    Craftsmanship & Architectural Perspectives
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.gallery_images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-sm overflow-hidden bg-sand group"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${project.title} gallery frame ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Works */}
            {relatedProjects.length > 0 && (
              <div className="border-t border-sand pt-16">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
                      Related Milestones
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
                      More Completed Projects
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs uppercase tracking-wider text-olive font-semibold hover:text-olive-hover transition-colors"
                  >
                    View All Works
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
