import React from 'react';

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E2E8F0]">
      <div>
        <div className="text-2xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-0.5">
          {breadcrumb}
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">{title}</h1>
        {subtitle && <p className="text-xs text-[#475569] mt-0.5">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
