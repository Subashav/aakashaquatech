import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  List,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Truck,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ServiceDetailDrawer } from './ServiceDetailDrawer';
import { ServiceStatus, ServicePriority } from '../types';

export const ServiceView: React.FC = () => {
  const {
    services,
    setSelectedServiceId,
    openCreateDrawer,
    updateServiceStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'list'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.engineerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [services, searchQuery, statusFilter]);

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

  const statusCounts = {
    total: services.length,
    new: services.filter((s) => s.status === 'NEW').length,
    assigned: services.filter((s) => s.status === 'ASSIGNED').length,
    onTheWay: services.filter((s) => s.status === 'ON_THE_WAY').length,
    inProgress: services.filter((s) => s.status === 'IN_PROGRESS' || s.status === 'OTP_VERIFIED').length,
    completed: services.filter((s) => s.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Field Service Operations / Dispatch"
        title="Service Management & Operations Control"
        subtitle="Manage technician assignments, travel tracking, customer OTP validation, and field reports"
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-[#E2E8F0] rounded-sm p-0.5 shadow-subtle">
              <button
                type="button"
                onClick={() => setActiveTab('today')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors ${
                  activeTab === 'today'
                    ? 'bg-[#F1F5F9] text-[#0369A1]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Today's Dispatch
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors ${
                  activeTab === 'calendar'
                    ? 'bg-[#F1F5F9] text-[#0369A1]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Calendar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors ${
                  activeTab === 'list'
                    ? 'bg-[#F1F5F9] text-[#0369A1]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Master List
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('service')}
            >
              New Service Job
            </Button>
          </div>
        }
      />

      {/* Operations Dispatch Status Strip (75% Neutral, color only for clear business states) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-white border border-[#E2E8F0] p-2.5 rounded-sm shadow-subtle text-xs">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'ALL'
              ? 'bg-[#F1F5F9] border-[#0369A1]/30 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#475569] font-semibold uppercase">Total Jobs</span>
          <div className="text-lg font-bold text-[#0F172A] mt-0.5">{statusCounts.total}</div>
        </button>

        <button
          onClick={() => setStatusFilter('NEW')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'NEW'
              ? 'bg-[#F1F5F9] border-[#D97706]/40 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#D97706] font-semibold uppercase">Unassigned</span>
          <div className="text-lg font-bold text-[#D97706] mt-0.5">{statusCounts.new}</div>
        </button>

        <button
          onClick={() => setStatusFilter('ASSIGNED')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'ASSIGNED'
              ? 'bg-[#F1F5F9] border-[#2563EB]/40 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#2563EB] font-semibold uppercase">Assigned</span>
          <div className="text-lg font-bold text-[#2563EB] mt-0.5">{statusCounts.assigned}</div>
        </button>

        <button
          onClick={() => setStatusFilter('ON_THE_WAY')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'ON_THE_WAY'
              ? 'bg-[#F1F5F9] border-[#0891B2]/40 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#0891B2] font-semibold uppercase">En Route</span>
          <div className="text-lg font-bold text-[#0891B2] mt-0.5">{statusCounts.onTheWay}</div>
        </button>

        <button
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'IN_PROGRESS'
              ? 'bg-[#F1F5F9] border-[#2563EB]/40 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#2563EB] font-semibold uppercase">In Progress</span>
          <div className="text-lg font-bold text-[#2563EB] mt-0.5">{statusCounts.inProgress}</div>
        </button>

        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`p-2 rounded-xs text-left transition-colors border ${
            statusFilter === 'COMPLETED'
              ? 'bg-[#F1F5F9] border-[#16A34A]/40 font-bold'
              : 'border-transparent hover:bg-[#F8FAFC]'
          }`}
        >
          <span className="text-2xs text-[#16A34A] font-semibold uppercase">Completed</span>
          <div className="text-lg font-bold text-[#16A34A] mt-0.5">{statusCounts.completed}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm p-2.5 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search service by customer, product, engineer, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-[#E2E8F0] rounded-sm focus:outline-none text-[#0F172A] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Unassigned)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ON_THE_WAY">On The Way</option>
            <option value="ARRIVED">Arrived</option>
            <option value="OTP_VERIFIED">OTP Verified</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="text-2xs text-[#475569] font-medium">
          {filteredServices.length} service requests
        </div>
      </div>

      {/* Content depending on active tab */}
      {activeTab !== 'calendar' ? (
        <div className="bg-white border border-[#E2E8F0] rounded-sm shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Service ID</th>
                  <th className="py-2.5 px-3">Customer & Location</th>
                  <th className="py-2.5 px-3">Equipment</th>
                  <th className="py-2.5 px-3">Reported Problem</th>
                  <th className="py-2.5 px-3">Engineer</th>
                  <th className="py-2.5 px-3">Schedule</th>
                  <th className="py-2.5 px-3">Customer OTP</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredServices.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedServiceId(job.id)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0369A1]">
                      #{job.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#0F172A] group-hover:text-[#0369A1]">
                        {job.customerName}
                      </div>
                      <div className="text-2xs text-[#475569]">{job.location}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#0F172A]">{job.product}</td>
                    <td className="py-2.5 px-3 text-[#475569] max-w-xs truncate">
                      {job.problem}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 font-medium text-[#0F172A]">
                        <UserCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{job.engineerName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#475569] font-mono text-2xs">
                      {job.scheduledTime}
                    </td>
                    <td className="py-2.5 px-3">
                      {job.status === 'OTP_VERIFIED' ||
                      job.status === 'IN_PROGRESS' ||
                      job.status === 'COMPLETED' ? (
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
                        onClick={() => setSelectedServiceId(job.id)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-2xs text-[#475569]">
            <span>Showing all operational dispatch tasks for current cycle</span>
            <span className="font-mono text-[#94A3B8]">Real-time GPS & OTP sync enabled</span>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-4 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Service Operations Schedule (October 2026)
            </h3>
            <span className="text-2xs text-[#475569] font-mono">Week 41 · 4 Active Dispatches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { day: 'Mon, 05 Oct', jobs: services.filter((s) => s.status === 'COMPLETED') },
              { day: 'Tue, 06 Oct (Today)', jobs: services.filter((s) => s.status !== 'COMPLETED' && s.id !== 'SR-1027') },
              { day: 'Wed, 07 Oct', jobs: services.filter((s) => s.id === 'SR-1027') },
              { day: 'Thu, 08 Oct', jobs: [] },
              { day: 'Fri, 09 Oct', jobs: [] },
            ].map((col) => (
              <div key={col.day} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs p-2.5 min-h-[300px]">
                <div className="font-bold text-xs text-[#0F172A] pb-2 mb-2 border-b border-[#E2E8F0]">
                  {col.day}
                </div>
                <div className="space-y-2">
                  {col.jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedServiceId(job.id)}
                      className="p-2 bg-white border border-[#E2E8F0] rounded-xs shadow-subtle cursor-pointer hover:border-[#0369A1] transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-mono font-bold text-[#0369A1]">#{job.id}</span>
                        <span className="text-[#475569]">{job.scheduledTime.split(',')[1] || job.scheduledTime}</span>
                      </div>
                      <div className="font-bold text-[#0F172A] mt-1 truncate">{job.customerName}</div>
                      <div className="text-2xs text-[#475569] truncate">{job.product}</div>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                        <Badge variant={getStatusBadgeVariant(job.status)} size="sm">
                          {job.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {col.jobs.length === 0 && (
                    <div className="py-8 text-center text-2xs text-[#94A3B8]">
                      No scheduled visits
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Detail Drawer */}
      <ServiceDetailDrawer />
    </div>
  );
};
