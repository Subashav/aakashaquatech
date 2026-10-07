import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/formatters';

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  accent?: 'blue' | 'aqua' | 'red' | 'green' | 'neutral';
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
        'grid grid-cols-2 lg:grid-cols-4 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-[#222222] shadow-xs overflow-hidden',
        className
      )}
    >
      {stats.map((stat, idx) => (
        <motion.button
          key={stat.id}
          type="button"
          whileHover={{ opacity: 0.95 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.04 }}
          onClick={stat.onClick}
          className={cn(
            'p-4 text-left transition-colors duration-150 group relative focus:outline-none bg-white dark:bg-black',
            stat.onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0D0D0D]' : 'cursor-default',
            stat.isActive && 'bg-slate-50 dark:bg-[#111111]'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {stat.icon && (
                <span className="shrink-0 text-slate-400 dark:text-zinc-500 group-hover:text-[#0369A1] dark:group-hover:text-cyan-400 transition-colors">
                  {stat.icon}
                </span>
              )}
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 truncate">
                {stat.label}
              </span>
            </div>
            {stat.trend && (
              <span
                className={cn(
                  'text-2xs font-semibold px-1.5 py-0.5 rounded border shrink-0',
                  stat.trend.isError || stat.trend.isWarning
                    ? 'text-[#B91C1C] dark:text-amber-300 bg-red-50 dark:bg-black border-red-200 dark:border-amber-800'
                    : stat.trend.isPositive
                    ? 'text-[#15803D] dark:text-emerald-400 bg-emerald-50 dark:bg-black border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-black border-slate-200 dark:border-[#222222]'
                )}
              >
                {stat.trend.value}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={cn(
                'text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-black dark:text-white group-hover:text-[#0369A1] dark:group-hover:text-cyan-400 transition-colors'
              )}
            >
              {stat.value}
            </span>
          </div>

          {stat.subtext && (
            <p className="mt-1 text-2xs text-slate-500 dark:text-zinc-400 truncate">{stat.subtext}</p>
          )}

          {/* Restrained accent indicator on top */}
          {stat.accent === 'blue' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0369A1] dark:bg-[#38BDF8]" />
          )}
          {stat.accent === 'aqua' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0891B2] dark:bg-[#06B6D4]" />
          )}
          {stat.accent === 'green' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#16A34A] dark:bg-[#22C55E]" />
          )}
          {stat.accent === 'red' && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#DC2626] dark:bg-[#EF4444]" />
          )}

          {stat.isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0369A1] dark:bg-cyan-400" />
          )}
        </motion.button>
      ))}
    </div>
  );
};
