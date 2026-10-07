import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  PhoneCall,
  UserCheck,
  Package,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Filter,
  CheckCircle2,
  RefreshCw,
  Plus,
  Building2,
  MapPin,
  ExternalLink,
  Smartphone,
  Eye,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { StatStrip, StatItem } from '../components/ui/StatStrip';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatINR } from '../utils/formatters';
import { ServiceStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    leads,
    services,
    invoices,
    inventory,
    amcs,
    engineers,
    attentionQueue,
    setCurrentTab,
    setSelectedServiceId,
    setSelectedLeadId,
    setSelectedCustomerId,
    openCreateDrawer,
    activeBranch,
    currentUser,
  } = useApp();

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'fy'>('today');
  const [serviceStatusFilter, setServiceStatusFilter] = useState<string>('ALL');

  // Compute Greeting based on local time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Metrics computation
  const totalPipelineValue = leads.reduce((acc, l) => acc + l.dealValue, 0);
  const openLeadsCount = leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST').length;
  const todayServicesCount = services.length;
  const completedServicesCount = services.filter((s) => s.status === 'COMPLETED').length;
  const verifiedServicesCount = services.filter(
    (s) => s.status === 'OTP_VERIFIED' || s.status === 'IN_PROGRESS' || s.status === 'COMPLETED'
  ).length;

  const outstandingPaymentsTotal = invoices
    .filter((i) => i.status !== 'PAID')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const statItems: StatItem[] = [
    {
      id: 'pipeline',
      label: 'Sales Pipeline',
      value: formatINR(totalPipelineValue),
      subtext: `${leads.length} active opportunities across TN`,
      accent: 'blue',
      trend: { value: '+14.2% MoM', isPositive: true },
      onClick: () => setCurrentTab('leads'),
    },
    {
      id: 'open-leads',
      label: 'Open CRM Leads',
      value: openLeadsCount,
      subtext: '4 new website enquiries captured today',
      accent: 'aqua',
      trend: { value: 'High Conversion', isPositive: true },
      onClick: () => setCurrentTab('leads'),
    },
    {
      id: 'today-services',
      label: "Today's Field Services",
      value: `${completedServicesCount}/${todayServicesCount} Done`,
      subtext: `${verifiedServicesCount} verified via customer OTP`,
      accent: 'green',
      trend: { value: '99.8% SLA', isPositive: true },
      onClick: () => setCurrentTab('service'),
    },
    {
      id: 'outstanding',
      label: 'Outstanding Collections',
      value: formatINR(outstandingPaymentsTotal),
      subtext: '2 GST invoices require payment follow-up',
      accent: 'red',
      trend: { value: '₹58k Overdue', isWarning: true },
      onClick: () => setCurrentTab('billing'),
    },
  ];

  // Helper for service status badge
  const getStatusBadgeVariant = (status: ServiceStatus) => {
    switch (status) {
      case 'COMPLETED':
      case 'OTP_VERIFIED':
        return 'success';
      case 'ON_THE_WAY':
        return 'aqua';
      case 'IN_PROGRESS':
      case 'ARRIVED':
      case 'ASSIGNED':
      case 'NEW':
        return 'info';
      case 'DELAYED':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Filtered services for the table
  const displayedServices = services.filter((s) => {
    if (serviceStatusFilter === 'ALL') return true;
    if (serviceStatusFilter === 'PENDING') return s.status !== 'COMPLETED';
    if (serviceStatusFilter === 'COMPLETED') return s.status === 'COMPLETED';
    if (serviceStatusFilter === 'OTP_VERIFIED') return s.status === 'OTP_VERIFIED' || s.status === 'IN_PROGRESS';
    return true;
  });

  // Low stock inventory items
  const lowStockItems = inventory.filter((i) => i.status !== 'HEALTHY');

  // Expiring AMCs (within 30-60 days or active)
  const priorityAmcs = amcs.slice(0, 3);

  // Regional revenue demo distribution
  const regionalDist = [
    { city: 'Coimbatore Hub', share: '42%', value: '₹6,02,000', leads: 8 },
    { city: 'Salem Depot', share: '24%', value: '₹3,45,000', leads: 4 },
    { city: 'Tiruppur Store', share: '18%', value: '₹2,58,000', leads: 3 },
    { city: 'Chennai & Erode', share: '16%', value: '₹2,30,000', leads: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 bg-white dark:bg-black text-black dark:text-white"
    >
      {/* Top Operational Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
            <span>Command Center</span>
            <span>/</span>
            <span className="text-[#0369A1] dark:text-cyan-400">Live Executive Operations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
            {greeting}, {currentUser?.name || 'Operations Director'}
          </h1>

          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
            Operating smoothly across <span className="font-semibold text-black dark:text-white">{activeBranch}</span>. 4 website enquiries captured today with zero dispatch backlog.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md text-xs font-medium">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === 'today'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === 'week'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === 'month'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange('fy')}
              className={`hidden sm:inline-block px-2.5 py-1 rounded transition-colors ${
                dateRange === 'fy'
                  ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              FY 2026-27
            </button>
          </div>

          {/* Quick Create Action */}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => openCreateDrawer('lead')}
          >
            Quick Create
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentTab('service')}
          >
            Dispatch Board
          </Button>
        </div>
      </div>

      {/* Business Overview StatStrip */}
      <StatStrip stats={statItems} />

      {/* Connected Business Architecture Flow Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md p-3.5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Aakash Aqua Tech End-to-End Business Lifecycle Continuity
          </span>
          <span className="text-2xs font-mono text-[#0369A1] dark:text-cyan-400 font-semibold">
            Real-time Telemetry & Pipeline Sync
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-2xs overflow-x-auto py-1">
          {[
            { step: '1. Website Enquiry', active: true, done: true },
            { step: '2. CRM Site Survey', active: true, done: true },
            { step: '3. Technical Quote', active: true, done: true },
            { step: '4. Customer 360', active: true, done: true },
            { step: '5. Dispatch Service', active: true, done: false },
            { step: '6. Field OTP Verify', active: true, done: false },
            { step: '7. Spares Consumption', active: false, done: false },
            { step: '8. GST Tax Invoice', active: false, done: false },
            { step: '9. Recurring AMC', active: false, done: false },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-2xs whitespace-nowrap font-medium border transition-colors ${
                  item.done
                    ? 'bg-emerald-50 dark:bg-black text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : item.active
                    ? 'bg-[#F0F9FF] dark:bg-black text-[#0369A1] dark:text-cyan-300 border-[#BAE6FD] dark:border-[#0369A1] font-semibold'
                    : 'bg-white dark:bg-black text-slate-400 dark:text-zinc-600 border-slate-200 dark:border-[#222222]'
                }`}
              >
                <span>{item.step}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="w-2.5 h-px bg-slate-300 dark:bg-[#222222] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Main Area: Split 2 columns (LEFT: Pipeline & Revenue, RIGHT: Attention Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sales Pipeline / Revenue Breakdown (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="lg:col-span-7 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-xs flex flex-col"
        >
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                Sales Pipeline & Deal Flow Velocity
              </h2>
              <p className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Active commercial RO, dialysis water plants, and industrial softening projects
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentTab('leads')}
            >
              Open Pipeline
            </Button>
          </div>

          <div className="p-5 flex-1 space-y-5">
            {/* Stage progress breakdown bars */}
            <div className="space-y-3.5">
              {[
                { stage: 'New Enquiries', count: 1, value: 245000, color: 'bg-blue-600 dark:bg-blue-500', pct: 20 },
                { stage: 'Qualified & Water Testing', count: 1, value: 85000, color: 'bg-cyan-600 dark:bg-cyan-500', pct: 15 },
                { stage: 'Formal Engineering Quotation Sent', count: 1, value: 185000, color: 'bg-[#0369A1] dark:bg-[#38BDF8]', pct: 25 },
                { stage: 'Commercial Negotiation & Terms', count: 1, value: 420000, color: 'bg-amber-600 dark:bg-amber-500', pct: 30 },
                { stage: 'Closed Won & PO Received', count: 1, value: 585000, color: 'bg-emerald-600 dark:bg-emerald-500', pct: 40 },
              ].map((s) => (
                <div key={s.stage} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black dark:text-white">{s.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 dark:text-zinc-400 text-2xs font-mono">{s.count} deal</span>
                      <span className="font-bold text-black dark:text-white tabular-nums">
                        {formatINR(s.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-[#141414] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Branch Performance Pills */}
            <div className="pt-3 border-t border-slate-200 dark:border-[#222222]">
              <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Regional Hub Distribution (Demo Baseline)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {regionalDist.map((r) => (
                  <div
                    key={r.city}
                    className="p-2.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-[#222222] text-left"
                  >
                    <div className="text-2xs text-slate-500 dark:text-zinc-400 truncate">{r.city}</div>
                    <div className="text-xs font-bold text-black dark:text-white tabular-nums mt-0.5">
                      {r.value}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {r.leads} active leads
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent lead conversion snippet */}
            <div className="pt-2 bg-white dark:bg-black p-3 rounded-md border border-slate-200 dark:border-[#222222] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-black dark:text-white truncate">
                    KM Multispeciality Hospital Converted
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400 truncate">
                    Dual Dialysis RO Unit (₹5,85,000) converted from Website enquiry
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setCurrentTab('customers');
                }}
              >
                View 360°
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Action Attention Queue (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="lg:col-span-5 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-xs flex flex-col"
        >
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-red-100 dark:bg-black text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-900">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                Action Attention Queue
              </h2>
            </div>
            <span className="text-2xs font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-black px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
              {attentionQueue.length} Priority Items
            </span>
          </div>

          <div className="p-2 flex-1 divide-y divide-slate-200 dark:divide-[#222222] overflow-y-auto max-h-[380px]">
            {attentionQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.actionTab);
                  if (item.category === 'SERVICE') setSelectedServiceId(item.recordId);
                  if (item.category === 'LEAD') setSelectedLeadId(item.recordId);
                }}
                className="p-3 hover:bg-slate-50 dark:hover:bg-[#111111] rounded cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between text-2xs mb-1">
                  <span
                    className={`font-semibold px-1.5 py-0.5 rounded border ${
                      item.severity === 'high'
                        ? 'bg-red-50 dark:bg-black text-red-700 dark:text-red-400 border-red-200 dark:border-red-900'
                        : 'bg-amber-50 dark:bg-black text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-slate-400 dark:text-zinc-500 font-mono text-2xs">{item.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-black dark:text-white group-hover:text-[#0369A1] dark:group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </div>
                <div className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-[#222222] bg-white dark:bg-black text-right">
            <button
              onClick={() => setCurrentTab('service')}
              className="text-2xs font-semibold text-[#0369A1] hover:text-[#075985] dark:text-cyan-400 dark:hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Service Queue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* TODAY'S SERVICE OPERATIONS - Information-Rich Operations Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md shadow-xs"
      >
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                Today's Field Service Operations & OTP Verification
              </h2>
              <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-[#0369A1] dark:text-cyan-400 border border-slate-200 dark:border-[#222222]">
                {displayedServices.length} Jobs
              </span>
            </div>
            <p className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Live dispatch status, engineer assignments, and customer OTP authentication
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1 p-0.5 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded text-xs">
              <button
                onClick={() => setServiceStatusFilter('ALL')}
                className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                  serviceStatusFilter === 'ALL'
                    ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setServiceStatusFilter('PENDING')}
                className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                  serviceStatusFilter === 'PENDING'
                    ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setServiceStatusFilter('OTP_VERIFIED')}
                className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                  serviceStatusFilter === 'OTP_VERIFIED'
                    ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                OTP Verified
              </button>
              <button
                onClick={() => setServiceStatusFilter('COMPLETED')}
                className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                  serviceStatusFilter === 'COMPLETED'
                    ? 'bg-[#0369A1] text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                Completed
              </button>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentTab('service')}
            >
              Full Dispatch Board
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => openCreateDrawer('service')}
            >
              + Dispatch Job
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white dark:bg-black border-b border-slate-200 dark:border-[#222222] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-2xs">
                <th className="py-3 px-4">Service ID</th>
                <th className="py-3 px-4">Customer & Product</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Assigned Engineer</th>
                <th className="py-3 px-4">Scheduled</th>
                <th className="py-3 px-4">OTP Verification</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#222222]">
              {displayedServices.slice(0, 5).map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedServiceId(job.id);
                    setCurrentTab('service');
                  }}
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#0369A1] dark:text-cyan-400">
                    #{job.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-black dark:text-white">{job.customerName}</div>
                    <div className="text-2xs text-slate-500 dark:text-zinc-400">{job.product}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-zinc-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span className="font-medium text-black dark:text-white">{job.engineerName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-zinc-400 font-mono text-2xs">
                    {job.scheduledTime}
                  </td>
                  <td className="py-3 px-4">
                    {job.status === 'OTP_VERIFIED' || job.status === 'IN_PROGRESS' || job.status === 'COMPLETED' ? (
                      <Badge variant="success" size="sm">
                        Verified {job.otpVerifiedAt ? `(${job.otpVerifiedAt})` : ''}
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending (OTP: {job.otp})
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(job.status)} size="sm">
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setSelectedServiceId(job.id);
                        setCurrentTab('service');
                      }}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Operational Hub Grids: Engineer Workload, Inventory Alerts, AMC Renewals, Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Engineer Workload & Availability */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md p-4 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Field Engineer Availability
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentTab('engineers')}
              >
                Web App
              </Button>
            </div>
            <div className="space-y-2">
              {engineers.slice(0, 3).map((eng) => (
                <div
                  key={eng.id}
                  onClick={() => setCurrentTab('engineers')}
                  className="p-2 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded text-xs cursor-pointer hover:border-[#0369A1] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black dark:text-white">{eng.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border ${
                        eng.status === 'AVAILABLE'
                          ? 'bg-emerald-50 dark:bg-black text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : 'bg-sky-50 dark:bg-black text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800'
                      }`}
                    >
                      {eng.status === 'AVAILABLE' ? 'Available' : 'On Field'}
                    </span>
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {eng.currentLocationName} · {eng.activeJobsCount} active job
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#222222] text-2xs text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Live GPS telemetry active</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% On-Duty</span>
          </div>
        </motion.div>

        {/* Card 2: Low-Stock Inventory Spares Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md p-4 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Low Stock Spares
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentTab('inventory')}
              >
                Inventory
              </Button>
            </div>
            <div className="space-y-2">
              {lowStockItems.slice(0, 2).map((item) => (
                <div
                  key={item.sku}
                  onClick={() => setCurrentTab('inventory')}
                  className="p-2 bg-white dark:bg-black border border-amber-300 dark:border-amber-800 rounded text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black dark:text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-2xs font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      {item.stock} left
                    </span>
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {item.warehouse} · Min threshold: {item.minStock}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#222222] text-2xs text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Auto PO draft available</span>
            <button
              onClick={() => setCurrentTab('inventory')}
              className="text-[#0369A1] dark:text-cyan-400 font-semibold hover:underline"
            >
              Reorder
            </button>
          </div>
        </motion.div>

        {/* Card 3: Upcoming AMC Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.35 }}
          className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md p-4 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Upcoming AMC Renewals
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentTab('amc')}
              >
                Contracts
              </Button>
            </div>
            <div className="space-y-2">
              {priorityAmcs.map((amc) => (
                <div
                  key={amc.id}
                  onClick={() => setCurrentTab('amc')}
                  className="p-2 bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded text-xs cursor-pointer hover:border-[#0369A1] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black dark:text-white truncate">
                      {amc.customerName}
                    </span>
                    <span className="text-2xs font-mono font-bold text-[#0369A1] dark:text-cyan-400">
                      {formatINR(amc.contractValue)}
                    </span>
                  </div>
                  <div className="text-2xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {amc.coveragePlan} · Due {amc.renewalDueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#222222] text-2xs text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Renewals due: 3 contracts</span>
            <span className="text-[#0369A1] dark:text-cyan-400 font-semibold">₹1.4L Potential</span>
          </div>
        </motion.div>

        {/* Card 4: Recent Business Activity Stream */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.4 }}
          className="bg-white dark:bg-black border border-slate-200 dark:border-[#222222] rounded-md p-4 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Recent Audit Trail
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentTab('audit')}
              >
                Audit
              </Button>
            </div>
            <div className="space-y-2 text-2xs">
              {[
                { text: 'Customer OTP #4192 verified by Arun', time: '12m ago', icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> },
                { text: 'Web enquiry: KM Multispeciality converted', time: '38m ago', icon: <TrendingUp className="w-3 h-3 text-cyan-500" /> },
                { text: 'Invoice INV-2026-1042 created ₹45k', time: '1h ago', icon: <FileText className="w-3 h-3 text-blue-500" /> },
              ].map((ev, i) => (
                <div key={i} className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#111111]">
                  <span className="mt-0.5 shrink-0">{ev.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-black dark:text-white font-medium truncate">{ev.text}</div>
                    <div className="text-slate-400 dark:text-zinc-500 text-[10px] font-mono">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#222222] text-2xs text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>System state: Operational</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">100% Up</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
