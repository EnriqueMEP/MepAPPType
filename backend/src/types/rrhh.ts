import { BaseEntity, User } from './common';

// Empleado
export interface Employee extends BaseEntity {
  user_id: string;
  employee_id: string;
  department_id?: string;
  position_id?: string;
  manager_id?: string;
  hire_date: Date;
  employment_type: EmploymentType;
  work_location: WorkLocation;
  salary?: number;
  currency?: string;
  status: EmployeeStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  birth_date?: Date;
  national_id?: string;
  tax_id?: string;
  bank_account?: string;
  first_name?: string;
  last_name?: string;
  notes?: string;
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary',
}

export enum WorkLocation {
  OFFICE = 'office',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave',
}

// Departamento
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
  location?: string;
  parent_id?: string;
  status: DepartmentStatus;
}

export enum DepartmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Posición/Cargo
export interface Position extends BaseEntity {
  title: string;
  description?: string;
  department_id?: string;
  level: PositionLevel;
  salary_min?: number;
  salary_max?: number;
  min_salary?: number;
  max_salary?: number;
  requirements?: string;
  responsibilities?: string;
  status: PositionStatus;
}

export enum PositionLevel {
  INTERN = 'intern',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
  DIRECTOR = 'director',
  EXECUTIVE = 'executive',
}

export enum PositionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Solicitud de Licencia
export interface LeaveRequest extends BaseEntity {
  employee_id: string;
  type: LeaveType;
  start_date: Date;
  end_date: Date;
  days_requested: number;
  reason?: string;
  status: LeaveStatus;
  approved_by?: string;
  approved_at?: Date;
  comments?: string;
  attachments?: string[];
}

export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  BEREAVEMENT = 'bereavement',
  JURY_DUTY = 'jury_duty',
  MILITARY = 'military',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// Asistencia
export interface Attendance extends BaseEntity {
  employee_id: string;
  date: Date;
  clock_in?: Date;
  clock_out?: Date;
  break_start?: Date;
  break_end?: Date;
  total_hours?: number;
  overtime_hours?: number;
  status: AttendanceStatus;
  location?: string;
  ip_address?: string;
  notes?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  LEAVE = 'leave',
  HOLIDAY = 'holiday',
}

// Evaluación de Desempeño
export interface PerformanceReview extends BaseEntity {
  employee_id: string;
  reviewer_id: string;
  period_start: Date;
  period_end: Date;
  overall_rating: number;
  goals_rating?: number;
  skills_rating?: number;
  attitude_rating?: number;
  achievements?: string;
  areas_for_improvement?: string;
  goals_for_next_period?: string;
  comments?: string;
  status: ReviewStatus;
  submitted_at?: Date;
}

export enum ReviewStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
}

// Nómina
export interface Payroll extends BaseEntity {
  employee_id: string;
  pay_period_start: Date;
  pay_period_end: Date;
  pay_date: Date;
  gross_salary: number;
  deductions: PayrollDeduction[];
  net_salary: number;
  currency: string;
  status: PayrollStatus;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface PayrollDeduction {
  type: DeductionType;
  amount: number;
  description?: string;
}

export enum DeductionType {
  TAX = 'tax',
  SOCIAL_SECURITY = 'social_security',
  HEALTH_INSURANCE = 'health_insurance',
  RETIREMENT = 'retirement',
  OTHER = 'other',
}

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

// Request Interfaces
export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager_id?: string;
  budget?: number;
  location?: string;
  parent_id?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  manager_id?: string;
  budget?: number;
  location?: string;
  parent_id?: string;
  status?: DepartmentStatus;
}

export interface CreatePositionRequest {
  title: string;
  description?: string;
  department_id?: string;
  level: PositionLevel;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  responsibilities?: string;
}

export interface UpdatePositionRequest {
  title?: string;
  description?: string;
  department_id?: string;
  level?: PositionLevel;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  responsibilities?: string;
  status?: PositionStatus;
}

export interface CreateEmployeeRequest {
  user_id: string;
  employee_id?: string;
  department_id?: string;
  position_id?: string;
  manager_id?: string;
  hire_date: Date;
  employment_type: EmploymentType;
  work_location: WorkLocation;
  salary?: number;
  currency?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  birth_date?: Date;
  national_id?: string;
  tax_id?: string;
  bank_account?: string;
  first_name?: string;
  last_name?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest {
  user_id?: string;
  employee_id?: string;
  department_id?: string;
  position_id?: string;
  manager_id?: string;
  hire_date?: Date;
  employment_type?: EmploymentType;
  work_location?: WorkLocation;
  salary?: number;
  currency?: string;
  status?: EmployeeStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  birth_date?: Date;
  national_id?: string;
  tax_id?: string;
  bank_account?: string;
  first_name?: string;
  last_name?: string;
  notes?: string;
}

// Enums que faltan
export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CASH = 'cash',
  PAYPAL = 'paypal',
  OTHER = 'other',
}
