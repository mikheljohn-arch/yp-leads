'use client'
import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { useFilter } from '@/hooks/useFilter'
import { downloadCSV } from '@/lib/csv'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus, LeadFormData } from '@/lib/types'
import { AU_STATES, LEAD_STATUSES, STATUS_LABELS, STATUS_STYLES, BLANK_FORM } from '@/lib/constants'

function Icon({ d, size = 'w-4 h-4' }: { d: string; size?: string }) {
  return (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  )
}

const ICONS = {
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  search:   'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  plus:     'M12 4v16m8-8H4',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  external: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  pin:      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  phone:    'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  mail:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  edit:     'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  trash:    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  close:    'M6 18L18 6M6 6l12 12',
  clip:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase() || '?'
}

function LeadCard({ lead, onEdit, onDelete, onStatusChange }: {
  lead: Lead
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (s: LeadStatus) => void
}) {
  return (
    <div className="card p-4 hover:shadow-sm transition flex gap-3 items-start">
      <div className="w-9 h-9 rounded-full bg-orange-100 text-yp-orange flex items-center justify-center text-xs font-semibold flex-shrink-0">
        {initials(lead.managing_director || lead.company_name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-gray-900">{lead.managing_director || '—'}</span>
          {lead.title && <span className="text-xs text-gray-400">{lead.title}</span>}
          <select value={lead.status} onChange={e => onStatusChange(e.target.value as LeadStatus)}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer focus:outline-none ${STATUS_STYLES[lead.status]}`}
            style={{ appearance: 'none' }}>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div className="text-sm font-medium text-gray-700">
          {lead.company_name}
          {lead.category && <span className="text-gray-400 font-normal"> · {lead.category}</span>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
          {lead.address && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Icon d={ICONS.pin} size="w-3 h-3" />{lead.address}
            </span>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 hover:text-yp-orange flex items-center gap-1">
              <Icon d={ICONS.phone} size="w-3 h-3" />{lead.phone}
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Icon d={ICONS.mail} size="w-3 h-3" />{lead.email}
            </a>
          )}
        </div>
        {lead.notes && <p className="text-xs text-gray-400 italic mt-1">{lead.notes}</p>}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
          <Icon d={ICONS.edit} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
          <Icon d={ICONS.trash} />
        </button>
      </div>
    </div>
  )
}

function LeadModal({ lead, onClose, onSaved }: {
  lead?: Lead
  onClose: () => void
  onSaved: (lead: Lead) => void
}) {
  const supabase = createClient()
  const [form, setForm] = useState<LeadFormData>(lead ? {
    managing_director: lead.managing_director, title: lead.title,
    company_name: lead.company_name, address: lead.address,
    phone: lead.phone, email: lead.email, category: lead.category,
    status: lead.status, notes: lead.notes,
  } : { ...BLANK_FORM })
  const [saving, setSaving] = useState(false)
  const [error,  setError ] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    if (!form.company_name && !form.managing_director) {
      setError('Enter a company name or contact name.'); return
    }
    setSaving(true); setError('')
    const now = new Date().toISOString()
    if (lead) {
      const { data, error: err } = await supabase.from('leads')
        .update({ ...form, updated_at: now }).eq('id', lead.id).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      onSaved(data as Lead)
    } else {
      const { data, error: err } = await supabase.from('leads')
        .insert([{ ...form, created_at: now, updated_at: now }]).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      onSaved(data as Lead)
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{lead ? 'Edit lead' : 'Add new lead'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icon d={ICONS.close} size="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Managing director</label>
              <input className="input" value={form.managing_director}
                onChange={e => set('managing_director', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Job title</label>
              <input className="input" value={form.title}
                onChange={e => set('title', e.target.value)} placeholder="e.g. Managing Director" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Company name *</label>
            <input className="input" value={form.company_name}
              onChange={e => set('company_name', e.target.value)} placeholder="Business name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input className="input" value={form.address}
              onChange={e => set('address', e.target.value)} placeholder="Street, Suburb, State, Postcode" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input className="input" value={form.phone}
                onChange={e => set('phone', e.target.value)} placeholder="02 XXXX XXXX" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="email@company.com.au" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <input className="input" value={form.category}
                onChange={e => set('category', e.target.value)} placeholder="e.g. Plumber" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <input className="input" value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Optional notes…" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : lead ? 'Save changes' : 'Add lead'}
          </button>
        </div>
      </div>
    </div>
  )
}

const FILTERS = [
  { value: 'all' as const,       label: 'All'       },
  { value: 'new' as const,       label: 'New'       },
  { value: 'contacted' as const, label: 'Contacted' },
  { value: 'qualified' as const, label: 'Qualified' },
  { value: 'closed' as const,    label: 'Closed'    },
]

export default function DashboardPage() {
  const { leads, loading, userEmail, updateStatus, deleteLead, upsertLead, signOut } = useLeads()
  const { filter, setFilter, search, setSearch, filtered } = useFilter(leads)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLead, setModalLead] = useState<Lead | undefined>()
  const [cat, setCat] = useState('')
  const [loc, setLoc] = useState('')
  const [state, setState] = useState('')

  function openYP() {
    const q = encodeURIComponent(cat || 'business')
    const l = encodeURIComponent([loc, state].filter(Boolean).join(' ') || 'Australia')
    window.open(`https://www.yellowpages.com.au/search/listings?q=${q}&loc=${l}`, '_blank', 'noopener')
  }

  const stats = [
    { label: 'Total',     value: leads.length,                                       color: 'text-gray-900'   },
    { label: 'New',       value: leads.filter(l => l.status === 'new').length,       color: 'text-green-600'  },
    { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'text-blue-600'   },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: 'text-purple-600' },
    { label: 'Closed',    value: leads.filter(l => l.status === 'closed').length,    color: 'text-gray-400'   },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yp-orange rounded-lg flex items-center justify-center">
              <Icon d={ICONS.building} size="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-900">YP Leads</span>
            <span className="text-xs bg-orange-100 text-yp-orange px-2 py-0.5 rounded-full font-medium">AU</span>
          </div>
          <div className="flex items-center gap-2">
            {userEmail && <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>}
            <button onClick={signOut} className="btn-secondary text-xs px-3 py-1.5">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Search Yellow Pages */}
        <div className="card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-yp-orange rounded flex items-center justify-center flex-shrink-0">
              <Icon d={ICONS.search} size="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-gray-700">Search Yellow Pages Australia</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <input className="input flex-1 min-w-[140px] text-sm py-1.5" placeholder="Category (e.g. Plumber)"
              value={cat} onChange={e => setCat(e.target.value)} onKeyDown={e => e.key === 'Enter' && openYP()} />
            <input className="input flex-1 min-w-[120px] text-sm py-1.5" placeholder="Suburb or city"
              value={loc} onChange={e => setLoc(e.target.value)} onKeyDown={e => e.key === 'Enter' && openYP()} />
            <select className="input w-28 text-sm py-1.5" value={state} onChange={e => setState(e.target.value)}>
              <option value="">All states</option>
              {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={openYP} className="btn-primary whitespace-nowrap">
              <Icon d={ICONS.external} size="w-4 h-4" /> Open Yellow Pages
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map(s => (
            <div key={s.label} className="card px-4 py-3">
              <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 gap-1">
            {FILTERS.map(o => (
              <button key={o.value} onClick={() => setFilter(o.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition
                  ${filter === o.value ? 'bg-yp-orange text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                {o.label}
              </button>
            ))}
          </div>
          <input className="input flex-1 min-w-[160px] max-w-xs text-xs py-1.5" placeholder="Search leads…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="ml-auto flex gap-2">
            <button onClick={() => downloadCSV(leads)} className="btn-secondary text-xs px-3 py-1.5">
              <Icon d={ICONS.download} size="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={() => { setModalLead(undefined); setModalOpen(true) }} className="btn-primary text-xs px-3 py-1.5">
              <Icon d={ICONS.plus} size="w-3.5 h-3.5" /> Add lead
            </button>
          </div>
        </div>

        {/* Lead list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading leads…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon d={ICONS.clip} size="w-6 h-6" />
            </div>
            <p className="font-medium text-gray-700">No leads yet</p>
            <p className="text-sm text-gray-400 mt-1">Search Yellow Pages or add a lead manually</p>
            <button onClick={() => { setModalLead(undefined); setModalOpen(true) }}
              className="btn-primary mt-4 mx-auto">Add first lead</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => (
              <LeadCard key={lead.id} lead={lead}
                onEdit={() => { setModalLead(lead); setModalOpen(true) }}
                onDelete={async () => { if (confirm('Remove this lead?')) await deleteLead(lead.id) }}
                onStatusChange={s => updateStatus(lead.id, s)} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <LeadModal
          lead={modalLead}
          onClose={() => setModalOpen(false)}
          onSaved={lead => { upsertLead(lead); setModalOpen(false) }}
        />
      )}
    </div>
  )
}