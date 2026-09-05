'use client';

import React, { useState } from 'react';
import { Project, Category } from '@/lib/supabase/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Building2 } from 'lucide-react';

interface ProjectsDirectoryProps {
  projects: Project[];
  categories: Category[];
}

export const ProjectsDirectory: React.FC<ProjectsDirectoryProps> = ({
  projects,
  categories,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(
          (p) =>
            p.category_id === activeCategory ||
            p.category_name?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-6 border-b border-sand">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors ${
              activeCategory === 'all'
                ? 'bg-near-black text-off-white font-medium'
                : 'bg-sand/40 text-warm-grey hover:bg-sand hover:text-near-black'
            }`}
          >
            All Works ({projects.length})
          </button>

          {categories.map((cat) => {
            const count = projects.filter(
              (p) =>
                p.category_id === cat.id ||
                p.category_name?.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-near-black text-off-white font-medium'
                    : 'bg-sand/40 text-warm-grey hover:bg-sand hover:text-near-black'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title={
            activeCategory === 'all'
              ? 'No Projects Published Yet'
              : 'No Projects In This Category'
          }
          description="Projects will appear here with full architectural specifications once published. Contact us for inquiries about completed works."
          icon={Building2}
          actionHref="/enquire"
          actionLabel="Start Project Consultation"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
