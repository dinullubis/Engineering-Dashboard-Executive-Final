import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { ChartCard } from '../components/cards/ChartCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { FileText, Download, BarChart2, ShieldCheck, Zap, Users } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
};

const reportTypes = [
  { id: 'wo', label: 'Work Order Report', icon: <FileText size={18} />, color: 'text-primary' },
  { id: 'breakdown', label: 'Breakdown Analysis', icon: <BarChart2 size={18} />, color: 'text-red-400' },
  { id: 'pm', label: 'PM Compliance Report', icon: <ShieldCheck size={18} />, color: 'text-green-400' },
  { id: 'utility', label: 'Utility Consumption', icon: <Zap size={18} />, color: 'text-yellow-400' },
  { id: 'team', label: 'Team Performance', icon: <Users size={18} />, color: 'text-blue-400' },
];

export default function Reports() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const { dailyTrend, weeklyTrend, monthlyTrend, summary } = data;
  const [activeReport, setActiveReport] = useState('wo');

  const handleExport = (format: string) => {
    // placeholder — wire to googleSheetService or backend export
    alert(`Export as ${format} — connect to Google Sheets or backend to enable.`);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Reports</h1>
                <p className="text-slate-400 text-sm mt-1">Generate and export engineering performance reports</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('CSV')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-card-border rounded-lg text-slate-300 text-sm hover:bg-slate-700 transition-colors"
                  data-testid="button-export-csv"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-white text-sm hover:bg-primary/80 transition-colors"
                  data-testid="button-export-pdf"
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
            </div>

            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* Report type selector */}
                <div className="flex flex-wrap gap-3">
                  {reportTypes.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setActiveReport(r.id)}
                      data-testid={`button-report-${r.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        activeReport === r.id
                          ? 'bg-primary border-primary text-white'
                          : 'bg-slate-800 border-card-border text-slate-400 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      <span className={activeReport === r.id ? 'text-white' : r.color}>{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Summary numbers */}
                {summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Period Total WO', value: summary.totalWO.value.toLocaleString() },
                      { label: 'Availability', value: `${summary.availability.value}%` },
                      { label: 'PM Compliance', value: `${summary.pmCompliance.value}%` },
                      { label: 'Avg MTTR', value: `${summary.mttr.value}h` },
                    ].map((s, i) => (
                      <AnimatedCard key={s.label} index={i} className="p-4 text-center">
                        <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                        <div className="text-2xl font-bold text-white">{s.value}</div>
                      </AnimatedCard>
                    ))}
                  </div>
                )}

                {/* Charts by report type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Daily Volume" subtitle="Work order count per day" index={4} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrend}>
                        <defs>
                          <linearGradient id="rptDaily" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => v.substring(5)} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="value" stroke="#ff7a00" strokeWidth={2} fill="url(#rptDaily)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Weekly Volume" subtitle="Work order count per week" index={5} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyTrend} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Monthly Volume" subtitle="Work order count per month" index={6} className="min-h-[280px] md:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip {...tooltipStyle} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} isAnimationActive />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Google Sheets notice */}
                <AnimatedCard index={7} className="p-5 border-primary/30 bg-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Google Sheets Integration Ready</h3>
                      <p className="text-sm text-slate-400">
                        Set <code className="bg-slate-800 px-1 rounded text-primary">VITE_GOOGLE_SPREADSHEET_ID</code> and configure{' '}
                        <code className="bg-slate-800 px-1 rounded text-primary">src/config/google.ts</code> to pull live data into reports automatically.
                        See <code className="bg-slate-800 px-1 rounded text-slate-300">src/services/googleSheetService.ts</code> for the integration layer.
                      </p>
                    </div>
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
