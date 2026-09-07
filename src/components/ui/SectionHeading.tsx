import React from 'react';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  align = 'left',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl ${alignStyles[align]} ${className}`}>
      {subtitle && (
        <div className="flex items-center space-x-2 mb-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive" />
          <span
            className={`text-[11px] uppercase tracking-[0.2em] font-medium ${
              isDark ? 'text-warm-beige' : 'text-warm-grey'
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}

      <h2
        className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.15] tracking-tight ${
          isDark ? 'text-off-white' : 'text-near-black'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-xs sm:text-[13px] leading-relaxed max-w-2xl font-light ${
            isDark ? 'text-warm-grey' : 'text-warm-grey'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
