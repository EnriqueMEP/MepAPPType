// filepath: backend/src/controllers/CRMController.ts
import { Request, Response } from 'express';
import CRMService from '../services/CRMService';
import { ApiResponseBuilder } from '../utils/response';
import { AuthenticatedRequest } from '../types/common';

export class CRMController {
  // Customers
  async getAllCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const customers = await CRMService.getAllCustomers();
      ApiResponseBuilder.success(res, customers, 'Customers retrieved successfully');
    } catch (error) {
      console.error('Error getting customers:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve customers', 500);
    }
  }

  async getCustomerById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const customer = await CRMService.getCustomerById(id);
      
      if (!customer) {
        return ApiResponseBuilder.error(res, 'Customer not found', 404);
      }
      
      ApiResponseBuilder.success(res, customer, 'Customer retrieved successfully');
    } catch (error) {
      console.error('Error getting customer:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve customer', 500);
    }
  }

  async createCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const customerData = req.body;
      const customer = await CRMService.createCustomer(customerData);
      ApiResponseBuilder.success(res, customer, 'Customer created successfully', 201);
    } catch (error) {
      console.error('Error creating customer:', error);
      ApiResponseBuilder.error(res, 'Failed to create customer', 500);
    }
  }

  async updateCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const customer = await CRMService.updateCustomer(id, updateData);
      
      if (!customer) {
        return ApiResponseBuilder.error(res, 'Customer not found', 404);
      }
      
      ApiResponseBuilder.success(res, customer, 'Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      ApiResponseBuilder.error(res, 'Failed to update customer', 500);
    }
  }

  async deleteCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CRMService.deleteCustomer(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Customer not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      ApiResponseBuilder.error(res, 'Failed to delete customer', 500);
    }
  }

  // Leads
  async getAllLeads(req: AuthenticatedRequest, res: Response) {
    try {
      const leads = await CRMService.getAllLeads();
      ApiResponseBuilder.success(res, leads, 'Leads retrieved successfully');
    } catch (error) {
      console.error('Error getting leads:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve leads', 500);
    }
  }

  async getLeadById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const lead = await CRMService.getLeadById(id);
      
      if (!lead) {
        return ApiResponseBuilder.error(res, 'Lead not found', 404);
      }
      
      ApiResponseBuilder.success(res, lead, 'Lead retrieved successfully');
    } catch (error) {
      console.error('Error getting lead:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve lead', 500);
    }
  }

  async createLead(req: AuthenticatedRequest, res: Response) {
    try {
      const leadData = req.body;
      const lead = await CRMService.createLead(leadData);
      ApiResponseBuilder.success(res, lead, 'Lead created successfully', 201);
    } catch (error) {
      console.error('Error creating lead:', error);
      ApiResponseBuilder.error(res, 'Failed to create lead', 500);
    }
  }

  async updateLead(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const lead = await CRMService.updateLead(id, updateData);
      
      if (!lead) {
        return ApiResponseBuilder.error(res, 'Lead not found', 404);
      }
      
      ApiResponseBuilder.success(res, lead, 'Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      ApiResponseBuilder.error(res, 'Failed to update lead', 500);
    }
  }

  async updateLeadStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const lead = await CRMService.updateLeadStatus(id, status);
      
      if (!lead) {
        return ApiResponseBuilder.error(res, 'Lead not found', 404);
      }
      
      ApiResponseBuilder.success(res, lead, 'Lead status updated successfully');
    } catch (error) {
      console.error('Error updating lead status:', error);
      ApiResponseBuilder.error(res, 'Failed to update lead status', 500);
    }
  }

  async deleteLead(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CRMService.deleteLead(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Lead not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      ApiResponseBuilder.error(res, 'Failed to delete lead', 500);
    }
  }

  async convertLeadToCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const result = await CRMService.convertLeadToCustomer(id);
      
      if (!result) {
        return ApiResponseBuilder.error(res, 'Lead not found', 404);
      }
      
      ApiResponseBuilder.success(res, result, 'Lead converted to customer successfully');
    } catch (error) {
      console.error('Error converting lead:', error);
      ApiResponseBuilder.error(res, 'Failed to convert lead', 500);
    }
  }

  // Deals
  async getAllDeals(req: AuthenticatedRequest, res: Response) {
    try {
      const deals = await CRMService.getAllDeals();
      ApiResponseBuilder.success(res, deals, 'Deals retrieved successfully');
    } catch (error) {
      console.error('Error getting deals:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve deals', 500);
    }
  }

  async getDealById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deal = await CRMService.getDealById(id);
      
      if (!deal) {
        return ApiResponseBuilder.error(res, 'Deal not found', 404);
      }
      
      ApiResponseBuilder.success(res, deal, 'Deal retrieved successfully');
    } catch (error) {
      console.error('Error getting deal:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve deal', 500);
    }
  }

  async createDeal(req: AuthenticatedRequest, res: Response) {
    try {
      const dealData = req.body;
      const deal = await CRMService.createDeal(dealData);
      ApiResponseBuilder.success(res, deal, 'Deal created successfully', 201);
    } catch (error) {
      console.error('Error creating deal:', error);
      ApiResponseBuilder.error(res, 'Failed to create deal', 500);
    }
  }

  async updateDeal(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const deal = await CRMService.updateDeal(id, updateData);
      
      if (!deal) {
        return ApiResponseBuilder.error(res, 'Deal not found', 404);
      }
      
      ApiResponseBuilder.success(res, deal, 'Deal updated successfully');
    } catch (error) {
      console.error('Error updating deal:', error);
      ApiResponseBuilder.error(res, 'Failed to update deal', 500);
    }
  }

  async updateDealStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const deal = await CRMService.updateDealStatus(id, status);
      
      if (!deal) {
        return ApiResponseBuilder.error(res, 'Deal not found', 404);
      }
      
      ApiResponseBuilder.success(res, deal, 'Deal status updated successfully');
    } catch (error) {
      console.error('Error updating deal status:', error);
      ApiResponseBuilder.error(res, 'Failed to update deal status', 500);
    }
  }

  async deleteDeal(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await CRMService.deleteDeal(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Deal not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Deal deleted successfully');
    } catch (error) {
      console.error('Error deleting deal:', error);
      ApiResponseBuilder.error(res, 'Failed to delete deal', 500);
    }
  }

  // Analytics
  async getCRMStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await CRMService.getCRMStats();
      ApiResponseBuilder.success(res, stats, 'CRM stats retrieved successfully');
    } catch (error) {
      console.error('Error getting CRM stats:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve CRM stats', 500);
    }
  }

  async getLeadsByStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await CRMService.getLeadsByStatus();
      ApiResponseBuilder.success(res, stats, 'Leads by status retrieved successfully');
    } catch (error) {
      console.error('Error getting leads by status:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve leads by status', 500);
    }
  }

  async getDealsByStage(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await CRMService.getDealsByStage();
      ApiResponseBuilder.success(res, stats, 'Deals by stage retrieved successfully');
    } catch (error) {
      console.error('Error getting deals by stage:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve deals by stage', 500);
    }
  }

  async getTopCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const topCustomers = await CRMService.getTopCustomersByValue(parseInt(limit as string));
      ApiResponseBuilder.success(res, topCustomers, 'Top customers retrieved successfully');
    } catch (error) {
      console.error('Error getting top customers:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve top customers', 500);
    }
  }
}

export default new CRMController();
