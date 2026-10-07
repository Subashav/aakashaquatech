import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  Building2,
  Smartphone,
  Monitor,
  Menu,
  Sun,
  Moon,
  Laptop,
  LogOut,
  User,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    theme,
    setTheme,
    currentUser,
    logout,
  } = useApp();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="h-14 bg-white dark:bg-black border-b border-slate-200 dark:border-[#222222] px-4 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs transition-colors duration-150">
      {/* Left: Mobile hamburger & Global Search Command Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-1.5 text-slate-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search trigger button */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-white dark:bg-black hover:border-[#0369A1] focus:border-[#0369A1] border border-slate-200 dark:border-[#222222] rounded-sm transition-all text-left group shadow-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-[#0369A1] dark:group-hover:text-cyan-400 shrink-0" />
            <span className="truncate text-slate-600 dark:text-zinc-400">
              Search leads, customers, services, invoices...
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center text-2xs font-mono font-medium text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] px-1.5 py-0.5 rounded-xs shrink-0 ml-2">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Branch Filter */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] px-2.5 py-1 rounded-sm">
          <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-transparent text-xs font-semibold text-black dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="All Branches" className="dark:bg-black text-black dark:text-white">All Branches (TN)</option>
            <option value="Coimbatore Hub" className="dark:bg-black text-black dark:text-white">Coimbatore Hub</option>
            <option value="Salem Depot" className="dark:bg-black text-black dark:text-white">Salem Depot</option>
            <option value="Tiruppur Store" className="dark:bg-black text-black dark:text-white">Tiruppur Store</option>
            <option value="Chennai Office" className="dark:bg-black text-black dark:text-white">Chennai Office</option>
          </select>
        </div>

        {/* Field Engineer Mobile Web Preview Toggle */}
        <button
          type="button"
          onClick={() => setEngineerMobileMode(!isEngineerMobileMode)}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm border transition-colors ${
            isEngineerMobileMode
              ? 'bg-amber-50 dark:bg-black text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-black text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border-slate-200 dark:border-[#222222] hover:bg-slate-50 dark:hover:bg-[#141414]'
          }`}
          title="Toggle Field Engineer mobile interface"
        >
          {isEngineerMobileMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-amber-600" />
              <span>Exit Mobile Web</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Engineer Mobile</span>
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

        {/* THEME SELECTOR DROPDOWN / TOGGLE */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setThemeMenuOpen(!isThemeMenuOpen)}
            className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm transition-colors flex items-center gap-1 border border-slate-200 dark:border-[#222222] bg-white dark:bg-black"
            title={`Current theme: ${theme} (Click to switch)`}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Laptop className="w-4 h-4 text-slate-600 dark:text-cyan-400" />
            )}
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          <AnimatePresence>
            {isThemeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-sm shadow-dropdown p-1 z-50 text-xs"
              >
                <div className="px-2 py-1 text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-200 dark:border-[#222222] mb-1">
                  Theme
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xs transition-colors text-left ${
                    theme === 'light'
                      ? 'bg-[#0369A1] text-white font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#141414]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xs transition-colors text-left ${
                    theme === 'dark'
                      ? 'bg-[#0369A1] text-white font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#141414]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('system');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xs transition-colors text-left ${
                    theme === 'system'
                      ? 'bg-[#0369A1] text-white font-semibold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#141414]'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 shrink-0" />
                  <span>System</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm relative transition-colors border border-slate-200 dark:border-[#222222] bg-white dark:bg-black"
            title="Attention items"
          >
            <Bell className="w-4 h-4" />
            {attentionQueue.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white dark:ring-black" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-sm shadow-dropdown p-2 z-50"
              >
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-200 dark:border-[#222222]">
                  <span className="text-xs font-bold text-black dark:text-white">
                    Action Attention Queue
                  </span>
                  <span className="text-2xs font-semibold text-[#B91C1C] dark:text-red-400 bg-red-50 dark:bg-black px-1.5 py-0.5 rounded-xs border border-red-200 dark:border-red-900">
                    {attentionQueue.length} pending
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-200 dark:divide-[#222222] py-1">
                  {attentionQueue.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        setCurrentTab(item.actionTab);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-[#141414] rounded-xs transition-colors"
                    >
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-semibold text-[#B91C1C] dark:text-red-400">
                          {item.tag}
                        </span>
                        <span className="text-slate-400 dark:text-zinc-500">{item.timestamp}</span>
                      </div>
                      <div className="text-xs font-medium text-black dark:text-white mt-0.5 truncate">
                        {item.title}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setHelpOpen(!isHelpOpen)}
            className="p-1.5 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm transition-colors border border-slate-200 dark:border-[#222222] bg-white dark:bg-black"
            title="Operational Architecture Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isHelpOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-sm shadow-dropdown p-3 z-50 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222222] mb-2 font-bold text-black dark:text-white">
                  <span>Aakash Aqua Tech Workflow Guide</span>
                  <button onClick={() => setHelpOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white">
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-2xs text-slate-600 dark:text-zinc-400">
                  <p>
                    <strong className="text-black dark:text-white">1. Leads to Quotes:</strong> Web enquiries convert to site survey tickets, then formal RO skidding proposals.
                  </p>
                  <p>
                    <strong className="text-black dark:text-white">2. OTP Dispatch:</strong> Field engineers authenticate customer presence using a 4-digit SMS OTP prior to starting membrane service.
                  </p>
                  <p>
                    <strong className="text-black dark:text-white">3. Spares & AMC:</strong> Consumed filters decrement warehouse inventory automatically and reflect in GST tax invoices.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile & Session Controls */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-[#222222]" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-[#141414] rounded-sm transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#0369A1]/10 dark:bg-white/10 text-[#0369A1] dark:text-white font-bold text-2xs flex items-center justify-center border border-[#0369A1]/30 dark:border-[#333333] shrink-0">
              {currentUser?.avatarInitials || 'AS'}
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-semibold text-black dark:text-white leading-tight">
                {currentUser?.name || 'Operations Admin'}
              </div>
              <div className="text-2xs text-slate-500 dark:text-zinc-400 leading-tight">
                {currentUser?.role || 'Headquarters'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500 hidden xl:block" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-sm shadow-dropdown p-2.5 z-50 text-xs"
              >
                <div className="pb-2 border-b border-slate-200 dark:border-[#222222] mb-2">
                  <div className="font-bold text-black dark:text-white">
                    {currentUser?.name || 'Operations Admin'}
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400">
                    {currentUser?.email || 'admin@aakashaqua.com'}
                  </div>
                  <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#141414] text-[#0369A1] dark:text-cyan-400 border border-slate-200 dark:border-[#222222]">
                    <Shield className="w-2.5 h-2.5" />
                    <span>{currentUser?.role || 'Operations Director'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>System Settings & Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Session</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
