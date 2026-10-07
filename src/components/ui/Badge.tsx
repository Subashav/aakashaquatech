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
    neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    success: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    info: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    aqua: 'bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]',
    brand: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  };

  const dotStyles = {
    neutral: 'bg-[#64748B]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
    info: 'bg-[#2563EB]',
    aqua: 'bg-[#0891B2]',
    brand: 'bg-[#0369A1]',
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
