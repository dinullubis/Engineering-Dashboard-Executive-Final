import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RefreshButton } from '../ui/RefreshButton';

interface PageHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onRefresh, isRefreshing }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-primary rounded md:hidden flex items-center justify-center text-white font-bold text-lg">
          T
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">PT. Taco Anugrah Corporindo</h1>
          <h1 className="text-xl font-bold tracking-tight text-white sm:hidden">TACO Dashboard</h1>
          <p className="text-xs text-muted-foreground font-medium">Engineering Executive Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-slate-300">{format(currentTime, 'EEEE, MMMM d, yyyy')}</span>
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mt-1">
            {format(currentTime, 'HH:mm:ss')} Live
          </span>
        </div>
        <RefreshButton onRefresh={onRefresh} isRefreshing={isRefreshing} />
      </div>
    </header>
  );
};
