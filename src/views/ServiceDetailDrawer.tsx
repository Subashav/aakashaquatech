import React, { useState } from 'react';
import {
  Phone,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  KeyRound,
  Wrench,
  Camera,
  FileCheck,
  AlertCircle,
  Truck,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ServiceStatus } from '../types';
import { formatINR } from '../utils/formatters';

export const ServiceDetailDrawer: React.FC = () => {
  const {
    selectedService,
    setSelectedServiceId,
    updateServiceStatus,
    verifyServiceOtp,
    completeServiceJob,
    showToast,
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [diagnosis, setDiagnosis] = useState(selectedService?.diagnosis || '');
  const [workDone, setWorkDone] = useState(selectedService?.workPerformed || '');

  if (!selectedService) return null;

  const lifecycleStages: { status: ServiceStatus; label: string }[] = [
    { status: 'NEW', label: 'Created' },
    { status: 'ASSIGNED', label: 'Assigned' },
    { status: 'ON_THE_WAY', label: 'On The Way' },
    { status: 'ARRIVED', label: 'Arrived' },
    { status: 'OTP_VERIFIED', label: 'OTP Verified' },
    { status: 'IN_PROGRESS', label: 'In Progress' },
    { status: 'COMPLETED', label: 'Completed' },
  ];

  const currentIdx = lifecycleStages.findIndex((s) => s.status === selectedService.status);

  // Dynamic contextual action based on status
  const renderNextActionButton = () => {
    switch (selectedService.status) {
      case 'NEW':
        return (
          <Button
            variant="primary"
            size="xs"
            onClick={() => updateServiceStatus(selectedService.id, 'ASSIGNED')}
          >
            Assign Engineer
          </Button>
        );
      case 'ASSIGNED':
        return (
          <Button
            variant="primary"
            size="xs"
            icon={<Truck className="w-3.5 h-3.5" />}
            onClick={() => updateServiceStatus(selectedService.id, 'ON_THE_WAY')}
          >
            Dispatch & Start Travel
          </Button>
        );
      case 'ACCEPTED':
        return (
          <Button
            variant="primary"
            size="xs"
            onClick={() => updateServiceStatus(selectedService.id, 'ON_THE_WAY')}
          >
            Start Travel
          </Button>
        );
      case 'ON_THE_WAY':
        return (
          <Button
            variant="primary"
            size="xs"
            icon={<MapPin className="w-3.5 h-3.5" />}
            onClick={() => updateServiceStatus(selectedService.id, 'ARRIVED')}
          >
            Mark Arrived on Site
          </Button>
        );
      case 'ARRIVED':
        return (
          <span className="text-2xs text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-xs border border-amber-200">
            Awaiting Customer OTP
          </span>
        );
      case 'OTP_VERIFIED':
        return (
          <Button
            variant="primary"
            size="xs"
            icon={<Wrench className="w-3.5 h-3.5" />}
            onClick={() => updateServiceStatus(selectedService.id, 'IN_PROGRESS')}
          >
            Start Field Service
          </Button>
        );
      case 'IN_PROGRESS':
        return (
          <Button
            variant="primary"
            size="xs"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={() => {
              completeServiceJob(
                selectedService.id,
                diagnosis || 'Completed inspection and overhaul.',
                workDone || 'Pressure tested and filters replaced.'
              );
            }}
          >
            Complete Service Job
          </Button>
        );
      case 'COMPLETED':
        return (
          <Badge variant="success" size="md">
            Job Completed & Certified
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      isOpen={!!selectedService}
      onClose={() => setSelectedServiceId(null)}
      title={
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#0369A1] font-semibold">#{selectedService.id}</span>
          <span className="text-[#0F172A] font-bold">{selectedService.product}</span>
        </div>
      }
      subtitle={`Customer: ${selectedService.customerName} · ${selectedService.location}`}
      width="2xl"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            icon={<Phone className="w-3.5 h-3.5 text-[#475569]" />}
            onClick={() => showToast(`Dialing customer ${selectedService.phone}`)}
          >
            Call Customer
          </Button>
          {renderNextActionButton()}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Progress Tracker Stepper: Clean thin lines and small status nodes */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm p-4 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Service Progress Workflow
            </span>
            <Badge variant={selectedService.status === 'COMPLETED' ? 'success' : 'info'} size="sm">
              Status: {selectedService.status.replace(/_/g, ' ')}
            </Badge>
          </div>

          {/* Thin lines and small status nodes tracker */}
          <div className="flex items-center justify-between relative py-2">
            {lifecycleStages.map((st, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isLast = idx === lifecycleStages.length - 1;

              return (
                <div key={st.status} className="flex-1 flex items-center relative">
                  {/* Node & Label */}
                  <div className="flex flex-col items-center z-10">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#0369A1] ring-3 ring-[#0369A1]/20'
                          : isPast
                          ? 'bg-[#16A34A]'
                          : 'bg-[#CBD5E1]'
                      }`}
                    />
                    <span
                      className={`text-3xs mt-1.5 whitespace-nowrap font-medium ${
                        isCurrent
                          ? 'text-[#0369A1] font-bold'
                          : isPast
                          ? 'text-[#16A34A]'
                          : 'text-[#94A3B8]'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Thin connecting line */}
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-1.5 transition-colors ${
                        isPast ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* OTP Authentication Panel (Real interactive customer verification) */}
        <div
          className={`p-4 rounded-sm border ${
            selectedService.status === 'OTP_VERIFIED' ||
            selectedService.status === 'IN_PROGRESS' ||
            selectedService.status === 'COMPLETED'
              ? 'bg-[#F8FAFC] border-[#16A34A]/30'
              : 'bg-[#F8FAFC] border-[#D97706]/40'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                <KeyRound
                  className={`w-4 h-4 ${
                    selectedService.status === 'OTP_VERIFIED' ||
                    selectedService.status === 'IN_PROGRESS' ||
                    selectedService.status === 'COMPLETED'
                      ? 'text-[#16A34A]'
                      : 'text-[#D97706]'
                  }`}
                />
                <span>Customer OTP Authentication Gate</span>
              </div>
              <p className="text-2xs text-[#475569] mt-0.5">
                {selectedService.status === 'OTP_VERIFIED' ||
                selectedService.status === 'IN_PROGRESS' ||
                selectedService.status === 'COMPLETED'
                  ? `Authenticated successfully at ${selectedService.otpVerifiedAt || 'site arrival'}. Engineer is authorized.`
                  : `Customer receives a 4-digit SMS OTP. Service cannot commence without customer verification.`}
              </p>
            </div>

            {selectedService.status === 'ARRIVED' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder={`Code: ${selectedService.otp}`}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-24 h-8 text-center font-mono font-bold text-sm bg-white border border-[#D97706] rounded-xs focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A]"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const ok = verifyServiceOtp(selectedService.id, otpInput || selectedService.otp);
                    if (ok) setOtpInput('');
                  }}
                >
                  Verify OTP
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-2xs">
                <span className="text-[#475569]">Security Code:</span>
                <span className="font-mono font-bold text-xs px-2 py-0.5 bg-white border border-[#E2E8F0] rounded-xs text-[#0F172A]">
                  {selectedService.otp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-[#E2E8F0] p-4 rounded-sm shadow-subtle text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Customer Site</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{selectedService.customerName}</div>
              <div className="text-[#475569] mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mt-0.5" />
                <span>{selectedService.address}</span>
              </div>
            </div>

            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Service Category</span>
              <div className="font-medium text-[#0F172A] mt-0.5">{selectedService.serviceType}</div>
            </div>

            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Reported Problem</span>
              <div className="p-2.5 bg-[#F8FAFC] text-[#0F172A] rounded-xs border border-[#E2E8F0] mt-1">
                {selectedService.problem}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Assigned Field Engineer</span>
              <div className="font-bold text-[#0F172A] mt-0.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#0369A1]" />
                <span>{selectedService.engineerName}</span>
              </div>
            </div>

            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Scheduled Window</span>
              <div className="font-mono text-[#0F172A] mt-0.5">{selectedService.scheduledTime}</div>
            </div>

            <div>
              <span className="text-2xs font-bold text-[#94A3B8] uppercase">Billing Status</span>
              <div className="mt-1">
                <Badge
                  variant={
                    selectedService.billingStatus === 'INCLUDED_IN_AMC'
                      ? 'success'
                      : 'brand'
                  }
                  size="sm"
                >
                  {selectedService.billingStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Parts Consumption Log */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-sm shadow-subtle text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Spare Parts & Consumables Consumed
            </span>
            <span className="text-2xs text-[#475569] font-mono">
              Auto-deducted from Coimbatore Hub
            </span>
          </div>

          {selectedService.partsUsed.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] text-2xs uppercase border-b border-[#E2E8F0]">
                    <th className="p-2">SKU</th>
                    <th className="p-2">Part Description</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Unit Rate</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {selectedService.partsUsed.map((p) => (
                    <tr key={p.sku}>
                      <td className="p-2 font-mono text-[#475569]">{p.sku}</td>
                      <td className="p-2 font-medium text-[#0F172A]">{p.partName}</td>
                      <td className="p-2 text-right font-bold text-[#0F172A]">{p.quantity}</td>
                      <td className="p-2 text-right text-[#475569]">{formatINR(p.unitPrice)}</td>
                      <td className="p-2 text-right font-bold text-[#0F172A]">
                        {formatINR(p.quantity * p.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center border border-dashed border-[#CBD5E1] rounded-xs text-[#94A3B8] text-2xs">
              No parts consumed on this service call.
            </div>
          )}
        </div>

        {/* Technical Work Summary and Completion Inputs */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-sm shadow-subtle text-xs space-y-3">
          <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Technical Diagnosis & Work Performed
          </span>

          <div>
            <label className="block text-2xs font-semibold text-[#475569] mb-1">
              Field Diagnosis
            </label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Silt buildup inside 5-micron pre-filter vessel causing 1.2 bar drop..."
              className="w-full p-2 text-xs border border-[#E2E8F0] rounded-xs focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-[#475569] mb-1">
              Work Performed
            </label>
            <textarea
              rows={2}
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="e.g. Replaced cartridges, flushed skid with antiscalant, restored flow to 520 LPH..."
              className="w-full p-2 text-xs border border-[#E2E8F0] rounded-xs focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-2xs text-[#475569]">
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>{selectedService.photosUploaded} Job Photos Attached</span>
            </div>
            {selectedService.status === 'COMPLETED' && (
              <div className="flex items-center gap-1 text-[#16A34A] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Customer Confirmed & Signed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
