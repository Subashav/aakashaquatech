import React, { createContext, useContext, useState } from 'react';
import {
  NavigationTab,
  Lead,
  Customer,
  ServiceJob,
  Engineer,
  InventoryItem,
  StockMovement,
  Invoice,
  AMCContract,
  AttentionItem,
  LeadStage,
  ServiceStatus,
} from '../types';
import {
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_SERVICES,
  INITIAL_ENGINEERS,
  INITIAL_INVENTORY,
  INITIAL_MOVEMENTS,
  INITIAL_INVOICES,
  INITIAL_AMCS,
  INITIAL_ATTENTION_QUEUE,
} from '../data/mockData';

export type CreateRecordType = 'lead' | 'customer' | 'service' | 'quote' | 'invoice' | 'product' | 'amc';

interface ToastData {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  activeBranch: string;
  setActiveBranch: (branch: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isEngineerMobileMode: boolean;
  setEngineerMobileMode: (val: boolean) => void;

  // Data collections
  leads: Lead[];
  customers: Customer[];
  services: ServiceJob[];
  engineers: Engineer[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  invoices: Invoice[];
  amcs: AMCContract[];
  attentionQueue: AttentionItem[];

  // Selection states for drawers
  selectedLead: Lead | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedService: ServiceJob | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoiceId: (id: string | null) => void;

  // Global modals
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isCreateDrawerOpen: boolean;
  createType: CreateRecordType;
  openCreateDrawer: (type?: CreateRecordType) => void;
  closeCreateDrawer: () => void;

  // Toast
  toast: ToastData | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Operations
  updateLeadStage: (id: string, newStage: LeadStage) => void;
  createLead: (data: Partial<Lead>) => void;
  createCustomer: (data: Partial<Customer>) => void;
  createServiceJob: (data: Partial<ServiceJob>) => void;
  createInvoice: (data: Partial<Invoice>) => void;
  createInventoryItem: (data: Partial<InventoryItem>) => void;
  createAMC: (data: Partial<AMCContract>) => void;
  updateServiceStatus: (serviceId: string, status: ServiceStatus) => void;
  verifyServiceOtp: (serviceId: string, enteredOtp: string) => boolean;
  completeServiceJob: (serviceId: string, diagnosis: string, workPerformed: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeBranch, setActiveBranch] = useState<string>('All Branches');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isEngineerMobileMode, setEngineerMobileMode] = useState<boolean>(false);

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [services, setServices] = useState<ServiceJob[]>(INITIAL_SERVICES);
  const [engineers] = useState<Engineer[]>(INITIAL_ENGINEERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [amcs, setAmcs] = useState<AMCContract[]>(INITIAL_AMCS);
  const [attentionQueue, setAttentionQueue] = useState<AttentionItem[]>(INITIAL_ATTENTION_QUEUE);

  // Selections
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Command palette & Create drawer
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isCreateDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [createType, setCreateType] = useState<CreateRecordType>('lead');

  // Toast
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const openCreateDrawer = (type: CreateRecordType = 'lead') => {
    setCreateType(type);
    setCreateDrawerOpen(true);
  };

  const closeCreateDrawer = () => setCreateDrawerOpen(false);

  // Derived selections
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;
  const selectedService = services.find((s) => s.id === selectedServiceId) || null;
  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) || null;

  // Actions
  const updateLeadStage = (id: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          stage: newStage,
          lastActivity: `Stage updated to ${newStage}`,
          timeline: [
            {
              id: `ev-${Date.now()}`,
              time: 'Just now',
              date: 'Today',
              title: `Lead moved to ${newStage}`,
              description: `Stage progression triggered in CRM pipeline.`,
              actor: 'Admin',
              badge: 'Pipeline',
            },
            ...lead.timeline,
          ],
        };
      })
    );
    showToast(`Lead updated to ${newStage}`, 'success');
  };

  const createLead = (data: Partial<Lead>) => {
    const newId = `LD-${2054 + leads.length}`;
    const newLead: Lead = {
      id: newId,
      name: data.name || 'New Lead',
      company: data.company || 'Enterprise Client',
      phone: data.phone || '+91 98000 00000',
      email: data.email || 'contact@client.in',
      requirement: data.requirement || 'Commercial RO System',
      dealValue: Number(data.dealValue) || 100000,
      owner: data.owner || 'Arun Sales',
      stage: 'NEW',
      source: data.source || 'Website',
      websitePage: data.websitePage || '/contact-us',
      websiteForm: data.websiteForm || 'Direct CRM Entry',
      location: data.location || 'Coimbatore',
      address: data.address || `${data.location || 'Coimbatore'}, Tamil Nadu`,
      lastActivity: 'Record created',
      nextFollowUp: 'Tomorrow, 10:00 AM',
      notes: data.notes || ['Lead captured in system.'],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          time: 'Just now',
          date: 'Today',
          title: 'Lead record generated',
          description: `Created with deal potential ₹${(Number(data.dealValue) || 100000).toLocaleString('en-IN')}`,
          actor: 'Admin',
          badge: 'Create',
        },
      ],
    };
    setLeads([newLead, ...leads]);
    closeCreateDrawer();
    showToast(`Lead ${newId} created successfully`, 'success');
  };

  const createCustomer = (data: Partial<Customer>) => {
    const newId = `CUS-${1028 + customers.length}`;
    const newCustomer: Customer = {
      id: newId,
      name: data.name || 'New Client',
      company: data.company || data.name || 'Commercial Account',
      phone: data.phone || '+91 99000 00000',
      email: data.email || 'accounts@client.com',
      type: data.type || 'Commercial',
      location: data.location || 'Coimbatore',
      address: data.address || 'Industrial Estate, Coimbatore',
      gstin: data.gstin || '33AAABC0000A1Z0',
      customerSince: 'Today',
      customerLifetimeValue: 0,
      outstandingBalance: 0,
      activeAMC: false,
      serviceCount: 0,
      invoiceCount: 0,
      installedProducts: [],
    };
    setCustomers([newCustomer, ...customers]);
    closeCreateDrawer();
    showToast(`Customer ${newCustomer.name} (${newId}) created`, 'success');
  };

  const createServiceJob = (data: Partial<ServiceJob>) => {
    const newId = `SR-${1028 + services.length}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newJob: ServiceJob = {
      id: newId,
      customerId: data.customerId || 'CUS-1024',
      customerName: data.customerName || 'Ravi Kumar',
      company: data.company || 'Sri Murugan Textiles',
      phone: data.phone || '+91 98421 82910',
      location: data.location || 'Coimbatore',
      address: data.address || 'Peelamedu, Coimbatore',
      product: data.product || 'Commercial RO 500 LPH',
      problem: data.problem || 'Routine inspection & filter check',
      serviceType: data.serviceType || 'Routine Maintenance',
      engineerId: data.engineerId || 'ENG-01',
      engineerName: data.engineerName || 'Arun Field Eng',
      scheduledTime: data.scheduledTime || 'Today, 03:00 PM',
      priority: data.priority || 'NORMAL',
      status: 'ASSIGNED',
      otp: otp,
      partsUsed: [],
      photosUploaded: 0,
      billingStatus: 'INCLUDED_IN_AMC',
    };
    setServices([newJob, ...services]);
    closeCreateDrawer();
    showToast(`Service Request #${newId} created. Customer OTP is ${otp}`, 'success');
  };

  const createInvoice = (data: Partial<Invoice>) => {
    const newId = `INV-2026-${1043 + invoices.length}`;
    const total = Number(data.totalAmount) || 25000;
    const newInv: Invoice = {
      id: newId,
      customerId: data.customerId || 'CUS-1024',
      customerName: data.customerName || 'Ravi Kumar',
      date: 'Today',
      dueDate: data.dueDate || '14 Oct 2026',
      items: [
        {
          description: 'Water Filtration Consumables & Service',
          hsnCode: '8421',
          qty: 1,
          rate: Math.round(total / 1.18),
          gstRate: 18,
          amount: total,
        },
      ],
      subtotal: Math.round(total / 1.18),
      gstAmount: Math.round(total - total / 1.18),
      totalAmount: total,
      paidAmount: 0,
      balanceDue: total,
      status: 'PARTIAL',
      referenceType: 'SERVICE',
    };
    setInvoices([newInv, ...invoices]);
    closeCreateDrawer();
    showToast(`Invoice ${newId} created for ₹${total.toLocaleString('en-IN')}`, 'success');
  };

  const createInventoryItem = (data: Partial<InventoryItem>) => {
    const newItem: InventoryItem = {
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      name: data.name || 'New Inventory Item',
      category: data.category || 'Spare Part',
      stock: Number(data.stock) || 10,
      minStock: Number(data.minStock) || 5,
      unitPrice: Number(data.unitPrice) || 2000,
      warehouse: data.warehouse || 'Coimbatore Hub',
      status: (Number(data.stock) || 10) <= (Number(data.minStock) || 5) ? 'LOW_STOCK' : 'HEALTHY',
      lastMovement: 'Initial stock intake',
    };
    setInventory([newItem, ...inventory]);
    closeCreateDrawer();
    showToast(`Inventory item ${newItem.name} registered`, 'success');
  };

  const createAMC = (data: Partial<AMCContract>) => {
    const newId = `AMC-${(92 + amcs.length).toString().padStart(4, '0')}`;
    const newContract: AMCContract = {
      id: newId,
      customerId: data.customerId || 'CUS-1024',
      customerName: data.customerName || 'Ravi Kumar',
      product: data.product || 'Commercial RO 500 LPH Skid',
      coveragePlan: data.coveragePlan || 'Standard 4-Visit',
      startDate: 'Today',
      endDate: '06 Oct 2027',
      contractValue: Number(data.contractValue) || 45000,
      totalVisits: 4,
      completedVisits: 0,
      remainingVisits: 4,
      nextScheduledVisit: 'In 3 months',
      renewalDueDate: '06 Oct 2027',
      renewalStatus: 'ACTIVE',
    };
    setAmcs([newContract, ...amcs]);
    closeCreateDrawer();
    showToast(`AMC Contract ${newId} activated`, 'success');
  };

  const updateServiceStatus = (serviceId: string, status: ServiceStatus) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return {
          ...s,
          status,
          ...(status === 'ARRIVED' ? { arrivedAt: nowStr } : {}),
          ...(status === 'COMPLETED' ? { completedAt: nowStr } : {}),
        };
      })
    );
    showToast(`Service #${serviceId} moved to ${status.replace(/_/g, ' ')}`, 'info');
  };

  const verifyServiceOtp = (serviceId: string, enteredOtp: string): boolean => {
    const target = services.find((s) => s.id === serviceId);
    if (!target) return false;
    if (target.otp.trim() === enteredOtp.trim()) {
      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? { ...s, status: 'OTP_VERIFIED', otpVerifiedAt: nowStr }
            : s
        )
      );
      showToast(`OTP Verified successfully at ${nowStr}. Service authorized.`, 'success');
      return true;
    }
    showToast('Invalid OTP entered. Please verify with customer.', 'error');
    return false;
  };

  const completeServiceJob = (serviceId: string, diagnosis: string, workPerformed: string) => {
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              status: 'COMPLETED',
              completedAt: nowStr,
              diagnosis,
              workPerformed,
              rating: 5,
            }
          : s
      )
    );
    showToast(`Service #${serviceId} marked as Completed. Customer confirmation recorded.`, 'success');
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: 'PAID', paidAmount: inv.totalAmount, balanceDue: 0 }
          : inv
      )
    );
    showToast(`Payment of ₹${invoices.find((i) => i.id === invoiceId)?.balanceDue.toLocaleString('en-IN')} marked as received.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        activeBranch,
        setActiveBranch,
        isSidebarCollapsed,
        toggleSidebar,
        isEngineerMobileMode,
        setEngineerMobileMode,
        leads,
        customers,
        services,
        engineers,
        inventory,
        movements,
        invoices,
        amcs,
        attentionQueue,
        selectedLead,
        setSelectedLeadId,
        selectedCustomer,
        setSelectedCustomerId,
        selectedService,
        setSelectedServiceId,
        selectedInvoice,
        setSelectedInvoiceId,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isCreateDrawerOpen,
        createType,
        openCreateDrawer,
        closeCreateDrawer,
        toast,
        showToast,
        updateLeadStage,
        createLead,
        createCustomer,
        createServiceJob,
        createInvoice,
        createInventoryItem,
        createAMC,
        updateServiceStatus,
        verifyServiceOtp,
        completeServiceJob,
        markInvoicePaid,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
