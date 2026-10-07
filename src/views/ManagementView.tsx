import React, { useState } from 'react';
import {
  Users,
  KeyRound,
  Settings,
  History,
  Shield,
  CheckCircle2,
  Lock,
  Globe,
  Bell,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';

export const ManagementView: React.FC = () => {
  const { currentTab, setCurrentTab, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState(
    currentTab === 'roles' ? 'roles' : currentTab === 'settings' ? 'settings' : currentTab === 'audit' ? 'audit' : 'team'
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Enterprise Administration"
        title="Organization, Security & System Logs"
        subtitle="Manage access control, branch assignments, website integration webhooks, and compliance audits"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => showToast('User invitation dialogue opened')}
            >
              + Invite Team Member
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="bg-white border border-surface-border p-2.5 rounded-xs">
        <Tabs
          variant="pills"
          tabs={[
            { id: 'team', label: 'Team Members & Engineers' },
            { id: 'roles', label: 'Roles & Access Control' },
            { id: 'settings', label: 'Website & OTP Configuration' },
            { id: 'audit', label: 'Compliance Audit Trail' },
          ]}
          activeTab={activeSubTab}
          onChange={(tab) => {
            setActiveSubTab(tab);
            setCurrentTab(tab as any);
          }}
        />
      </div>

      {/* SUBTAB 1: TEAM */}
      {activeSubTab === 'team' && (
        <div className="bg-white border border-surface-border rounded-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-surface-border text-text-secondary font-semibold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Staff Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Branch / Territory</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {[
                  { name: 'Arun Kumar', role: 'Field Operations Engineer', branch: 'Coimbatore Hub', phone: '+91 98422 10291', status: 'ACTIVE' },
                  { name: 'Meena R', role: 'Commercial Sales Lead', branch: 'Salem & Erode', phone: '+91 97890 22319', status: 'ACTIVE' },
                  { name: 'Gokul K', role: 'Senior Service Technician', branch: 'Salem Depot', phone: '+91 97880 33412', status: 'ACTIVE' },
                  { name: 'Vijay Anand', role: 'Water Treatment Specialist', branch: 'Coimbatore Hub', phone: '+91 94421 99014', status: 'ACTIVE' },
                  { name: 'Suresh Kumar', role: 'Field Service Technician', branch: 'Tiruppur Store', phone: '+91 96290 88219', status: 'ACTIVE' },
                  { name: 'Karthik N', role: 'Key Account Executive', branch: 'Chennai Office', phone: '+91 93601 28994', status: 'ACTIVE' },
                ].map((user) => (
                  <tr key={user.name} className="hover:bg-surface-secondary/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text-primary">{user.name}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{user.role}</td>
                    <td className="py-2.5 px-3 text-text-secondary font-medium">{user.branch}</td>
                    <td className="py-2.5 px-3 font-mono text-2xs text-text-muted">{user.phone}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success" size="sm">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => showToast(`Editing permissions for ${user.name}`)}
                      >
                        Edit Access
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ROLES */}
      {activeSubTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              role: 'Executive Super Admin',
              desc: 'Full operational control across financials, inventory, user invitations, and pricing.',
              users: 2,
              caps: ['Billing & Invoices', 'ERP Master Config', 'All Branches Visibility'],
            },
            {
              role: 'Field Service Engineer',
              desc: 'Mobile-first operational permissions for customer visits, OTP verification, and job completion reports.',
              users: 4,
              caps: ['View Assigned Jobs', 'Enter Customer OTP', 'Van Stock Deductions', 'Upload Work Photos'],
            },
            {
              role: 'Sales Representative',
              desc: 'CRM access for website leads, quotation generation, site survey logging, and contract creation.',
              users: 3,
              caps: ['Lead Pipeline Management', 'Issue Price Quotes', 'Customer Onboarding'],
            },
          ].map((r) => (
            <div
              key={r.role}
              className="bg-white border border-surface-border rounded-xs p-4 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">{r.role}</h3>
                <Badge variant="neutral" size="sm">{r.users} users</Badge>
              </div>
              <p className="text-text-muted text-2xs">{r.desc}</p>
              <div className="pt-2 border-t border-surface-border space-y-1.5">
                <span className="text-2xs font-semibold uppercase text-text-muted tracking-wider">Permissions</span>
                {r.caps.map((c) => (
                  <div key={c} className="flex items-center gap-1.5 text-2xs text-text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="bg-white border border-surface-border rounded-xs p-5 space-y-6 text-xs max-w-2xl">
          {/* Website hook */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-action" />
              <h3 className="font-semibold text-text-primary">Website Lead Ingestion Webhook</h3>
            </div>
            <p className="text-2xs text-text-muted">
              Inbound enquiries from public website (aakashaquatech.com) automatically parse product model, location, and phone number into CRM leads.
            </p>
            <div className="p-2.5 bg-surface-secondary font-mono text-2xs rounded-xs border border-surface-border text-text-primary select-all">
              https://api.aakashaquatech.com/v1/webhooks/inbound-lead-sync
            </div>
          </div>

          {/* OTP Policy */}
          <div className="space-y-2 pt-4 border-t border-surface-border">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-action" />
              <h3 className="font-semibold text-text-primary">Field Service Security OTP Policy</h3>
            </div>
            <p className="text-2xs text-text-muted">
              Ensures engineers cannot mark jobs started or finished without physical customer presence.
            </p>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-xs text-brand-action accent-brand-action" />
                <span className="font-medium text-text-primary">
                  Enforce 4-digit SMS OTP prior to service authorization
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-xs text-brand-action accent-brand-action" />
                <span className="font-medium text-text-primary">
                  Require site photo upload before job completion
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-surface-border rounded-xs p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-text-primary">
              Immutable Operations Audit Trail
            </h3>
            <span className="text-2xs text-text-muted font-mono">Real-time log capture</span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '11:42 AM', actor: 'Arun Field Eng', action: 'Verified customer OTP 4821 on mobile web for Job #SR-1024 (Ravi Kumar site).' },
              { time: '11:05 AM', actor: 'Arun Sales', action: 'Completed technical survey call for Lead LD-2048 (Commercial RO 500 LPH).' },
              { time: '10:32 AM', actor: 'Website Webhook', action: 'Captured inbound Get a Quote form from /products/commercial-ro.' },
              { time: '09:15 AM', actor: 'Finance Admin', action: 'Recorded partial payment ₹30,000 for Invoice INV-2026-1042.' },
              { time: 'Yesterday', actor: 'Meena R', action: 'Emailed quotation QT-2026-141 (₹1,85,000) to Priya Foods procurement.' },
            ].map((log, i) => (
              <div key={i} className="p-2.5 bg-surface-secondary/70 rounded-xs border border-surface-border flex items-start gap-3">
                <span className="font-mono text-2xs text-text-muted shrink-0 mt-0.5">{log.time}</span>
                <div className="flex-1">
                  <span className="font-semibold text-text-primary">{log.actor}</span>
                  <p className="text-text-secondary mt-0.5">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
