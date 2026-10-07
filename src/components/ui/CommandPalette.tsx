import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, User, Wrench, FileText, Package, Briefcase, PhoneCall, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    leads,
    customers,
    services,
    invoices,
    inventory,
    engineers,
    setSelectedLeadId,
    setSelectedCustomerId,
    setSelectedServiceId,
    setSelectedInvoiceId,
    setCurrentTab,
  } = useApp();

  const [query, setQuery] = useState('');

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        leads: leads.slice(0, 3),
        customers: customers.slice(0, 3),
        services: services.slice(0, 2),
        invoices: invoices.slice(0, 2),
        inventory: inventory.slice(0, 2),
        engineers: engineers.slice(0, 2),
      };
    }

    return {
      leads: leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.requirement.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      ),
      customers: customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      ),
      services: services.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.product.toLowerCase().includes(q) ||
          s.engineerName.toLowerCase().includes(q)
      ),
      invoices: invoices.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q)
      ),
      inventory: inventory.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ),
      engineers: engineers.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.branch.toLowerCase().includes(q)
      ),
    };
  }, [query, leads, customers, services, invoices, inventory, engineers]);

  if (!isCommandPaletteOpen) return null;

  const totalResults =
    searchResults.leads.length +
    searchResults.customers.length +
    searchResults.services.length +
    searchResults.invoices.length +
    searchResults.inventory.length +
    searchResults.engineers.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center pt-16 px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#0B172A]/40 backdrop-blur-none transition-opacity"
          onClick={() => setCommandPaletteOpen(false)}
        />

        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-sm bg-white border border-[#E2E8F0] shadow-modal text-left">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E8F0] bg-white">
            <Search className="w-5 h-5 text-[#94A3B8] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads, customers, services, invoices, inventory, engineers..."
              className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
            />
            <span className="text-2xs font-mono font-medium text-[#94A3B8] border border-[#E2E8F0] px-1.5 py-0.5 rounded-xs shrink-0">
              ESC
            </span>
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results list */}
          <div className="max-h-[420px] overflow-y-auto p-2 divide-y divide-[#E2E8F0]">
            {totalResults === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-[#0F172A]">No matching records found</p>
                <p className="text-xs text-[#475569] mt-1">
                  Try searching with customer name, product SKU, service ID or location.
                </p>
              </div>
            )}

            {/* Leads */}
            {searchResults.leads.length > 0 && (
              <div className="py-2">
                <div className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Leads ({searchResults.leads.length})
                </div>
                {searchResults.leads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setCurrentTab('leads');
                      setSelectedLeadId(l.id);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xs hover:bg-[#F1F5F9] group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 bg-[#F1F5F9] text-[#0369A1] rounded-xs">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0369A1] truncate">
                          {l.name} <span className="font-normal text-[#475569]">· {l.company}</span>
                        </div>
                        <div className="text-2xs text-[#475569] truncate">
                          {l.requirement} · {l.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-2xs text-[#475569]">
                      <span className="font-semibold text-[#0F172A]">{formatINR(l.dealValue)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Customers */}
            {searchResults.customers.length > 0 && (
              <div className="py-2">
                <div className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Customers ({searchResults.customers.length})
                </div>
                {searchResults.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setCurrentTab('customers');
                      setSelectedCustomerId(c.id);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xs hover:bg-[#F1F5F9] group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 bg-[#F1F5F9] text-[#0891B2] rounded-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0369A1] truncate">
                          {c.name} <span className="font-normal text-[#475569]">({c.id})</span>
                        </div>
                        <div className="text-2xs text-[#475569] truncate">
                          {c.company} · {c.location}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Service Operations */}
            {searchResults.services.length > 0 && (
              <div className="py-2">
                <div className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Service Operations ({searchResults.services.length})
                </div>
                {searchResults.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setCurrentTab('service');
                      setSelectedServiceId(s.id);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xs hover:bg-[#F1F5F9] group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 bg-[#F1F5F9] text-[#2563EB] rounded-xs">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0369A1] truncate">
                          {s.id} · {s.customerName}
                        </div>
                        <div className="text-2xs text-[#475569] truncate">
                          {s.product} · Status: {s.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Invoices */}
            {searchResults.invoices.length > 0 && (
              <div className="py-2">
                <div className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Invoices ({searchResults.invoices.length})
                </div>
                {searchResults.invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setCurrentTab('billing');
                      setSelectedInvoiceId(inv.id);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xs hover:bg-[#F1F5F9] group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 bg-[#F1F5F9] text-[#16A34A] rounded-xs">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0369A1] truncate">
                          {inv.id} · {inv.customerName}
                        </div>
                        <div className="text-2xs text-[#475569] truncate">
                          Due: {inv.dueDate} · Status: {inv.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {formatINR(inv.totalAmount)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Inventory Products */}
            {searchResults.inventory.length > 0 && (
              <div className="py-2">
                <div className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Products & Inventory ({searchResults.inventory.length})
                </div>
                {searchResults.inventory.map((item) => (
                  <button
                    key={item.sku}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setCurrentTab('inventory');
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xs hover:bg-[#F1F5F9] group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 bg-[#F1F5F9] text-[#475569] rounded-xs">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0369A1] truncate">
                          {item.name}
                        </div>
                        <div className="text-2xs text-[#475569] truncate">
                          SKU: {item.sku} · {item.warehouse}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xs font-medium text-[#475569]">
                      Stock: <span className="font-bold text-[#0F172A]">{item.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-2xs text-[#94A3B8]">
            <span>Navigation: ↑ ↓ to navigate · Enter to select</span>
            <span>Aakash Aqua Tech Enterprise SaaS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
