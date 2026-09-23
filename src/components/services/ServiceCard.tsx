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
    <div className="group bg-sand/30 hover:border-olive/50 border border-sand/70 transition-all duration-300 p-6 sm:p-8 rounded-sm flex flex-col justify-between h-full shadow-xs hover:shadow-sm">
      <div>
        {/* Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-sm bg-white border border-sand/80 flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-white transition-all duration-300">
            <IconResolver name={service.icon_name} className="w-6 h-6" strokeWidth={1.25} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl text-near-black mb-3 font-normal leading-snug">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-near-black/75 font-light leading-relaxed mb-6">
          {service.short_description}
        </p>

        {/* Features bullet list */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 mb-8 border-t border-sand/60 pt-4">
            {service.features.slice(0, 5).map((feature, idx) => (
              <li key={idx} className="text-xs text-near-black/70 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-olive shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-sand/50 mt-auto flex items-center justify-between">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-olive hover:text-near-black transition-colors space-x-1"
        >
          <span>Explore Service</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </Link>

        <Link
          href={`/contact?service=${encodeURIComponent(service.title)}`}
          className="text-[11px] uppercase tracking-wider text-warm-grey hover:text-near-black"
        >
          Inquire
        </Link>
      </div>
    </div>
  );
};
