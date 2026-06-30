import React from 'react';
import { AnimatedCard } from './AnimatedCard';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  index?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  children?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, trend, icon, index, valuePrefix = '', valueSuffix = '', children }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  
  return (
    <AnimatedCard index={index} className="p-5 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-slate-800/50 rounded-lg text-primary">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">
            {valuePrefix}{typeof value === 'number' ? formatNumber(value) : value}{valueSuffix}
          </span>
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center text-xs mt-2 font-medium ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : isNegative ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
            <span>{Math.abs(trend).toFixed(1)}% vs last period</span>
          </div>
        )}
        
        {children && <div className="mt-4">{children}</div>}
      </div>
    </AnimatedCard>
  );
};
