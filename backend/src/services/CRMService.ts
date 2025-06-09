// filepath: backend/src/services/CRMService.ts
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import {
  Customer,
  Lead,
  Deal,
  CreateCustomerRequest,
  CreateLeadRequest,
  CreateDealRequest,
  UpdateCustomerRequest,
  UpdateLeadRequest,
  UpdateDealRequest,
  LeadStatus,
  DealStatus,
  CustomerStatus,
  CustomerSource,
  LeadStage,
  OpportunityStage,
  OpportunityStatus
} from '../types/crm';

export class CRMService {
  // Customers
  async getAllCustomers(): Promise<Customer[]> {
    return await db('customers')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await db('customers')
      .where('id', id)
      .first();
    
    return customer || null;
  }
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const customer: Omit<Customer, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      postal_code: data.postal_code,
      tax_id: data.tax_id,
      website: data.website,
      industry: data.industry,
      annual_revenue: data.annual_revenue,
      employees_count: data.employees_count,      status: data.status || CustomerStatus.ACTIVE,
      source: data.source || CustomerSource.OTHER,
      assigned_to: data.assigned_to,
      notes: data.notes
    };

    await db('customers').insert(customer);
    return await this.getCustomerById(customer.id) as Customer;
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('customers')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getCustomerById(id);
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const deleted = await db('customers')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return await db('leads')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async getLeadById(id: string): Promise<Lead | null> {
    const lead = await db('leads')
      .where('id', id)
      .first();
    
    return lead || null;
  }
  async createLead(data: CreateLeadRequest): Promise<Lead> {
    const lead: Omit<Lead, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      job_title: data.job_title,      source: data.source || CustomerSource.OTHER,
      status: data.status || LeadStatus.NEW,
      stage: data.stage || LeadStage.AWARENESS,
      value: data.value,
      probability: data.probability,
      assigned_to: data.assigned_to,
      notes: data.notes,
      expected_close_date: data.expected_close_date
    };

    await db('leads').insert(lead);
    return await this.getLeadById(lead.id) as Lead;
  }

  async updateLead(id: string, data: UpdateLeadRequest): Promise<Lead | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('leads')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getLeadById(id);
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
    return await this.updateLead(id, { status });
  }

  async deleteLead(id: string): Promise<boolean> {
    const deleted = await db('leads')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  async convertLeadToCustomer(leadId: string): Promise<{ customer: Customer; lead: Lead } | null> {
    const lead = await this.getLeadById(leadId);
    if (!lead) {
      return null;
    }    // Create customer from lead
    const customerData: CreateCustomerRequest = {
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      assigned_to: lead.assigned_to,
      notes: lead.notes,
      status: CustomerStatus.ACTIVE
    };

    const customer = await this.createCustomer(customerData);    // Update lead with customer_id and status
    const updatedLead = await this.updateLead(leadId, {
      status: LeadStatus.CLOSED_WON
    });

    return {
      customer,
      lead: updatedLead!
    };
  }

  // Deals
  async getAllDeals(): Promise<Deal[]> {
    return await db('deals')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  async getDealById(id: string): Promise<Deal | null> {
    const deal = await db('deals')
      .where('id', id)
      .first();
    
    return deal || null;
  }
  async createDeal(data: CreateDealRequest): Promise<Deal> {
    const deal: Omit<Deal, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: data.name,
      customer_id: data.customer_id,
      lead_id: data.lead_id,
      value: data.value,
      probability: data.probability || 50,
      stage: data.stage || OpportunityStage.PROSPECTING,
      status: data.status || OpportunityStatus.OPEN,
      assigned_to: data.assigned_to,
      expected_close_date: data.expected_close_date,
      description: data.description,
      notes: data.notes
    };

    await db('deals').insert(deal);
    return await this.getDealById(deal.id) as Deal;
  }

  async updateDeal(id: string, data: UpdateDealRequest): Promise<Deal | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('deals')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getDealById(id);
  }

  async updateDealStatus(id: string, status: DealStatus): Promise<Deal | null> {
    return await this.updateDeal(id, { status });
  }

  async deleteDeal(id: string): Promise<boolean> {
    const deleted = await db('deals')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  // Analytics and Reports
  async getCRMStats() {
    const [
      totalCustomers,
      totalLeads,
      totalDeals,
      totalDealsValue,
      newLeadsThisMonth,
      convertedLeadsThisMonth,
      closedDealsThisMonth
    ] = await Promise.all([
      db('customers').count('* as count').first(),
      db('leads').count('* as count').first(),
      db('deals').count('* as count').first(),
      db('deals').sum('value as total').first(),
      db('leads')
        .where('created_at', '>=', db.raw('DATE_TRUNC(\'month\', CURRENT_DATE)'))
        .count('* as count').first(),
      db('leads')
        .where('status', 'converted')
        .where('updated_at', '>=', db.raw('DATE_TRUNC(\'month\', CURRENT_DATE)'))
        .count('* as count').first(),
      db('deals')
        .where('status', 'won')
        .where('updated_at', '>=', db.raw('DATE_TRUNC(\'month\', CURRENT_DATE)'))
        .count('* as count').first()
    ]);

    return {
      customers: {
        total: parseInt(totalCustomers?.count as string) || 0
      },
      leads: {
        total: parseInt(totalLeads?.count as string) || 0,
        newThisMonth: parseInt(newLeadsThisMonth?.count as string) || 0,
        convertedThisMonth: parseInt(convertedLeadsThisMonth?.count as string) || 0
      },
      deals: {
        total: parseInt(totalDeals?.count as string) || 0,
        totalValue: parseFloat(totalDealsValue?.total as string) || 0,
        closedThisMonth: parseInt(closedDealsThisMonth?.count as string) || 0
      }
    };
  }

  async getLeadsByStatus(): Promise<Record<LeadStatus, number>> {
    const results = await db('leads')
      .select('status')
      .count('* as count')
      .groupBy('status');    const statusCounts: Record<LeadStatus, number> = {
      [LeadStatus.NEW]: 0,
      [LeadStatus.CONTACTED]: 0,
      [LeadStatus.QUALIFIED]: 0,
      [LeadStatus.PROPOSAL]: 0,
      [LeadStatus.NEGOTIATION]: 0,
      [LeadStatus.CLOSED_WON]: 0,
      [LeadStatus.CLOSED_LOST]: 0
    };

    results.forEach(row => {
      statusCounts[row.status as LeadStatus] = parseInt(row.count as string);
    });

    return statusCounts;
  }

  async getDealsByStage(): Promise<Record<string, number>> {
    const results = await db('deals')
      .select('stage')
      .count('* as count')
      .groupBy('stage');

    const stageCounts: Record<string, number> = {};
    results.forEach(row => {
      stageCounts[row.stage] = parseInt(row.count as string);
    });

    return stageCounts;
  }

  async getTopCustomersByValue(limit: number = 10): Promise<Array<{ customer: Customer; totalValue: number }>> {
    const results = await db('customers')
      .leftJoin('deals', 'customers.id', 'deals.customer_id')
      .select('customers.*')
      .sum('deals.value as total_value')
      .groupBy('customers.id')
      .orderBy('total_value', 'desc')
      .limit(limit);    return results.map((row: any) => ({
      customer: {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        city: row.city,
        country: row.country,
        postal_code: row.postal_code,
        tax_id: row.tax_id,
        website: row.website,
        industry: row.industry,
        annual_revenue: row.annual_revenue,
        employees_count: row.employees_count,
        status: row.status,
        source: row.source || CustomerSource.OTHER,
        assigned_to: row.assigned_to,
        notes: row.notes,
        last_contact: row.last_contact,
        created_at: row.created_at,
        updated_at: row.updated_at
      } as Customer,
      totalValue: parseFloat(row.total_value) || 0
    }));
  }
}

export default new CRMService();
