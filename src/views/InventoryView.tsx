import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  History,
  TrendingDown,
  Warehouse,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatINR } from '../utils/formatters';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    movements,
    openCreateDrawer,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSku, setSelectedSku] = useState<string | null>(inventory[0]?.sku || null);

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const selectedItem = inventory.find((i) => i.sku === selectedSku) || inventory[0];
  const itemMovements = movements.filter((m) => m.sku === selectedItem?.sku);

  const totalValue = inventory.reduce((acc, i) => acc + i.stock * i.unitPrice, 0);
  const lowStockCount = inventory.filter((i) => i.status !== 'HEALTHY').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <PageHeader
        breadcrumb="Operations / Warehouse Management"
        title="Inventory & Spare Parts Control"
        subtitle="Manage water treatment membranes, filter sets, chemicals, pumps, and field consumption"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-text-muted" />}
              onClick={() => showToast('Stock manifest exported')}
            >
              Export Manifest
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              onClick={() => openCreateDrawer('product')}
            >
              Add Inventory SKU
            </Button>
          </div>
        }
      />

      {/* Inventory Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#E2E8F0] p-3 rounded-sm shadow-subtle text-xs">
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Total Inventory Items</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5">{inventory.length} Stock Units</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Total Valuation</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5 tabular-nums">
            {formatINR(totalValue)}
          </div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#DC2626] uppercase">Low Stock Alerts</span>
          <div className="text-base font-bold text-[#DC2626] mt-0.5">{lowStockCount} Re-orders Due</div>
        </div>
        <div>
          <span className="text-2xs font-semibold text-[#94A3B8] uppercase">Active Warehouses</span>
          <div className="text-base font-bold text-[#0F172A] mt-0.5">3 Tamil Nadu Hubs</div>
        </div>
      </div>

      {/* Main Area: Split layout (Left: Stock Table, Right: Stock Ledger & Item Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Main Inventory Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle overflow-hidden flex flex-col">
          <div className="p-2.5 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by SKU, product name, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm focus:ring-1 focus:ring-[#0369A1] focus:border-[#0369A1] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
            <span className="text-2xs text-[#475569] font-mono shrink-0">
              {filteredInventory.length} SKUs
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider text-2xs">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU & Category</th>
                  <th className="py-2.5 px-3 text-right">Available</th>
                  <th className="py-2.5 px-3 text-right">Min Stock</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredInventory.map((item) => (
                  <tr
                    key={item.sku}
                    onClick={() => setSelectedSku(item.sku)}
                    className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer group ${
                      selectedSku === item.sku ? 'bg-[#F1F5F9]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#0F172A] group-hover:text-[#0369A1]">
                        {item.name}
                      </div>
                      <div className="text-2xs text-[#475569]">{item.warehouse}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-[#0369A1] font-semibold">{item.sku}</div>
                      <div className="text-2xs text-[#475569]">{item.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0F172A] tabular-nums">
                      {item.stock}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#475569] tabular-nums">
                      {item.minStock}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-[#0F172A] tabular-nums">
                      {formatINR(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          item.status === 'HEALTHY'
                            ? 'success'
                            : item.status === 'OUT_OF_STOCK'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected SKU Detail & Movement Transaction Ledger (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-sm shadow-subtle p-4 space-y-4">
          {selectedItem && (
            <>
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
                <div>
                  <span className="text-2xs font-mono font-bold text-[#0369A1]">
                    {selectedItem.sku}
                  </span>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-0.5">{selectedItem.name}</h3>
                  <div className="text-2xs text-[#475569] mt-0.5">
                    {selectedItem.category} · {selectedItem.warehouse}
                  </div>
                </div>
                <Badge
                  variant={
                    selectedItem.status === 'HEALTHY'
                      ? 'success'
                      : selectedItem.status === 'OUT_OF_STOCK'
                      ? 'danger'
                      : 'warning'
                  }
                  size="md"
                >
                  {selectedItem.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Stock KPI row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Stock Level</span>
                  <div className="font-bold text-[#0F172A] text-sm mt-0.5">{selectedItem.stock}</div>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Min Alert</span>
                  <div className="font-bold text-[#0F172A] text-sm mt-0.5">{selectedItem.minStock}</div>
                </div>
                <div className="bg-[#F8FAFC] p-2 rounded-xs border border-[#E2E8F0]">
                  <span className="text-2xs text-[#94A3B8] font-semibold uppercase">Unit Value</span>
                  <div className="font-bold text-[#0F172A] text-sm mt-0.5 tabular-nums">
                    {formatINR(selectedItem.unitPrice)}
                  </div>
                </div>
              </div>

              {/* Stock Movement Transaction Ledger */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Stock Transaction History</span>
                  </div>
                  <span>Movement Ledger</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {itemMovements.length > 0 ? (
                    itemMovements.map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-2xs">
                          <span
                            className={`font-bold ${
                              m.quantity > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}
                          >
                            {m.quantity > 0 ? `+${m.quantity}` : m.quantity} Units
                          </span>
                          <span className="text-[#94A3B8] font-mono">{m.date}</span>
                        </div>
                        <div className="font-medium text-[#0F172A]">{m.reference}</div>
                        <div className="text-2xs text-[#475569]">{m.warehouse}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center border border-dashed border-[#CBD5E1] rounded-xs text-2xs text-[#94A3B8]">
                      Initial intake record. No further consumptions.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
