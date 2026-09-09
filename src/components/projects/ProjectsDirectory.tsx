'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Project, Category } from '@/lib/supabase/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Building2, ChevronDown, Check } from 'lucide-react';

interface ProjectsDirectoryProps {
  projects: Project[];
  categories: Category[];
}

export const ProjectsDirectory: React.FC<ProjectsDirectoryProps> = ({
  projects,
  categories,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(
          (p) =>
            p.category_id === activeCategory ||
            p.category_name?.toLowerCase() === activeCategory.toLowerCase()
        );

  const activeLabel =
    activeCategory === 'all'
      ? `All Works (${projects.length})`
      : (() => {
          const cat = categories.find((c) => c.id === activeCategory);
          const count = projects.filter(
            (p) =>
              p.category_id === activeCategory ||
              p.category_name?.toLowerCase() === cat?.name.toLowerCase()
          ).length;
          return `${cat?.name || 'Category'} (${count})`;
        })();

  return (
    <div className="space-y-12">
      {/* Category Tabs & Mobile Select */}
      {categories.length > 0 && (
        <div className="border-b border-sand">
          {/* Mobile: Custom Architectural Dropdown */}
          <div ref={dropdownRef} className="sm:hidden relative w-full">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-sand/40 hover:bg-sand/60 text-near-black text-xs uppercase tracking-wider font-medium px-4 py-3 rounded-sm border border-sand/70 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="truncate pr-2">{activeLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-warm-grey shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-olive' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-sand/80 shadow-lg rounded-sm py-1 max-h-64 overflow-y-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-between transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-olive/10 text-olive font-semibold'
                      : 'text-near-black hover:bg-sand/30'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {activeCategory === 'all' && <Check className="w-3.5 h-3.5 text-olive" strokeWidth={2} />}
                    <span>All Works</span>
                  </div>
                  <span className="text-[11px] font-mono text-warm-grey">({projects.length})</span>
                </button>

                {categories.map((cat) => {
                  const count = projects.filter(
                    (p) =>
                      p.category_id === cat.id ||
                      p.category_name?.toLowerCase() === cat.name.toLowerCase()
                  ).length;
                  const isSelected = activeCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-between transition-colors border-t border-sand/30 ${
                        isSelected
                          ? 'bg-olive/10 text-olive font-semibold'
                          : 'text-near-black hover:bg-sand/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        {isSelected && <Check className="w-3.5 h-3.5 text-olive shrink-0" strokeWidth={2} />}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-warm-grey shrink-0">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop: Category Tabs */}
          <div className="hidden sm:flex flex-wrap items-center gap-3">
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
