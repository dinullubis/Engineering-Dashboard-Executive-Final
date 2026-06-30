import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { ChartCard } from '../components/cards/ChartCard';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Search, Clock, Users, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ComposedChart, Area,
} from 'recharts';

const tip = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
  itemStyle: { color: '#ff7a00' },
};

const StatCard: React.FC<{ label: string; value: number | string; sub?: string; icon: React.ReactNode; color: string; idx?: number }> =
  ({ label, value, sub, icon, color, idx = 0 }) => (
    <AnimatedCard index={idx} className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`${color} opacity-70`}>{icon}</div>
      </div>
    </AnimatedCard>
  );

const SHIFT_COLORS = ['#ff7a00', '#3b82f6', '#10b981'];
const TEAM_COLORS  = ['#3b82f6', '#ff7a00', '#10b981', '#a855f7'];

export default function Overtime() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const [search, setSearch] = useState('');

  const ot      = data.overtimeSummary;
  const records = (data.overtimeRecords ?? []).filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-white">Overtime</h1>
              <p className="text-slate-400 text-sm mt-1">Overtime hours tracking by shift, team, and employee</p>
            </div>
            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading ? <LoadingSkeleton /> : (
              <div className="space-y-6">
                {/* KPI row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard idx={0} label="Total Overtime Hours"    value={ot?.totalHours ?? '—'}
                    sub="This period" icon={<Clock size={22} />} color="text-primary" />
                  <StatCard idx={1} label="Employees on Overtime"   value={ot?.employeesOnOT ?? '—'}
                    icon={<Users size={22} />} color="text-blue-400" />
                  <StatCard idx={2} label="Avg Hours / Employee"    value={`${ot?.avgHoursPerEmployee?.toFixed(1) ?? '—'}h`}
                    icon={<TrendingUp size={22} />} color="text-green-400" />
                </div>

                {/* By Shift and By Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedCard index={3} className="p-5">
                    <p className="text-sm font-semibold text-slate-200 mb-4">Overtime by Shift</p>
                    <div className="space-y-4">
                      {(ot?.byShift ?? []).map((s, i) => (
                        <div key={s.shift}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-300 font-medium">{s.shift}</span>
                            <span className="text-white font-semibold">{s.hours}h <span className="text-slate-500 font-normal text-xs">· {s.employees} pax</span></span>
                          </div>
                          <ProgressBar value={(s.hours / (ot?.totalHours ?? 1)) * 100} colorClass={['bg-primary','bg-blue-500','bg-green-500'][i]} />
                        </div>
                      ))}
                    </div>
                  </AnimatedCard>

                  <AnimatedCard index={4} className="p-5">
                    <p className="text-sm font-semibold text-slate-200 mb-4">Overtime by Team</p>
                    <div className="space-y-4">
                      {(ot?.byTeam ?? []).map((t, i) => (
                        <div key={t.team}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-300 font-medium">{t.team}</span>
                            <span className="text-white font-semibold">{t.hours}h <span className="text-slate-500 font-normal text-xs">· {t.employees} pax</span></span>
                          </div>
                          <ProgressBar value={(t.hours / (ot?.totalHours ?? 1)) * 100} colorClass={TEAM_COLORS[i % TEAM_COLORS.length]} />
                        </div>
                      ))}
                    </div>
                  </AnimatedCard>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="OT Hours Trend" subtitle="14-day trend" index={5} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={ot?.trend ?? []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis yAxisId="left"  stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                        <Area yAxisId="left" type="monotone" dataKey="hours" name="OT Hours" fill="#ff7a00" stroke="#ff7a00" fillOpacity={0.2} />
                        <Line yAxisId="right" type="monotone" dataKey="employees" name="Employees" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="OT by Shift" subtitle="Breakdown per shift" index={6} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ot?.byShift ?? []} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="shift" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                        {(ot?.byShift ?? []).map((_, i) => null)}
                        <Bar dataKey="hours"     name="Hours"     fill="#ff7a00" radius={[4,4,0,0]} />
                        <Bar dataKey="employees" name="Employees" fill="#3b82f6" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Records table */}
                <AnimatedCard index={7} className="flex flex-col">
                  <div className="p-4 border-b border-card-border flex flex-wrap gap-3 justify-between items-center">
                    <h3 className="font-semibold">Overtime Records</h3>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text" placeholder="Search name or team…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-background border border-border rounded-lg pl-8 pr-4 py-1.5 text-sm w-52 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">ID</th>
                          <th className="px-4 py-2.5 font-medium">Name</th>
                          <th className="px-4 py-2.5 font-medium">Team</th>
                          <th className="px-4 py-2.5 font-medium">Shift</th>
                          <th className="px-4 py-2.5 font-medium">Date</th>
                          <th className="px-4 py-2.5 font-medium text-right">Hours</th>
                          <th className="px-4 py-2.5 font-medium">Reason</th>
                          <th className="px-4 py-2.5 font-medium">Approved By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map(r => (
                          <tr key={r.id} className="border-b border-card-border hover:bg-slate-800/40">
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{r.employeeId}</td>
                            <td className="px-4 py-2.5 font-medium text-slate-200">{r.name}</td>
                            <td className="px-4 py-2.5 text-slate-400">{r.team}</td>
                            <td className="px-4 py-2.5 text-slate-400">{r.shift}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{r.date}</td>
                            <td className="px-4 py-2.5 text-right font-mono font-bold text-primary">{r.hours}h</td>
                            <td className="px-4 py-2.5 text-xs text-slate-400">{r.reason}</td>
                            <td className="px-4 py-2.5 text-xs text-slate-500">{r.approvedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-card-border text-xs text-slate-500 flex justify-between bg-slate-800/20">
                    <span>Showing {records.length} records</span>
                  </div>
                </AnimatedCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
