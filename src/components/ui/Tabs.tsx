import React from 'react';
import { motion } from 'framer-motion';
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
      <div
        className={cn(
          'flex items-center gap-1 p-1 bg-[#F1F5F9] dark:bg-[#111C30] rounded-md border border-[#E2E8F0] dark:border-[#1E2E48]',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors duration-150',
                isActive
                  ? 'bg-white dark:bg-[#0B1322] text-[#0F172A] dark:text-white shadow-sm border border-[#E2E8F0] dark:border-[#1E2E48]'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-2xs px-1.5 py-0.2 rounded-full tabular-nums font-semibold',
                    isActive
                      ? 'bg-[#F1F5F9] dark:bg-[#152238] text-[#0F172A] dark:text-white'
                      : 'bg-[#E2E8F0] dark:bg-[#1E2E48] text-[#64748B] dark:text-[#94A3B8]'
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
    <div
      className={cn(
        'flex items-center gap-6 border-b border-[#E2E8F0] dark:border-[#1E2E48] overflow-x-auto',
        className
      )}
    >
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
                ? 'text-[#0369A1] dark:text-cyan-400'
                : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-2xs px-1.5 py-0.5 rounded-xs font-semibold tabular-nums border',
                  isActive
                    ? 'bg-[#F0F9FF] dark:bg-[#075985]/30 text-[#0369A1] dark:text-cyan-400 border-[#BAE6FD] dark:border-[#0369A1]/40'
                    : 'bg-[#F8FAFC] dark:bg-[#111C30] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#1E2E48]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.span
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0369A1] dark:bg-cyan-400"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
