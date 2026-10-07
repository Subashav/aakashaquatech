import React, { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { useApp, CreateRecordType } from '../../context/AppContext';
import { Briefcase, User, Wrench, FileSpreadsheet, FileText, Package, ShieldCheck } from 'lucide-react';

export const GlobalCreateDrawer: React.FC = () => {
  const {
    isCreateDrawerOpen,
    closeCreateDrawer,
    createType,
    openCreateDrawer,
    createLead,
    createCustomer,
    createServiceJob,
    createInvoice,
    createInventoryItem,
    createAMC,
    customers,
  } = useApp();

  // Form states
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createType === 'lead') {
      createLead(formData);
    } else if (createType === 'customer') {
      createCustomer(formData);
    } else if (createType === 'service') {
      createServiceJob(formData);
    } else if (createType === 'invoice') {
      createInvoice(formData);
    } else if (createType === 'product') {
      createInventoryItem(formData);
    } else if (createType === 'amc') {
      createAMC(formData);
    } else if (createType === 'quote') {
      createLead({ ...formData, stage: 'QUOTATION' });
    }
    setFormData({});
  };

  const navItems: { type: CreateRecordType; label: string; icon: React.ReactNode }[] = [
    { type: 'lead', label: 'New Lead', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { type: 'customer', label: 'New Customer', icon: <User className="w-3.5 h-3.5" /> },
    { type: 'service', label: 'Service Request', icon: <Wrench className="w-3.5 h-3.5" /> },
    { type: 'quote', label: 'Sales Quote', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { type: 'invoice', label: 'Tax Invoice', icon: <FileText className="w-3.5 h-3.5" /> },
    { type: 'product', label: 'Inventory SKU', icon: <Package className="w-3.5 h-3.5" /> },
    { type: 'amc', label: 'AMC Contract', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const titles: Record<CreateRecordType, string> = {
    lead: 'Create Sales Opportunity / Lead',
    customer: 'Register Customer Profile',
    service: 'Create Service Request & Dispatch',
    quote: 'Generate Commercial Quotation',
    invoice: 'Create GST Tax Invoice',
    product: 'Register Product / Spare in Inventory',
    amc: 'Initiate Annual Maintenance Contract (AMC)',
  };

  return (
    <Drawer
      isOpen={isCreateDrawerOpen}
      onClose={closeCreateDrawer}
      title={titles[createType]}
      subtitle="Complete necessary operational fields. Changes sync across CRM records immediately."
      width="lg"
    >
      <div className="space-y-6">
        {/* Record Type Selector pills */}
        <div>
          <label className="block text-2xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Record Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-1 bg-white border border-surface-border rounded-xs">
            {navItems.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  setFormData({});
                  openCreateDrawer(item.type);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs text-xs font-medium transition-colors text-left ${
                  createType === item.type
                    ? 'bg-brand-action/10 text-brand-action border border-brand-action/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-transparent'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Progressive Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 border border-surface-border rounded-sm shadow-subtle">
          {createType === 'lead' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Contact Person *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Anand Murugan"
                    value={formData.name || ''}
                    onChange={(e) => handleField('name', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Company / Organization *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sri Venkateswara Spinning Mills"
                    value={formData.company || ''}
                    onChange={(e) => handleField('company', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Phone Number *</label>
                  <input
                    required
                    type="text"
                    placeholder="+91 98432 XXXXX"
                    value={formData.phone || ''}
                    onChange={(e) => handleField('phone', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">City / Region</label>
                  <select
                    value={formData.location || 'Coimbatore'}
                    onChange={(e) => handleField('location', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Salem">Salem</option>
                    <option value="Tiruppur">Tiruppur</option>
                    <option value="Erode">Erode</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Product Requirement *
                  </label>
                  <select
                    value={formData.requirement || 'Commercial RO 500 LPH'}
                    onChange={(e) => handleField('requirement', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Commercial RO 500 LPH">Commercial RO 500 LPH</option>
                    <option value="Commercial RO 1000 LPH">Commercial RO 1000 LPH</option>
                    <option value="Industrial RO Plant 2000 LPH">Industrial RO Plant 2000 LPH</option>
                    <option value="Water Softener Plant 5000 LPH">Water Softener Plant 5000 LPH</option>
                    <option value="Dual Dialysis RO Unit">Dual Dialysis RO Unit</option>
                    <option value="RO Membrane & Filter Overhaul">RO Membrane & Filter Overhaul</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Estimated Deal Value (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="85000"
                    value={formData.dealValue || ''}
                    onChange={(e) => handleField('dealValue', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Lead Source</label>
                  <select
                    value={formData.source || 'Website'}
                    onChange={(e) => handleField('source', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Website">Website (Contact Us)</option>
                    <option value="Product Enquiry">Product Enquiry (Web)</option>
                    <option value="Get a Quote">Get a Quote (Web)</option>
                    <option value="Book a Service">Book a Service (Web)</option>
                    <option value="Phone">Inbound Phone</option>
                    <option value="Referral">Customer Referral</option>
                    <option value="Manual">Direct Field Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Assigned Sales Owner</label>
                  <select
                    value={formData.owner || 'Arun Sales'}
                    onChange={(e) => handleField('owner', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Arun Sales">Arun Sales</option>
                    <option value="Meena R">Meena R</option>
                    <option value="Karthik N">Karthik N</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {createType === 'customer' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Customer / Entity Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Hospital"
                    value={formData.name || ''}
                    onChange={(e) => handleField('name', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Customer Type</label>
                  <select
                    value={formData.type || 'Commercial'}
                    onChange={(e) => handleField('type', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Commercial">Commercial Facility</option>
                    <option value="Industrial">Industrial Manufacturing</option>
                    <option value="Healthcare">Healthcare & Hospital</option>
                    <option value="Institution">Institution / College</option>
                    <option value="Residential">Residential Gated Complex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Primary Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94432 XXXXX"
                    value={formData.phone || ''}
                    onChange={(e) => handleField('phone', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="33AAABC0000A1Z5"
                    value={formData.gstin || ''}
                    onChange={(e) => handleField('gstin', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Premises Address</label>
                <textarea
                  rows={2}
                  placeholder="Street address, industrial area, PIN code..."
                  value={formData.address || ''}
                  onChange={(e) => handleField('address', e.target.value)}
                  className="w-full p-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                />
              </div>
            </>
          )}

          {createType === 'service' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Select Customer *</label>
                  <select
                    required
                    value={formData.customerId || (customers[0]?.id || '')}
                    onChange={(e) => {
                      const cust = customers.find((c) => c.id === e.target.value);
                      handleField('customerId', e.target.value);
                      if (cust) {
                        handleField('customerName', cust.name);
                        handleField('company', cust.company);
                        handleField('phone', cust.phone);
                        handleField('location', cust.location);
                        handleField('address', cust.address);
                      }
                    }}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company}) · {c.location}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Service Type</label>
                  <select
                    value={formData.serviceType || 'Routine Maintenance'}
                    onChange={(e) => handleField('serviceType', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Routine Maintenance">Routine Maintenance (AMC)</option>
                    <option value="Filter Replacement">Filter Replacement</option>
                    <option value="Breakdown Repair">Breakdown Repair</option>
                    <option value="Installation">New Skid Installation</option>
                    <option value="Membrane Cleaning">Chemical Membrane CIP Cleaning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Reported Issue / Work Scope *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Raw water inlet pressure below 1.5 bar, check pre-filters"
                  value={formData.problem || ''}
                  onChange={(e) => handleField('problem', e.target.value)}
                  className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Dispatch Field Engineer</label>
                  <select
                    value={formData.engineerName || 'Arun Field Eng'}
                    onChange={(e) => {
                      handleField('engineerName', e.target.value);
                      handleField('engineerId', 'ENG-01');
                    }}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Arun Field Eng">Arun Field Eng (Coimbatore)</option>
                    <option value="Gokul K">Gokul K (Salem)</option>
                    <option value="Vijay Anand">Vijay Anand (Coimbatore)</option>
                    <option value="Suresh Kumar">Suresh Kumar (Tiruppur)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Priority</label>
                  <select
                    value={formData.priority || 'NORMAL'}
                    onChange={(e) => handleField('priority', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent (Breakdown)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {createType === 'invoice' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Billed To (Customer) *</label>
                  <select
                    required
                    value={formData.customerId || (customers[0]?.id || '')}
                    onChange={(e) => {
                      const cust = customers.find((c) => c.id === e.target.value);
                      handleField('customerId', e.target.value);
                      if (cust) handleField('customerName', cust.name);
                    }}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Total Bill Amount (Incl GST) *</label>
                  <input
                    required
                    type="number"
                    placeholder="42500"
                    value={formData.totalAmount || ''}
                    onChange={(e) => handleField('totalAmount', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleField('dueDate', e.target.value)}
                  className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                />
              </div>
            </>
          )}

          {createType === 'product' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Product / Spare Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. RO Booster Pump 100 GPD"
                    value={formData.name || ''}
                    onChange={(e) => handleField('name', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Item Category</label>
                  <select
                    value={formData.category || 'Spare Part'}
                    onChange={(e) => handleField('category', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Spare Part">Spare Part</option>
                    <option value="Consumable">Consumable (Filter/Resin)</option>
                    <option value="Commercial Equipment">Commercial Equipment</option>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Initial Stock</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.stock || ''}
                    onChange={(e) => handleField('stock', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Min Alert Stock</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.minStock || ''}
                    onChange={(e) => handleField('minStock', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={formData.unitPrice || ''}
                    onChange={(e) => handleField('unitPrice', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {createType === 'amc' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Customer *</label>
                  <select
                    required
                    value={formData.customerId || (customers[0]?.id || '')}
                    onChange={(e) => {
                      const cust = customers.find((c) => c.id === e.target.value);
                      handleField('customerId', e.target.value);
                      if (cust) handleField('customerName', cust.name);
                    }}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Covered Product *</label>
                  <input
                    required
                    type="text"
                    placeholder="Commercial RO 500 LPH Skid"
                    value={formData.product || ''}
                    onChange={(e) => handleField('product', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Coverage Tier</label>
                  <select
                    value={formData.coveragePlan || 'Comprehensive'}
                    onChange={(e) => handleField('coveragePlan', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none bg-white"
                  >
                    <option value="Comprehensive">Comprehensive (Spares & Filters Included)</option>
                    <option value="Standard 4-Visit">Standard (Labor & 4 Periodic Visits)</option>
                    <option value="Non-Comprehensive">Non-Comprehensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Contract Annual Value (₹)</label>
                  <input
                    type="number"
                    placeholder="36000"
                    value={formData.contractValue || ''}
                    onChange={(e) => handleField('contractValue', e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-surface-border rounded-xs focus:ring-1 focus:ring-brand-action focus:border-brand-action focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={closeCreateDrawer}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create & Save Record
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};
