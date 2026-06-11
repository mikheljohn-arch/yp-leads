'use client'
import { useMemo, useState } from 'react'
import { Lead, LeadStatus } from '@/lib/types'

export function useFilter(leads: Lead[]) {
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return [l.managing_director, l.company_name, l.email,
              l.phone, l.address, l.category].join(' ').toLowerCase().includes(q)
    }
    return true
  }), [leads, filter, search])

  return { filter, setFilter, search, setSearch, filtered }
}