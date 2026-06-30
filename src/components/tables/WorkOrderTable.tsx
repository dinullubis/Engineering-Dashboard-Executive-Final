import React, { useState } from 'react';
import { WorkOrder } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate, formatHour } from '../../utils/formatters';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
}

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({ workOrders }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = workOrders.filter(wo => 
    wo.woNumber.toLowerCase().includes(search.toLowerCase()) ||
    wo.machine.toLowerCase().includes(search.toLowerCase()) ||
    wo.pic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-card-border flex justify-between items-center">
        <h3 className="font-semibold text-lg">Open Work Orders</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search WO, Machine, PIC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-primary focus:border-primary w-64"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-card-border">
            <tr>
              <th className="px-4 py-3 font-medium">WO Number</th>
              <th className="px-4 py-3 font-medium">Machine / Area</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">PIC</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 10).map((wo) => (
              <React.Fragment key={wo.id}>
                <tr 
                  className={`border-b border-card-border hover:bg-slate-800/50 cursor-pointer transition-colors ${expandedId === wo.id ? 'bg-slate-800/30' : ''}`}
                  onClick={() => setExpandedId(expandedId === wo.id ? null : wo.id)}
                >
                  <td className="px-4 py-3 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      {expandedId === wo.id ? <ChevronUp size={14} className="text-primary"/> : <ChevronDown size={14} className="text-slate-500"/>}
                      {wo.woNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-300">{wo.machine}</div>
                    <div className="text-xs text-slate-500">{wo.area}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{wo.category}</td>
                  <td className="px-4 py-3"><StatusBadge priority={wo.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={wo.status} /></td>
                  <td className="px-4 py-3 text-slate-300 font-mono">{formatHour(wo.durationHours)}</td>
                  <td className="px-4 py-3 text-slate-400">{wo.pic}</td>
                </tr>
                {expandedId === wo.id && (
                  <tr className="bg-slate-900/50 border-b border-card-border">
                    <td colSpan={7} className="px-8 py-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Description</p>
                          <p className="text-slate-300">{wo.description}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Timeline</p>
                          <p className="text-slate-400">Opened: <span className="text-slate-200">{formatDate(wo.openedDate)}</span></p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No work orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-card-border text-xs text-slate-500 flex justify-between items-center bg-slate-800/20">
        <span>Showing {Math.min(filtered.length, 10)} of {filtered.length} work orders</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};
