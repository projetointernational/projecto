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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-grey text-xs tracking-wider">
            Image Pending
          </div>
        )}

        {/* Category Badge overlay */}
        {project.category_name && (
          <div className="absolute top-4 left-4 bg-off-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest text-near-black font-medium">
            {project.category_name}
          </div>
        )}

        {/* Hover Arrow Reveal */}
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-sm bg-off-white/90 backdrop-blur-sm text-near-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-olive" strokeWidth={1.5} />
        </div>
      </div>

      {/* Meta Content */}
      <div className="pt-4 flex flex-col space-y-1.5">
        <div className="flex items-center space-x-3 text-xs text-warm-grey font-light">
          {project.location && (
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
              <span>{project.location}</span>
            </span>
          )}
          {project.year && (
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-warm-beige" strokeWidth={1.5} />
              <span>{project.year}</span>
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-near-black group-hover:text-olive transition-colors duration-200 font-normal">
          {project.title}
        </h3>

        <p className="text-xs sm:text-sm text-warm-grey font-light line-clamp-2 leading-relaxed">
          {project.short_description}
        </p>
      </div>
    </Link>
  );
};
