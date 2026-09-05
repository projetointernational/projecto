import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string; className?: string }> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 ${className}`}>
      <div
        className={`${sizeMap[size]} border-sand border-t-olive rounded-full animate-spin`}
      />
      {text && <p className="text-xs uppercase tracking-widest text-warm-grey font-medium">{text}</p>}
    </div>
  );
};
