'use client'
import { Lead, LeadStatus } from '@/lib/types'

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-green-50 text-green-700 border-green-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'closed']

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?'
}

export default function LeadCard({ lead, onEdit, onDelete, onStatusChange }:
  { lead: Lead; onEdit: () => void; onDelete: () => void; onStatusChange: (s: LeadStatus) => void }) {
  return (
    <div className="card p-4 hover:shadow-sm transition flex gap-3 items-start">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-orange-100 text-yp-orange flex items-center justify-center text-xs font-semibold flex-shrink-0">
        {initials(lead.managing_director || lead.company_name)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-medium text-gray-900 text-sm">{lead.managing_director || '—'}</span>
          {lead.title && <span className="text-xs text-gray-400">{lead.title}</span>}
          <select value={lead.status} onChange={e => onStatusChange(e.target.value as LeadStatus)}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer focus:outline-none ${STATUS_STYLES[lead.status]}`}
            style={{ appearance: 'none' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="text-sm font-medium text-gray-700">
          {lead.company_name}
          {lead.category && <span className="text-gray-400 font-normal"> · {lead.category}</span>}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
          {lead.address && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {lead.address}
            </span>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 hover:text-yp-orange flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {lead.phone}
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {lead.email}
            </a>
          )}
        </div>

        {lead.notes && <p className="text-xs text-gray-400 italic mt-1">{lead.notes}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  )
}
