import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './button';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRefresh} 
      disabled={isRefreshing}
      className="bg-card border-card-border hover:bg-slate-800 text-slate-300 gap-2"
      data-testid="button-refresh"
    >
      <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
      <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
    </Button>
  );
};
