import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn (Class Name) Utility
 * Combines Tailwind classes and merges conflicts using tailwind-merge.
 * Essential for dynamic styling in the Streamify glassmorphic UI.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
