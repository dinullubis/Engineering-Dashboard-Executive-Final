import React, { useState } from 'react';
import { FilterState } from '../../types';
import { Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
}

const AREAS      = ['All', 'Utilities', 'Packaging', 'Processing', 'Finishing', 'QC'];
const MACHINES   = ['All', 'Boiler 1', 'Packer A', 'Mixer B', 'Conveyor 3', 'Wrapper C', 'Pump 2', 'Compressor 1'];
const CATEGORIES = ['All', 'Corrective', 'Preventive', 'Predictive', 'Improvement'];
const SHIFTS     = ['All', 'Morning', 'Afternoon', 'Night'];
const TEAMS      = ['All', 'Electrical', 'Mechanical', 'Instrumentation', 'Civil'];
const EMPLOYEES  = ['All', 'Budi Santoso', 'Agus Pratama', 'Hendra Wijaya', 'Rizky Fadillah', 'Dedi Kurniawan', 'Sandi Maulana'];
const WO_STATUSES = ['All', 'OPEN', 'IN PROGRESS', 'WAITING PARTS', 'WAITING VENDOR', 'ON HOLD', 'CLOSED'];
const PERIODS    = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom Date'] as const;

const Sel: React.FC<{ value: string; options: string[]; placeholder: string; onChange: (v: string) => void }> =
  ({ value, options, placeholder, onChange }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-slate-300 focus:ring-primary focus:border-primary min-w-[120px]"
    >
      {options.map(o => <option key={o} value={o}>{o === 'All' ? placeholder : o}</option>)}
    </select>
  );

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-card-border rounded-xl p-3 shadow-sm mb-6">
      {/* Row 1: Period + toggle */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center text-slate-400 font-medium text-sm">
          <Filter size={15} className="mr-2 text-primary" />
          Filters:
        </div>

        {/* Period selector */}
        <div className="flex items-center bg-background rounded-lg border border-border p-1 overflow-x-auto">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => onChange({ period: p })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filters.period === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              data-testid={`filter-period-${p.replace(' ', '-')}`}
            >
              {p === 'Custom Date' && <Calendar size={11} className="inline mr-1" />}
              {p}
            </button>
          ))}
        </div>

        {/* Always-visible selects */}
        <Sel value={filters.shift}  options={SHIFTS}  placeholder="All Shifts" onChange={v => onChange({ shift: v })} />
        <Sel value={filters.area}   options={AREAS}   placeholder="All Areas"  onChange={v => onChange({ area: v })} />
        <Sel value={filters.team}   options={TEAMS}   placeholder="All Teams"  onChange={v => onChange({ team: v })} />

        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          data-testid="button-filter-expand"
        >
          {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> More filters</>}
        </button>
      </div>

      {/* Row 2: extra filters */}
      {expanded && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-card-border">
          <Sel value={filters.machine}    options={MACHINES}    placeholder="All Machines"    onChange={v => onChange({ machine: v })} />
          <Sel value={filters.category}   options={CATEGORIES}  placeholder="All Categories"  onChange={v => onChange({ category: v })} />
          <Sel value={filters.woStatus}   options={WO_STATUSES} placeholder="All WO Statuses" onChange={v => onChange({ woStatus: v })} />
          <Sel value={filters.woCategory} options={CATEGORIES}  placeholder="All WO Types"    onChange={v => onChange({ woCategory: v })} />
          <Sel value={filters.employee}   options={EMPLOYEES}   placeholder="All Employees"   onChange={v => onChange({ employee: v })} />
          <button
            onClick={() => onChange({ shift: 'All', area: 'All', team: 'All', machine: 'All', category: 'All', woStatus: 'All', woCategory: 'All', employee: 'All', period: 'Today' })}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 border border-card-border rounded-lg hover:border-red-500/40 transition-colors"
            data-testid="button-filter-clear"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
