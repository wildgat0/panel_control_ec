import { Layers, ChevronRight } from 'lucide-react'

export default function ProjectCard({ project, containers, onClick }) {
  const running = containers.filter(c => c.state === 'running').length
  const total   = containers.length
  const allUp   = running === total
  const allDown = running === 0
  const partial = !allUp && !allDown

  const statusColor  = allUp ? '#10C048' : allDown ? '#F87171' : '#C4C87A'
  const statusBg     = allUp ? 'rgba(16,192,72,0.1)' : allDown ? 'rgba(239,68,68,0.1)' : 'rgba(196,200,122,0.1)'
  const statusBorder = allUp ? 'rgba(16,192,72,0.25)' : allDown ? 'rgba(239,68,68,0.25)' : 'rgba(196,200,122,0.25)'
  const statusLabel  = allUp ? 'Activo' : allDown ? 'Detenido' : 'Parcial'

  return (
    <button onClick={onClick}
      className="w-full text-left rounded-xl p-4 flex flex-col gap-4 transition-all"
      style={{ backgroundColor: '#0D200D', border: '1px solid #1A3A1A' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2A5A2A'; e.currentTarget.style.backgroundColor = '#112811' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.backgroundColor = '#0D200D' }}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: statusBg, border: `1px solid ${statusBorder}` }}>
            <Layers size={18} color={statusColor} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate capitalize">{project}</p>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>
              {total} servicio{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
            style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusBorder}` }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor, boxShadow: allUp ? `0 0 6px ${statusColor}` : 'none' }} />
            {statusLabel}
          </span>
          <ChevronRight size={14} color="#1A3A1A" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {containers.map(c => (
          <div key={c.id} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A3A1A' }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: c.state === 'running' ? '#10C048' : '#F87171' }} />
            <span style={{ color: '#C4C87A' }}>{c.service || c.name}</span>
          </div>
        ))}
      </div>

      <div className="w-full rounded-full overflow-hidden" style={{ height: 4, backgroundColor: '#1A3A1A' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${(running / total) * 100}%`, backgroundColor: partial ? '#C4C87A' : statusColor }} />
      </div>
    </button>
  )
}
