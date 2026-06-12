'use client'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Lead, LeadStatus } from '@/lib/types'

export function useLeads() {
  const [leads,   setLeads  ] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(id: string, status: LeadStatus) {
    await supabase.from('leads')
      .update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteLead(id: string) {
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  function upsertLead(lead: Lead) {
    setLeads(prev => {
      const exists = prev.some(l => l.id === lead.id)
      return exists
        ? prev.map(l => l.id === lead.id ? lead : l)
        : [lead, ...prev]
    })
  }

  return { leads, loading, updateStatus, deleteLead, upsertLead }
}