import React from 'react';
import { cn } from '../../utils/formatters';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'sm', icon, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary:
        'bg-[#0369A1] hover:bg-[#075985] dark:bg-[#0284C7] dark:hover:bg-[#0369A1] text-white shadow-subtle border border-[#0369A1] dark:border-[#0284C7] focus:ring-[#0369A1]/30 active:scale-[0.98]',
      secondary:
        'bg-white dark:bg-[#111C30] hover:bg-[#F1F5F9] dark:hover:bg-[#16253E] text-[#0F172A] dark:text-slate-100 border border-[#CBD5E1] dark:border-[#2A3F60] shadow-subtle focus:ring-[#CBD5E1] active:scale-[0.98]',
      outline:
        'bg-white dark:bg-[#0B1322] hover:bg-[#F1F5F9] dark:hover:bg-[#152238] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-[#1E2E48] focus:ring-[#CBD5E1] active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#152238] text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white border border-transparent focus:ring-[#CBD5E1] active:scale-[0.98]',
      danger:
        'bg-[#DC2626] hover:bg-[#B91C1C] dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-subtle border border-[#DC2626] dark:border-red-600 focus:ring-[#DC2626]/30 active:scale-[0.98]',
    };

    const sizeStyles = {
      xs: 'h-7 px-2 text-2xs gap-1',
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-sm gap-2',
      lg: 'h-10 px-4 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
