// Tipos para CRM - inspirados en Crater
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: Address
  taxNumber?: string
  website?: string
  notes?: string
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  updatedAt: string
  totalInvoiced: number
  totalPaid: number
  outstandingAmount: number
}

export interface Lead {
  id: string
  title: string
  customer?: Customer
  contactName: string
  contactEmail: string
  contactPhone?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost'
  value: number
  probability: number
  expectedClosingDate?: string
  assignedTo: string
  notes?: string
  activities: Activity[]
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  number: string
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  terms?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  taxRate?: number
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  title: string
  description?: string
  date: string
  duration?: number
  userId: string
  leadId?: string
  customerId?: string
  completed: boolean
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}
