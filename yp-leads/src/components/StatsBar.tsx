import { Lead } from '@/lib/types'

export default function StatsBar({ leads }: { leads: Lead[] }) {
  const stats = [
    { label: 'Total leads', value: leads.length, color: 'text-gray-900' },
    { label: 'New', value: leads.filter(l => l.status === 'new').length, color: 'text-green-600' },
    { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'text-blue-600' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: 'text-purple-600' },
    { label: 'Closed', value: leads.filter(l => l.status === 'closed').length, color: 'text-gray-400' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className="card px-4 py-3">
          <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
