import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconResolverProps {
  name?: string | null;
  className?: string;
  strokeWidth?: number;
}

export const IconResolver: React.FC<IconResolverProps> = ({
  name,
  className = 'w-6 h-6',
  strokeWidth = 1.25,
}) => {
  if (!name) {
    return <LucideIcons.Building2 className={className} strokeWidth={strokeWidth} />;
  }

  // Find icon in Lucide namespace
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[name];

  if (!IconComponent) {
    return <LucideIcons.Building2 className={className} strokeWidth={strokeWidth} />;
  }

  return <IconComponent className={className} strokeWidth={strokeWidth} />;
};
