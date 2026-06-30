import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, UserCheck, Clock, Wrench, BarChart2,
  ShieldCheck, Zap, Users, FileText, Database, Settings, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',                       icon: LayoutDashboard, label: 'Overview' },
  { href: '/attendance',             icon: UserCheck,       label: 'Attendance' },
  { href: '/overtime',               icon: Clock,           label: 'Overtime' },
  { href: '/work-orders',            icon: Wrench,          label: 'WOs' },
  { href: '/breakdown',              icon: BarChart2,       label: 'Analysis' },
  { href: '/preventive-maintenance', icon: ShieldCheck,     label: 'PM' },
  { href: '/utility',                icon: Zap,             label: 'Utility' },
  { href: '/team',                   icon: Users,           label: 'Team' },
  { href: '/reports',                icon: FileText,        label: 'Reports' },
  { href: '/assets',                 icon: Database,        label: 'Assets' },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, active, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 mb-1 ${
      active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
    data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
  >
    <Icon size={20} />
    <span className="text-[9px] mt-1 font-medium leading-tight text-center">{label}</span>
  </Link>
);

export const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-card-border rounded-lg text-white"
        onClick={() => setOpen(o => !o)}
        data-testid="button-mobile-menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <aside className={`w-[68px] bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex-col z-40 hidden md:flex ${open ? '!flex fixed left-0 top-0' : ''}`}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-sidebar-border shrink-0">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
            T
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-1.5 py-2 flex flex-col overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        {/* Settings */}
        <div className="px-1.5 pb-2 border-t border-sidebar-border shrink-0">
          <NavItem
            href="/settings"
            icon={Settings}
            label="Settings"
            active={isActive('/settings')}
            onClick={() => setOpen(false)}
          />
        </div>
      </aside>
    </>
  );
};
