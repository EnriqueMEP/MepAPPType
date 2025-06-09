// filepath: backend/src/routes/crm.ts
import { Router } from 'express';
import CRMController from '@/controllers/CRMController';
import authenticateToken from '@/middleware/auth';
import rateLimiter from '@/middleware/rateLimiting';

const router = Router();

// Apply authentication and rate limiting to all routes
router.use(authenticateToken.authenticate);
router.use(rateLimiter.apiLimiter);

// Customer routes
router.get('/customers', CRMController.getAllCustomers);
router.get('/customers/:id', CRMController.getCustomerById);
router.post('/customers', CRMController.createCustomer);
router.put('/customers/:id', CRMController.updateCustomer);
router.delete('/customers/:id', CRMController.deleteCustomer);

// Lead routes
router.get('/leads', CRMController.getAllLeads);
router.get('/leads/:id', CRMController.getLeadById);
router.post('/leads', CRMController.createLead);
router.put('/leads/:id', CRMController.updateLead);
router.patch('/leads/:id/status', CRMController.updateLeadStatus);
router.delete('/leads/:id', CRMController.deleteLead);
router.post('/leads/:id/convert', CRMController.convertLeadToCustomer);

// Deal routes
router.get('/deals', CRMController.getAllDeals);
router.get('/deals/:id', CRMController.getDealById);
router.post('/deals', CRMController.createDeal);
router.put('/deals/:id', CRMController.updateDeal);
router.patch('/deals/:id/status', CRMController.updateDealStatus);
router.delete('/deals/:id', CRMController.deleteDeal);

// Analytics routes
router.get('/stats', CRMController.getCRMStats);
router.get('/stats/leads-by-status', CRMController.getLeadsByStatus);
router.get('/stats/deals-by-stage', CRMController.getDealsByStage);
router.get('/stats/top-customers', CRMController.getTopCustomers);

export default router;
