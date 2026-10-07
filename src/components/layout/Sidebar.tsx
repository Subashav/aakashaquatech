import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  TrendingUp,
  Wrench,
  Smartphone,
  Package,
  Receipt,
  ShieldCheck,
  BarChart3,
  UserCheck,
  KeyRound,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { cn } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    isSidebarCollapsed,
    toggleSidebar,
    isEngineerMobileMode,
    setEngineerMobileMode,
  } = useApp();

  const workspaceNav: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'leads', label: 'Leads & Pipeline', icon: <Briefcase className="w-4 h-4" /> },
    { tab: 'customers', label: 'Customers (360°)', icon: <Users className="w-4 h-4" /> },
    { tab: 'sales', label: 'Sales & Quotes', icon: <TrendingUp className="w-4 h-4" /> },
    { tab: 'service', label: 'Service Operations', icon: <Wrench className="w-4 h-4" /> },
    {
      tab: 'engineers',
      label: 'Engineer Field Web',
      icon: <Smartphone className="w-4 h-4" />,
      badge: 'Mobile',
    },
    { tab: 'inventory', label: 'Inventory & Spares', icon: <Package className="w-4 h-4" /> },
    { tab: 'billing', label: 'Billing & Invoices', icon: <Receipt className="w-4 h-4" /> },
    { tab: 'amc', label: 'AMC Contracts', icon: <ShieldCheck className="w-4 h-4" /> },
    { tab: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const managementNav: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'team', label: 'Team Members', icon: <UserCheck className="w-4 h-4" /> },
    { tab: 'roles', label: 'Roles & Permissions', icon: <KeyRound className="w-4 h-4" /> },
    { tab: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { tab: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={cn(
        'bg-white dark:bg-black text-slate-700 dark:text-zinc-300 border-r border-slate-200 dark:border-[#222222] flex flex-col transition-all duration-200 select-none z-30 shrink-0 h-screen sticky top-0',
        isSidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-[#222222]">
        <div
          onClick={() => {
            setCurrentTab('dashboard');
            setEngineerMobileMode(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer min-w-0 group"
        >
          {/* Professional Solid Monogram */}
          <div className="w-7 h-7 rounded-sm bg-[#0369A1] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 border border-[#0891B2]/50 shadow-xs group-hover:border-[#38BDF8] transition-colors">
            AA
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-xs font-bold text-black dark:text-white tracking-tight truncate">
                Aakash Aqua Tech
              </div>
              <div className="text-2xs text-slate-500 dark:text-zinc-500 font-medium truncate uppercase tracking-widest">
                Business Platform
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1 text-slate-400 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {/* Workspace Section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-2.5 pb-1.5 text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Workspace
            </div>
          )}
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const isActive = currentTab === item.tab && !isEngineerMobileMode;
              return (
                <motion.button
                  key={item.tab}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentTab(item.tab);
                    setEngineerMobileMode(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors group relative',
                    isActive
                      ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414]'
                  )}
                >
                  {/* Subtle active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#38BDF8] rounded-r-xs" />
                  )}
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white')}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={cn(
                        'text-2xs px-1.5 py-0.2 rounded-xs font-semibold uppercase tracking-wider',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-[#141414] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-[#222222]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Management Section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-2.5 pb-1.5 text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Management
            </div>
          )}
          <nav className="space-y-0.5">
            {managementNav.map((item) => {
              const isActive = currentTab === item.tab && !isEngineerMobileMode;
              return (
                <motion.button
                  key={item.tab}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentTab(item.tab);
                    setEngineerMobileMode(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors group relative',
                    isActive
                      ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414]'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#38BDF8] rounded-r-xs" />
                  )}
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white')}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-[#222222] text-2xs text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">Website sync live · 3m ago</span>
          </div>
          <div className="text-slate-400 dark:text-zinc-600 text-2xs mt-1">Tamil Nadu Operations</div>
        </div>
      )}
    </aside>
  );
};
