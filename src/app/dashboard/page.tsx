'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'
import LeadModal from '@/components/LeadModal'
import LeadCard from '@/components/LeadCard'
import StatsBar from '@/components/StatsBar'
import SearchPanel from '@/components/SearchPanel'

const STATUSES: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed', label: 'Closed' },
]

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; lead?: Lead }>({ open: false })
  const [userEmail, setUserEmail] = useState('')

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth')
      else { setUserEmail(user.email || ''); fetchLeads() }
    })
  }, [fetchLeads, router, supabase.auth])

  async function handleDelete(id: string) {
    if (!confirm('Remove this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    await supabase.from('leads').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  function exportCSV() {
    const headers = ['Managing Director', 'Title', 'Company', 'Address', 'Phone', 'Email', 'Category', 'Status', 'Notes', 'Date Added']
    const rows = leads.map(l => [l.managing_director, l.title, l.company_name, l.address, l.phone, l.email, l.category, l.status, l.notes, new Date(l.created_at).toLocaleDateString('en-AU')]
      .map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'yp_leads.csv'
    a.click()
  }

  const filtered = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return [l.managing_director, l.company_name, l.email, l.phone, l.address, l.category].join(' ').toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yp-orange rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">YP Leads</span>
            <span className="text-xs bg-orange-100 text-yp-orange px-2 py-0.5 rounded-full font-medium">AU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">{userEmail}</span>
            <button onClick={handleSignOut} className="btn-secondary text-xs px-3 py-1.5">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <SearchPanel onOpenYP={() => {}} />

        <StatsBar leads={leads} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 gap-1">
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => setFilter(s.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${filter === s.value ? 'bg-yp-orange text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <input className="input flex-1 min-w-[160px] max-w-xs text-xs py-1.5" placeholder="Search leads…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="ml-auto flex gap-2">
            <button onClick={exportCSV} className="btn-secondary text-xs px-3 py-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
            <button onClick={() => setModal({ open: true })} className="btn-primary text-xs px-3 py-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add lead
            </button>
          </div>
        </div>

        {/* Leads list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading leads…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <p className="font-medium text-gray-700">No leads yet</p>
            <p className="text-sm text-gray-400 mt-1">Search Yellow Pages or add a lead manually</p>
            <button onClick={() => setModal({ open: true })} className="btn-primary mt-4 mx-auto">Add first lead</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => (
              <LeadCard key={lead.id} lead={lead}
                onEdit={() => setModal({ open: true, lead })}
                onDelete={() => handleDelete(lead.id)}
                onStatusChange={(status) => handleStatusChange(lead.id, status)} />
            ))}
          </div>
        )}
      </main>

      {modal.open && (
        <LeadModal
          lead={modal.lead}
          onClose={() => setModal({ open: false })}
          onSaved={(lead) => {
            setLeads(prev => modal.lead
              ? prev.map(l => l.id === lead.id ? lead : l)
              : [lead, ...prev])
            setModal({ open: false })
          }}
        />
      )}
    </div>
  )
}
