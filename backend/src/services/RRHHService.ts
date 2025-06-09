// filepath: backend/src/services/RRHHService.ts
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import {
  Department,
  Position,
  Employee,
  CreateDepartmentRequest,
  CreatePositionRequest,
  CreateEmployeeRequest,
  UpdateDepartmentRequest,
  UpdatePositionRequest,
  UpdateEmployeeRequest,
  EmployeeStatus,
  DepartmentStatus,
  PositionStatus
} from '../types/rrhh';

export class RRHHService {  // Departments
  async getAllDepartments(): Promise<Department[]> {
    return await db('departments')
      .select('*')
      .orderBy('name', 'asc');
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    const department = await db('departments')
      .where('id', id)
      .first();
    
    return department || null;
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
    const department: Omit<Department, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      manager_id: data.manager_id,
      parent_id: data.parent_id,
      budget: data.budget,
      location: data.location,
      status: DepartmentStatus.ACTIVE
    };

    await db('departments').insert(department);
    return await this.getDepartmentById(department.id) as Department;
  }
  async updateDepartment(id: string, data: UpdateDepartmentRequest): Promise<Department | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('departments')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getDepartmentById(id);
  }

  async deleteDepartment(id: string): Promise<boolean> {
    // Check if department has employees
    const employeeCount = await db('employees')
      .where('department_id', id)
      .count('* as count')
      .first();

    if (parseInt(employeeCount?.count as string) > 0) {
      throw new Error('Cannot delete department with active employees');
    }

    const deleted = await db('departments')
      .where('id', id)
      .del();

    return deleted > 0;
  }
  // Positions
  async getAllPositions(): Promise<Position[]> {
    return await db('positions')
      .leftJoin('departments', 'positions.department_id', 'departments.id')
      .select(
        'positions.*',
        'departments.name as department_name'
      )
      .orderBy('positions.title', 'asc');
  }

  async getPositionById(id: string): Promise<Position | null> {
    const position = await db('positions')
      .leftJoin('departments', 'positions.department_id', 'departments.id')
      .select(
        'positions.*',
        'departments.name as department_name'
      )
      .where('positions.id', id)
      .first();
    
    return position || null;
  }

  async getPositionsByDepartment(departmentId: string): Promise<Position[]> {
    return await db('positions')
      .where('department_id', departmentId)
      .select('*')
      .orderBy('title', 'asc');
  }
  async createPosition(data: CreatePositionRequest): Promise<Position> {
    const position: Omit<Position, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      department_id: data.department_id,
      level: data.level,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      status: PositionStatus.ACTIVE
    };

    await db('positions').insert(position);
    return await this.getPositionById(position.id) as Position;
  }
  async updatePosition(id: string, data: UpdatePositionRequest): Promise<Position | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('positions')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getPositionById(id);
  }

  async deletePosition(id: string): Promise<boolean> {
    // Check if position has employees
    const employeeCount = await db('employees')
      .where('position_id', id)
      .count('* as count')
      .first();

    if (parseInt(employeeCount?.count as string) > 0) {
      throw new Error('Cannot delete position with active employees');
    }

    const deleted = await db('positions')
      .where('id', id)
      .del();

    return deleted > 0;
  }
  // Employees
  async getAllEmployees(): Promise<Employee[]> {
    return await db('employees')
      .leftJoin('departments', 'employees.department_id', 'departments.id')
      .leftJoin('positions', 'employees.position_id', 'positions.id')
      .leftJoin('users', 'employees.user_id', 'users.id')
      .select(
        'employees.*',
        'departments.name as department_name',
        'positions.title as position_title',
        'users.name as user_name',
        'users.email as user_email'
      )
      .orderBy('employees.first_name', 'asc');
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const employee = await db('employees')
      .leftJoin('departments', 'employees.department_id', 'departments.id')
      .leftJoin('positions', 'employees.position_id', 'positions.id')
      .leftJoin('users', 'employees.user_id', 'users.id')
      .select(
        'employees.*',
        'departments.name as department_name',
        'positions.title as position_title',
        'users.name as user_name',
        'users.email as user_email'
      )
      .where('employees.id', id)
      .first();
    
    return employee || null;
  }

  async getEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
    return await db('employees')
      .leftJoin('positions', 'employees.position_id', 'positions.id')
      .leftJoin('users', 'employees.user_id', 'users.id')
      .select(
        'employees.*',
        'positions.title as position_title',
        'users.name as user_name',
        'users.email as user_email'
      )
      .where('employees.department_id', departmentId)
      .orderBy('employees.first_name', 'asc');
  }
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    const employee: Omit<Employee, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      employee_id: data.employee_id || uuidv4().slice(0, 8),
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      address: data.address,
      city: data.city,
      country: data.country,
      postal_code: data.postal_code,
      birth_date: data.birth_date,
      national_id: data.national_id,
      tax_id: data.tax_id,
      bank_account: data.bank_account,
      emergency_contact_name: data.emergency_contact_name,
      emergency_contact_phone: data.emergency_contact_phone,
      department_id: data.department_id,
      position_id: data.position_id,
      manager_id: data.manager_id,
      hire_date: data.hire_date,
      employment_type: data.employment_type,
      work_location: data.work_location,
      salary: data.salary,
      currency: data.currency || 'USD',
      status: EmployeeStatus.ACTIVE,
      notes: data.notes
    };

    await db('employees').insert(employee);
    return await this.getEmployeeById(employee.id) as Employee;
  }

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('employees')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getEmployeeById(id);
  }

  async updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<Employee | null> {
    return await this.updateEmployee(id, { status });
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const deleted = await db('employees')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  // Analytics and Reports
  async getRRHHStats() {
    const [
      totalEmployees,
      totalDepartments,
      totalPositions,
      activeEmployees,
      newHiresThisMonth,
      averageSalary,
      employeesByDepartment
    ] = await Promise.all([
      db('employees').count('* as count').first(),
      db('departments').count('* as count').first(),
      db('positions').count('* as count').first(),
      db('employees').where('status', 'active').count('* as count').first(),      db('employees')
        .where('hire_date', '>=', db.raw("date('now', 'start of month')"))
        .count('* as count').first(),
      db('employees')
        .where('status', 'active')
        .avg('salary as average').first(),
      db('employees')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .select('departments.name as department_name')
        .count('employees.id as employee_count')
        .groupBy('departments.id', 'departments.name')
    ]);

    return {
      employees: {
        total: parseInt(totalEmployees?.count as string) || 0,
        active: parseInt(activeEmployees?.count as string) || 0,
        newHiresThisMonth: parseInt(newHiresThisMonth?.count as string) || 0
      },
      departments: {
        total: parseInt(totalDepartments?.count as string) || 0
      },
      positions: {
        total: parseInt(totalPositions?.count as string) || 0
      },
      salary: {
        average: parseFloat(averageSalary?.average as string) || 0
      },
      distribution: {
        byDepartment: employeesByDepartment.map(row => ({
          department: row.department_name,
          count: parseInt(row.employee_count as string)
        }))
      }
    };
  }

  async getEmployeesByStatus(): Promise<Record<EmployeeStatus, number>> {
    const results = await db('employees')
      .select('status')
      .count('* as count')
      .groupBy('status');

    const statusCounts: Record<EmployeeStatus, number> = {
      active: 0,
      inactive: 0,
      terminated: 0,
      on_leave: 0
    };

    results.forEach(row => {
      statusCounts[row.status as EmployeeStatus] = parseInt(row.count as string);
    });

    return statusCounts;
  }

  async getDepartmentHierarchy(): Promise<Department[]> {
    // Get all departments with their parent relationships
    const departments = await db('departments')
      .leftJoin('employees as managers', 'departments.manager_id', 'managers.id')
      .select(
        'departments.*',
        'managers.first_name as manager_first_name',
        'managers.last_name as manager_last_name'
      )
      .orderBy('departments.name', 'asc');

    // Build hierarchy structure
    const departmentMap = new Map();
    const rootDepartments: Department[] = [];

    departments.forEach(dept => {
      dept.children = [];
      departmentMap.set(dept.id, dept);
    });

    departments.forEach(dept => {
      if (dept.parent_id) {
        const parent = departmentMap.get(dept.parent_id);
        if (parent) {
          parent.children.push(dept);
        }
      } else {
        rootDepartments.push(dept);
      }
    });

    return rootDepartments;
  }
  async getUpcomingBirthdays(days: number = 30): Promise<Employee[]> {
    return await db('employees')
      .leftJoin('departments', 'employees.department_id', 'departments.id')
      .leftJoin('positions', 'employees.position_id', 'positions.id')
      .select(
        'employees.*',
        'departments.name as department_name',
        'positions.title as position_title'
      )
      .whereRaw(`
        strftime('%j', birth_date) BETWEEN 
        strftime('%j', date('now')) AND 
        strftime('%j', date('now', '+${days} days'))
      `)
      .orderByRaw('strftime("%j", birth_date)');
  }

  async getWorkAnniversaries(days: number = 30): Promise<Employee[]> {
    return await db('employees')
      .leftJoin('departments', 'employees.department_id', 'departments.id')
      .leftJoin('positions', 'employees.position_id', 'positions.id')
      .select(
        'employees.*',
        'departments.name as department_name',
        'positions.title as position_title'
      )
      .whereRaw(`
        strftime('%j', hire_date) BETWEEN 
        strftime('%j', date('now')) AND 
        strftime('%j', date('now', '+${days} days'))
      `)
      .orderByRaw('strftime("%j", hire_date)');
  }
}

export default new RRHHService();
