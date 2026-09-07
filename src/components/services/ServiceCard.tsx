import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-olive-hover hover:bg-olive transition-all duration-300 p-8 rounded-sm flex flex-col justify-between h-full shadow-sm">
      <div>
        {/* Icon & Index */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 rounded-sm bg-white/10 flex items-center justify-center text-warm-beige group-hover:scale-105 transition-transform duration-300 shadow-sm">
            <IconResolver name={service.icon_name} className="w-6 h-6 text-warm-beige" strokeWidth={1.25} />
          </div>
          <span className="text-xs uppercase tracking-widest text-off-white/60 font-mono">
            0{service.display_order + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl text-off-white mb-3 font-normal">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-off-white/80 font-light leading-relaxed mb-6">
          {service.short_description}
        </p>

        {/* Features bullet list if available */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-1.5 mb-8 border-t border-white/15 pt-4">
            {service.features.map((feature, idx) => (
              <li key={idx} className="text-xs text-off-white/80 flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-warm-beige" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-4 mt-auto">
        <Link
          href={`/enquire?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-warm-beige hover:text-white transition-colors space-x-1"
        >
          <span>Enquire Regarding Discipline</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
};
