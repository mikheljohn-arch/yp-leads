'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus } from '@/lib/types'

const BLANK = { managing_director: '', title: '', company_name: '', address: '', phone: '', email: '', category: '', status: 'new' as LeadStatus, notes: '' }

export default function LeadModal({ lead, onClose, onSaved }: {
  lead?: Lead; onClose: () => void; onSaved: (lead: Lead) => void
}) {
  const supabase = createClient()
  const [form, setForm] = useState(lead ? {
    managing_director: lead.managing_director,
    title: lead.title,
    company_name: lead.company_name,
    address: lead.address,
    phone: lead.phone,
    email: lead.email,
    category: lead.category,
    status: lead.status,
    notes: lead.notes,
  } : { ...BLANK })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave() {
    if (!form.company_name && !form.managing_director) { setError('Enter a company name or contact name.'); return }
    setSaving(true); setError('')
    const now = new Date().toISOString()
    if (lead) {
      const { data, error: err } = await supabase.from('leads').update({ ...form, updated_at: now }).eq('id', lead.id).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      onSaved(data as Lead)
    } else {
      const { data, error: err } = await supabase.from('leads').insert([{ ...form, created_at: now, updated_at: now }]).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      onSaved(data as Lead)
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{lead ? 'Edit lead' : 'Add new lead'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Managing director / contact</label>
              <input className="input" value={form.managing_director} onChange={e => set('managing_director', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Job title</label>
              <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Managing Director" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Company name *</label>
            <input className="input" value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="Business name" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, Suburb, State, Postcode" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="02 XXXX XXXX" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@company.com.au" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Business category</label>
              <input className="input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Plumber" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <input className="input" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes…" />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : lead ? 'Save changes' : 'Add lead'}
          </button>
        </div>
      </div>
    </div>
  )
}
