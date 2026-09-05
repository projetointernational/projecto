import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { Project } from '@/lib/supabase/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface FeaturedProjectsProps {
  projects: Project[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <section className="py-24 sm:py-32 bg-sand/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            subtitle="Selected Works"
            title="Enduring Architectural Portfolios & Milestones"
            description="A curated catalog of completed residential estates, commercial developments, and structural engineering landmarks."
          />
          <Link
            href="/projects"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] font-semibold text-olive hover:text-olive-hover transition-colors space-x-1.5 shrink-0"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Projects Grid or Architectural Empty State */}
        {projects.length === 0 ? (
          <EmptyState
            title="Projects Catalog Updating"
            description="Our curated architectural portfolio is currently being updated. Please check back shortly or start a direct enquiry."
            icon={Building2}
            actionHref="/enquire"
            actionLabel="Inquire About Projects"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
