import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Wrench,
  Package,
  Receipt,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { formatINR } from '../utils/formatters';

export const ReportsView: React.FC = () => {
  const { showToast } = useApp();
  const [reportCategory, setReportCategory] = useState('sales');
  const [dateRange, setDateRange] = useState('Q3-2026');

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Executive Intelligence / Reports"
        title="Business Operations Intelligence & Reports"
        subtitle="Focused analytics answering core business questions: conversion rates, field technician SLA, inventory turnaround, and collection cycles"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-secondary bg-white border border-surface-border rounded-xs">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-medium text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="THIS-MONTH">Current Month (Oct 2026)</option>
                <option value="Q3-2026">Q3 Fiscal (Jul - Sep 2026)</option>
                <option value="YTD-2026">Financial Year 2026-27 YTD</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast(`Exported ${reportCategory.toUpperCase()} analytical summary`)}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Category Tabs */}
      <div className="bg-white border border-surface-border p-2.5 rounded-xs">
        <Tabs
          variant="pills"
          tabs={[
            { id: 'sales', label: 'Sales & Conversion' },
            { id: 'service', label: 'Service Operations SLA' },
            { id: 'engineers', label: 'Field Engineer Productivity' },
            { id: 'inventory', label: 'Inventory Turnover' },
            { id: 'billing', label: 'Billing & Collection Ageing' },
            { id: 'amc', label: 'AMC Recurring Revenue' },
          ]}
          activeTab={reportCategory}
          onChange={setReportCategory}
        />
      </div>

      {/* Report Content Panels */}
      {reportCategory === 'sales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Lead Conversion by Marketing Channel
            </h3>
            <p className="text-2xs text-text-muted">
              Which channels generate paying clients for commercial filtration?
            </p>
            <div className="space-y-3 pt-2 text-xs">
              {[
                { source: 'Website Forms (Get a Quote / Enquiries)', rate: '32.4%', leads: 72, won: 23, value: 1840000 },
                { source: 'Customer Referrals', rate: '54.2%', leads: 24, won: 13, value: 920000 },
                { source: 'Direct Inbound Phone Calls', rate: '28.0%', leads: 25, won: 7, value: 450000 },
                { source: 'Field Canvassing / Industrial Estates', rate: '14.5%', leads: 38, won: 6, value: 310000 },
              ].map((row) => (
                <div key={row.source} className="p-2.5 bg-surface-secondary/70 border border-surface-border rounded-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-text-primary">{row.source}</span>
                    <Badge variant="success" size="sm">{row.rate} Win Rate</Badge>
                  </div>
                  <div className="flex justify-between text-2xs text-text-muted">
                    <span>{row.leads} Leads · {row.won} Converted</span>
                    <strong className="text-text-primary">{formatINR(row.value)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Product Revenue Distribution
            </h3>
            <p className="text-2xs text-text-muted">
              Revenue contribution across capacity tiers
            </p>
            <div className="space-y-3 pt-2 text-xs">
              {[
                { prod: 'Industrial RO Plants (1000-5000 LPH)', val: 2450000, share: '48%' },
                { prod: 'Commercial RO Systems (250-1000 LPH)', val: 1680000, share: '33%' },
                { prod: 'Water Softener Units (Industrial & Cafeteria)', val: 620000, share: '12%' },
                { prod: 'Dialysis & Healthcare Ultra-pure RO Units', val: 585000, share: '7%' },
              ].map((p) => (
                <div key={p.prod} className="space-y-1">
                  <div className="flex justify-between text-2xs">
                    <span className="font-medium text-text-primary">{p.prod}</span>
                    <span className="font-semibold text-text-primary">{formatINR(p.val)} ({p.share})</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-action rounded-full" style={{ width: p.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportCategory === 'service' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              First-Time Fix Rate & SLA Adherence
            </h3>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
                <span className="text-2xs font-semibold text-semantic-success uppercase tracking-wider">First-Visit Resolution</span>
                <div className="text-xl font-bold text-semantic-success mt-0.5">93.8%</div>
                <p className="text-2xs text-text-secondary mt-1">
                  Correct replacement cartridges pre-loaded in field vans based on customer equipment profile.
                </p>
              </div>
              <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
                <span className="text-2xs font-semibold text-brand-action uppercase tracking-wider">Average Emergency Turnaround</span>
                <div className="text-xl font-bold text-brand-action mt-0.5">3.4 Hours</div>
                <p className="text-2xs text-text-secondary mt-1">
                  Hospital and factory breakdowns attended within stipulated 4-hour SLA window.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Top Field Failure Root Causes
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { issue: 'Pre-filter Choking (High Borewell Silt)', pct: '42%' },
                { issue: 'RO Membrane Bio-fouling / Scaling', pct: '28%' },
                { issue: 'High-Pressure Pump Electrical Trip / Low Voltage', pct: '18%' },
                { issue: 'UV Lamp Ballast Burnout', pct: '12%' },
              ].map((f) => (
                <div key={f.issue} className="flex justify-between items-center p-2.5 bg-surface-secondary rounded-xs border border-surface-border">
                  <span className="text-text-primary font-medium">{f.issue}</span>
                  <Badge variant="aqua" size="sm">{f.pct}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportCategory === 'billing' && (
        <div className="bg-white border border-surface-border rounded-xs p-4 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            Accounts Receivable & Collection Ageing Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
              <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">0 - 15 Days (Current)</span>
              <div className="font-bold text-text-primary text-sm mt-1">{formatINR(12500)}</div>
              <div className="text-2xs text-semantic-success mt-0.5">Healthy collection cycle</div>
            </div>
            <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
              <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">16 - 30 Days</span>
              <div className="font-bold text-text-primary text-sm mt-1">{formatINR(35000)}</div>
              <div className="text-2xs text-text-muted mt-0.5">Standard hospital terms</div>
            </div>
            <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
              <span className="text-2xs text-semantic-error font-semibold uppercase tracking-wider">31 - 60 Days (Overdue)</span>
              <div className="font-bold text-semantic-error text-sm mt-1">{formatINR(58000)}</div>
              <div className="text-2xs text-text-muted mt-0.5">Green Textiles follow-up</div>
            </div>
            <div className="p-3 bg-surface-secondary border border-surface-border rounded-xs">
              <span className="text-2xs text-text-muted font-semibold uppercase tracking-wider">&gt; 60 Days</span>
              <div className="font-bold text-text-primary text-sm mt-1">₹0</div>
              <div className="text-2xs text-text-muted mt-0.5">Zero bad debts</div>
            </div>
          </div>
        </div>
      )}

      {(reportCategory === 'engineers' || reportCategory === 'inventory' || reportCategory === 'amc') && (
        <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            {reportCategory.toUpperCase()} Operational Summary
          </h3>
          <p className="text-xs text-text-secondary">
            Field performance verified against ERP log timestamps and customer OTP signatures.
          </p>
        </div>
      )}
    </div>
  );
};
