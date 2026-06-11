export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed'

export interface Lead {
  id: string
  user_id: string
  managing_director: string
  title: string
  company_name: string
  address: string
  phone: string
  email: string
  category: string
  status: LeadStatus
  notes: string
  created_at: string
  updated_at: string
}

export type LeadFormData = Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>