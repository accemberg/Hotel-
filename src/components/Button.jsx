'use client';

import { cn } from '@/lib/utils';

/**
 * Button — Amrit Palace design system
 * All lengths in rem. 1px border is the only px value (intentional hairline).
 * variant: 'ghost' | 'ghost-light'
 * size:    'sm' | 'md' | 'lg'
 */
export default function Button({ children, variant = 'ghost', size = 'md', className = '', ...props }) {
  const base =
    'inline-flex items-center gap-2 border font-sans font-medium uppercase cursor-pointer no-underline transition-all duration-300 select-none';

  const variants = {
    ghost:
      'border-[var(--color-white-overlay)] text-[var(--color-white-overlay)] bg-transparent hover:bg-[var(--color-white-overlay)] hover:text-[var(--color-white-overlay)]',
    'ghost-light':
      'border-[var(--color-white-overlay)] text-[var(--color-white-overlay)] bg-transparent hover:bg-[var(--color-white-overlay)] hover:text-[var(--color-white-overlay)]',
  };

  // rem values — never px (except the 1px border handled by Tailwind's border util)
  const sizes = {
    sm: 'px-[0.9375rem] py-[0.625rem] text-[0.75rem] tracking-[-0.01em] rounded-[0.1875rem]',
    md: 'px-[1.75rem] py-[0.875rem] text-[0.8125rem] tracking-[-0.01em] rounded-[0.1875rem]',
    lg: 'px-[2rem] py-[1rem] text-[0.875rem] tracking-[-0.01em] rounded-[0.1875rem]',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
