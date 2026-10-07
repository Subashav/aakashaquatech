import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatINR } from '../utils/formatters';
import { AMCContract } from '../types';

export const AMCView: React.FC = () => {
  const {
    amcs,
    openCreateDrawer,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmc, setSelectedAmc] = useState<AMCContract | null>(amcs[0] || null);

  const filteredAmcs = useMemo(() => {
    return amcs.filter(
      (a) =>
        searchQuery === '' ||
        a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amcs, searchQuery]);

  const activeCount = amcs.filter((a) => a.renewalStatus === 'ACTIVE').length;
  const expiringCount = amcs.filter((a) => a.renewalStatus === 'EXPIRING_SOON').length;
  const totalRenewalValue = amcs.reduce((acc, a) => acc + a.contractValue, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Contracts / Recurring Revenue"
        title="Annual Maintenance Contracts (AMC)"
        subtitle="Manage recurring customer contracts, planned quarterly maintenance visits, and renewal pipelines"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast('Exported AMC register')}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('amc')}
            >
              New AMC Contract
            </Button>
          </div>
        }
      />

      {/* AMC Recurring Revenue Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E2E8F0] p-3.5 rounded-sm shadow-subtle text-xs">
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Active Contracts</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5">{activeCount} Sites Under AMC</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#D97706] uppercase">Expiring Next 30 Days</span>
          <div className="text-base font-bold text-[#D97706] mt-0.5">{expiringCount} Pending Renewals</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Annual Contract Value</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {formatINR(totalRenewalValue)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Quarterly Service Adherence</span>
          <div className="text-base font-bold text-[#16A34A] mt-0.5">100% SLA Covered</div>
        </div>
      </div>

      {/* Main Area: Split layout (Left: AMC Table, Right: AMC Deep Inspection) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle overflow-hidden flex flex-col">
          <div className="p-2.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search contract, customer, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
            <span className="text-2xs text-[#475569] font-mono shrink-0">
              {filteredAmcs.length} contracts
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Contract ID</th>
                  <th className="py-2.5 px-3">Customer & Product</th>
                  <th className="py-2.5 px-3">Coverage Plan</th>
                  <th className="py-2.5 px-3 text-right">Value</th>
                  <th className="py-2.5 px-3 text-center">Visits</th>
                  <th className="py-2.5 px-3">Renewal Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredAmcs.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAmc(a)}
                    className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer group ${
                      selectedAmc?.id === a.id ? 'bg-[#F1F5F9]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0369A1]">
                      {a.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#0F172A] group-hover:text-[#0369A1]">
                        {a.customerName}
                      </div>
                      <div className="text-2xs text-[#475569]">{a.product}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#475569] font-medium">{a.coveragePlan}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0F172A] tabular-nums">
                      {formatINR(a.contractValue)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold text-[#0F172A]">
                      {a.completedVisits} / {a.totalVisits}
                    </td>
                    <td className="py-2.5 px-3 text-2xs font-mono text-[#475569]">
                      {a.renewalDueDate}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          a.renewalStatus === 'ACTIVE'
                            ? 'success'
                            : a.renewalStatus === 'EXPIRING_SOON'
                            ? 'warning'
                            : a.renewalStatus === 'EXPIRED'
                            ? 'danger'
                            : 'info'
                        }
                        size="sm"
                      >
                        {a.renewalStatus.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected AMC Detail & Visit Progress Tracker (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle p-4 space-y-4">
          {selectedAmc && (
            <>
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
                <div>
                  <span className="text-2xs font-mono font-bold text-[#0369A1]">
                    {selectedAmc.id}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-0.5">
                    {selectedAmc.customerName}
                  </h3>
                  <div className="text-2xs text-[#475569] mt-0.5">{selectedAmc.product}</div>
                </div>
                <Badge
                  variant={
                    selectedAmc.renewalStatus === 'ACTIVE'
                      ? 'success'
                      : selectedAmc.renewalStatus === 'EXPIRING_SOON'
                      ? 'warning'
                      : selectedAmc.renewalStatus === 'EXPIRED'
                      ? 'danger'
                      : 'info'
                  }
                  size="md"
                >
                  {selectedAmc.renewalStatus.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Contract Key Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Contract Plan</span>
                  <div className="font-bold text-[#0F172A] mt-0.5">{selectedAmc.coveragePlan}</div>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Annual Rate</span>
                  <div className="font-bold text-[#0F172A] mt-0.5 tabular-nums">
                    {formatINR(selectedAmc.contractValue)}
                  </div>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Period Start</span>
                  <div className="font-mono text-[#0F172A] mt-0.5">{selectedAmc.startDate}</div>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Renewal Due</span>
                  <div className="font-mono text-[#0F172A] mt-0.5">{selectedAmc.renewalDueDate}</div>
                </div>
              </div>

              {/* Maintenance Visit Fulfillment Bar */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  <span>Mandatory AMC Visit Fulfillment</span>
                  <span className="text-[#0F172A] font-mono">
                    {selectedAmc.completedVisits} of {selectedAmc.totalVisits} Completed
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[1, 2, 3, 4].map((vNum) => {
                    const isDone = vNum <= selectedAmc.completedVisits;
                    return (
                      <div
                        key={vNum}
                        className={`p-2 rounded-xs border text-center text-2xs ${
                          isDone
                            ? 'bg-[#F1F5F9] text-[#16A34A] border-[#16A34A]/30 font-semibold'
                            : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]'
                        }`}
                      >
                        <div>Visit #{vNum}</div>
                        <div className="font-bold text-xs mt-0.5">
                          {isDone ? 'Done' : 'Scheduled'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => showToast('Dispatched AMC routine inspection visit')}
                >
                  Schedule Next Visit
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => showToast('Generated renewal quotation')}
                >
                  Initiate Contract Renewal
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
