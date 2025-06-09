// filepath: backend/src/controllers/RRHHController.ts
import { Request, Response } from 'express';
import RRHHService from '../services/RRHHService';
import { ApiResponseBuilder } from '../utils/response';
import { AuthenticatedRequest } from '../types/common';

export class RRHHController {
  // Departments
  async getAllDepartments(req: AuthenticatedRequest, res: Response) {
    try {
      const departments = await RRHHService.getAllDepartments();
      ApiResponseBuilder.success(res, departments, 'Departments retrieved successfully');
    } catch (error) {
      console.error('Error getting departments:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve departments', 500);
    }
  }

  async getDepartmentById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const department = await RRHHService.getDepartmentById(id);
      
      if (!department) {
        return ApiResponseBuilder.error(res, 'Department not found', 404);
      }
      
      ApiResponseBuilder.success(res, department, 'Department retrieved successfully');
    } catch (error) {
      console.error('Error getting department:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve department', 500);
    }
  }

  async createDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const departmentData = req.body;
      const department = await RRHHService.createDepartment(departmentData);
      ApiResponseBuilder.success(res, department, 'Department created successfully', 201);
    } catch (error) {
      console.error('Error creating department:', error);
      ApiResponseBuilder.error(res, 'Failed to create department', 500);
    }
  }

  async updateDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const department = await RRHHService.updateDepartment(id, updateData);
      
      if (!department) {
        return ApiResponseBuilder.error(res, 'Department not found', 404);
      }
      
      ApiResponseBuilder.success(res, department, 'Department updated successfully');
    } catch (error) {
      console.error('Error updating department:', error);
      ApiResponseBuilder.error(res, 'Failed to update department', 500);
    }
  }

  async deleteDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await RRHHService.deleteDepartment(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Department not found or has active employees', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Department deleted successfully');    } catch (error) {
      console.error('Error deleting department:', error);
      if (error instanceof Error && error.message.includes('Cannot delete department')) {
        return ApiResponseBuilder.error(res, error.message, 400);
      }
      ApiResponseBuilder.error(res, 'Failed to delete department', 500);
    }
  }

  async getDepartmentHierarchy(req: AuthenticatedRequest, res: Response) {
    try {
      const hierarchy = await RRHHService.getDepartmentHierarchy();
      ApiResponseBuilder.success(res, hierarchy, 'Department hierarchy retrieved successfully');
    } catch (error) {
      console.error('Error getting department hierarchy:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve department hierarchy', 500);
    }
  }

  // Positions
  async getAllPositions(req: AuthenticatedRequest, res: Response) {
    try {
      const positions = await RRHHService.getAllPositions();
      ApiResponseBuilder.success(res, positions, 'Positions retrieved successfully');
    } catch (error) {
      console.error('Error getting positions:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve positions', 500);
    }
  }

  async getPositionById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const position = await RRHHService.getPositionById(id);
      
      if (!position) {
        return ApiResponseBuilder.error(res, 'Position not found', 404);
      }
      
      ApiResponseBuilder.success(res, position, 'Position retrieved successfully');
    } catch (error) {
      console.error('Error getting position:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve position', 500);
    }
  }

  async getPositionsByDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const { departmentId } = req.params;
      const positions = await RRHHService.getPositionsByDepartment(departmentId);
      ApiResponseBuilder.success(res, positions, 'Positions retrieved successfully');
    } catch (error) {
      console.error('Error getting positions by department:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve positions', 500);
    }
  }

  async createPosition(req: AuthenticatedRequest, res: Response) {
    try {
      const positionData = req.body;
      const position = await RRHHService.createPosition(positionData);
      ApiResponseBuilder.success(res, position, 'Position created successfully', 201);
    } catch (error) {
      console.error('Error creating position:', error);
      ApiResponseBuilder.error(res, 'Failed to create position', 500);
    }
  }

  async updatePosition(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const position = await RRHHService.updatePosition(id, updateData);
      
      if (!position) {
        return ApiResponseBuilder.error(res, 'Position not found', 404);
      }
      
      ApiResponseBuilder.success(res, position, 'Position updated successfully');
    } catch (error) {
      console.error('Error updating position:', error);
      ApiResponseBuilder.error(res, 'Failed to update position', 500);
    }
  }

  async deletePosition(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await RRHHService.deletePosition(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Position not found or has active employees', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Position deleted successfully');    } catch (error) {
      console.error('Error deleting position:', error);
      if (error instanceof Error && error.message.includes('Cannot delete position')) {
        return ApiResponseBuilder.error(res, error.message, 400);
      }
      ApiResponseBuilder.error(res, 'Failed to delete position', 500);
    }
  }

  // Employees
  async getAllEmployees(req: AuthenticatedRequest, res: Response) {
    try {
      const employees = await RRHHService.getAllEmployees();
      ApiResponseBuilder.success(res, employees, 'Employees retrieved successfully');
    } catch (error) {
      console.error('Error getting employees:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve employees', 500);
    }
  }

  async getEmployeeById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const employee = await RRHHService.getEmployeeById(id);
      
      if (!employee) {
        return ApiResponseBuilder.error(res, 'Employee not found', 404);
      }
      
      ApiResponseBuilder.success(res, employee, 'Employee retrieved successfully');
    } catch (error) {
      console.error('Error getting employee:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve employee', 500);
    }
  }

  async getEmployeesByDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const { departmentId } = req.params;
      const employees = await RRHHService.getEmployeesByDepartment(departmentId);
      ApiResponseBuilder.success(res, employees, 'Employees retrieved successfully');
    } catch (error) {
      console.error('Error getting employees by department:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve employees', 500);
    }
  }

  async createEmployee(req: AuthenticatedRequest, res: Response) {
    try {
      const employeeData = req.body;
      const employee = await RRHHService.createEmployee(employeeData);
      ApiResponseBuilder.success(res, employee, 'Employee created successfully', 201);
    } catch (error) {
      console.error('Error creating employee:', error);
      ApiResponseBuilder.error(res, 'Failed to create employee', 500);
    }
  }

  async updateEmployee(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const employee = await RRHHService.updateEmployee(id, updateData);
      
      if (!employee) {
        return ApiResponseBuilder.error(res, 'Employee not found', 404);
      }
      
      ApiResponseBuilder.success(res, employee, 'Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      ApiResponseBuilder.error(res, 'Failed to update employee', 500);
    }
  }

  async updateEmployeeStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const employee = await RRHHService.updateEmployeeStatus(id, status);
      
      if (!employee) {
        return ApiResponseBuilder.error(res, 'Employee not found', 404);
      }
      
      ApiResponseBuilder.success(res, employee, 'Employee status updated successfully');
    } catch (error) {
      console.error('Error updating employee status:', error);
      ApiResponseBuilder.error(res, 'Failed to update employee status', 500);
    }
  }

  async deleteEmployee(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await RRHHService.deleteEmployee(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Employee not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      ApiResponseBuilder.error(res, 'Failed to delete employee', 500);
    }
  }

  // Analytics and Reports
  async getRRHHStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await RRHHService.getRRHHStats();
      ApiResponseBuilder.success(res, stats, 'RRHH stats retrieved successfully');
    } catch (error) {
      console.error('Error getting RRHH stats:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve RRHH stats', 500);
    }
  }

  async getEmployeesByStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await RRHHService.getEmployeesByStatus();
      ApiResponseBuilder.success(res, stats, 'Employees by status retrieved successfully');
    } catch (error) {
      console.error('Error getting employees by status:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve employees by status', 500);
    }
  }

  async getUpcomingBirthdays(req: AuthenticatedRequest, res: Response) {
    try {
      const { days = 30 } = req.query;
      const birthdays = await RRHHService.getUpcomingBirthdays(parseInt(days as string));
      ApiResponseBuilder.success(res, birthdays, 'Upcoming birthdays retrieved successfully');
    } catch (error) {
      console.error('Error getting upcoming birthdays:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve upcoming birthdays', 500);
    }
  }

  async getWorkAnniversaries(req: AuthenticatedRequest, res: Response) {
    try {
      const { days = 30 } = req.query;
      const anniversaries = await RRHHService.getWorkAnniversaries(parseInt(days as string));
      ApiResponseBuilder.success(res, anniversaries, 'Work anniversaries retrieved successfully');
    } catch (error) {
      console.error('Error getting work anniversaries:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve work anniversaries', 500);
    }
  }
}

export default new RRHHController();
