'use client'
import { useState } from 'react'

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function SearchPanel({ onOpenYP }: { onOpenYP: () => void }) {
  const [cat, setCat] = useState('')
  const [loc, setLoc] = useState('')
  const [state, setState] = useState('')

  function openYP() {
    const q = encodeURIComponent(cat || 'business')
    const l = encodeURIComponent([loc, state].filter(Boolean).join(' ') || 'Australia')
    window.open(`https://www.yellowpages.com.au/search/listings?q=${q}&loc=${l}`, '_blank')
  }

  return (
    <div className="card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-yp-orange rounded flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </div>
        <span className="text-sm font-medium text-gray-700">Search Yellow Pages Australia</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <input className="input flex-1 min-w-[140px] text-sm py-1.5" placeholder="Business category (e.g. Plumber)"
          value={cat} onChange={e => setCat(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && openYP()} />
        <input className="input flex-1 min-w-[120px] text-sm py-1.5" placeholder="Suburb or city"
          value={loc} onChange={e => setLoc(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && openYP()} />
        <select className="input w-28 text-sm py-1.5" value={state} onChange={e => setState(e.target.value)}>
          <option value="">All states</option>
          {AU_STATES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openYP} className="btn-primary whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Open Yellow Pages
        </button>
      </div>
    </div>
  )
}
