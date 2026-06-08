import React from 'react';
import { cn } from '../../utils/cn';

/**
 * GlassCard Component
 * The foundational UI element for the Streamify 3D glassmorphic aesthetic.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'low' | 'medium' | 'high';
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  intensity = 'medium',
  hoverable = true,
  ...props 
}) => {
  const intensityMap = {
    low: 'bg-white/5 backdrop-blur-md',
    medium: 'bg-white/5 backdrop-blur-xl border-white/10',
    high: 'bg-white/10 backdrop-blur-3xl border-white/20',
  };

  return (
    <div 
      className={cn(
        "rounded-[32px] border transition-all duration-500 shadow-2xl",
        intensityMap[intensity],
        hoverable && "hover:bg-white/10 hover:-translate-y-1 hover:shadow-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
