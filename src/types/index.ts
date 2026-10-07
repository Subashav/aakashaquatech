export type NavigationTab = 
  | 'dashboard' 
  | 'leads' 
  | 'customers' 
  | 'sales' 
  | 'service' 
  | 'engineers' 
  | 'inventory' 
  | 'billing' 
  | 'amc' 
  | 'reports' 
  | 'team' 
  | 'roles' 
  | 'settings' 
  | 'audit';

export type LeadStage = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'QUALIFIED' 
  | 'SITE_VISIT' 
  | 'QUOTATION' 
  | 'NEGOTIATION' 
  | 'WON' 
  | 'LOST';

export type LeadSource = 
  | 'Website' 
  | 'Product Enquiry' 
  | 'Get a Quote' 
  | 'Book a Service' 
  | 'Phone' 
  | 'Referral' 
  | 'Manual';

export interface TimelineEvent {
  id: string;
  time: string;
  date: string;
  title: string;
  description: string;
  actor: string;
  badge?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
  dealValue: number;
  owner: string;
  stage: LeadStage;
  source: LeadSource;
  websitePage?: string;
  websiteForm?: string;
  location: string;
  address: string;
  lastActivity: string;
  nextFollowUp: string;
  notes: string[];
  timeline: TimelineEvent[];
}

export interface InstalledProduct {
  id: string;
  productName: string;
  serialNumber: string;
  installedDate: string;
  capacity: string;
  location: string;
  warrantyStatus: 'ACTIVE' | 'EXPIRED' | 'AMC_COVERED';
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  type: 'Commercial' | 'Industrial' | 'Residential' | 'Healthcare' | 'Institution';
  location: string;
  address: string;
  gstin?: string;
  customerSince: string;
  customerLifetimeValue: number;
  outstandingBalance: number;
  activeAMC: boolean;
  amcId?: string;
  installedProducts: InstalledProduct[];
  serviceCount: number;
  invoiceCount: number;
}

export type ServiceStatus = 
  | 'NEW'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'OTP_VERIFIED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'CANCELLED';

export type ServicePriority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface ServicePartUsage {
  sku: string;
  partName: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceJob {
  id: string;
  customerId: string;
  customerName: string;
  company?: string;
  phone: string;
  location: string;
  address: string;
  product: string;
  problem: string;
  serviceType: 'Routine Maintenance' | 'Filter Replacement' | 'Breakdown Repair' | 'Installation' | 'Membrane Cleaning';
  engineerId: string;
  engineerName: string;
  scheduledTime: string;
  priority: ServicePriority;
  status: ServiceStatus;
  otp: string;
  otpVerifiedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  partsUsed: ServicePartUsage[];
  diagnosis?: string;
  workPerformed?: string;
  photosUploaded: number;
  rating?: number;
  billingStatus: 'INCLUDED_IN_AMC' | 'BILLABLE' | 'BILLED' | 'PAID';
}

export interface Engineer {
  id: string;
  name: string;
  phone: string;
  branch: string;
  activeJobsCount: number;
  completedTodayCount: number;
  status: 'AVAILABLE' | 'ON_FIELD' | 'OFF_DUTY';
  rating: number;
  currentLocationName: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: 'Spare Part' | 'Consumable' | 'Commercial Equipment' | 'Industrial Equipment' | 'Accessories';
  stock: number;
  minStock: number;
  unitPrice: number;
  warehouse: 'Coimbatore Hub' | 'Salem Depot' | 'Tiruppur Store';
  status: 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastMovement: string;
}

export interface StockMovement {
  id: string;
  date: string;
  sku: string;
  itemName: string;
  type: 'PURCHASE' | 'SERVICE_CONSUMPTION' | 'SALE' | 'ADJUSTMENT';
  quantity: number;
  reference: string;
  warehouse: string;
}

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  qty: number;
  rate: number;
  gstRate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PAID' | 'PARTIAL' | 'OVERDUE' | 'DRAFT';
  referenceType?: 'SERVICE' | 'EQUIPMENT_SALE' | 'AMC';
  referenceId?: string;
}

export interface AMCContract {
  id: string;
  customerId: string;
  customerName: string;
  product: string;
  coveragePlan: 'Comprehensive' | 'Non-Comprehensive' | 'Standard 4-Visit';
  startDate: string;
  endDate: string;
  contractValue: number;
  totalVisits: number;
  completedVisits: number;
  remainingVisits: number;
  nextScheduledVisit: string;
  renewalDueDate: string;
  renewalStatus: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface AttentionItem {
  id: string;
  category: 'LEAD' | 'SERVICE' | 'INVENTORY' | 'INVOICE' | 'AMC';
  title: string;
  subtitle: string;
  tag: string;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  actionTab: NavigationTab;
  recordId: string;
}
