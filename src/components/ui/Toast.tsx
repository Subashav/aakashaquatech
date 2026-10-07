import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/formatters';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#0369A1] dark:text-cyan-400 shrink-0" />,
  };

  const styleMap = {
    success: 'border-emerald-500/30 bg-white dark:bg-[#0B1322]',
    error: 'border-red-500/30 bg-white dark:bg-[#0B1322]',
    warning: 'border-amber-500/30 bg-white dark:bg-[#0B1322]',
    info: 'border-[#0369A1]/30 dark:border-cyan-500/30 bg-white dark:bg-[#0B1322]',
  };

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 border rounded-md shadow-modal max-w-md',
              styleMap[toast.type]
            )}
          >
            {iconMap[toast.type]}
            <div className="text-xs font-semibold text-[#0F172A] dark:text-white flex-1">
              {toast.message}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
