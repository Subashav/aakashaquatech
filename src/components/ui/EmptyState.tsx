import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <PackageOpen className="w-8 h-8 text-[#94A3B8] stroke-[1.5]" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-[#CBD5E1] rounded-sm">
      <div className="p-3 bg-[#F1F5F9] rounded-full mb-3 text-[#475569]">{icon}</div>
      <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">{title}</h3>
      <p className="text-xs text-[#475569] max-w-sm mt-1">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
