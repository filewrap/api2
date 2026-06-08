import React from 'react';
import { cn } from '../../utils/cn';

/**
 * NeonButton Component
 * High-performance interactive button with the primary brand glow.
 */
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-surface shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] font-black',
    secondary: 'bg-white/10 backdrop-blur-md text-on-surface hover:bg-white/20 border border-white/10',
    outline: 'border-2 border-primary/50 text-primary hover:bg-primary/10',
    ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-2xl',
    lg: 'px-8 py-4 text-base rounded-[24px]',
    icon: 'p-3 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
