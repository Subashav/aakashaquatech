import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Wrench,
  Receipt,
  ShieldCheck,
  Building,
  Package,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { formatINR } from '../utils/formatters';

export const Customer360Drawer: React.FC = () => {
  const {
    selectedCustomer,
    setSelectedCustomerId,
    services,
    invoices,
    amcs,
    openCreateDrawer,
    showToast,
    setSelectedServiceId,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedCustomer) return null;

  // Filter linked items
  const customerServices = services.filter((s) => s.customerId === selectedCustomer.id);
  const customerInvoices = invoices.filter((i) => i.customerId === selectedCustomer.id);
  const customerAmc = amcs.find((a) => a.customerId === selectedCustomer.id);

  return (
    <Drawer
      isOpen={!!selectedCustomer}
      onClose={() => setSelectedCustomerId(null)}
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-muted">#{selectedCustomer.id}</span>
          <span>{selectedCustomer.name}</span>
          <span className="text-text-muted font-normal text-xs">({selectedCustomer.company})</span>
        </div>
      }
      subtitle={`${selectedCustomer.type} Account · ${selectedCustomer.location}`}
      width="2xl"
      actions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            icon={<Phone className="w-3.5 h-3.5 text-text-muted" />}
            onClick={() => showToast(`Calling customer phone ${selectedCustomer.phone}`)}
          >
            Call
          </Button>
          <Button
            variant="outline"
            size="xs"
            icon={<MessageSquare className="w-3.5 h-3.5 text-semantic-success" />}
            onClick={() => showToast(`WhatsApp message dispatched to ${selectedCustomer.phone}`)}
          >
            WhatsApp
          </Button>
          <Button
            variant="secondary"
            size="xs"
            icon={<Wrench className="w-3.5 h-3.5 text-text-muted" />}
            onClick={() => openCreateDrawer('service')}
          >
            New Service
          </Button>
          <Button
            variant="secondary"
            size="xs"
            icon={<Receipt className="w-3.5 h-3.5 text-text-muted" />}
            onClick={() => openCreateDrawer('invoice')}
          >
            New Invoice
          </Button>
          <Button
            variant="primary"
            size="xs"
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
            onClick={() => openCreateDrawer('amc')}
          >
            New AMC
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Customer Header Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white border border-surface-border p-3.5 rounded-xs text-xs">
          <div>
            <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Customer Value</span>
            <div className="text-base font-bold text-text-primary mt-0.5 tabular-nums">
              {formatINR(selectedCustomer.customerLifetimeValue)}
            </div>
          </div>
          <div>
            <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Outstanding Due</span>
            <div
              className={`text-base font-bold mt-0.5 tabular-nums ${
                selectedCustomer.outstandingBalance > 0 ? 'text-semantic-error' : 'text-text-primary'
              }`}
            >
              {formatINR(selectedCustomer.outstandingBalance)}
            </div>
          </div>
          <div>
            <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">AMC Coverage</span>
            <div className="mt-1">
              {selectedCustomer.activeAMC ? (
                <Badge variant="success" size="sm">
                  Active Contract
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  Uncovered / Expired
                </Badge>
              )}
            </div>
          </div>
          <div>
            <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Customer Since</span>
            <div className="font-semibold text-text-secondary mt-0.5 font-mono">
              {selectedCustomer.customerSince}
            </div>
          </div>
          <div>
            <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Installed Units</span>
            <div className="font-bold text-text-primary mt-0.5">
              {selectedCustomer.installedProducts.length} Machines
            </div>
          </div>
        </div>

        {/* 360 Degree Tabs */}
        <div className="bg-white border border-surface-border rounded-xs p-4">
          <Tabs
            tabs={[
              { id: 'overview', label: '360° Overview' },
              { id: 'products', label: 'Installed Equipment', count: selectedCustomer.installedProducts.length },
              { id: 'services', label: 'Service History', count: customerServices.length },
              { id: 'invoices', label: 'Invoices & Billing', count: customerInvoices.length },
              { id: 'amc', label: 'AMC Coverage' },
              { id: 'activity', label: 'Relationship Timeline' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="mt-4">
            {/* TAB 1: 360 OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Account details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-secondary/70 p-3.5 rounded-xs border border-surface-border">
                  <div className="space-y-2">
                    <div>
                      <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Premises Address</span>
                      <p className="font-medium text-text-primary mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                        <span>{selectedCustomer.address}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">GSTIN / Tax ID</span>
                      <p className="font-mono font-medium text-text-secondary mt-0.5">
                        {selectedCustomer.gstin || 'Unregistered Dealer'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Direct Contact</span>
                      <p className="font-medium text-text-primary mt-0.5">
                        {selectedCustomer.name} · {selectedCustomer.phone}
                      </p>
                      <p className="text-text-muted font-mono">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">Lifecycle Category</span>
                      <p className="font-medium text-text-secondary mt-0.5">
                        {selectedCustomer.type} Facility
                      </p>
                    </div>
                  </div>
                </div>

                {/* Installed Machinery Glance */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-text-muted">
                      Installed Machinery & Filtration Units
                    </span>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-2xs font-semibold text-brand-action hover:underline"
                    >
                      View All Specs
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedCustomer.installedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white border border-surface-border rounded-xs"
                      >
                        <div className="font-semibold text-text-primary truncate">{p.productName}</div>
                        <div className="text-2xs font-mono text-text-muted mt-0.5">{p.serialNumber}</div>
                        <div className="flex items-center justify-between text-2xs mt-2 pt-1.5 border-t border-surface-border">
                          <span className="text-text-secondary">{p.capacity}</span>
                          <Badge variant="success" size="sm">
                            {p.warrantyStatus.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Service Interaction */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-text-muted">
                      Recent Service Engagements
                    </span>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="text-2xs font-semibold text-brand-action hover:underline"
                    >
                      All ({customerServices.length})
                    </button>
                  </div>
                  {customerServices.length > 0 ? (
                    <div className="space-y-2">
                      {customerServices.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => {
                            setSelectedServiceId(job.id);
                            setCurrentTab('service');
                          }}
                          className="p-2.5 bg-white border border-surface-border rounded-xs flex items-center justify-between cursor-pointer hover:bg-surface-secondary transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-text-primary">
                              #{job.id} · {job.product}
                            </div>
                            <div className="text-2xs text-text-muted">
                              Engineer: {job.engineerName} · {job.problem}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={job.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                              {job.status.replace(/_/g, ' ')}
                            </Badge>
                            <div className="text-2xs font-mono text-text-muted mt-0.5">
                              {job.scheduledTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center border border-dashed border-surface-border rounded-xs text-text-muted">
                      No service calls logged yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: INSTALLED PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-3">
                {selectedCustomer.installedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white border border-surface-border rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-text-primary">{p.productName}</div>
                      <div className="text-text-muted text-2xs mt-0.5 flex items-center gap-2">
                        <span>Serial: <strong className="font-mono text-text-secondary">{p.serialNumber}</strong></span>
                        <span>·</span>
                        <span>Installed: <strong className="text-text-secondary">{p.installedDate}</strong></span>
                        <span>·</span>
                        <span>Location: <strong className="text-text-secondary">{p.location}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="aqua" size="sm">{p.capacity}</Badge>
                      <Badge variant="success" size="sm">{p.warrantyStatus.replace(/_/g, ' ')}</Badge>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => openCreateDrawer('service')}
                      >
                        Request Service
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-3">
                {customerServices.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 bg-white border border-surface-border rounded-xs text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-text-primary">
                        #{job.id} · {job.serviceType}
                      </div>
                      <Badge variant={job.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
                        {job.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-text-secondary mt-1">{job.problem}</p>
                    {job.diagnosis && (
                      <div className="mt-2 p-2 bg-surface-secondary rounded-xs text-2xs text-text-secondary border border-surface-border">
                        <strong className="text-text-primary">Diagnosis:</strong> {job.diagnosis}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-2xs text-text-muted mt-3 pt-2 border-t border-surface-border">
                      <span>Assigned: {job.engineerName}</span>
                      <span>Scheduled: {job.scheduledTime}</span>
                      <span>OTP: {job.otpVerifiedAt ? `Verified (${job.otp})` : `Pending`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: INVOICES */}
            {activeTab === 'invoices' && (
              <div className="space-y-3">
                {customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 bg-white border border-surface-border rounded-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-text-primary font-mono">{inv.id}</div>
                      <div className="text-2xs text-text-muted mt-0.5">
                        Date: {inv.date} · Due: {inv.dueDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary tabular-nums">
                        {formatINR(inv.totalAmount)}
                      </div>
                      <div className={`text-2xs font-semibold mt-0.5 ${inv.balanceDue > 0 ? 'text-semantic-error' : 'text-text-muted'}`}>
                        Balance: {formatINR(inv.balanceDue)}
                      </div>
                    </div>
                    <Badge
                      variant={
                        inv.status === 'PAID'
                          ? 'success'
                          : inv.status === 'OVERDUE'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {inv.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: AMC */}
            {activeTab === 'amc' && (
              <div className="space-y-3 text-xs">
                {customerAmc ? (
                  <div className="p-4 bg-white border border-surface-border rounded-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-base text-text-primary">
                          {customerAmc.id} · {customerAmc.coveragePlan}
                        </div>
                        <div className="text-2xs text-text-muted mt-0.5">
                          Period: {customerAmc.startDate} to {customerAmc.endDate}
                        </div>
                      </div>
                      <Badge variant="success" size="md">
                        {customerAmc.renewalStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-surface-secondary p-3 rounded-xs border border-surface-border text-center">
                      <div>
                        <span className="text-2xs text-text-muted font-semibold">Total Visits</span>
                        <div className="font-bold text-text-primary text-sm mt-0.5">
                          {customerAmc.totalVisits}
                        </div>
                      </div>
                      <div>
                        <span className="text-2xs text-text-muted font-semibold">Completed</span>
                        <div className="font-bold text-semantic-success text-sm mt-0.5">
                          {customerAmc.completedVisits}
                        </div>
                      </div>
                      <div>
                        <span className="text-2xs text-text-muted font-semibold">Remaining</span>
                        <div className="font-bold text-brand-action text-sm mt-0.5">
                          {customerAmc.remainingVisits}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-surface-border rounded-xs">
                    <p className="text-text-secondary font-medium">No active AMC contract found.</p>
                    <div className="mt-2">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => openCreateDrawer('amc')}
                      >
                        Activate AMC Contract
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: ACTIVITY TIMELINE */}
            {activeTab === 'activity' && (
              <div className="space-y-3 text-xs">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-semantic-success ring-4 ring-white" />
                    <div className="font-semibold text-text-primary">Field Service OTP Authenticated</div>
                    <p className="text-text-secondary text-2xs mt-0.5">
                      Customer code 4821 entered on mobile web by Engineer Arun. Commercial RO 500 LPH serviced.
                    </p>
                    <span className="text-2xs text-text-muted font-mono">Today, 11:42 AM</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-action ring-4 ring-white" />
                    <div className="font-semibold text-text-primary">Tax Invoice INV-2026-1042 Issued</div>
                    <p className="text-text-secondary text-2xs mt-0.5">
                      Quarterly AMC and membrane overhaul total ₹42,500. Partial ₹30,000 received.
                    </p>
                    <span className="text-2xs text-text-muted font-mono">02 Oct 2026</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                    <div className="font-semibold text-text-primary">Annual Maintenance Contract Activated</div>
                    <p className="text-text-secondary text-2xs mt-0.5">
                      Comprehensive 4-visit AMC contract initialized for Sri Murugan Textiles site.
                    </p>
                    <span className="text-2xs text-text-muted font-mono">14 Jan 2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
