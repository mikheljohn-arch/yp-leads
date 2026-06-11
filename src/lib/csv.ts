import { Lead } from './types'

const HEADERS = ['Managing Director','Title','Company','Address','Phone',
  'Email','Category','Status','Notes','Date Added']

function cell(v: string) {
  return `"${(v ?? '').replace(/"/g, '""')}"`
}

export function downloadCSV(leads: Lead[]) {
  const rows = leads.map(l =>
    [l.managing_director, l.title, l.company_name, l.address, l.phone,
     l.email, l.category, l.status, l.notes,
     new Date(l.created_at).toLocaleDateString('en-AU')].map(cell).join(',')
  )
  const csv = [HEADERS.join(','), ...rows].join('\n')
  const a   = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'yp_leads.csv',
  })
  a.click()
  URL.revokeObjectURL(a.href)
}