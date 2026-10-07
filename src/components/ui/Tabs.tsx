import React from 'react';
import { cn } from '../../utils/formatters';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'pills') {
    return (
      <div className={cn('flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-sm border border-[#E2E8F0]', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xs transition-colors duration-150',
                isActive
                  ? 'bg-white text-[#0F172A] font-semibold shadow-subtle border border-[#E2E8F0]'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-white/60'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-2xs px-1.5 py-0.2 rounded-full tabular-nums font-semibold',
                    isActive ? 'bg-[#F1F5F9] text-[#0F172A]' : 'bg-[#E2E8F0] text-[#64748B]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6 border-b border-[#E2E8F0] overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative pb-2.5 pt-1 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2',
              isActive
                ? 'text-[#0369A1]'
                : 'text-[#475569] hover:text-[#0F172A]'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-2xs px-1.5 py-0.5 rounded-xs font-semibold tabular-nums border',
                  isActive
                    ? 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0369A1]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
