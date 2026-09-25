import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react';
import { Project } from '@/lib/supabase/types';

interface ProjectCardProps {
  project: Project;
  aspect?: 'landscape' | 'portrait' | 'square';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  aspect = 'landscape',
}) => {
  const aspectClasses = {
    landscape: 'aspect-[16/10]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Image container */}
      <div className={`relative w-full ${aspectClasses[aspect]} overflow-hidden rounded-sm bg-sand`}>
        {project.main_image_url ? (
          <Image
            src={project.main_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-grey text-[11px] tracking-wider">
            Image Pending
          </div>
        )}

        {/* Category Badge overlay */}
        {project.category_name && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-off-white/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-sm text-[7.5px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-near-black font-medium truncate max-w-[85%]">
            {project.category_name}
          </div>
        )}

        {/* Hover Arrow Reveal */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-9 sm:h-9 rounded-sm bg-off-white/90 backdrop-blur-sm text-near-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-olive" strokeWidth={1.5} />
        </div>
      </div>

      {/* Meta Content */}
      <div className="pt-2 sm:pt-4 flex flex-col space-y-1 sm:space-y-1.5">
        <div className="flex items-center space-x-1.5 sm:space-x-3 text-[9px] sm:text-[11px] text-warm-grey font-light">
          {project.location && (
            <span className="flex items-center space-x-0.5 sm:space-x-1 truncate">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warm-beige shrink-0" strokeWidth={1.5} />
              <span className="truncate">{project.location}</span>
            </span>
          )}
          {project.year && (
            <span className="hidden sm:flex items-center space-x-1 shrink-0">
              <Calendar className="w-3 h-3 text-warm-beige shrink-0" strokeWidth={1.5} />
              <span>{project.year}</span>
            </span>
          )}
        </div>

        <h3 className="font-serif text-[11px] sm:text-lg lg:text-xl text-near-black group-hover:text-olive transition-colors duration-200 font-normal line-clamp-1 leading-snug">
          {project.title}
        </h3>

        <p className="text-[9px] sm:text-xs text-warm-grey font-light line-clamp-2 leading-tight sm:leading-relaxed">
          {project.short_description}
        </p>
      </div>
    </Link>
  );
};
