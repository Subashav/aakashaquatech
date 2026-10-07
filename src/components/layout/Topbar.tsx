import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  Building2,
  Smartphone,
  Monitor,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const Topbar: React.FC = () => {
  const {
    activeBranch,
    setActiveBranch,
    setCommandPaletteOpen,
    openCreateDrawer,
    isEngineerMobileMode,
    setEngineerMobileMode,
    attentionQueue,
    setCurrentTab,
    toggleSidebar,
  } = useApp();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-subtle">
      {/* Left: Mobile hamburger & Global Search Command Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-sm"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search trigger button */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#94A3B8] bg-[#F8FAFC] hover:bg-white hover:border-[#0369A1] focus:bg-white focus:border-[#0369A1] border border-[#E2E8F0] rounded-sm transition-colors text-left group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0369A1] shrink-0" />
            <span className="truncate text-[#64748B]">Search leads, customers, services, invoices...</span>
          </div>
          <span className="hidden sm:inline-flex items-center text-2xs font-mono font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-1.5 py-0.2 rounded-xs shrink-0 ml-2">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Branch Filter */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 rounded-sm">
          <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#0F172A] focus:outline-none cursor-pointer"
          >
            <option value="All Branches">All Branches (TN)</option>
            <option value="Coimbatore Hub">Coimbatore Hub</option>
            <option value="Salem Depot">Salem Depot</option>
            <option value="Tiruppur Store">Tiruppur Store</option>
            <option value="Chennai Office">Chennai Office</option>
          </select>
        </div>

        {/* Engineer Mobile Web Preview Toggle */}
        <button
          type="button"
          onClick={() => setEngineerMobileMode(!isEngineerMobileMode)}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm border transition-colors ${
            isEngineerMobileMode
              ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
              : 'bg-white text-[#475569] hover:text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
          title="Toggle Engineer mobile phone interface preview"
        >
          {isEngineerMobileMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Exit Mobile Web</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Field Engineer Mobile</span>
            </>
          )}
        </button>

        {/* Quick + Create */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          onClick={() => openCreateDrawer('lead')}
        >
          <span>Create</span>
        </Button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-sm relative transition-colors"
            title="Attention items"
          >
            <Bell className="w-4 h-4" />
            {attentionQueue.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-sm shadow-dropdown p-2 z-50">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F172A]">Attention Queue</span>
                <span className="text-2xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-1.5 py-0.5 rounded-xs border border-[#FECACA]">
                  {attentionQueue.length} pending
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E2E8F0] py-1">
                {attentionQueue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      setCurrentTab(item.actionTab);
                    }}
                    className="w-full text-left p-2 hover:bg-[#F8FAFC] rounded-xs transition-colors"
                  >
                    <div className="flex items-center justify-between text-2xs">
                      <span className="font-semibold text-[#B91C1C]">{item.tag}</span>
                      <span className="text-[#94A3B8]">{item.timestamp}</span>
                    </div>
                    <div className="text-xs font-medium text-[#0F172A] mt-0.5 truncate">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          type="button"
          onClick={() => setHelpOpen(!isHelpOpen)}
          className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-sm transition-colors"
          title="Workflow Guide & Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
          <div className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#0F172A] font-bold text-2xs flex items-center justify-center border border-[#CBD5E1] shrink-0">
            AD
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-[#0F172A] leading-tight">Admin Ops</div>
            <div className="text-2xs text-[#64748B] leading-tight">Headquarters</div>
          </div>
        </div>
      </div>
    </header>
  );
};
