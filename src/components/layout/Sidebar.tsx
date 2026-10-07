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
        'bg-[#0B172A] text-[#CBD5E1] border-r border-[#1E293B] flex flex-col transition-all duration-200 select-none z-30 shrink-0 h-screen sticky top-0',
        isSidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-[#1E293B]">
        <div
          onClick={() => {
            setCurrentTab('dashboard');
            setEngineerMobileMode(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
        >
          {/* Professional Solid Monogram (No gradients, no droplets) */}
          <div className="w-7 h-7 rounded-sm bg-[#075985] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 border border-[#0891B2]/30">
            AA
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-xs font-bold text-white tracking-tight truncate">
                Aakash Aqua Tech
              </div>
              <div className="text-2xs text-[#94A3B8] font-medium truncate uppercase tracking-widest">
                Business Platform
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1 text-[#94A3B8] hover:text-white hover:bg-[#132A43] rounded-sm transition-colors"
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
            <div className="px-2.5 pb-1.5 text-2xs font-bold uppercase tracking-widest text-[#94A3B8]">
              Workspace
            </div>
          )}
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const isActive = currentTab === item.tab && !isEngineerMobileMode;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => {
                    setCurrentTab(item.tab);
                    setEngineerMobileMode(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors group relative',
                    isActive
                      ? 'bg-[#075985] text-white shadow-subtle'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#132A43]'
                  )}
                >
                  {/* Subtle active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0891B2] rounded-r-xs" />
                  )}
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white')}>
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
                          ? 'bg-[#0369A1] text-white'
                          : 'bg-[#132A43] text-[#CBD5E1] border border-[#1E293B]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Management Section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="px-2.5 pb-1.5 text-2xs font-bold uppercase tracking-widest text-[#94A3B8]">
              Management
            </div>
          )}
          <nav className="space-y-0.5">
            {managementNav.map((item) => {
              const isActive = currentTab === item.tab && !isEngineerMobileMode;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => {
                    setCurrentTab(item.tab);
                    setEngineerMobileMode(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors group relative',
                    isActive
                      ? 'bg-[#075985] text-white shadow-subtle'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#132A43]'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0891B2] rounded-r-xs" />
                  )}
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white')}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-[#1E293B] text-2xs text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            <span className="truncate">Website sync live · 3m ago</span>
          </div>
          <div className="text-[#64748B] text-2xs mt-1">Tamil Nadu Operations</div>
        </div>
      )}
    </aside>
  );
};
