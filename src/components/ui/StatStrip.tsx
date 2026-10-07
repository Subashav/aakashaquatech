import React from 'react';
import { cn } from '../../utils/formatters';

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  subtext?: string;
  accent?: 'blue' | 'aqua' | 'red' | 'neutral';
  trend?: {
    value: string;
    isPositive?: boolean;
    isWarning?: boolean;
    isError?: boolean;
  };
  onClick?: () => void;
  isActive?: boolean;
}

interface StatStripProps {
  stats: StatItem[];
  className?: string;
}

export const StatStrip: React.FC<StatStripProps> = ({ stats, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 bg-white border border-[#E2E8F0] rounded-sm divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] shadow-subtle',
        className
      )}
    >
      {stats.map((stat) => (
        <button
          key={stat.id}
          type="button"
          onClick={stat.onClick}
          className={cn(
            'p-3.5 text-left transition-colors duration-150 group relative',
            stat.onClick ? 'cursor-pointer hover:bg-[#F8FAFC]' : 'cursor-default',
            stat.isActive && 'bg-[#F0F9FF]'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-[#475569]">
              {stat.label}
            </span>
            {stat.trend && (
              <span
                className={cn(
                  'text-2xs font-semibold px-1.5 py-0.2 rounded-xs border',
                  stat.trend.isError || stat.trend.isWarning
                    ? 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]'
                    : stat.trend.isPositive
                    ? 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]'
                    : 'text-[#475569] bg-[#F1F5F9] border-[#E2E8F0]'
                )}
              >
                {stat.trend.value}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={cn(
                'text-xl font-bold tracking-tight tabular-nums',
                stat.accent === 'blue'
                  ? 'text-[#0F172A] group-hover:text-[#0369A1]'
                  : stat.accent === 'aqua'
                  ? 'text-[#0F172A] group-hover:text-[#0891B2]'
                  : stat.accent === 'red'
                  ? 'text-[#0F172A] group-hover:text-[#DC2626]'
                  : 'text-[#0F172A]'
              )}
            >
              {stat.value}
            </span>
          </div>

          {stat.subtext && (
            <p className="mt-0.5 text-2xs text-[#475569] truncate">{stat.subtext}</p>
          )}

          {/* Restrained accent line at top/bottom */}
          {stat.accent === 'blue' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0369A1]" />
          )}
          {stat.accent === 'aqua' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0891B2]" />
          )}
          {stat.accent === 'red' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#DC2626]" />
          )}

          {stat.isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0369A1]" />
          )}
        </button>
      ))}
    </div>
  );
};
