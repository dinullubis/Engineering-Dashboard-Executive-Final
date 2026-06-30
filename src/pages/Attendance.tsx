import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { ChartCard } from '../components/cards/ChartCard';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Search, UserCheck, UserX, Thermometer, CalendarOff, Timer, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';

const tip = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
  itemStyle: { color: '#ff7a00' },
};

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; idx?: number }> =
  ({ label, value, icon, color, idx = 0 }) => (
    <AnimatedCard index={idx} className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${color} opacity-70`}>{icon}</div>
      </div>
    </AnimatedCard>
  );

const STATUS_COLOR: Record<string, string> = {
  PRESENT: 'bg-green-500/20 text-green-400',
  ABSENT:  'bg-red-500/20 text-red-400',
  SICK:    'bg-yellow-500/20 text-yellow-400',
  LEAVE:   'bg-blue-500/20 text-blue-400',
  LATE:    'bg-orange-500/20 text-orange-400',
};

export default function Attendance() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const [search, setSearch] = useState('');

  const att    = data.attendanceSummary;
  const trend  = data.attendanceTrend ?? [];
  const records = (data.attendanceRecords ?? []).filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.team.toLowerCase().includes(search.toLowerCase()) ||
    r.shift.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-white">Attendance</h1>
              <p className="text-slate-400 text-sm mt-1">Employee attendance tracking and summary</p>
            </div>
            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading ? <LoadingSkeleton /> : (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatCard idx={0} label="Present"          value={att?.present ?? '—'}  icon={<UserCheck size={20} />}  color="text-green-400" />
                  <StatCard idx={1} label="Absent"           value={att?.absent ?? '—'}   icon={<UserX size={20} />}     color="text-red-400" />
                  <StatCard idx={2} label="Sick"             value={att?.sick ?? '—'}     icon={<Thermometer size={20} />} color="text-yellow-400" />
                  <StatCard idx={3} label="Leave"            value={att?.leave ?? '—'}    icon={<CalendarOff size={20} />} color="text-blue-400" />
                  <StatCard idx={4} label="Late"             value={att?.late ?? '—'}     icon={<Timer size={20} />}     color="text-orange-400" />
                  <StatCard idx={5} label="Total Workforce"  value={att?.total ?? '—'}    icon={<Users size={20} />}     color="text-slate-300" />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Daily Attendance Trend" subtitle="14-day overview" index={6} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trend} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                        <Bar dataKey="present" name="Present" fill="#10b981" stackId="att" radius={[0,0,0,0]} />
                        <Bar dataKey="sick"    name="Sick"    fill="#eab308" stackId="att" />
                        <Bar dataKey="leave"   name="Leave"   fill="#3b82f6" stackId="att" />
                        <Bar dataKey="absent"  name="Absent"  fill="#ef4444" stackId="att" radius={[2,2,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Attendance vs Overtime" subtitle="14-day trend" index={7} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} />
                        <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                        <Line type="monotone" dataKey="present"  name="Present"  stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="late"     name="Late"     stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="overtime" name="OT (h)"   stroke="#ff7a00" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Records table */}
                <AnimatedCard index={8} className="flex flex-col">
                  <div className="p-4 border-b border-card-border flex flex-wrap gap-3 justify-between items-center">
                    <h3 className="font-semibold">Attendance Records</h3>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text" placeholder="Search name, team, shift…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-background border border-border rounded-lg pl-8 pr-4 py-1.5 text-sm w-56 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Employee ID</th>
                          <th className="px-4 py-2.5 font-medium">Name</th>
                          <th className="px-4 py-2.5 font-medium">Team</th>
                          <th className="px-4 py-2.5 font-medium">Shift</th>
                          <th className="px-4 py-2.5 font-medium">Date</th>
                          <th className="px-4 py-2.5 font-medium">Check In</th>
                          <th className="px-4 py-2.5 font-medium">Check Out</th>
                          <th className="px-4 py-2.5 font-medium">Status</th>
                          <th className="px-4 py-2.5 font-medium text-right">OT (h)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.slice(0, 20).map(r => (
                          <tr key={r.id} className="border-b border-card-border hover:bg-slate-800/40">
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{r.employeeId}</td>
                            <td className="px-4 py-2.5 font-medium text-slate-200">{r.name}</td>
                            <td className="px-4 py-2.5 text-slate-400">{r.team}</td>
                            <td className="px-4 py-2.5 text-slate-400">{r.shift}</td>
                            <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">{r.date}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-300">{r.checkIn}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-300">{r.checkOut}</td>
                            <td className="px-4 py-2.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[r.status] ?? 'bg-slate-700 text-slate-300'}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono text-xs text-primary">{r.otHours > 0 ? `${r.otHours}h` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-card-border text-xs text-slate-500 flex justify-between bg-slate-800/20">
                    <span>Showing {Math.min(records.length, 20)} of {records.length} records</span>
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
