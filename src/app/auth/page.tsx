'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [mode,     setMode    ] = useState<Mode>('login')
  const [email,    setEmail   ] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError   ] = useState('')
  const [loading,  setLoading ] = useState(false)
  const [done,     setDone    ] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setDone(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yp-orange rounded-xl mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">YP Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Yellow Pages Lead Generator · AU</p>
        </div>

        <div className="card p-6 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Check your email</p>
              <p className="text-sm text-gray-500 mt-1">Confirmation sent to <strong>{email}</strong></p>
              <button onClick={() => { setDone(false); setMode('login') }}
                className="mt-4 text-sm text-yp-orange hover:underline">Back to login</button>
            </div>
          ) : (
            <>
              <div className="flex rounded-lg border border-gray-200 mb-5 p-1 gap-1">
                {(['login', 'signup'] as Mode[]).map(m => (
                  <button key={m} onClick={() => { setMode(m); setError('') }}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition
                      ${mode === m ? 'bg-yp-orange text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    {m === 'login' ? 'Log in' : 'Sign up'}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input className="input" type="email" required autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input className="input" type="password" required minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                  {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}