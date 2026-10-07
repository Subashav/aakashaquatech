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
        'bg-[#0369A1] hover:bg-[#075985] active:bg-[#075985] text-white shadow-subtle border border-[#0369A1] focus:ring-[#0369A1]/30',
      secondary:
        'bg-white hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1] shadow-subtle focus:ring-[#CBD5E1]',
      outline:
        'bg-white hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] focus:ring-[#CBD5E1]',
      ghost:
        'bg-transparent hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] border border-transparent focus:ring-[#CBD5E1]',
      danger:
        'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-subtle border border-[#DC2626] focus:ring-[#DC2626]/30',
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
          'inline-flex items-center justify-center font-medium rounded-sm transition-colors duration-150',
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
