import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, colorClass = 'bg-primary', className = '' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};
