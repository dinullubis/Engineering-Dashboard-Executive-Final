import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { WorkOrderTable } from '../components/tables/WorkOrderTable';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { AlertTriangle, ClipboardList, CheckCircle2, Wrench } from 'lucide-react';

export default function WorkOrders() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const { openWO, summary } = data;

  const counts = {
    total: summary?.totalWO.value ?? 0,
    open: summary?.openWO.value ?? 0,
    closed: summary?.closedWO.value ?? 0,
    breakdown: summary?.breakdown.value ?? 0,
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Work Orders</h1>
              <p className="text-slate-400 text-sm mt-1">Manage and track all maintenance work orders</p>
            </div>

            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total WO', value: counts.total, icon: <ClipboardList size={18} />, color: 'text-white' },
                    { label: 'Open', value: counts.open, icon: <Wrench size={18} />, color: 'text-orange-400' },
                    { label: 'Closed', value: counts.closed, icon: <CheckCircle2 size={18} />, color: 'text-green-400' },
                    { label: 'Breakdowns', value: counts.breakdown, icon: <AlertTriangle size={18} />, color: 'text-red-400' },
                  ].map((item, i) => (
                    <AnimatedCard key={item.label} index={i} className="p-4 flex items-center gap-4">
                      <div className={`p-2 bg-slate-800 rounded-lg ${item.color}`}>{item.icon}</div>
                      <div>
                        <div className="text-xs text-slate-400">{item.label}</div>
                        <div className="text-2xl font-bold text-white">{item.value.toLocaleString()}</div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>

                {openWO && <WorkOrderTable workOrders={openWO} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
