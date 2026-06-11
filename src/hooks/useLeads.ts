'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus } from '@/lib/types'

export function useLeads() {
  const supabase = createClient()
  const router   = useRouter()
  const [leads,     setLeads    ] = useState<Lead[]>([])
  const [loading,   setLoading  ] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth')
      else { setUserEmail(user.email ?? ''); fetchLeads() }
    })
  }, [fetchLeads, router, supabase.auth])

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

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return { leads, loading, userEmail, updateStatus, deleteLead, upsertLead, signOut }
}
