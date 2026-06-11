import { LeadFormData, LeadStatus } from './types'

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'closed']

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', closed: 'Closed',
}

export const STATUS_STYLES: Record<LeadStatus, string> = {
  new:       'bg-green-50  text-green-700  border-green-200',
  contacted: 'bg-blue-50   text-blue-700   border-blue-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  closed:    'bg-gray-100  text-gray-500   border-gray-200',
}

export const BLANK_FORM: LeadFormData = {
  managing_director: '', title: '', company_name: '', address: '',
  phone: '', email: '', category: '', status: 'new', notes: '',
}

export const AU_STATES = ['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'] as const