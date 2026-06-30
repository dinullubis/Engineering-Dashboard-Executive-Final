import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { GaugeCard } from '../components/cards/GaugeCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatDate } from '../utils/formatters';
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const statusColor = (status: string) => {
  switch (status) {
    case 'overdue': return 'bg-red-500/20 text-red-400 border border-red-500/40';
    case 'due': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
    default: return 'bg-green-500/20 text-green-400 border border-green-500/40';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'overdue': return 'OVERDUE';
    case 'due': return 'DUE';
    default: return 'UPCOMING';
  }
};

export default function PreventiveMaintenance() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const { summary, pm } = data;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'due' | 'upcoming'>('all');

  const filtered = (pm ?? []).filter(item => {
    const matchSearch = item.machine.toLowerCase().includes(search.toLowerCase()) ||
      item.technician.toLowerCase().includes(search.toLowerCase()) ||
      item.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const overdue = (pm ?? []).filter(p => p.status === 'overdue').length;
  const due = (pm ?? []).filter(p => p.status === 'due').length;
  const upcoming = (pm ?? []).filter(p => p.status === 'upcoming').length;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Preventive Maintenance</h1>
              <p className="text-slate-400 text-sm mt-1">PM schedule, compliance tracking, and upcoming maintenance tasks</p>
            </div>

            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading || !summary ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* KPI + Gauge */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <GaugeCard title="PM Compliance" value={summary.pmCompliance.value} index={0} />
                  <AnimatedCard index={1} className="p-4 flex flex-col items-center justify-center text-center">
                    <AlertTriangle size={24} className="text-red-400 mb-2" />
                    <div className="text-3xl font-bold text-red-400">{overdue}</div>
                    <div className="text-xs text-slate-400 mt-1">Overdue</div>
                  </AnimatedCard>
                  <AnimatedCard index={2} className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock size={24} className="text-yellow-400 mb-2" />
                    <div className="text-3xl font-bold text-yellow-400">{due}</div>
                    <div className="text-xs text-slate-400 mt-1">Due This Week</div>
                  </AnimatedCard>
                  <AnimatedCard index={3} className="p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 size={24} className="text-green-400 mb-2" />
                    <div className="text-3xl font-bold text-green-400">{upcoming}</div>
                    <div className="text-xs text-slate-400 mt-1">Upcoming</div>
                  </AnimatedCard>
                </div>

                {/* PM Schedule Table */}
                <AnimatedCard index={4} className="flex flex-col">
                  <div className="p-4 border-b border-card-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <ShieldCheck size={18} className="text-primary" /> PM Schedule
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search machine, technician..."
                          className="pl-8 pr-3 py-1.5 text-sm bg-slate-800 border border-card-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary w-56"
                          data-testid="input-pm-search"
                        />
                      </div>
                      {(['all', 'overdue', 'due', 'upcoming'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(s)}
                          data-testid={`button-filter-${s}`}
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors capitalize ${
                            filterStatus === s
                              ? 'bg-primary text-white border-primary'
                              : 'bg-slate-800 text-slate-400 border-card-border hover:border-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-card-border bg-slate-800/50">
                          {['Machine', 'Area', 'Last Done', 'Next Due', 'Technician', 'Status'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border">
                        {filtered.map((item, i) => (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors" data-testid={`row-pm-${i}`}>
                            <td className="px-4 py-3 font-medium text-white">{item.machine}</td>
                            <td className="px-4 py-3 text-slate-300">{item.area}</td>
                            <td className="px-4 py-3 text-slate-400">{formatDate(item.lastDone)}</td>
                            <td className={`px-4 py-3 font-medium ${item.status === 'overdue' ? 'text-red-400' : item.status === 'due' ? 'text-yellow-400' : 'text-slate-300'}`}>
                              {formatDate(item.nextDue)}
                            </td>
                            <td className="px-4 py-3 text-slate-300">{item.technician}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor(item.status)}`}>
                                {statusLabel(item.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No PM items match your criteria</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AnimatedCard>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
