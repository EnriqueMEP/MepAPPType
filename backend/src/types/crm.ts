import { BaseEntity, User } from './common';

// Cliente/Empresa
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  website?: string;
  industry?: string;
  annual_revenue?: number;
  employees_count?: number;
  status: CustomerStatus;
  source: CustomerSource;
  assigned_to?: string; // User ID
  notes?: string;
  last_contact?: Date;
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
  LOST = 'lost',
}

export enum CustomerSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  COLD_CALL = 'cold_call',
  TRADE_SHOW = 'trade_show',
  OTHER = 'other',
}

// Lead/Prospecto
export interface Lead extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source: CustomerSource;
  status: LeadStatus;
  stage: LeadStage;
  value?: number;
  probability?: number;
  assigned_to?: string; // User ID
  notes?: string;
  last_contact?: Date;
  expected_close_date?: Date;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export enum LeadStage {
  AWARENESS = 'awareness',
  INTEREST = 'interest',
  CONSIDERATION = 'consideration',
  DECISION = 'decision',
}

// Oportunidad
export interface Opportunity extends BaseEntity {
  name: string;
  customer_id: string;
  lead_id?: string;
  value: number;
  probability: number;
  stage: OpportunityStage;
  status: OpportunityStatus;
  assigned_to?: string; // User ID
  expected_close_date?: Date;
  actual_close_date?: Date;
  description?: string;
  notes?: string;
}

export enum OpportunityStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export enum OpportunityStatus {
  OPEN = 'open',
  WON = 'won',
  LOST = 'lost',
}

// Actividad
export interface Activity extends BaseEntity {
  type: ActivityType;
  subject: string;
  description?: string;
  date: Date;
  duration?: number; // en minutos
  status: ActivityStatus;
  priority: ActivityPriority;
  assigned_to: string; // User ID
  customer_id?: string;
  lead_id?: string;
  opportunity_id?: string;
  notes?: string;
}

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note',
  DEMO = 'demo',
  PROPOSAL = 'proposal',
  FOLLOW_UP = 'follow_up',
}

export enum ActivityStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Factura
export interface Invoice extends BaseEntity {
  number: string;
  customer_id: string;
  opportunity_id?: string;
  issue_date: Date;
  due_date: Date;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  payment_terms?: string;
  paid_date?: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

// Request interfaces for API
export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  website?: string;
  industry?: string;
  annual_revenue?: number;
  employees_count?: number;
  status?: CustomerStatus;
  source?: CustomerSource;
  assigned_to?: string;
  notes?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  website?: string;
  industry?: string;
  annual_revenue?: number;
  employees_count?: number;
  status?: CustomerStatus;
  source?: CustomerSource;
  assigned_to?: string;
  notes?: string;
}

export interface CreateLeadRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: CustomerSource;
  status?: LeadStatus;
  stage?: LeadStage;
  value?: number;
  probability?: number;
  assigned_to?: string;
  notes?: string;
  expected_close_date?: Date;
}

export interface UpdateLeadRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  source?: CustomerSource;
  status?: LeadStatus;
  stage?: LeadStage;
  value?: number;
  probability?: number;
  assigned_to?: string;
  notes?: string;
  expected_close_date?: Date;
}

// Deal is an alias for Opportunity for backwards compatibility
export type Deal = Opportunity;
export type DealStatus = OpportunityStatus;

export interface CreateDealRequest {
  name: string;
  customer_id: string;
  lead_id?: string;
  value: number;
  probability?: number;
  stage?: OpportunityStage;
  status?: OpportunityStatus;
  assigned_to?: string;
  expected_close_date?: Date;
  description?: string;
  notes?: string;
}

export interface UpdateDealRequest {
  name?: string;
  customer_id?: string;
  lead_id?: string;
  value?: number;
  probability?: number;
  stage?: OpportunityStage;
  status?: OpportunityStatus;
  assigned_to?: string;
  expected_close_date?: Date;
  actual_close_date?: Date;
  description?: string;
  notes?: string;
}
