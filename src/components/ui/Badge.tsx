import React from 'react';
import { cn } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'aqua' | 'brand';
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  dot = true,
  className,
  size = 'sm',
}) => {
  const variantStyles = {
    neutral:
      'bg-[#F1F5F9] dark:bg-[#152238] text-[#475569] dark:text-[#CBD5E1] border-[#E2E8F0] dark:border-[#1E2E48]',
    success:
      'bg-[#F0FDF4] dark:bg-emerald-950/50 text-[#15803D] dark:text-emerald-300 border-[#BBF7D0] dark:border-emerald-800',
    warning:
      'bg-[#FFFBEB] dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 border-[#FDE68A] dark:border-amber-800',
    danger:
      'bg-[#FEF2F2] dark:bg-red-950/50 text-[#B91C1C] dark:text-red-300 border-[#FECACA] dark:border-red-900',
    info:
      'bg-[#EFF6FF] dark:bg-sky-950/50 text-[#1D4ED8] dark:text-sky-300 border-[#BFDBFE] dark:border-sky-800',
    aqua:
      'bg-[#ECFEFF] dark:bg-cyan-950/50 text-[#0E7490] dark:text-cyan-300 border-[#A5F3FC] dark:border-cyan-800',
    brand:
      'bg-[#F0F9FF] dark:bg-[#075985]/30 text-[#0369A1] dark:text-cyan-300 border-[#BAE6FD] dark:border-[#0369A1]/50',
  };

  const dotStyles = {
    neutral: 'bg-[#64748B] dark:bg-[#94A3B8]',
    success: 'bg-[#16A34A] dark:bg-emerald-400',
    warning: 'bg-[#D97706] dark:bg-amber-400',
    danger: 'bg-[#DC2626] dark:bg-red-400',
    info: 'bg-[#2563EB] dark:bg-sky-400',
    aqua: 'bg-[#0891B2] dark:bg-cyan-400',
    brand: 'bg-[#0369A1] dark:bg-cyan-400',
  };

  const sizeStyles = {
    sm: 'text-2xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-sm tracking-tight select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  );
};
