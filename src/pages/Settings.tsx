import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';
import { AnimatedCard } from '../components/cards/AnimatedCard';
import { Settings as SettingsIcon, Link, Bell, Shield, RefreshCw, Check } from 'lucide-react';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; index: number }> = ({ title, icon, children, index }) => (
  <AnimatedCard index={index} className="flex flex-col">
    <div className="p-4 border-b border-card-border flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </AnimatedCard>
);

const FieldRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <div>
      <div className="text-sm font-medium text-slate-200">{label}</div>
      {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
    </div>
    <div className="sm:min-w-[260px]">{children}</div>
  </div>
);

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('300');
  const [notifyBreakdown, setNotifyBreakdown] = useState(true);
  const [notifyPM, setNotifyPM] = useState(true);
  const [notifyLateWO, setNotifyLateWO] = useState(false);
  const [companyName, setCompanyName] = useState('PT. Taco Anugrah Corporindo');
  const [plant, setPlant] = useState('Main Plant');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader onRefresh={() => {}} isRefreshing={false} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[900px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 text-sm mt-1">Configure data sources, notifications, and preferences</p>
              </div>
              <button
                onClick={handleSave}
                data-testid="button-save-settings"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  saved ? 'bg-green-600 text-white' : 'bg-primary hover:bg-primary/80 text-white'
                }`}
              >
                {saved ? <><Check size={14} /> Saved</> : <><SettingsIcon size={14} /> Save Changes</>}
              </button>
            </div>

            {/* General */}
            <Section title="General" icon={<SettingsIcon size={16} />} index={0}>
              <FieldRow label="Company Name" description="Displayed in the dashboard header">
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none focus:border-primary"
                  data-testid="input-company-name"
                />
              </FieldRow>
              <FieldRow label="Plant / Site" description="Production site identifier">
                <input
                  value={plant}
                  onChange={e => setPlant(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none focus:border-primary"
                  data-testid="input-plant"
                />
              </FieldRow>
              <FieldRow label="Data Refresh Interval" description="How often to pull new data (seconds)">
                <select
                  value={refreshInterval}
                  onChange={e => setRefreshInterval(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none"
                  data-testid="select-refresh-interval"
                >
                  <option value="60">60 seconds</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1800">30 minutes</option>
                </select>
              </FieldRow>
            </Section>

            {/* Google Sheets */}
            <Section title="Google Sheets Integration" icon={<Link size={16} />} index={1}>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-slate-300 mb-2">
                Connect a Google Spreadsheet to replace mock data with live production data. 
                See <code className="text-primary">src/services/googleSheetService.ts</code> for the API contract.
              </div>
              <FieldRow label="Spreadsheet ID" description="Found in your Google Sheet URL">
                <input
                  value={spreadsheetId}
                  onChange={e => setSpreadsheetId(e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-primary"
                  data-testid="input-spreadsheet-id"
                />
              </FieldRow>
              <FieldRow label="Service Account Email" description="From Google Cloud Console">
                <input
                  placeholder="taco-dashboard@project.iam.gserviceaccount.com"
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-primary"
                  data-testid="input-service-email"
                />
              </FieldRow>
              <FieldRow label="Connection Status">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-yellow-400">Not configured — using mock data</span>
                </div>
              </FieldRow>
            </Section>

            {/* Refresh */}
            <Section title="Auto-Refresh" icon={<RefreshCw size={16} />} index={2}>
              <FieldRow label="Enable Auto-Refresh" description="Automatically fetch latest data on interval">
                <label className="relative inline-flex items-center cursor-pointer" data-testid="toggle-auto-refresh">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary peer-focus:outline-none transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </FieldRow>
            </Section>

            {/* Notifications */}
            <Section title="Alarm Thresholds" icon={<Bell size={16} />} index={3}>
              {[
                { label: 'Critical Breakdown Alerts', description: 'Notify when a critical machine breakdown is logged', value: notifyBreakdown, set: setNotifyBreakdown, id: 'breakdown' },
                { label: 'PM Overdue Alerts', description: 'Notify when preventive maintenance is overdue', value: notifyPM, set: setNotifyPM, id: 'pm' },
                { label: 'Late WO Alerts', description: 'Notify when a work order exceeds its SLA', value: notifyLateWO, set: setNotifyLateWO, id: 'late-wo' },
              ].map(n => (
                <FieldRow key={n.id} label={n.label} description={n.description}>
                  <label className="relative inline-flex items-center cursor-pointer" data-testid={`toggle-notify-${n.id}`}>
                    <input type="checkbox" checked={n.value} onChange={e => n.set(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary peer-focus:outline-none transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </FieldRow>
              ))}
            </Section>

            {/* Access */}
            <Section title="Access & Security" icon={<Shield size={16} />} index={4}>
              <FieldRow label="Dashboard Mode" description="Control who can see the dashboard">
                <select className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none" data-testid="select-mode">
                  <option>Read Only (Public)</option>
                  <option>Authenticated Users</option>
                  <option>Admin Only</option>
                </select>
              </FieldRow>
              <FieldRow label="Data Retention" description="How long historical data is kept">
                <select className="w-full px-3 py-2 text-sm bg-slate-800 border border-card-border rounded-lg text-white focus:outline-none" data-testid="select-retention">
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                  <option>Unlimited</option>
                </select>
              </FieldRow>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}
