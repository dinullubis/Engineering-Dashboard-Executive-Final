import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { ChartCard } from '../components/cards/ChartCard';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Users, Trophy, Activity, Clock, Wrench } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';

const tip = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
  itemStyle: { color: '#ff7a00' },
};

const COLORS = ['#ff7a00', '#3b82f6', '#10b981', '#a855f7'];

export default function TeamPerformance() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();

  const teams    = data.teamPerformance ?? [];
  const techList = data.topEngineer ?? [];

  const totalTech   = techList.length;
  const avgComplete = teams.length > 0 ? Math.round(teams.reduce((s, t) => s + t.completionRate, 0) / teams.length) : 0;
  const avgMTTR     = teams.length > 0 ? (teams.reduce((s, t) => s + t.avgRepairTime, 0) / teams.length).toFixed(1) : '—';
  const totalWO     = teams.reduce((s, t) => s + t.totalWO, 0);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-white">Team Performance</h1>
              <p className="text-slate-400 text-sm mt-1">Technician performance, team leaderboard, and workload distribution</p>
            </div>
            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading ? <LoadingSkeleton /> : (
              <div className="space-y-6">
                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Technicians', value: totalTech,        icon: <Users size={20} className="text-primary" /> },
                    { title: 'Avg Completion',    value: `${avgComplete}%`, icon: <Trophy size={20} className="text-yellow-400" /> },
                    { title: 'Avg MTTR',          value: `${avgMTTR}h`,    icon: <Clock size={20} className="text-blue-400" /> },
                    { title: 'Total WOs Handled', value: totalWO,           icon: <Wrench size={20} className="text-green-400" /> },
                  ].map((k, i) => (
                    <AnimatedCard key={k.title} index={i} className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-slate-800 rounded-xl">{k.icon}</div>
                      <div>
                        <p className="text-xs text-slate-400">{k.title}</p>
                        <p className="text-2xl font-bold text-white">{k.value}</p>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Completion Rate by Team" subtitle="% of WOs completed" index={4} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teams} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="team" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis domain={[0,100]} unit="%" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip {...tip} formatter={v => [`${v}%`, 'Completion Rate']} />
                        <Bar dataKey="completionRate" name="Completion Rate" radius={[4,4,0,0]}>
                          {teams.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="WO Volume by Team" subtitle="Total work orders handled" index={5} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teams} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis dataKey="team" type="category" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 11 }} width={95} />
                        <Tooltip {...tip} />
                        <Bar dataKey="totalWO" name="Total WO" radius={[0,4,4,0]}>
                          {teams.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Team cards */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" /> Team Rankings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {teams.map((t, i) => (
                      <AnimatedCard key={t.id} index={6 + i} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{i===0?'🥇':i===1?'🥈':i===2?'🥉':'🔹'}</span>
                          <div>
                            <p className="font-semibold text-white text-sm">{t.team}</p>
                            <p className="text-[10px] text-slate-500">{t.leader} · {t.members} members</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-400">Completion</span><span className="text-white font-semibold">{t.completionRate}%</span></div>
                          <ProgressBar value={t.completionRate} colorClass={COLORS[i % COLORS.length].replace('#','bg-[#') + ']'} />
                          <div className="flex justify-between"><span className="text-slate-400">Avg MTTR</span><span className="text-white">{t.avgRepairTime}h</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Total WOs</span><span className="text-white">{t.totalWO}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Breakdowns</span><span className="text-red-400 font-medium">{t.breakdown}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">OT Hours</span><span className="text-primary font-medium">{t.otHours}h</span></div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>

                {/* Technician leaderboard */}
                <AnimatedCard index={10} className="flex flex-col">
                  <div className="p-4 border-b border-card-border flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <h3 className="font-semibold">Technician Leaderboard</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">#</th>
                          <th className="px-4 py-2.5 font-medium">Name</th>
                          <th className="px-4 py-2.5 font-medium">Team</th>
                          <th className="px-4 py-2.5 font-medium">Shift</th>
                          <th className="px-4 py-2.5 font-medium text-right">Total WOs</th>
                          <th className="px-4 py-2.5 font-medium text-right">Completion</th>
                          <th className="px-4 py-2.5 font-medium text-right">Resp. Time</th>
                          <th className="px-4 py-2.5 font-medium text-right">MTTR</th>
                          <th className="px-4 py-2.5 font-medium">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techList.map((tech, i) => (
                          <tr key={tech.id} className="border-b border-card-border hover:bg-slate-800/40">
                            <td className="px-4 py-2.5">
                              <span className={`font-bold ${i===0?'text-yellow-400':i===1?'text-slate-300':i===2?'text-orange-500':'text-slate-500'}`}>
                                {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 font-medium text-slate-200">{tech.name}</td>
                            <td className="px-4 py-2.5 text-slate-400">{tech.team}</td>
                            <td className="px-4 py-2.5 text-slate-400">{tech.shift ?? '—'}</td>
                            <td className="px-4 py-2.5 text-right text-slate-300">{tech.totalWO}</td>
                            <td className="px-4 py-2.5 text-right">
                              <span className={`font-semibold ${tech.completionRate>=90?'text-green-400':tech.completionRate>=80?'text-yellow-400':'text-red-400'}`}>
                                {tech.completionRate}%
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono text-slate-300">{tech.avgResponseTime}h</td>
                            <td className="px-4 py-2.5 text-right font-mono text-slate-300">{tech.avgRepairTime}h</td>
                            <td className="px-4 py-2.5 min-w-[120px]">
                              <ProgressBar value={tech.completionRate} colorClass={i === 0 ? 'bg-yellow-500' : 'bg-primary'} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
