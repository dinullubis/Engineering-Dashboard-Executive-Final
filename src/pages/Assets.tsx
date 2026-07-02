import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Database, Search, Filter } from 'lucide-react';
const mockAssets: any[] = [];

const AREAS = ['All', 'Packaging', 'Processing', 'Utilities', 'Finishing', 'QC'];

export default function Assets() {
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = mockAssets.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.area.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === 'All' || a.area === filterArea;
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchArea && matchStatus;
  });

  const counts = {
    total: mockAssets.length,
    operational: mockAssets.filter(a => a.status === 'Operational').length,
    maintenance: mockAssets.filter(a => a.status === 'Under Maintenance').length,
    offline: mockAssets.filter(a => a.status === 'Offline').length,
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={() => {}} isRefreshing={false} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Asset Registry</h1>
              <p className="text-slate-400 text-sm mt-1">All equipment, machinery, and critical assets across production areas</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Assets', value: counts.total, color: 'text-white' },
                { label: 'Operational', value: counts.operational, color: 'text-green-400' },
                { label: 'Under Maintenance', value: counts.maintenance, color: 'text-yellow-400' },
                { label: 'Offline', value: counts.offline, color: 'text-red-400' },
              ].map((item, i) => (
                <AnimatedCard key={item.label} index={i} className="p-4 flex items-center gap-4">
                  <div className={`p-2 bg-slate-800 rounded-lg`}>
                    <Database size={18} className={item.color} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Filters + Table */}
            <AnimatedCard index={4} className="flex flex-col">
              <div className="p-4 border-b border-card-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Database size={18} className="text-primary" /> Assets
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search asset, tag, area..."
                      className="pl-8 pr-3 py-1.5 text-sm bg-slate-800 border border-card-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary w-52"
                      data-testid="input-assets-search"
                    />
                  </div>
                  <div className="relative">
                    <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={filterArea}
                      onChange={e => setFilterArea(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none"
                      data-testid="select-area-filter"
                    >
                      {AREAS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none"
                    data-testid="select-status-filter"
                  >
                    {['All', 'Operational', 'Under Maintenance', 'Offline'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border bg-slate-800/50">
                      {['Asset Tag', 'Name', 'Area', 'Type', 'Manufacturer', 'Year', 'Last Service', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    {filtered.map((asset, i) => (
                      <tr key={asset.id} className="hover:bg-slate-800/40 transition-colors" data-testid={`row-asset-${asset.id}`}>
                        <td className="px-4 py-3 font-mono text-xs text-primary">{asset.tag}</td>
                        <td className="px-4 py-3 font-medium text-white">{asset.name}</td>
                        <td className="px-4 py-3 text-slate-300">{asset.area}</td>
                        <td className="px-4 py-3 text-slate-400">{asset.type}</td>
                        <td className="px-4 py-3 text-slate-400">{asset.manufacturer}</td>
                        <td className="px-4 py-3 text-slate-400">{asset.year}</td>
                        <td className="px-4 py-3 text-slate-400">{asset.lastService}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            asset.status === 'Operational' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
                            asset.status === 'Under Maintenance' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                            'bg-red-500/20 text-red-400 border-red-500/40'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No assets match your criteria</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-card-border text-xs text-slate-500">
                Showing {filtered.length} of {mockAssets.length} assets
              </div>
            </AnimatedCard>
          </div>
        </main>
      </div>
    </div>
  );
}
