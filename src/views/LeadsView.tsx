import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  LayoutList,
  Kanban,
  ArrowUpDown,
  Phone,
  Calendar,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { Lead, LeadStage } from '../types';
import { formatINR } from '../utils/formatters';

export const LeadsView: React.FC = () => {
  const {
    leads,
    setSelectedLeadId,
    updateLeadStage,
    openCreateDrawer,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const stages: { key: LeadStage; label: string }[] = [
    { key: 'NEW', label: 'New' },
    { key: 'CONTACTED', label: 'Contacted' },
    { key: 'QUALIFIED', label: 'Qualified' },
    { key: 'SITE_VISIT', label: 'Site Visit' },
    { key: 'QUOTATION', label: 'Quotation' },
    { key: 'NEGOTIATION', label: 'Negotiation' },
    { key: 'WON', label: 'Won' },
    { key: 'LOST', label: 'Lost' },
  ];

  // Filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === '' ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = stageFilter === 'ALL' || lead.stage === stageFilter;
      const matchesOwner = ownerFilter === 'ALL' || lead.owner === ownerFilter;

      return matchesSearch && matchesStage && matchesOwner;
    });
  }, [leads, searchQuery, stageFilter, ownerFilter]);

  // Stage badges helper
  const getStageBadgeVariant = (stage: LeadStage) => {
    switch (stage) {
      case 'WON':
        return 'success';
      case 'LOST':
        return 'danger';
      case 'NEGOTIATION':
        return 'warning';
      case 'QUOTATION':
        return 'brand';
      case 'QUALIFIED':
        return 'aqua';
      case 'SITE_VISIT':
      case 'CONTACTED':
      case 'NEW':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const exportCSV = () => {
    const headers = 'ID,Name,Company,Phone,Requirement,Deal Value,Owner,Stage,Location\n';
    const rows = filteredLeads
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.company}","${l.phone}","${l.requirement}","${l.dealValue}","${l.owner}","${l.stage}","${l.location}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aakash-aqua-leads-${Date.now()}.csv`;
    a.click();
    showToast('Exported leads dataset to CSV', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="CRM / Pipeline Management"
        title="Leads & Deal Flow"
        subtitle="Manage website enquiries, quotations, site surveys, and opportunity conversions"
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-[#E2E8F0] rounded-sm p-0.5 shadow-subtle">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#F1F5F9] text-[#0369A1] font-bold'
                    : 'text-[#94A3B8] hover:text-[#0F172A]'
                }`}
                title="Table View"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-[#F1F5F9] text-[#0369A1] font-bold'
                    : 'text-[#94A3B8] hover:text-[#0F172A]'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-[#475569]" />}
              onClick={exportCSV}
            >
              Export CSV
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('lead')}
            >
              New Lead
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm p-2.5 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search leads, requirement, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Stage Dropdown Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-[#E2E8F0] rounded-sm focus:outline-none text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Stages</option>
            {stages.map((st) => (
              <option key={st.key} value={st.key}>
                {st.label}
              </option>
            ))}
          </select>

          {/* Owner Dropdown Filter */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-[#E2E8F0] rounded-sm focus:outline-none text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Sales Owners</option>
            <option value="Arun Sales">Arun Sales</option>
            <option value="Meena R">Meena R</option>
            <option value="Karthik N">Karthik N</option>
          </select>

          {/* Saved View Quick Tags */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0] text-2xs">
            <span className="text-[#94A3B8]">Quick:</span>
            <button
              onClick={() => {
                setStageFilter('NEW');
                setSearchQuery('');
              }}
              className="px-2 py-0.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xs border border-[#E2E8F0] text-[#0F172A] transition-colors"
            >
              New Only
            </button>
            <button
              onClick={() => {
                setStageFilter('QUOTATION');
                setSearchQuery('');
              }}
              className="px-2 py-0.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xs border border-[#E2E8F0] text-[#0F172A] transition-colors"
            >
              Quoted Deals
            </button>
            <button
              onClick={() => {
                setStageFilter('ALL');
                setOwnerFilter('ALL');
                setSearchQuery('');
              }}
              className="px-2 py-0.5 text-[#475569] hover:text-[#0F172A]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Selected count info & columns */}
        <div className="flex items-center gap-3 shrink-0 text-[#475569] text-2xs">
          {selectedLeadIds.length > 0 && (
            <span className="bg-[#F1F5F9] text-[#0369A1] px-2 py-1 rounded-xs border border-[#0369A1]/30 font-semibold">
              {selectedLeadIds.length} selected
            </span>
          )}
          <span>{filteredLeads.length} total records</span>
        </div>
      </div>

      {/* View Mode 1: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E2E8F0] rounded-sm shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3 w-8">
                    <button onClick={toggleSelectAll} className="p-0.5 text-[#475569]">
                      {selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#0369A1]" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3">Lead ID & Contact</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Product Requirement</th>
                  <th className="py-2.5 px-3">Source Channel</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3 text-right">Deal Value</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer group ${
                        isChecked ? 'bg-[#F1F5F9]' : ''
                      }`}
                    >
                      <td
                        className="py-2.5 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectLead(lead.id);
                        }}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#0369A1]" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-[#CBD5E1]" />
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#0F172A] group-hover:text-[#0369A1]">
                          {lead.name}
                        </div>
                        <div className="text-2xs text-[#475569] flex items-center gap-1 font-mono">
                          <span className="text-[#0369A1] font-semibold">{lead.id}</span>
                          <span>·</span>
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#0F172A]">{lead.company}</div>
                        <div className="text-2xs text-[#475569]">{lead.location}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#475569] max-w-xs truncate">
                        {lead.requirement}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="neutral" size="sm">
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-[#475569] font-medium">
                        {lead.owner}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#0F172A] tabular-nums">
                        {formatINR(lead.dealValue)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={getStageBadgeVariant(lead.stage)} size="sm">
                          {lead.stage.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-2xs text-[#475569] font-mono">
                        {lead.nextFollowUp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Dense Pagination */}
          <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-2xs text-[#475569]">
            <div>
              Showing <span className="font-bold text-[#0F172A]">1-{filteredLeads.length}</span> of{' '}
              <span className="font-bold text-[#0F172A]">{filteredLeads.length}</span> records
            </div>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 text-[#CBD5E1] disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium px-2 py-0.5 bg-white border border-[#E2E8F0] rounded-xs text-[#0F172A]">
                Page 1 of 1
              </span>
              <button disabled className="p-1 text-[#CBD5E1] disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Kanban Pipeline View (Subtle indicators, not a rainbow, clean neutral surfaces) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2.5 overflow-x-auto pb-4">
          {stages.map((st) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === st.key);
            const stageValue = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);

            // Subtle indicator color mapping according to brand direction
            const stageIndicatorColor = {
              NEW: 'bg-[#2563EB]',
              CONTACTED: 'bg-[#2563EB]',
              QUALIFIED: 'bg-[#0891B2]',
              SITE_VISIT: 'bg-[#2563EB]',
              QUOTATION: 'bg-[#0369A1]',
              NEGOTIATION: 'bg-[#D97706]',
              WON: 'bg-[#16A34A]',
              LOST: 'bg-[#DC2626]',
            }[st.key];

            return (
              <div
                key={st.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedLeadId) {
                    updateLeadStage(draggedLeadId, st.key);
                    setDraggedLeadId(null);
                  }
                }}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm p-2 min-h-[460px] flex flex-col min-w-[200px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${stageIndicatorColor}`} />
                    <span className="text-2xs font-bold uppercase text-[#0F172A]">
                      {st.label}
                    </span>
                    <span className="text-2xs font-semibold px-1.5 py-0.2 rounded-xs bg-white border border-[#E2E8F0] text-[#475569]">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-2xs font-mono font-medium text-[#475569] tabular-nums">
                    {stageValue > 0 ? formatINR(stageValue) : '₹0'}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2 flex-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDraggedLeadId(lead.id)}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="bg-white border border-[#E2E8F0] hover:border-[#0369A1] p-2.5 rounded-sm shadow-subtle cursor-grab active:cursor-grabbing hover:shadow-dropdown transition-all group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-2xs font-mono font-bold text-[#0369A1]">
                          #{lead.id}
                        </span>
                        <span className="text-2xs font-bold text-[#0F172A] tabular-nums">
                          {formatINR(lead.dealValue)}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#0369A1] transition-colors line-clamp-1">
                        {lead.name}
                      </div>
                      <div className="text-2xs text-[#475569] truncate mb-1.5">
                        {lead.company} · {lead.location}
                      </div>

                      <div className="text-2xs text-[#475569] bg-[#F1F5F9] p-1.5 rounded-xs border border-[#E2E8F0] line-clamp-1 mb-1.5">
                        {lead.requirement}
                      </div>

                      <div className="flex items-center justify-between text-2xs pt-1 border-t border-[#E2E8F0] text-[#94A3B8]">
                        <span className="truncate text-[#475569] font-medium">{lead.owner.split(' ')[0]}</span>
                        <span className="text-2xs font-mono text-[#475569] truncate">
                          {lead.nextFollowUp.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center border border-dashed border-[#CBD5E1] rounded-sm text-2xs text-[#94A3B8]">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Slide-over Detail Drawer */}
      <LeadDetailDrawer />
    </div>
  );
};
