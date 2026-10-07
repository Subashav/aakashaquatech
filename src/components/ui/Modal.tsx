import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
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

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#0B172A]/40 backdrop-blur-none transition-opacity"
          onClick={onClose}
        />

        <div
          className={cn(
            'relative w-full transform overflow-hidden rounded-sm bg-white border border-[#E2E8F0] text-left shadow-modal transition-all my-8',
            maxWidthStyles[maxWidth]
          )}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 bg-white">
              <div>
                {title && (
                  <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">{title}</h3>
                )}
                {subtitle && <p className="text-2xs text-[#475569] mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 hover:bg-[#F1F5F9] rounded-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};
