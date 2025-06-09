// Tipos para RRHH - basados en OpenHRMS
export interface Employee {
  id: string
  employeeNumber: string
  personalInfo: PersonalInfo
  jobInfo: JobInfo
  contactInfo: ContactInfo
  emergencyContact?: EmergencyContact
  documents: Document[]
  status: 'active' | 'inactive' | 'terminated'
  createdAt: string
  updatedAt: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  nationality: string
  idNumber: string
  avatar?: string
}

export interface JobInfo {
  position: string
  department: string
  manager?: string
  startDate: string
  endDate?: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern'
  workLocation: string
  salary: number
  currency: string
}

export interface ContactInfo {
  email: string
  phone: string
  alternatePhone?: string
  address: Address
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface Document {
  id: string
  name: string
  type: 'resume' | 'contract' | 'id-copy' | 'certificate' | 'other'
  url: string
  uploadedAt: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity'
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  notes?: string
  createdAt: string
}

export interface Attendance {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  totalHours?: number
  status: 'present' | 'absent' | 'late' | 'half-day'
  notes?: string
}

export interface Payroll {
  id: string
  employeeId: string
  period: string
  basicSalary: number
  allowances: PayrollItem[]
  deductions: PayrollItem[]
  overtime: number
  grossPay: number
  netPay: number
  status: 'draft' | 'processed' | 'paid'
  processedAt?: string
  paidAt?: string
}

export interface PayrollItem {
  name: string
  amount: number
  type: 'allowance' | 'deduction'
}
