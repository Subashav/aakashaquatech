import React, { useState } from 'react';
import {
  Phone,
  Navigation,
  CheckCircle2,
  KeyRound,
  Wrench,
  Camera,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
  Truck,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ServiceJob, ServiceStatus } from '../types';
import { formatINR } from '../utils/formatters';

export const EngineerMobileView: React.FC = () => {
  const {
    services,
    updateServiceStatus,
    verifyServiceOtp,
    completeServiceJob,
    showToast,
    setEngineerMobileMode,
  } = useApp();

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [workSummaryText, setWorkSummaryText] = useState('');
  const [selectedPart, setSelectedPart] = useState('SP-RO-100');

  // Arun's jobs
  const engineerJobs = services.filter((s) => s.engineerId === 'ENG-01' || s.engineerName.includes('Arun'));
  const activeJob = services.find((s) => s.id === activeJobId) || null;

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto advance focus
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (!activeJob) return;
    const entered = otpCode.join('');
    const ok = verifyServiceOtp(activeJob.id, entered || activeJob.otp);
    if (ok) {
      setOtpCode(['', '', '', '']);
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'OTP_VERIFIED':
        return <Badge variant="success">OTP Verified</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">In Progress</Badge>;
      case 'ARRIVED':
        return <Badge variant="info">Arrived on Site</Badge>;
      case 'ON_THE_WAY':
        return <Badge variant="aqua">En Route</Badge>;
      default:
        return <Badge variant="warning">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F9FC] dark:bg-[#070C15] text-[#0F172A] dark:text-[#F8FAFC] border-x border-[#E2E8F0] dark:border-[#1E2E48] shadow-modal flex flex-col font-sans">
      {/* Top Mobile Brand Bar */}
      <div className="bg-[#0B172A] dark:bg-[#060B14] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-subtle border-b border-[#132A43] dark:border-[#1E2E48]">
        <div className="flex items-center gap-2">
          {activeJob && (
            <button
              onClick={() => setActiveJobId(null)}
              className="p-1 text-[#CBD5E1] hover:text-white mr-1 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="text-xs font-bold tracking-tight">Aakash Aqua Tech</div>
            <div className="text-2xs text-[#0891B2] uppercase tracking-widest font-mono">
              Field Technician App
            </div>
          </div>
        </div>

        <button
          onClick={() => setEngineerMobileMode(false)}
          className="text-2xs font-semibold px-2 py-1 bg-[#132A43] hover:bg-[#1E3A5F] text-[#CBD5E1] rounded-xs transition-colors"
        >
          Exit Mobile
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3.5 space-y-4 pb-20">
        {!activeJob ? (
          /* Engineer Home Screen */
          <div className="space-y-4">
            {/* Engineer Greeting & Today's Duty Info */}
            <div className="bg-white p-4 rounded-sm border border-[#E2E8F0] shadow-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-base font-bold text-[#0F172A]">Good Morning, Arun</h1>
                  <p className="text-2xs text-[#475569] mt-0.5">
                    Coimbatore Hub · Tuesday, 06 Oct 2026
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#0369A1] font-bold text-xs flex items-center justify-center border border-[#E2E8F0]">
                  AR
                </div>
              </div>

              {/* Mobile Metric Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E2E8F0] text-center text-xs">
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#475569] font-semibold">Assigned</span>
                  <div className="font-bold text-[#0F172A] text-sm mt-0.5">3 Jobs</div>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#0369A1] font-semibold">In Progress</span>
                  <div className="font-bold text-[#0369A1] text-sm mt-0.5">1 Job</div>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#16A34A] font-semibold">Completed</span>
                  <div className="font-bold text-[#16A34A] text-sm mt-0.5">2 Jobs</div>
                </div>
              </div>
            </div>

            {/* Today's Jobs List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-2xs px-1 text-[#475569] font-bold uppercase tracking-wider">
                <span>Today's Dispatched Calls ({engineerJobs.length})</span>
                <span>Sorted by Time</span>
              </div>

              {engineerJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-3.5 rounded-sm border border-[#E2E8F0] shadow-subtle space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0369A1] text-xs">
                          #{job.id}
                        </span>
                        <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-xs bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {job.scheduledTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A] mt-1">{job.customerName}</h3>
                      <div className="text-2xs text-[#475569] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#94A3B8] shrink-0" />
                        <span>{job.address}</span>
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  <div className="p-2 bg-[#F8FAFC] rounded-xs border border-[#E2E8F0] text-xs text-[#0F172A]">
                    <span className="text-2xs font-bold text-[#475569] block uppercase">
                      Equipment & Issue:
                    </span>
                    <span className="font-semibold">{job.product}</span> — {job.problem}
                  </div>

                  {/* High touch-target action buttons (Call, Navigate, Open Job) */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => showToast(`Calling ${job.phone}`)}
                      className="h-10 flex items-center justify-center gap-1.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs rounded-sm border border-[#CBD5E1] active:scale-95 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#475569]" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => showToast(`Opening Google Maps navigation to ${job.location}`)}
                      className="h-10 flex items-center justify-center gap-1.5 bg-white hover:bg-[#F8FAFC] text-[#0891B2] font-semibold text-xs rounded-sm border border-[#CBD5E1] active:scale-95 transition-all"
                    >
                      <Navigation className="w-4 h-4 text-[#0891B2]" />
                      <span>Navigate</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveJobId(job.id);
                        setDiagnosisText(job.diagnosis || '');
                        setWorkSummaryText(job.workPerformed || '');
                      }}
                      className="h-10 flex items-center justify-center gap-1.5 bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-xs rounded-sm active:scale-95 transition-all"
                    >
                      <span>Open Job</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Job Execution Flow */
          <div className="space-y-4">
            {/* Header info */}
            <div className="bg-white p-3.5 rounded-sm border border-[#E2E8F0] shadow-subtle">
              <div className="flex items-center justify-between text-2xs text-[#475569] mb-1">
                <span className="font-mono font-bold text-[#0369A1] text-xs">#{activeJob.id}</span>
                {getStatusBadge(activeJob.status)}
              </div>
              <h2 className="text-sm font-bold text-[#0F172A]">{activeJob.customerName}</h2>
              <div className="text-2xs text-[#475569] mt-0.5">{activeJob.product}</div>
              <div className="text-xs text-[#0F172A] bg-[#F8FAFC] p-2.5 rounded-xs border border-[#E2E8F0] mt-2">
                <strong className="text-[#475569]">Complaint:</strong> {activeJob.problem}
              </div>
            </div>

            {/* Stepper Status Progression Buttons (Large Touch Targets for 1-hand use) */}
            <div className="bg-white p-4 rounded-sm border border-[#E2E8F0] shadow-subtle space-y-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Technician Workflow Action
              </span>

              {activeJob.status === 'ASSIGNED' && (
                <button
                  onClick={() => updateServiceStatus(activeJob.id, 'ON_THE_WAY')}
                  className="w-full h-12 bg-[#0369A1] hover:bg-[#075985] active:scale-[0.99] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 shadow-subtle transition-all"
                >
                  <Truck className="w-5 h-5" />
                  <span>Start Travel to Site</span>
                </button>
              )}

              {activeJob.status === 'ON_THE_WAY' && (
                <button
                  onClick={() => updateServiceStatus(activeJob.id, 'ARRIVED')}
                  className="w-full h-12 bg-[#0891B2] hover:bg-[#0e7490] active:scale-[0.99] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 shadow-subtle transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Mark Arrived on Site</span>
                </button>
              )}

              {/* OTP Verification Gate */}
              {activeJob.status === 'ARRIVED' && (
                <div className="p-3.5 bg-[#F8FAFC] border border-[#D97706]/40 rounded-sm space-y-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D97706]">
                      <KeyRound className="w-4 h-4 text-[#D97706]" />
                      <span>Enter Customer Verification OTP</span>
                    </div>
                    <p className="text-2xs text-[#475569] mt-0.5">
                      Ask customer for the 4-digit SMS OTP code (Demo Code: <strong className="text-[#0F172A]">{activeJob.otp}</strong>)
                    </p>
                  </div>

                  {/* 4 large OTP digit inputs */}
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        type="text"
                        maxLength={1}
                        value={otpCode[idx]}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        className="h-14 text-center font-mono font-bold text-xl bg-white border border-[#D97706] rounded-sm focus:ring-2 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A]"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    className="w-full h-11 bg-[#0369A1] hover:bg-[#075985] text-white font-bold text-xs rounded-sm shadow-subtle transition-colors"
                  >
                    Authenticate & Authorize Service
                  </button>
                </div>
              )}

              {activeJob.status === 'OTP_VERIFIED' && (
                <button
                  onClick={() => updateServiceStatus(activeJob.id, 'IN_PROGRESS')}
                  className="w-full h-12 bg-[#0369A1] hover:bg-[#075985] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 shadow-subtle transition-colors"
                >
                  <Wrench className="w-5 h-5" />
                  <span>Start Service Work</span>
                </button>
              )}

              {/* IN PROGRESS: Field Report, Parts & Completion */}
              {(activeJob.status === 'IN_PROGRESS' || activeJob.status === 'OTP_VERIFIED') && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Technical Diagnosis
                    </label>
                    <textarea
                      rows={2}
                      value={diagnosisText}
                      onChange={(e) => setDiagnosisText(e.target.value)}
                      placeholder="e.g. Silt buildup in 5-micron pre-filter vessel..."
                      className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Work Performed Summary
                    </label>
                    <textarea
                      rows={2}
                      value={workSummaryText}
                      onChange={(e) => setWorkSummaryText(e.target.value)}
                      placeholder="e.g. Replaced cartridges, flushed skid, restored flow..."
                      className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                    />
                  </div>

                  {/* Add Parts */}
                  <div className="p-3 bg-[#F8FAFC] rounded-sm border border-[#E2E8F0] space-y-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-[#475569]">
                      Add Spare Parts Used
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={selectedPart}
                        onChange={(e) => setSelectedPart(e.target.value)}
                        className="flex-1 h-9 px-2 text-xs bg-white border border-[#E2E8F0] rounded-sm focus:outline-none text-[#0F172A]"
                      >
                        <option value="SP-RO-100">RO Membrane 100 GPD (₹1,600)</option>
                        <option value="SP-FLT-SET">Spun Filter 20" Jumbo (₹450)</option>
                        <option value="SP-UV-CH">UV Sterilizer 12 GPM (₹8,500)</option>
                      </select>
                      <button
                        onClick={() => showToast('Part deducted from van stock', 'success')}
                        className="h-9 px-3 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#0F172A] font-bold text-xs rounded-sm shrink-0 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Photo Upload trigger */}
                  <button
                    onClick={() => showToast('Camera triggered: Photo uploaded', 'info')}
                    className="w-full h-11 border border-dashed border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] rounded-sm flex items-center justify-center gap-2 text-xs font-semibold text-[#475569] transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#94A3B8]" />
                    <span>Upload Site Inspection Photos</span>
                  </button>

                  {/* Complete Service */}
                  <button
                    onClick={() => {
                      completeServiceJob(
                        activeJob.id,
                        diagnosisText || 'Replaced filters and flushed system.',
                        workSummaryText || 'Pressure checked and verified.'
                      );
                    }}
                    className="w-full h-12 bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.99] text-white font-bold text-sm rounded-sm flex items-center justify-center gap-2 shadow-subtle transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submit & Complete Service</span>
                  </button>
                </div>
              )}

              {activeJob.status === 'COMPLETED' && (
                <div className="p-4 bg-[#F8FAFC] border border-[#16A34A]/30 rounded-sm text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
                  <div className="font-bold text-[#16A34A] text-sm">Job Completed & Signed</div>
                  <p className="text-2xs text-[#475569]">
                    Customer confirmation and time stamp logged.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveJobId(null)}
                  >
                    Back to Job List
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
