import { format } from "date-fns";

export const formatDate = (date: Date | string | number): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return format(d, "MMM dd, yyyy");
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatHour = (hours: number): string => {
  if (hours >= 24 && hours % 24 === 0) {
    return `${hours / 24}d`;
  }
  return `${hours.toFixed(1)}h`;
};

export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat("en-US").format(n);
};

export const statusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'IN PROGRESS':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'WAITING PARTS':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'WAITING VENDOR':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50';
    case 'ON HOLD':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    case 'CLOSED':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  }
};

export const priorityColor = (priority: string): string => {
  switch (priority.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'LOW':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  }
};
