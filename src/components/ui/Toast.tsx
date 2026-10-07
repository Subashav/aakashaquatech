import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#2563EB] shrink-0" />,
  };

  const borderMap = {
    success: 'border-[#16A34A]/30 bg-white',
    error: 'border-[#DC2626]/30 bg-white',
    warning: 'border-[#D97706]/30 bg-white',
    info: 'border-[#2563EB]/30 bg-white',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-auto animate-in slide-in-from-bottom-2 duration-150">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 border rounded-sm shadow-dropdown max-w-md',
          borderMap[toast.type]
        )}
      >
        {iconMap[toast.type]}
        <div className="text-xs font-medium text-[#0F172A] flex-1">{toast.message}</div>
      </div>
    </div>
  );
};
