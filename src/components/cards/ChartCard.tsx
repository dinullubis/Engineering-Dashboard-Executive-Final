import React from 'react';
import { AnimatedCard } from './AnimatedCard';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  index?: number;
  className?: string;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, index, className = '', action }) => {
  return (
    <AnimatedCard index={index} className={`flex flex-col ${className}`}>
      <div className="p-5 border-b border-card-border flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5 flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </AnimatedCard>
  );
};
