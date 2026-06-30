import React from 'react';
import { statusColor, priorityColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status?: string;
  priority?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, className = '' }) => {
  const colorClass = status ? statusColor(status) : priority ? priorityColor(priority) : 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  const label = status || priority || 'UNKNOWN';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass} ${className}`}>
      {label}
    </span>
  );
};
