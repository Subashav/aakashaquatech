import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  width = 'xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B172A]/40 backdrop-blur-none transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={cn(
            'w-screen bg-white border-l border-[#E2E8F0] shadow-modal flex flex-col focus:outline-none animate-in slide-in-from-right duration-200',
            widthStyles[width]
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <div className="text-base font-bold text-[#0F172A] tracking-tight truncate">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-[#475569] mt-0.5 truncate">{subtitle}</div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {actions}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-sm transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#F7F9FC]">{children}</div>
        </div>
      </div>
    </div>
  );
};
