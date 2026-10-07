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
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';

export const ManagementView: React.FC = () => {
  const { currentTab, setCurrentTab, showToast, theme, setTheme } = useApp();

  const [activeSubTab, setActiveSubTab] = useState(
    currentTab === 'roles' ? 'roles' : currentTab === 'settings' ? 'settings' : currentTab === 'audit' ? 'audit' : 'team'
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Enterprise Administration"
        title="Organization, Security & System Logs"
        subtitle="Manage access control, branch assignments, appearance preferences, website webhooks, and compliance audits"
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
      <div className="bg-white dark:bg-[#0B1322] border border-[#E2E8F0] dark:border-[#1E2E48] p-2 rounded-md">
        <Tabs
          variant="pills"
          tabs={[
            { id: 'team', label: 'Team Members & Engineers' },
            { id: 'roles', label: 'Roles & Access Control' },
            { id: 'settings', label: 'Settings & Appearance' },
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
        <div className="bg-white dark:bg-[#0B1322] border border-[#E2E8F0] dark:border-[#1E2E48] rounded-md overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-[#0F1A2E] border-b border-[#E2E8F0] dark:border-[#1E2E48] text-[#475569] dark:text-[#94A3B8] font-semibold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Staff Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Branch / Territory</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E2E48]">
                {[
                  { name: 'Arunachalam S.', role: 'Operations Director', branch: 'All Branches (TN)', phone: '+91 98421 11000', email: 'admin@aakashaqua.com', status: 'ACTIVE' },
                  { name: 'Senthil Nathan', role: 'Regional Service Head', branch: 'Salem Depot', phone: '+91 98422 22000', email: 'service@aakashaqua.com', status: 'ACTIVE' },
                  { name: 'Arun Field Eng', role: 'Senior Field Tech', branch: 'Coimbatore Hub', phone: '+91 98421 82910', email: 'arun.tech@aakashaqua.com', status: 'ON_FIELD' },
                  { name: 'Karthik Raja', role: 'Field Service Specialist', branch: 'Salem Depot', phone: '+91 94432 99120', email: 'karthik@aakashaqua.com', status: 'AVAILABLE' },
                  { name: 'Meena R.', role: 'Commercial Sales Lead', branch: 'Tiruppur Store', phone: '+91 98423 33000', email: 'meena@aakashaqua.com', status: 'ACTIVE' },
                ].map((member) => (
                  <tr key={member.email} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111C30] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0F172A] dark:text-white">{member.name}</div>
                      <div className="text-2xs text-[#64748B] dark:text-[#94A3B8]">{member.email}</div>
                    </td>
                    <td className="py-3 px-3 text-[#475569] dark:text-slate-200">{member.role}</td>
                    <td className="py-3 px-3 text-[#475569] dark:text-slate-200">{member.branch}</td>
                    <td className="py-3 px-3 text-[#475569] dark:text-[#94A3B8] font-mono text-2xs">{member.phone}</td>
                    <td className="py-3 px-3">
                      <Badge variant={member.status === 'ACTIVE' || member.status === 'AVAILABLE' ? 'success' : 'aqua'} size="sm">
                        {member.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="outline" size="xs" onClick={() => showToast(`Edit permissions for ${member.name}`)}>
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
              role: 'Operations Director (Admin)',
              desc: 'Complete control over multi-branch routing, customer records, financial invoicing, and system settings.',
              users: 2,
              caps: ['All Module Access', 'Financial Override', 'User Provisioning', 'Audit Inspection'],
            },
            {
              role: 'Field Service Engineer',
              desc: 'Dedicated mobile web access for customer OTP verification, service checklist execution, and job completion.',
              users: 6,
              caps: ['View Assigned Jobs', 'Enter Customer OTP', 'Van Stock Deductions', 'Upload Work Photos'],
            },
            {
              role: 'Commercial Sales Specialist',
              desc: 'CRM access for website leads, quotation generation, site survey logging, and contract creation.',
              users: 3,
              caps: ['Lead Pipeline Management', 'Issue Price Quotes', 'Customer Onboarding'],
            },
          ].map((r) => (
            <div
              key={r.role}
              className="bg-white dark:bg-[#0B1322] border border-[#E2E8F0] dark:border-[#1E2E48] rounded-md p-4 space-y-3 text-xs shadow-subtle"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0F172A] dark:text-white">{r.role}</h3>
                <Badge variant="neutral" size="sm">{r.users} users</Badge>
              </div>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-2xs">{r.desc}</p>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E2E48] space-y-1.5">
                <span className="text-2xs font-semibold uppercase text-[#64748B] dark:text-[#94A3B8] tracking-wider">Capabilities</span>
                {r.caps.map((c) => (
                  <div key={c} className="flex items-center gap-1.5 text-2xs text-[#475569] dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: SETTINGS & APPEARANCE */}
      {activeSubTab === 'settings' && (
        <div className="bg-white dark:bg-[#0B1322] border border-[#E2E8F0] dark:border-[#1E2E48] rounded-md p-5 space-y-6 text-xs max-w-2xl shadow-subtle">
          {/* THEME PREFERENCE SELECTOR (LIGHT / DARK / SYSTEM) */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                Platform Appearance & Theme
              </h3>
              <p className="text-2xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Customize your visual display mode across dashboard, tables, dispatch maps, and engineer views.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  showToast('Light theme activated', 'info');
                }}
                className={`p-3 rounded-md border text-left flex flex-col justify-between transition-all ${
                  theme === 'light'
                    ? 'border-[#0369A1] bg-[#F0F9FF] dark:bg-[#075985]/20 ring-2 ring-[#0369A1]/30'
                    : 'border-[#E2E8F0] dark:border-[#1E2E48] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-[#0369A1]' : 'text-amber-500'}`} />
                  {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#0369A1]" />}
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-xs text-[#0F172A] dark:text-white">Light</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Clean white surfaces</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  showToast('Dark theme activated', 'info');
                }}
                className={`p-3 rounded-md border text-left flex flex-col justify-between transition-all ${
                  theme === 'dark'
                    ? 'border-[#0369A1] bg-[#0F1A2E] ring-2 ring-[#0369A1]/40'
                    : 'border-[#E2E8F0] dark:border-[#1E2E48] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-sky-400' : 'text-slate-400'}`} />
                  {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-xs text-[#0F172A] dark:text-white">Dark</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Deep charcoal & navy</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  showToast('System preference followed', 'info');
                }}
                className={`p-3 rounded-md border text-left flex flex-col justify-between transition-all ${
                  theme === 'system'
                    ? 'border-[#0369A1] bg-[#F0F9FF] dark:bg-[#075985]/20 ring-2 ring-[#0369A1]/30'
                    : 'border-[#E2E8F0] dark:border-[#1E2E48] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Laptop className={`w-5 h-5 ${theme === 'system' ? 'text-[#0369A1] dark:text-cyan-400' : 'text-slate-400'}`} />
                  {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />}
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-xs text-[#0F172A] dark:text-white">System</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Match OS settings</div>
                </div>
              </button>
            </div>
          </div>

          {/* Website hook */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2E48]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />
              <h3 className="font-semibold text-[#0F172A] dark:text-white">Website Lead Ingestion Webhook</h3>
            </div>
            <p className="text-2xs text-[#64748B] dark:text-[#94A3B8]">
              Inbound enquiries from public website (aakashaquatech.com) automatically parse product model, location, and phone number into CRM leads.
            </p>
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#111C30] font-mono text-2xs rounded border border-[#E2E8F0] dark:border-[#1E2E48] text-[#0F172A] dark:text-white select-all">
              https://api.aakashaquatech.com/v1/webhooks/inbound-lead-sync
            </div>
          </div>

          {/* OTP Policy */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2E48]">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />
              <h3 className="font-semibold text-[#0F172A] dark:text-white">Field Service Security OTP Policy</h3>
            </div>
            <p className="text-2xs text-[#64748B] dark:text-[#94A3B8]">
              Ensures engineers cannot mark jobs started or finished without physical customer presence.
            </p>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0369A1] accent-[#0369A1]" />
                <span className="font-medium text-[#0F172A] dark:text-slate-200">
                  Enforce 4-digit SMS OTP prior to service authorization
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0369A1] accent-[#0369A1]" />
                <span className="font-medium text-[#0F172A] dark:text-slate-200">
                  Require site photo upload before job completion
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-white dark:bg-[#0B1322] border border-[#E2E8F0] dark:border-[#1E2E48] rounded-md p-4 space-y-3 text-xs shadow-subtle">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#1E2E48]">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#0F172A] dark:text-white">
              Immutable Operations Audit Trail
            </h3>
            <span className="text-2xs text-[#64748B] dark:text-[#94A3B8] font-mono">Real-time log capture</span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '11:42 AM', actor: 'Arun Field Eng', action: 'Verified customer OTP 4821 on mobile web for Job #SR-1024 (Ravi Kumar site).' },
              { time: '11:05 AM', actor: 'Arun Sales', action: 'Completed technical survey call for Lead LD-2048 (Commercial RO 500 LPH).' },
              { time: '10:32 AM', actor: 'Website Webhook', action: 'Captured inbound Get a Quote form from /products/commercial-ro.' },
              { time: '09:15 AM', actor: 'Finance Admin', action: 'Recorded partial payment ₹30,000 for Invoice INV-2026-1042.' },
              { time: 'Yesterday', actor: 'Meena R', action: 'Emailed quotation QT-2026-141 (₹1,85,000) to Priya Foods procurement.' },
            ].map((log, i) => (
              <div key={i} className="p-2.5 bg-[#F8FAFC] dark:bg-[#111C30] rounded border border-[#E2E8F0] dark:border-[#1E2E48] flex items-start gap-3">
                <span className="font-mono text-2xs text-[#64748B] dark:text-[#94A3B8] shrink-0 mt-0.5">{log.time}</span>
                <div className="flex-1">
                  <span className="font-semibold text-[#0F172A] dark:text-white">{log.actor}</span>
                  <p className="text-[#475569] dark:text-[#94A3B8] mt-0.5">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
