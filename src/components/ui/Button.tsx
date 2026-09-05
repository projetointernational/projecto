import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'olive' | 'dark' | 'outline' | 'beige' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'olive',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-sm select-none tracking-wide';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 space-x-1.5',
    md: 'text-sm px-6 py-3 space-x-2',
    lg: 'text-base px-8 py-4 space-x-2.5',
  };

  const variantStyles = {
    olive: 'bg-olive hover:bg-olive-hover text-white shadow-none active:scale-[0.99]',
    dark: 'bg-near-black hover:bg-black text-off-white active:scale-[0.99]',
    outline:
      'bg-transparent text-near-black border border-near-black/20 hover:border-near-black hover:bg-near-black hover:text-white',
    beige: 'bg-warm-beige hover:bg-[#A3895B] text-white active:scale-[0.99]',
    ghost: 'bg-transparent text-near-black hover:bg-sand/60',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
  } ${className}`;

  const content = (
    <>
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        icon && iconPosition === 'left' && <span className="mr-1.5 inline-flex">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-1.5 inline-flex">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};
