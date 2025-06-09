import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CRMDashboard from './CRMDashboard'
import CustomersPage from './CustomersPage'
import LeadsPage from './LeadsPage'
import InvoicesPage from './InvoicesPage'

/**
 * Módulo CRM - inspirado en Crater
 * Conserva tu arquitectura modular pero con funcionalidades CRM completas
 */
const CRMModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CRMDashboard />} />
      <Route path="/dashboard" element={<CRMDashboard />} />
      <Route path="/customers/*" element={<CustomersPage />} />
      <Route path="/leads/*" element={<LeadsPage />} />
      <Route path="/invoices/*" element={<InvoicesPage />} />
      <Route path="*" element={<Navigate to="/crm/dashboard" replace />} />
    </Routes>
  )
}

export default CRMModule
