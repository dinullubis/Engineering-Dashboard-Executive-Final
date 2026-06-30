import React from 'react';
import { AnimatedCard } from './AnimatedCard';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface GaugeCardProps {
  title: string;
  value: number;
  index?: number;
  suffix?: string;
  description?: string;
}

export const GaugeCard: React.FC<GaugeCardProps> = ({ title, value, index, suffix = '%', description }) => {
  const data = [{ name: title, value: value, fill: value >= 90 ? '#22c55e' : value >= 80 ? '#eab308' : '#ef4444' }];
  
  return (
    <AnimatedCard index={index} className="p-5 flex flex-col items-center text-center justify-center relative">
      <h3 className="text-sm font-medium text-muted-foreground w-full text-left mb-2">{title}</h3>
      <div className="h-[180px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={20} 
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#334155' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
          <span className="text-4xl font-bold">{value}{suffix}</span>
        </div>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </AnimatedCard>
  );
};
