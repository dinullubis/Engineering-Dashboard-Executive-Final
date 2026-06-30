import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { ChartCard } from '../components/cards/ChartCard';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { AlertTriangle, Activity, Clock, CalendarClock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Legend,
} from 'recharts';

const tip = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
  itemStyle: { color: '#ff7a00' },
};

export default function BreakdownAnalysis() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();

  const {
    summary, weeklyTrend, monthlyTrend,
    breakdownArea, breakdownMachine, downtime,
    mttrTrend, mtbfTrend,
  } = data;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-white">Breakdown Analysis</h1>
              <p className="text-slate-400 text-sm mt-1">Deep-dive into failure patterns, downtime causes, and reliability metrics</p>
            </div>
            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading || !summary ? <LoadingSkeleton /> : (
              <div className="space-y-6">
                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Breakdowns',   value: summary.breakdown.value,    suffix: '',   color: 'text-red-400',    icon: <AlertTriangle size={20} className="text-red-400" />,   trend: summary.breakdown.trend,    trendGood: false },
                    { title: 'Availability', value: summary.availability.value, suffix: '%',  color: 'text-green-400',  icon: <Activity size={20} className="text-green-400" />,       trend: summary.availability.trend, trendGood: true  },
                    { title: 'MTTR',         value: summary.mttr.value,         suffix: 'h',  color: 'text-yellow-400', icon: <Clock size={20} className="text-yellow-400" />,         trend: summary.mttr.trend,         trendGood: false },
                    { title: 'MTBF',         value: summary.mtbf.value,         suffix: 'h',  color: 'text-blue-400',   icon: <CalendarClock size={20} className="text-blue-400" />,   trend: summary.mtbf.trend,         trendGood: true  },
                  ].map((k, i) => (
                    <AnimatedCard key={k.title} index={i} className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-slate-400">{k.title}</p>
                        {k.icon}
                      </div>
                      <p className={`text-3xl font-bold ${k.color}`}>{k.value}{k.suffix}</p>
                      <p className={`text-xs mt-1 ${(k.trendGood ? k.trend >= 0 : k.trend < 0) ? 'text-green-400' : 'text-red-400'}`}>
                        {k.trend > 0 ? '↑' : '↓'} {Math.abs(k.trend)}% vs last period
                      </p>
                    </AnimatedCard>
                  ))}
                </div>

                {/* Weekly + Monthly Trend */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Weekly WO Trend" subtitle="Last 12 weeks" index={4} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyTrend} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Bar dataKey="value" name="WOs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Monthly WO Trend" subtitle="Last 12 months" index={5} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Line type="monotone" dataKey="value" name="WOs" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Breakdown by Area + Machine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Breakdown by Area" subtitle="Failure count by production area" index={6} className="min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={breakdownArea} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis dataKey="date" type="category" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 11 }} width={75} />
                        <Tooltip {...tip} />
                        <Bar dataKey="value" name="Breakdowns" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Breakdown by Machine" subtitle="Top machines by failure count" index={7} className="min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={breakdownMachine} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis dataKey="date" type="category" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 11 }} width={80} />
                        <Tooltip {...tip} />
                        <Bar dataKey="value" name="Breakdowns" fill="#a855f7" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Downtime Pareto */}
                <ChartCard title="Downtime Pareto" subtitle="Hours lost by failure cause — 80/20 analysis" index={8} className="min-h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={downtime} margin={{ left: -10, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis yAxisId="left"  stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 }}
                        formatter={(value, name) => name === 'cumulative' ? [`${value}%`, 'Cumulative'] : [value, 'Downtime (h)']}
                      />
                      <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                      <Bar yAxisId="left" dataKey="value" name="Downtime (h)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative %" stroke="#ff7a00" strokeWidth={2} dot={{ fill: '#ff7a00', r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* MTTR + MTBF Trend */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="MTTR Trend" subtitle="Mean Time To Repair — 30 days" index={9} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mttrTrend} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => v.substring(5)} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} unit="h" />
                        <Tooltip {...tip} formatter={v => [`${Number(v).toFixed(2)}h`, 'MTTR']} />
                        <Line type="monotone" dataKey="value" name="MTTR" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="MTBF Trend" subtitle="Mean Time Between Failures — 30 days" index={10} className="min-h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mtbfTrend} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => v.substring(5)} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} unit="h" />
                        <Tooltip {...tip} formatter={v => [`${Number(v).toFixed(1)}h`, 'MTBF']} />
                        <Line type="monotone" dataKey="value" name="MTBF" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
