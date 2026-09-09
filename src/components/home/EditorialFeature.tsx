'use client';

import React from 'react';
import Image from 'next/image';
import { EditorialFeature as EditorialFeatureType } from '@/lib/supabase/types';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditorialFeatureProps {
  feature?: EditorialFeatureType | null;
}

export const EditorialFeature: React.FC<EditorialFeatureProps> = ({ feature }) => {
  if (!feature || feature.is_active === false) {
    return null;
  }

  // Guard against completely empty records
  if (!feature.title && !feature.image_url && !feature.description) {
    return null;
  }

  const isImageRight = feature.image_position === 'right';

  return (
    <section className="bg-white py-10 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          {feature.image_url && (
            <div
              className={`lg:col-span-6 ${
                isImageRight ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] w-full rounded-sm overflow-hidden bg-sand/30 shadow-md group border border-sand/60">
                <Image
                  src={feature.image_url}
                  alt={feature.title || 'Architectural feature showcase'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* Text & Content Column */}
          <div
            className={`${
              feature.image_url
                ? `lg:col-span-6 ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`
                : 'lg:col-span-8 lg:col-start-3 text-center'
            }`}
          >
            {feature.subtitle && (
              <div className="inline-flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-olive" />
                <span className="text-xs uppercase tracking-[0.25em] text-warm-grey font-medium">
                  {feature.subtitle}
                </span>
              </div>
            )}

            {feature.title && (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-near-black font-normal leading-[1.15] mb-6">
                {feature.title}
              </h2>
            )}

            {feature.description && (
              <p className="text-warm-grey text-sm leading-relaxed mb-8">
                {feature.description}
              </p>
            )}

            {feature.highlights && feature.highlights.length > 0 && (
              <ul className="space-y-3.5 mb-8 border-t border-sand/60 pt-6">
                {feature.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-sm sm:text-base text-near-black"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-olive/10 text-olive shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className={`pt-2 flex justify-center ${feature.image_url ? 'lg:justify-start' : 'lg:justify-center'}`}>
              <Button
                href="/contact"
                variant="olive"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
