'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { Project } from '@/lib/supabase/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

interface FeaturedProjectsProps {
  projects: Project[];
  subtitle?: string;
  title?: string;
  description?: string;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  subtitle = 'PORTFOLIO',
  title = 'Selected Projects & Case Studies',
  description = 'A selection of projects demonstrating our procurement, coordination and project support capabilities.',
}) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand/60">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <SectionHeading
            subtitle={subtitle}
            title={title}
            description={description}
          />
          <Link
            href="/projects"
            className="inline-flex items-center text-[11px] uppercase tracking-[0.16em] font-semibold text-olive hover:text-near-black transition-colors space-x-1.5 shrink-0"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Projects Grid: 3 in 1 row on mobile, standard grid on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-8 lg:gap-10">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
