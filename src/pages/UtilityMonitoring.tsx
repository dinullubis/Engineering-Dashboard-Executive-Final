import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { FilterBar } from '../components/ui/FilterBar';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { ChartCard } from '../components/cards/ChartCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Zap, Droplets, Wind, Gauge, Flame } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: 12 },
};

const StatusDot: React.FC<{ status: 'NORMAL' | 'WARNING' | 'CRITICAL' }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded ${
    status === 'NORMAL' ? 'bg-green-500/20 text-green-400' :
    status === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
    'bg-red-500/20 text-red-400'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${
      status === 'NORMAL' ? 'bg-green-400 animate-pulse' :
      status === 'WARNING' ? 'bg-yellow-400 animate-pulse' :
      'bg-red-400 animate-pulse'
    }`} />
    {status}
  </span>
);

export default function UtilityMonitoring() {
  const { filters, updateFilters, isLoading, refetchAll, data } = useDashboard();
  const { utility } = data;

  const trendToPoints = (trend: number[], label: string) =>
    trend.map((v, i) => ({ t: `T-${trend.length - i - 1}`, value: v, label }));

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={refetchAll} isRefreshing={isLoading} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Utility Monitoring</h1>
              <p className="text-slate-400 text-sm mt-1">Real-time tracking of power, steam, water, air, and boiler systems</p>
            </div>

            <FilterBar filters={filters} onChange={updateFilters} />

            {isLoading || !utility ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* Status cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {[
                    {
                      label: 'Power Consumption', value: utility.power.current, unit: 'kWh',
                      icon: <Zap size={22} className="text-yellow-400" />, status: utility.power.status,
                      pct: (utility.power.current / 3000) * 100, max: 3000, color: 'bg-yellow-400',
                      extra: `Peak: ${utility.power.peak} kWh · Off-peak: ${utility.power.offPeak} kWh`,
                    },
                    {
                      label: 'Water Usage', value: utility.water.current, unit: 'm³/d',
                      icon: <Droplets size={22} className="text-blue-400" />, status: utility.water.status,
                      pct: (utility.water.current / 2000) * 100, max: 2000, color: 'bg-blue-400',
                      extra: '',
                    },
                    {
                      label: 'Steam Consumption', value: utility.steam.current, unit: 't/h',
                      icon: <Wind size={22} className="text-slate-300" />, status: utility.steam.status,
                      pct: (utility.steam.current / 20) * 100, max: 20, color: 'bg-slate-400',
                      extra: '',
                    },
                    {
                      label: 'Compressed Air', value: utility.compressedAir.current, unit: 'PSI',
                      icon: <Gauge size={22} className="text-cyan-400" />, status: utility.compressedAir.status,
                      pct: (utility.compressedAir.current / 10) * 100, max: 10, color: 'bg-cyan-400',
                      extra: '',
                    },
                    {
                      label: 'Boiler', value: utility.boiler.pressure.current, unit: 'bar',
                      icon: <Flame size={22} className={utility.boiler.status === 'NORMAL' ? 'text-green-400' : 'text-yellow-400'} />,
                      status: utility.boiler.status,
                      pct: (utility.boiler.pressure.current / 12) * 100, max: 12, color: utility.boiler.status === 'NORMAL' ? 'bg-green-400' : 'bg-yellow-400',
                      extra: `Temp: ${utility.boiler.temperature.current}°C`,
                    },
                  ].map((u, i) => (
                    <AnimatedCard key={u.label} index={i} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-slate-800 rounded-lg">{u.icon}</div>
                        <StatusDot status={u.status} />
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{u.label}</div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {u.value} <span className="text-sm font-normal text-slate-400">{u.unit}</span>
                      </div>
                      {u.extra && <div className="text-xs text-slate-500 mb-2">{u.extra}</div>}
                      <ProgressBar value={u.pct} colorClass={u.color} className="h-1.5 mt-2" />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>0</span><span>{u.max} {u.unit}</span>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>

                {/* Trend charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartCard title="Power Trend" subtitle="kWh consumption over time" index={5} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendToPoints(utility.power.trend, 'Power')}>
                        <defs>
                          <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="t" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Water Usage Trend" subtitle="m³/day consumption over time" index={6} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendToPoints(utility.water.trend, 'Water')}>
                        <defs>
                          <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="t" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWater)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Steam Trend" subtitle="t/h consumption over time" index={7} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendToPoints(utility.steam.trend, 'Steam')} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="t" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip {...tooltipStyle} />
                        <Line type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Boiler Pressure Trend" subtitle="bar pressure over time" index={8} className="min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendToPoints(utility.boiler.pressure.trend, 'Pressure')} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="t" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip {...tooltipStyle} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* Boiler detail */}
                <AnimatedCard index={9} className="p-5">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Flame size={18} className="text-orange-400" /> Boiler System Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Pressure', value: `${utility.boiler.pressure.current} bar`, status: utility.boiler.pressure.status },
                      { label: 'Temperature', value: `${utility.boiler.temperature.current} °C`, status: utility.boiler.temperature.status },
                      { label: 'Overall Status', value: utility.boiler.status, status: utility.boiler.status },
                      { label: 'Air Pressure', value: `${utility.compressedAir.current} PSI`, status: utility.compressedAir.status },
                    ].map(b => (
                      <div key={b.label} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-xs text-slate-400 mb-2">{b.label}</div>
                        <div className="text-xl font-bold text-white mb-2">{b.value}</div>
                        <StatusDot status={b.status} />
                      </div>
                    ))}
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
