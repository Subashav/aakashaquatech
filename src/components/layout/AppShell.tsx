import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../ui/CommandPalette';
import { GlobalCreateDrawer } from '../ui/GlobalCreateDrawer';
import { Toast } from '../ui/Toast';

// Views
import { DashboardView } from '../../views/DashboardView';
import { LeadsView } from '../../views/LeadsView';
import { CustomersView } from '../../views/CustomersView';
import { ServiceView } from '../../views/ServiceView';
import { SalesView } from '../../views/SalesView';
import { InventoryView } from '../../views/InventoryView';
import { BillingView } from '../../views/BillingView';
import { AMCView } from '../../views/AMCView';
import { ReportsView } from '../../views/ReportsView';
import { EngineerMobileView } from '../../views/EngineerMobileView';
import { ManagementView } from '../../views/ManagementView';

export const AppShell: React.FC = () => {
  const { currentTab, isEngineerMobileMode } = useApp();

  const renderActiveView = () => {
    if (isEngineerMobileMode || currentTab === 'engineers') {
      return <EngineerMobileView />;
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadsView />;
      case 'customers':
        return <CustomersView />;
      case 'sales':
        return <SalesView />;
      case 'service':
        return <ServiceView />;
      case 'inventory':
        return <InventoryView />;
      case 'billing':
        return <BillingView />;
      case 'amc':
        return <AMCView />;
      case 'reports':
        return <ReportsView />;
      case 'team':
      case 'roles':
      case 'settings':
      case 'audit':
        return <ManagementView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-[#0369A1]/20 selection:text-[#0369A1] transition-colors duration-150">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Container with subtle Framer Motion Transition */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={isEngineerMobileMode ? 'mobile' : currentTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <GlobalCreateDrawer />
      <Toast />
    </div>
  );
};
