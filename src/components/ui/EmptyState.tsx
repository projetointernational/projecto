import React from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionHref,
  actionLabel,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center bg-sand/40 rounded-sm ${
        compact ? 'py-10 px-6' : 'py-20 px-8'
      } ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-sm bg-sand flex items-center justify-center text-olive mb-4">
          <Icon strokeWidth={1.25} className="w-6 h-6" />
        </div>
      )}

      <h3 className="font-serif text-xl sm:text-2xl text-near-black font-normal mb-2">
        {title}
      </h3>

      <p className="text-sm text-warm-grey max-w-md mb-6 leading-relaxed font-light">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-olive hover:text-olive-hover transition-colors space-x-1.5"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
};
