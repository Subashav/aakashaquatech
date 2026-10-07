import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  Building,
  User,
  Clock,
  Send,
  Plus,
  FileText,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { formatINR } from '../utils/formatters';
import { LeadStage } from '../types';

export const LeadDetailDrawer: React.FC = () => {
  const {
    selectedLead,
    setSelectedLeadId,
    updateLeadStage,
    createCustomer,
    showToast,
    openCreateDrawer,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');

  if (!selectedLead) return null;

  const handleConvertToCustomer = () => {
    createCustomer({
      name: selectedLead.name,
      company: selectedLead.company,
      phone: selectedLead.phone,
      email: selectedLead.email,
      location: selectedLead.location,
      address: selectedLead.address,
      type: 'Commercial',
    });
    updateLeadStage(selectedLead.id, 'WON');
    showToast(`Lead converted to Active Customer record!`, 'success');
  };

  const stages: LeadStage[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE_VISIT',
    'QUOTATION',
    'NEGOTIATION',
    'WON',
  ];

  return (
    <Drawer
      isOpen={!!selectedLead}
      onClose={() => setSelectedLeadId(null)}
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#0369A1] font-semibold">#{selectedLead.id}</span>
          <span className="text-[#0F172A] font-bold">{selectedLead.name}</span>
          <span className="text-[#475569] font-normal text-xs">({selectedLead.company})</span>
        </div>
      }
      subtitle={`${selectedLead.requirement} · ${selectedLead.location}`}
      width="2xl"
      actions={
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            icon={<Phone className="w-3.5 h-3.5 text-[#475569]" />}
            onClick={() => showToast(`Initiating outbound call to ${selectedLead.phone}`)}
          >
            Call
          </Button>
          <Button
            variant="outline"
            size="xs"
            icon={<MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />}
            onClick={() => showToast(`Opening WhatsApp template for ${selectedLead.phone}`)}
          >
            WhatsApp
          </Button>
          <Button
            variant="secondary"
            size="xs"
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#475569]" />}
            onClick={() => openCreateDrawer('quote')}
          >
            Create Quote
          </Button>
          <Button
            variant="primary"
            size="xs"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={handleConvertToCustomer}
          >
            Convert
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Stage Progression Stepper Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-3 shadow-subtle">
          <div className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
            CRM Stage Progression
          </div>
          <div className="grid grid-cols-7 gap-1">
            {stages.map((st, idx) => {
              const currentIdx = stages.indexOf(selectedLead.stage);
              const isPast = idx < currentIdx;
              const isCurrent = st === selectedLead.stage;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateLeadStage(selectedLead.id, st)}
                  className={`py-1.5 px-1 text-center rounded-xs transition-colors text-2xs font-semibold truncate ${
                    isCurrent
                      ? 'bg-[#0369A1] text-white shadow-subtle'
                      : isPast
                      ? 'bg-[#F1F5F9] text-[#16A34A] border border-[#16A34A]/30'
                      : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead High-Level Header Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white border border-[#E2E8F0] p-3.5 rounded-sm shadow-subtle text-xs">
          <div>
            <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Deal Value</span>
            <div className="text-base font-bold text-[#0F172A] mt-0.5 tabular-nums">
              {formatINR(selectedLead.dealValue)}
            </div>
          </div>
          <div>
            <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Sales Owner</span>
            <div className="font-semibold text-[#0F172A] mt-0.5">{selectedLead.owner}</div>
          </div>
          <div>
            <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Lead Source</span>
            <div className="mt-0.5">
              <Badge variant="neutral" size="sm">
                {selectedLead.source}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Next Follow-up</span>
            <div className="font-semibold text-[#0F172A] mt-0.5">{selectedLead.nextFollowUp}</div>
          </div>
        </div>

        {/* Tabs: Overview, Activity, Calls, Tasks, Notes, Quotes, Documents */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-4 shadow-subtle">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'activity', label: 'Activity Timeline', count: selectedLead.timeline.length },
              { id: 'calls', label: 'Call Log', count: 2 },
              { id: 'tasks', label: 'Tasks & Follow-up', count: 1 },
              { id: 'notes', label: 'Notes', count: selectedLead.notes.length },
              { id: 'quotes', label: 'Quotations', count: 1 },
              { id: 'documents', label: 'Survey Documents' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="mt-4">
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Website Source Attribution Card */}
                {selectedLead.websitePage && (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm">
                    <div className="flex items-center gap-2 text-2xs font-bold text-[#0369A1] uppercase tracking-wider mb-1">
                      <Globe className="w-3.5 h-3.5 text-[#0369A1]" />
                      <span>Inbound Website Attribution</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs text-[#475569]">
                      <div>
                        Landing Page: <strong className="font-mono text-[#0F172A]">{selectedLead.websitePage}</strong>
                      </div>
                      <div>
                        Form Captured: <strong className="text-[#0F172A]">{selectedLead.websiteForm}</strong>
                      </div>
                      <div>
                        IP Geolocation: <strong className="text-[#0F172A]">{selectedLead.location}, India</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lead Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-2xs text-[#94A3B8] font-bold uppercase">Requirement Scope</span>
                      <p className="font-medium text-[#0F172A] mt-0.5">{selectedLead.requirement}</p>
                    </div>
                    <div>
                      <span className="text-2xs text-[#94A3B8] font-bold uppercase">Site Address</span>
                      <p className="text-[#475569] mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mt-0.5" />
                        <span>{selectedLead.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-2xs text-[#94A3B8] font-bold uppercase">Contact Information</span>
                      <div className="mt-1 space-y-1 text-[#475569]">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{selectedLead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{selectedLead.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Internal Field Notes */}
                <div className="pt-3 border-t border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-bold uppercase">Field Survey Notes</span>
                  <div className="mt-2 space-y-2">
                    {selectedLead.notes.map((note, i) => (
                      <div key={i} className="p-2.5 bg-[#F8FAFC] rounded-xs text-[#0F172A] border border-[#E2E8F0]">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                  {selectedLead.timeline.map((ev) => (
                    <div key={ev.id} className="relative group">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#0369A1] ring-4 ring-white" />
                      <div className="flex items-center justify-between text-2xs mb-0.5">
                        <span className="font-bold text-[#0F172A]">{ev.title}</span>
                        <span className="text-[#94A3B8] font-mono">
                          {ev.date} · {ev.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569]">{ev.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-2xs text-[#94A3B8]">
                        <span>Actor: {ev.actor}</span>
                        {ev.badge && (
                          <Badge variant="neutral" size="sm">
                            {ev.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'calls' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">Survey Follow-up Call (Outbound)</span>
                    <span className="text-2xs text-[#94A3B8]">06 Oct, 11:05 AM (04m 32s)</span>
                  </div>
                  <p className="text-[#475569] mt-1">
                    Confirmed raw borewell TDS reading. Customer agreed to Commercial RO 500 LPH with automatic sand filter skid.
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">Initial Inbound Callback</span>
                    <span className="text-2xs text-[#94A3B8]">05 Oct, 10:14 AM (02m 18s)</span>
                  </div>
                  <p className="text-[#475569] mt-1">
                    Contacted Ravi Kumar regarding website quotation submission. Scheduled technical visit.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal CRM memo..."
                    className="flex-1 h-8 px-2.5 text-xs border border-[#E2E8F0] rounded-xs focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!newNote.trim()) return;
                      selectedLead.notes.push(newNote);
                      setNewNote('');
                      showToast('Note added to CRM record', 'success');
                    }}
                  >
                    Post Note
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedLead.notes.map((note, i) => (
                    <div key={i} className="p-2.5 bg-[#F8FAFC] text-xs rounded-xs border border-[#E2E8F0] text-[#0F172A]">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#0F172A]">QT-2026-140 (Commercial RO 500 LPH)</div>
                    <div className="text-2xs text-[#475569] mt-0.5">
                      Issued: 05 Oct 2026 · Valid for 15 days · 18% GST Applicable
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#0F172A] tabular-nums">{formatINR(selectedLead.dealValue)}</div>
                    <Badge variant="brand" size="sm">Under Review</Badge>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded-xs text-[#0369A1] focus:ring-[#0369A1]" />
                    <div>
                      <div className="font-semibold text-[#0F172A]">Conduct on-site raw water hardness test</div>
                      <div className="text-2xs text-[#475569]">Due: Tomorrow, 10:30 AM · Assigned to Arun Sales</div>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-[#0F172A]">Raw_Water_TDS_Analysis_Report.pdf</span>
                  </div>
                  <Button variant="outline" size="xs">View</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
