import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Customer360Drawer } from './Customer360Drawer';
import { formatINR } from '../utils/formatters';

export const CustomersView: React.FC = () => {
  const {
    customers,
    setSelectedCustomerId,
    openCreateDrawer,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'ALL' || c.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [customers, searchQuery, typeFilter]);

  const totalOutstanding = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);
  const activeAmcCount = customers.filter((c) => c.activeAMC).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="CRM / Accounts"
        title="Customer Directory & Relationship 360°"
        subtitle="Single source of truth for accounts, installed machinery, service logs, and AMC contracts"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast('Exported customer records')}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('customer')}
            >
              New Customer
            </Button>
          </div>
        }
      />

      {/* Customer Overview Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-surface-border p-3.5 rounded-xs text-xs">
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Total Accounts</span>
          <div className="text-base font-bold text-text-primary mt-0.5">{customers.length} Clients</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Active AMC Contracts</span>
          <div className="text-base font-bold text-semantic-success mt-0.5">{activeAmcCount} Covered</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Total Outstanding</span>
          <div className={`text-base font-bold mt-0.5 tabular-nums ${totalOutstanding > 0 ? 'text-semantic-error' : 'text-text-primary'}`}>
            {formatINR(totalOutstanding)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Operating Locations</span>
          <div className="text-base font-bold text-text-primary mt-0.5">5 TN Districts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-surface-border rounded-xs p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search customer by name, company, ID or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-surface-secondary border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none text-text-secondary cursor-pointer"
          >
            <option value="ALL">All Facility Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>

        <div className="text-2xs text-text-muted font-medium">
          {filteredCustomers.length} accounts found
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-surface-border rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-secondary border-b border-surface-border text-text-secondary font-semibold uppercase tracking-wider text-2xs">
                <th className="py-2.5 px-3">Account & ID</th>
                <th className="py-2.5 px-3">Type & Location</th>
                <th className="py-2.5 px-3">Installed Machines</th>
                <th className="py-2.5 px-3">AMC Status</th>
                <th className="py-2.5 px-3 text-right">Lifetime Value</th>
                <th className="py-2.5 px-3 text-right">Outstanding Balance</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className="hover:bg-surface-secondary/70 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-text-primary group-hover:text-brand-action">
                      {cust.name}
                    </div>
                    <div className="text-2xs text-text-muted font-mono">
                      {cust.id} · {cust.phone}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-text-primary">{cust.company}</div>
                    <div className="text-2xs text-text-muted">{cust.location}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-text-primary">
                      {cust.installedProducts.length} Units
                    </span>
                    <div className="text-2xs text-text-muted truncate max-w-[180px]">
                      {cust.installedProducts[0]?.productName || 'None'}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    {cust.activeAMC ? (
                      <Badge variant="success" size="sm">
                        Active AMC
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Uncovered
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-text-primary tabular-nums">
                    {formatINR(cust.customerLifetimeValue)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-semibold tabular-nums ${
                      cust.outstandingBalance > 0 ? 'text-semantic-error' : 'text-text-muted'
                    }`}
                  >
                    {formatINR(cust.outstandingBalance)}
                  </td>
                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedCustomerId(cust.id)}
                    >
                      Inspect 360°
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-surface-border bg-surface-secondary/40 flex items-center justify-between text-2xs text-text-muted">
          <div>
            Displaying <span className="font-semibold text-text-primary">{filteredCustomers.length}</span>{' '}
            active enterprise accounts
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>

      {/* 360 Degree Drawer */}
      <Customer360Drawer />
    </div>
  );
};
