import React from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  Globe,
  Plus,
  CheckCircle2,
  Download,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatINR } from '../utils/formatters';

export const SalesView: React.FC = () => {
  const { leads, openCreateDrawer, setSelectedLeadId, setCurrentTab, showToast } = useApp();

  const quoteLeads = leads.filter((l) =>
    ['QUOTATION', 'NEGOTIATION', 'QUALIFIED', 'WON'].includes(l.stage)
  );

  const totalQuotedValue = quoteLeads.reduce((acc, l) => acc + l.dealValue, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb="CRM / Commercial Proposals"
        title="Sales, Proposals & Quotes"
        subtitle="Manage commercial water treatment proposals, pricing skids, and inbound website conversion channels"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast('Exported sales proposal ledger')}
            >
              Export Proposals
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('quote')}
            >
              New Quotation
            </Button>
          </div>
        }
      />

      {/* Sales Performance Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-surface-border p-3.5 rounded-xs text-xs">
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Active Proposal Value</span>
          <div className="text-base font-bold text-text-primary mt-0.5 tabular-nums">
            {formatINR(totalQuotedValue)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Closed Won Revenue</span>
          <div className="text-base font-bold text-semantic-success mt-0.5 tabular-nums">
            {formatINR(585000)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Average Deal Size</span>
          <div className="text-base font-bold text-text-primary mt-0.5 tabular-nums">
            {formatINR(185000)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Website Lead Win Rate</span>
          <div className="text-base font-bold text-brand-action mt-0.5">34.8% Direct Web</div>
        </div>
      </div>

      {/* Split Layout: Open Quotes Table & Website Lead Inbound Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quotes Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-surface-border rounded-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Active Commercial Quotations & Proposals
            </h3>
            <span className="text-2xs text-text-muted font-mono">
              {quoteLeads.length} Proposals in play
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-surface-border text-text-secondary font-semibold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Quote ID</th>
                  <th className="py-2.5 px-3">Customer / Organization</th>
                  <th className="py-2.5 px-3">Offered Equipment</th>
                  <th className="py-2.5 px-3 text-right">Proposal Value</th>
                  <th className="py-2.5 px-3">Sales Owner</th>
                  <th className="py-2.5 px-3">Pipeline Stage</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {quoteLeads.map((l, idx) => (
                  <tr
                    key={l.id}
                    onClick={() => {
                      setSelectedLeadId(l.id);
                      setCurrentTab('leads');
                    }}
                    className="hover:bg-surface-secondary/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-brand-action">
                      QT-2026-{140 + idx}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-text-primary group-hover:text-brand-action">
                        {l.name}
                      </div>
                      <div className="text-2xs text-text-muted">{l.company}</div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary truncate max-w-xs">
                      {l.requirement}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-primary tabular-nums">
                      {formatINR(l.dealValue)}
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary">{l.owner}</td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          l.stage === 'WON'
                            ? 'success'
                            : l.stage === 'NEGOTIATION'
                            ? 'warning'
                            : 'brand'
                        }
                        size="sm"
                      >
                        {l.stage}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          setSelectedLeadId(l.id);
                          setCurrentTab('leads');
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

        {/* Website Inbound Attribution Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-surface-border rounded-xs p-4 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-wider">
              <Globe className="w-4 h-4 text-brand-action" />
              <span>Website Form Lead Attribution</span>
            </div>
            <p className="text-2xs text-text-muted mt-0.5">
              Source tracking linked directly from public customer forms
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { form: 'Product Enquiry (Commercial RO)', count: 72, pct: 45, val: 840000 },
              { form: 'Get a Quote (Industrial Plant)', count: 31, pct: 25, val: 920000 },
              { form: 'Water Softener Hardness Form', count: 18, pct: 15, val: 380000 },
              { form: 'Healthcare & Hospital Portal', count: 8, pct: 10, val: 585000 },
              { form: 'Book a Service / Repair Form', count: 14, pct: 5, val: 95000 },
            ].map((ch) => (
              <div key={ch.form} className="space-y-1">
                <div className="flex items-center justify-between text-2xs">
                  <span className="font-medium text-text-primary">{ch.form}</span>
                  <span className="font-mono text-text-muted">{ch.count} submissions</span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-action rounded-full"
                    style={{ width: `${ch.pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-2xs text-text-muted">
                  <span>Pipeline Contribution</span>
                  <span className="font-semibold text-text-primary">{formatINR(ch.val)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-surface-secondary rounded-xs border border-surface-border text-2xs text-text-secondary">
            <strong className="text-text-primary">Automatic Sync Hook:</strong> When clients submit forms on the public website, internal CRM records are instantly assigned with location mapping.
          </div>
        </div>
      </div>
    </div>
  );
};
