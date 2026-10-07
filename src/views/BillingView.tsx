import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Calendar,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatINR } from '../utils/formatters';
import { Invoice } from '../types';

export const BillingView: React.FC = () => {
  const {
    invoices,
    openCreateDrawer,
    markInvoicePaid,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (inv) =>
        searchQuery === '' ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  const totalRevenue = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Financial Operations / GST Invoicing"
        title="Billing & Tax Invoices"
        subtitle="Manage GST-compliant invoices, payment status, receipts, and outstanding collections"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast('Exported GSTR-1 Sales Register')}
            >
              Export GSTR-1
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('invoice')}
            >
              New Invoice
            </Button>
          </div>
        }
      />

      {/* Financial Overview Strip (Trustworthy, Professional, Clear) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E2E8F0] p-3.5 rounded-sm shadow-subtle text-xs">
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Gross Billed Revenue</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {formatINR(totalRevenue)}
          </div>
          <span className="text-2xs text-[#475569]">All fiscal invoices</span>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Total Collected</span>
          <div className="text-base font-bold text-[#16A34A] mt-0.5 tabular-nums">
            {formatINR(totalCollected)}
          </div>
          <span className="text-2xs text-[#16A34A] font-semibold">
            {Math.round((totalCollected / totalRevenue) * 100)}% realization
          </span>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Outstanding Balance</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {formatINR(totalOutstanding)}
          </div>
          <span className="text-2xs text-[#475569]">Current cycle balance</span>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#DC2626] uppercase">Overdue Collections</span>
          <div className="text-base font-bold text-[#DC2626] mt-0.5 tabular-nums">
            {formatINR(totalOverdue)}
          </div>
          <span className="text-2xs text-[#DC2626] font-semibold">Action required</span>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-sm shadow-subtle overflow-hidden">
        <div className="p-2.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
          <div className="relative min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice number, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="text-2xs text-[#475569] font-medium">
            {filteredInvoices.length} fiscal documents
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Customer Profile</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0369A1]">
                    {inv.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#0F172A] group-hover:text-[#0369A1]">
                    {inv.customerName}
                  </td>
                  <td className="py-2.5 px-3 text-[#475569] font-mono text-2xs">{inv.date}</td>
                  <td className="py-2.5 px-3 text-[#475569] font-mono text-2xs">{inv.dueDate}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#0F172A] tabular-nums">
                    {formatINR(inv.totalAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#16A34A] tabular-nums">
                    {formatINR(inv.paidAmount)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                      inv.balanceDue > 0 ? 'text-[#DC2626]' : 'text-[#94A3B8]'
                    }`}
                  >
                    {formatINR(inv.balanceDue)}
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant={
                        inv.status === 'PAID'
                          ? 'success'
                          : inv.status === 'OVERDUE'
                          ? 'danger'
                          : inv.status === 'PARTIAL'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'PAID' && (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => markInvoicePaid(inv.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        View Tax Doc
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Tax Invoice Financial Document Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="TAX INVOICE (GST REGULATED)"
        subtitle="Aakash Aqua Tech · Water Treatment Systems & Engineering"
        maxWidth="xl"
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs font-sans">
            {/* Header / Brand & Invoice Meta */}
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <div className="font-bold text-sm text-[#0F172A]">AAKASH AQUA TECH</div>
                <div className="text-2xs text-[#475569] mt-0.5">
                  Civil Aerodrome Post, Peelamedu, Coimbatore - 641014
                </div>
                <div className="text-2xs font-mono text-[#475569]">
                  GSTIN: 33AABCA8912J1Z3 · PAN: AABCA8912J
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-[#0369A1]">
                  {selectedInvoice.id}
                </div>
                <div className="text-2xs text-[#475569] mt-0.5">Date: {selectedInvoice.date}</div>
                <div className="text-2xs text-[#475569]">Payment Due: {selectedInvoice.dueDate}</div>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="bg-[#F8FAFC] p-3 rounded-xs border border-[#E2E8F0]">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Billed To
              </span>
              <div className="font-bold text-[#0F172A] mt-0.5">{selectedInvoice.customerName}</div>
              <div className="text-2xs text-[#475569] mt-0.5">
                Place of Supply: Tamil Nadu (Code 33)
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-[#E2E8F0] rounded-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] text-2xs uppercase border-b border-[#E2E8F0] font-bold">
                    <th className="p-2">Description of Goods / Service</th>
                    <th className="p-2 font-mono">HSN/SAC</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">GST</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium text-[#0F172A]">{item.description}</td>
                      <td className="p-2 font-mono text-[#475569]">{item.hsnCode}</td>
                      <td className="p-2 text-right font-medium text-[#0F172A]">{item.qty}</td>
                      <td className="p-2 text-right text-[#475569]">{formatINR(item.rate)}</td>
                      <td className="p-2 text-right text-[#475569]">{item.gstRate}%</td>
                      <td className="p-2 text-right font-bold text-[#0F172A]">
                        {formatINR(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal, GST, Total Calculation */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5 text-xs text-[#475569]">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span className="font-medium text-[#0F172A] tabular-nums">
                    {formatINR(selectedInvoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IGST / CGST+SGST (18%):</span>
                  <span className="font-medium text-[#0F172A] tabular-nums">
                    {formatINR(selectedInvoice.gstAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-1 font-bold text-[#0F172A] text-sm">
                  <span>Total Payable:</span>
                  <span className="tabular-nums">{formatINR(selectedInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[#16A34A] font-semibold pt-0.5">
                  <span>Amount Credited:</span>
                  <span className="tabular-nums">{formatINR(selectedInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-[#DC2626] font-bold border-t border-[#E2E8F0] pt-1">
                  <span>Balance Due:</span>
                  <span className="tabular-nums">{formatINR(selectedInvoice.balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
              <div className="text-2xs text-[#94A3B8] font-mono">
                Digitally generated by Aakash Aqua Tech CRM
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5 text-[#475569]" />}
                  onClick={() => showToast('Printing invoice document')}
                >
                  Print PDF
                </Button>
                {selectedInvoice.balanceDue > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      markInvoicePaid(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                  >
                    Record Full Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
