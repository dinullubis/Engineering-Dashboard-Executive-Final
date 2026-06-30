import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { GaugeCard } from '../components/cards/GaugeCard';
import { ChartCard } from '../components/cards/ChartCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  UserCheck, UserX, Thermometer, CalendarOff, Timer,
  Clock, CalendarClock, ShieldCheck, Activity, AlertTriangle,
  Wrench, CheckCircle2, Flame, ArrowUpCircle, ArrowDownCircle,
  Package, Truck, Users, Trophy
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
  ComposedChart, Area, AreaChart,
} from 'recharts';

const COLORS = ['#ff7a00', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444'];

const tip = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
  itemStyle: { color: '#ff7a00' },
};

/* ── Section label ─────────────────────────────── */
const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; sub?: string }> = ({ icon, title, sub }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="text-primary">{icon}</div>
    <div>
      <h2 className="text-base font-semibold text-white leading-none">{title}</h2>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ── Small stat card ───────────────────────────── */
const StatCard: React.FC<{
  label: string; value: number | string; icon: React.ReactNode;
  color?: string; sub?: string; idx?: number;
}> = ({ label, value, icon, color = 'text-primary', sub, idx = 0 }) => (
  <AnimatedCard index={idx} className="p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
      <div className={`${color} opacity-70`}>{icon}</div>
    </div>
  </AnimatedCard>
);

/* ── WO status card ────────────────────────────── */
const WOCard: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode; idx?: number }> =
  ({ label, value, color, icon, idx = 0 }) => (
    <AnimatedCard index={idx} className="p-3">
      <div className={`text-xs font-medium mb-1 ${color}`}>{label}</div>
      <div className={`text-2xl font-bold text-white`}>{value}</div>
      <div className={`${color} mt-1 opacity-60`}>{icon}</div>
    </AnimatedCard>
  );

export default function Dashboard() {
  const { filters, updateFilters, isLoading, isError, refetchAll, data } = useDashboard();

  if (isError) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card p-6 rounded-xl border border-red-500/30 text-center max-w-md">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">System Error</h2>
          <p className="text-slate-400 mb-6">Unable to connect to data source.</p>
          <button onClick={refetchAll} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    summary, attendanceSummary: att, overtimeSummary: ot,
    woExt: wo, teamPerformance: teams, topEngineer,
    attendanceTrend, openVsClosed, bdVsNonBd, otVsBreakdown, alarm,
    longestOpenWOs,
  } = data;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading || !summary ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-8">

                {/* ═══════════════════════════════════════
                    1. ATTENDANCE SUMMARY
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<UserCheck size={18} />}
                    title="Attendance Summary"
                    sub="Today's headcount status"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                      label="Present" idx={0}
                      value={att?.present ?? '—'}
                      icon={<UserCheck size={20} />}
                      color="text-green-400"
                      sub={`${att?.presentPct ?? 0}% of total`}
                    />
                    <StatCard label="Absent" idx={1}
                      value={att?.absent ?? '—'}
                      icon={<UserX size={20} />}
                      color="text-red-400"
                    />
                    <StatCard label="Sick" idx={2}
                      value={att?.sick ?? '—'}
                      icon={<Thermometer size={20} />}
                      color="text-yellow-400"
                    />
                    <StatCard label="Leave" idx={3}
                      value={att?.leave ?? '—'}
                      icon={<CalendarOff size={20} />}
                      color="text-blue-400"
                    />
                    <StatCard label="Late" idx={4}
                      value={att?.late ?? '—'}
                      icon={<Timer size={20} />}
                      color="text-orange-400"
                    />
                    <StatCard label="Total Workforce" idx={5}
                      value={att?.total ?? '—'}
                      icon={<Users size={20} />}
                      color="text-slate-300"
                      sub="All employees"
                    />
                  </div>
                </section>

                {/* ═══════════════════════════════════════
                    2. OVERTIME SUMMARY
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<Clock size={18} />}
                    title="Overtime Summary"
                    sub="Current period overtime status"
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* OT KPI cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                      <StatCard label="Total Overtime Hours" idx={6}
                        value={ot?.totalHours ?? '—'}
                        icon={<Clock size={20} />}
                        color="text-primary"
                        sub="This period"
                      />
                      <StatCard label="Employees on Overtime" idx={7}
                        value={ot?.employeesOnOT ?? '—'}
                        icon={<Users size={20} />}
                        color="text-blue-400"
                        sub={`Avg ${ot?.avgHoursPerEmployee?.toFixed(1) ?? '—'}h / person`}
                      />
                    </div>

                    {/* OT by Shift */}
                    <AnimatedCard index={8} className="p-4">
                      <p className="text-sm font-medium text-slate-300 mb-3">Overtime by Shift</p>
                      <div className="space-y-2.5">
                        {(ot?.byShift ?? []).map(s => (
                          <div key={s.shift}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">{s.shift}</span>
                              <span className="text-white font-medium">{s.hours}h · {s.employees} pax</span>
                            </div>
                            <ProgressBar
                              value={(s.hours / (ot?.totalHours ?? 1)) * 100}
                              colorClass="bg-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>

                    {/* OT by Team */}
                    <AnimatedCard index={9} className="p-4">
                      <p className="text-sm font-medium text-slate-300 mb-3">Overtime by Team</p>
                      <div className="space-y-2.5">
                        {(ot?.byTeam ?? []).map((t, i) => (
                          <div key={t.team}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">{t.team}</span>
                              <span className="text-white font-medium">{t.hours}h</span>
                            </div>
                            <ProgressBar
                              value={(t.hours / (ot?.totalHours ?? 1)) * 100}
                              colorClass={['bg-blue-500','bg-primary','bg-green-500','bg-purple-500'][i % 4]}
                            />
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  </div>
                </section>

                {/* ═══════════════════════════════════════
                    3. WORK ORDER SUMMARY
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<Wrench size={18} />}
                    title="Work Order Summary"
                    sub="Current period work order status"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <WOCard label="Open WO"        idx={10} value={wo?.open ?? 0}             color="text-orange-400" icon={<Wrench size={16} />} />
                    <WOCard label="Closed WO"      idx={11} value={wo?.closed ?? 0}            color="text-green-400" icon={<CheckCircle2 size={16} />} />
                    <WOCard label="Breakdown"      idx={12} value={wo?.breakdown ?? 0}         color="text-red-400"   icon={<Flame size={16} />} />
                    <WOCard label="Non-BD High"    idx={13} value={wo?.nonBreakdownHigh ?? 0}  color="text-yellow-400" icon={<ArrowUpCircle size={16} />} />
                    <WOCard label="Non-BD Low"     idx={14} value={wo?.nonBreakdownLow ?? 0}   color="text-slate-300" icon={<ArrowDownCircle size={16} />} />
                    <WOCard label="Waiting Part"   idx={15} value={wo?.waitingPart ?? 0}       color="text-blue-400"  icon={<Package size={16} />} />
                    <WOCard label="Waiting Vendor" idx={16} value={wo?.waitingVendor ?? 0}     color="text-purple-400" icon={<Truck size={16} />} />
                  </div>
                </section>

                {/* ═══════════════════════════════════════
                    4. ENGINEERING KPI
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<Activity size={18} />}
                    title="Engineering KPI"
                    sub="Reliability and maintenance performance indicators"
                  />
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GaugeCard title="Availability" value={summary.availability.value} index={17} />
                    <AnimatedCard index={18} className="p-5 flex flex-col justify-center items-center text-center">
                      <Clock size={28} className="text-yellow-400 mb-2" />
                      <p className="text-xs text-slate-400 mb-1">MTTR</p>
                      <p className="text-4xl font-bold text-white">{summary.mttr.value}<span className="text-xl text-slate-400 ml-1">h</span></p>
                      <p className="text-xs text-slate-500 mt-2">Mean Time To Repair</p>
                      <span className={`text-xs mt-1 font-medium ${summary.mttr.trend < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {summary.mttr.trend > 0 ? '↑' : '↓'} {Math.abs(summary.mttr.trend)}% vs last period
                      </span>
                    </AnimatedCard>
                    <AnimatedCard index={19} className="p-5 flex flex-col justify-center items-center text-center">
                      <CalendarClock size={28} className="text-blue-400 mb-2" />
                      <p className="text-xs text-slate-400 mb-1">MTBF</p>
                      <p className="text-4xl font-bold text-white">{summary.mtbf.value}<span className="text-xl text-slate-400 ml-1">h</span></p>
                      <p className="text-xs text-slate-500 mt-2">Mean Time Between Failures</p>
                      <span className={`text-xs mt-1 font-medium ${summary.mtbf.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {summary.mtbf.trend > 0 ? '↑' : '↓'} {Math.abs(summary.mtbf.trend)}% vs last period
                      </span>
                    </AnimatedCard>
                    <AnimatedCard index={20} className="p-5 flex flex-col justify-center items-center text-center">
                      <ShieldCheck size={28} className="text-green-400 mb-2" />
                      <p className="text-xs text-slate-400 mb-1">PM Compliance</p>
                      <p className="text-4xl font-bold text-white">{summary.pmCompliance.value}<span className="text-xl text-slate-400 ml-1">%</span></p>
                      <p className="text-xs text-slate-500 mt-2">Preventive Maintenance</p>
                      <ProgressBar
                        value={summary.pmCompliance.value}
                        colorClass={summary.pmCompliance.value >= 90 ? 'bg-green-500' : 'bg-yellow-500'}
                        className="mt-2 w-full"
                      />
                    </AnimatedCard>
                  </div>
                </section>

                {/* ═══════════════════════════════════════
                    5. CHARTS
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<Activity size={18} />}
                    title="Trend Charts"
                    sub="Visual performance overview"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Attendance vs Overtime */}
                    <ChartCard title="Attendance vs Overtime" subtitle="14-day trend" index={21} className="min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={attendanceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip {...tip} />
                          <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                          <Bar dataKey="present" name="Present" fill="#10b981" radius={[2,2,0,0]} />
                          <Line type="monotone" dataKey="overtime" name="OT (h)" stroke="#ff7a00" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Open vs Closed WO */}
                    <ChartCard title="Open vs Closed WO" subtitle="14-day trend" index={22} className="min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={openVsClosed}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip {...tip} />
                          <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                          <Bar dataKey="open"   name="Open"   fill="#ff7a00" radius={[2,2,0,0]} stackId="wo" />
                          <Bar dataKey="closed" name="Closed" fill="#10b981" radius={[2,2,0,0]} stackId="wo" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Breakdown vs Non-Breakdown */}
                    <ChartCard title="Breakdown vs Non-Breakdown" subtitle="Current period" index={23} className="min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bdVsNonBd}
                            dataKey="value" nameKey="date"
                            cx="50%" cy="45%"
                            outerRadius={80} innerRadius={45}
                            paddingAngle={3}
                          >
                            {(bdVsNonBd ?? []).map((_, i) => (
                              <Cell key={i} fill={[COLORS[5], COLORS[4], COLORS[0]][i % 3]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 }} />
                          <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Overtime vs Breakdown */}
                    <ChartCard title="Overtime vs Breakdown" subtitle="14-day correlation" index={24} className="min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={otVsBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis yAxisId="left"  stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip {...tip} />
                          <Legend iconSize={8} formatter={v => <span className="text-xs text-slate-300">{v}</span>} />
                          <Area yAxisId="left" type="monotone" dataKey="overtime" name="OT (h)" fill="#ff7a00" stroke="#ff7a00" fillOpacity={0.2} />
                          <Bar yAxisId="right" dataKey="value" name="Breakdowns" fill="#ef4444" radius={[2,2,0,0]} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Team Performance */}
                    <ChartCard title="Team Performance" subtitle="Completion rate by team" index={25} className="min-h-[240px] lg:col-span-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teams ?? []} layout="vertical" margin={{ left: 10, right: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis dataKey="team" type="category" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 11 }} width={95} />
                          <Tooltip {...tip} formatter={v => [`${v}%`, 'Completion Rate']} />
                          <Bar dataKey="completionRate" name="Completion Rate" radius={[0,4,4,0]} fill="#3b82f6" isAnimationActive />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>
                </section>

                {/* ═══════════════════════════════════════
                    6. TABLES
                ═══════════════════════════════════════ */}
                <section>
                  <SectionTitle
                    icon={<Trophy size={18} />}
                    title="Performance & Alert Tables"
                    sub="Current period rankings and open issues"
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Top Team Performance */}
                    <AnimatedCard index={26} className="flex flex-col">
                      <div className="p-4 border-b border-card-border flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <h3 className="font-semibold text-sm">Top Team Performance</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                            <tr>
                              <th className="px-4 py-2.5 font-medium">#</th>
                              <th className="px-4 py-2.5 font-medium">Team</th>
                              <th className="px-4 py-2.5 font-medium text-right">WOs</th>
                              <th className="px-4 py-2.5 font-medium text-right">Completion</th>
                              <th className="px-4 py-2.5 font-medium text-right">MTTR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(teams ?? []).map((t, i) => (
                              <tr key={t.id} className="border-b border-card-border hover:bg-slate-800/40">
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs font-bold ${i===0?'text-yellow-400':i===1?'text-slate-300':i===2?'text-orange-500':'text-slate-500'}`}>
                                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-slate-200">{t.team}</div>
                                  <div className="text-[10px] text-slate-500">{t.leader} · {t.members} members</div>
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-300">{t.totalWO}</td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className={`font-semibold ${t.completionRate>=90?'text-green-400':t.completionRate>=80?'text-yellow-400':'text-red-400'}`}>
                                    {t.completionRate}%
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-300 font-mono">{t.avgResponseTime}h</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AnimatedCard>

                    {/* Top Technician */}
                    <AnimatedCard index={27} className="flex flex-col">
                      <div className="p-4 border-b border-card-border flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <h3 className="font-semibold text-sm">Top Technician</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                            <tr>
                              <th className="px-4 py-2.5 font-medium">#</th>
                              <th className="px-4 py-2.5 font-medium">Name</th>
                              <th className="px-4 py-2.5 font-medium text-right">WOs</th>
                              <th className="px-4 py-2.5 font-medium text-right">Rate</th>
                              <th className="px-4 py-2.5 font-medium text-right">MTTR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(topEngineer ?? []).slice(0, 5).map((tech, i) => (
                              <tr key={tech.id} className="border-b border-card-border hover:bg-slate-800/40">
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs font-bold ${i===0?'text-yellow-400':i===1?'text-slate-300':i===2?'text-orange-500':'text-slate-500'}`}>
                                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-slate-200">{tech.name}</div>
                                  <div className="text-[10px] text-slate-500">{tech.team} · {tech.shift}</div>
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-300">{tech.totalWO}</td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className={`font-semibold ${tech.completionRate>=90?'text-green-400':tech.completionRate>=80?'text-yellow-400':'text-red-400'}`}>
                                    {tech.completionRate}%
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-300 font-mono">{tech.avgRepairTime}h</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AnimatedCard>

                    {/* Longest Open Work Orders */}
                    <AnimatedCard index={28} className="flex flex-col">
                      <div className="p-4 border-b border-card-border flex items-center gap-2">
                        <Wrench size={16} className="text-orange-400" />
                        <h3 className="font-semibold text-sm">Longest Open Work Orders</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                            <tr>
                              <th className="px-4 py-2.5 font-medium">WO #</th>
                              <th className="px-4 py-2.5 font-medium">Machine</th>
                              <th className="px-4 py-2.5 font-medium">Status</th>
                              <th className="px-4 py-2.5 font-medium text-right">Open (h)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(longestOpenWOs ?? []).slice(0, 6).map(wo => (
                              <tr key={wo.id} className="border-b border-card-border hover:bg-slate-800/40">
                                <td className="px-4 py-2.5 font-mono text-xs text-primary">{wo.woNumber}</td>
                                <td className="px-4 py-2.5">
                                  <div className="text-slate-200 text-xs">{wo.machine}</div>
                                  <div className="text-[10px] text-slate-500">{wo.area}</div>
                                </td>
                                <td className="px-4 py-2.5"><StatusBadge status={wo.status} /></td>
                                <td className="px-4 py-2.5 text-right font-mono font-bold text-orange-400">{wo.durationHours}h</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AnimatedCard>

                    {/* Active Critical Alarms */}
                    <AnimatedCard index={29} className="flex flex-col">
                      <div className="p-4 border-b border-card-border flex items-center justify-between bg-red-500/10">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-400 animate-pulse" />
                          <h3 className="font-semibold text-sm text-red-400">Active Critical Alarms</h3>
                        </div>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {alarm?.length ?? 0}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
                            <tr>
                              <th className="px-4 py-2.5 font-medium">WO #</th>
                              <th className="px-4 py-2.5 font-medium">Machine</th>
                              <th className="px-4 py-2.5 font-medium">Team</th>
                              <th className="px-4 py-2.5 font-medium text-right">Open (h)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(alarm ?? []).map(a => (
                              <tr key={a.id} className="border-b border-card-border hover:bg-slate-800/40">
                                <td className="px-4 py-2.5 font-mono text-xs text-primary">{a.woNumber}</td>
                                <td className="px-4 py-2.5">
                                  <div className="text-slate-200 text-xs">{a.machine}</div>
                                  <div className="text-[10px] text-slate-500">{a.area}</div>
                                </td>
                                <td className="px-4 py-2.5 text-xs text-slate-400">{a.team ?? '—'}</td>
                                <td className="px-4 py-2.5 text-right font-mono font-bold text-red-400">{a.duration}h</td>
                              </tr>
                            ))}
                            {(!alarm || alarm.length === 0) && (
                              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500 text-xs">No active alarms</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </AnimatedCard>

                  </div>
                </section>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
