import React from 'react';
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
} from 'lucide-react';
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
    attentionQueue,
    setCurrentTab,
    setSelectedServiceId,
    setSelectedLeadId,
    openCreateDrawer,
    activeBranch,
    updateServiceStatus,
  } = useApp();

  // Metrics computation
  const totalPipelineValue = leads.reduce((acc, l) => acc + l.dealValue, 0);
  const openLeadsCount = leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST').length;
  const todayServicesCount = services.length;
  const outstandingPaymentsTotal = invoices
    .filter((i) => i.status !== 'PAID')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const statItems: StatItem[] = [
    {
      id: 'pipeline',
      label: 'Sales Pipeline',
      value: formatINR(totalPipelineValue),
      subtext: `${leads.length} active opportunities`,
      trend: { value: '+14.2% MoM', isPositive: true },
      onClick: () => setCurrentTab('leads'),
    },
    {
      id: 'open-leads',
      label: 'Open CRM Leads',
      value: openLeadsCount,
      subtext: '4 new website enquiries today',
      trend: { value: 'High Conversion', isPositive: true },
      onClick: () => setCurrentTab('leads'),
    },
    {
      id: 'today-services',
      label: "Today's Field Services",
      value: todayServicesCount,
      subtext: '3 dispatched, 1 in progress',
      onClick: () => setCurrentTab('service'),
    },
    {
      id: 'outstanding',
      label: 'Outstanding Collections',
      value: formatINR(outstandingPaymentsTotal),
      subtext: '2 invoices require immediate follow-up',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumb="Command Center / Executive Overview"
        title="Good morning, Operations Admin"
        subtitle={`System is operating normally across ${activeBranch}. Website lead integration active.`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#475569] bg-white border border-[#E2E8F0] rounded-sm">
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="font-medium">Tuesday, 06 Oct 2026</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentTab('service')}
            >
              Dispatch Center
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openCreateDrawer('lead')}
            >
              + Quick Create
            </Button>
          </div>
        }
      />

      {/* Business Overview StatStrip (Dense, Clickable, No Clownish KPI cards) */}
      <StatStrip stats={statItems} />

      {/* Connected Business Architecture Flow Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm p-3.5 shadow-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Aakash Aqua Tech End-to-End Business Lifecycle
          </span>
          <span className="text-2xs font-medium text-[#475569]">
            Integrated Data Continuity
          </span>
        </div>
        <div className="flex items-center justify-between text-2xs overflow-x-auto py-1">
          {[
            { step: '1. Website Enquiry', active: true, done: true },
            { step: '2. CRM Lead Survey', active: true, done: true },
            { step: '3. Quote & PO', active: true, done: true },
            { step: '4. Customer 360', active: true, done: true },
            { step: '5. Dispatch Service', active: true, done: false },
            { step: '6. Field OTP Verify', active: false, done: false },
            { step: '7. Spares Consumption', active: false, done: false },
            { step: '8. Tax Invoice', active: false, done: false },
            { step: '9. Recurring AMC', active: false, done: false },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xs whitespace-nowrap font-medium ${
                  item.done
                    ? 'bg-[#F1F5F9] text-[#16A34A] border border-[#16A34A]/30'
                    : item.active
                    ? 'bg-[#F1F5F9] text-[#0369A1] border border-[#0369A1]/40 font-semibold'
                    : 'bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]'
                }`}
              >
                <span>{item.step}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="w-3 h-px bg-[#E2E8F0] shrink-0 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Area: Split 2 columns (LEFT: Pipeline & Revenue, RIGHT: Attention Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sales Pipeline / Revenue Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle flex flex-col">
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Sales Pipeline & Deal Flow
              </h2>
              <p className="text-2xs text-[#475569] mt-0.5">
                Distribution of active commercial and industrial water projects
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

          <div className="p-4 flex-1 space-y-4">
            {/* Stage progress breakdown bars */}
            <div className="space-y-3">
              {[
                { stage: 'New Enquiries', count: 1, value: 245000, color: 'bg-[#2563EB]', pct: 20 },
                { stage: 'Qualified & Survey', count: 1, value: 85000, color: 'bg-[#0891B2]', pct: 15 },
                { stage: 'Formal Quotation Sent', count: 1, value: 185000, color: 'bg-[#0369A1]', pct: 25 },
                { stage: 'Commercial Negotiation', count: 1, value: 420000, color: 'bg-[#D97706]', pct: 30 },
                { stage: 'Converted / Closed Won', count: 1, value: 585000, color: 'bg-[#16A34A]', pct: 40 },
              ].map((s) => (
                <div key={s.stage} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#0F172A]">{s.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#475569] text-2xs">{s.count} deals</span>
                      <span className="font-bold text-[#0F172A] tabular-nums">
                        {formatINR(s.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent lead conversion snippet */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] bg-[#F8FAFC] p-3 rounded-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#F1F5F9] text-[#16A34A] rounded-xs border border-[#16A34A]/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    KM Multispeciality Hospital Converted
                  </div>
                  <div className="text-2xs text-[#475569]">
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
        </div>

        {/* Right Column: Attention Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle flex flex-col">
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#F1F5F9] text-[#DC2626] rounded-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Action Attention Queue
              </h2>
            </div>
            <span className="text-2xs font-bold text-[#DC2626] bg-[#F1F5F9] px-2 py-0.5 rounded-xs border border-[#DC2626]/20">
              {attentionQueue.length} Critical
            </span>
          </div>

          <div className="p-2 flex-1 divide-y divide-[#E2E8F0] overflow-y-auto max-h-[380px]">
            {attentionQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.actionTab);
                  if (item.category === 'SERVICE') setSelectedServiceId(item.recordId);
                  if (item.category === 'LEAD') setSelectedLeadId(item.recordId);
                }}
                className="p-2.5 hover:bg-[#F8FAFC] rounded-xs cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between text-2xs mb-1">
                  <span
                    className={`font-semibold px-1.5 py-0.5 rounded-xs border ${
                      item.severity === 'high'
                        ? 'bg-[#F1F5F9] text-[#DC2626] border-[#DC2626]/30'
                        : 'bg-[#F1F5F9] text-[#D97706] border-[#D97706]/30'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-[#94A3B8] font-mono text-2xs">{item.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#0369A1] transition-colors">
                  {item.title}
                </div>
                <div className="text-2xs text-[#475569] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] text-right">
            <button
              onClick={() => setCurrentTab('service')}
              className="text-2xs font-semibold text-[#0369A1] hover:text-[#075985] inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Service Queue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S SERVICE OPERATIONS - Serious Professional Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm shadow-subtle">
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Today's Field Service Operations
            </h2>
            <p className="text-2xs text-[#475569] mt-0.5">
              Live dispatch status, engineer assignments, and customer OTP authentication
            </p>
          </div>
          <div className="flex items-center gap-2">
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
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                <th className="py-2.5 px-3">Service ID</th>
                <th className="py-2.5 px-3">Customer & Product</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Assigned Engineer</th>
                <th className="py-2.5 px-3">Scheduled Time</th>
                <th className="py-2.5 px-3">OTP State</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {services.slice(0, 4).map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedServiceId(job.id);
                    setCurrentTab('service');
                  }}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0369A1]">
                    #{job.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#0F172A]">{job.customerName}</div>
                    <div className="text-2xs text-[#475569]">{job.product}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#475569]">{job.location}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span className="font-medium text-[#0F172A]">{job.engineerName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#475569] font-mono text-2xs">
                    {job.scheduledTime}
                  </td>
                  <td className="py-2.5 px-3">
                    {job.status === 'OTP_VERIFIED' || job.status === 'IN_PROGRESS' || job.status === 'COMPLETED' ? (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending ({job.otp})
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge variant={getStatusBadgeVariant(job.status)} size="sm">
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
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
      </div>

      {/* Useful Secondary Information (Sales Performance, Service SLA, Inventory Alerts, AMC Renewals) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Inventory Alerts */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-3.5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#475569]">
              Inventory Alerts
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setCurrentTab('inventory')}
            >
              Stock
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {inventory
              .filter((i) => i.status !== 'HEALTHY')
              .slice(0, 2)
              .map((item) => (
                <div
                  key={item.sku}
                  onClick={() => setCurrentTab('inventory')}
                  className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs text-xs cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="font-semibold text-[#0F172A] truncate">{item.name}</div>
                  <div className="flex items-center justify-between text-2xs text-[#475569] mt-1">
                    <span>Stock: <strong className="text-[#DC2626]">{item.stock}</strong> (Min: {item.minStock})</span>
                    <Badge variant={item.status === 'OUT_OF_STOCK' ? 'danger' : 'warning'} size="sm">
                      {item.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Card 2: AMC Renewal Watch */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-3.5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#475569]">
              AMC Renewals Due
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setCurrentTab('amc')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {amcs.slice(0, 2).map((amc) => (
              <div
                key={amc.id}
                onClick={() => setCurrentTab('amc')}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs text-xs cursor-pointer hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="font-semibold text-[#0F172A] truncate">{amc.customerName}</div>
                <div className="flex items-center justify-between text-2xs text-[#475569] mt-1">
                  <span>Renews: {amc.renewalDueDate}</span>
                  <span className="font-bold text-[#0F172A]">{formatINR(amc.contractValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Service SLA Adherence */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-3.5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#475569]">
              Service SLA Adherence
            </span>
            <Badge variant="success" size="sm">96.4%</Badge>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-2xs text-[#475569]">
              <span>Avg Engineer On-Site Response</span>
              <strong className="text-[#0F172A]">42 mins</strong>
            </div>
            <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '92%' }} />
            </div>
            <div className="flex justify-between text-2xs text-[#475569]">
              <span>OTP Verification Compliance</span>
              <strong className="text-[#0F172A]">100% Mandatory</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Web Inbound Channel */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-3.5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#475569]">
              Website Lead Ingestion
            </span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          </div>
          <div className="mt-2 text-xs space-y-1.5">
            <div className="text-2xs text-[#475569]">
              Top Converting Forms:
            </div>
            <div className="flex items-center justify-between text-2xs">
              <span className="text-[#0F172A] font-medium">/products/commercial-ro</span>
              <strong className="text-[#0369A1]">48%</strong>
            </div>
            <div className="flex items-center justify-between text-2xs">
              <span className="text-[#0F172A] font-medium">/products/water-softener</span>
              <strong className="text-[#0369A1]">26%</strong>
            </div>
            <div className="flex items-center justify-between text-2xs">
              <span className="text-[#0F172A] font-medium">/solutions/healthcare</span>
              <strong className="text-[#0369A1]">18%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
