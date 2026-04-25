import { useState } from 'react'
import { X, Play, Square } from 'lucide-react'
import { apiFetch } from '../api.js'
import ContainerCard from './ContainerCard.jsx'

export default function ProjectModal({ project, containers, onClose, onAction }) {
  const [bulkLoading, setBulkLoading] = useState(null) // null | 'start' | 'stop'

  async function handleBulk(action) {
    const targets = action === 'start'
      ? containers.filter(c => c.state !== 'running')
      : containers.filter(c => c.state === 'running')

    if (targets.length === 0) return

    setBulkLoading(action)
    try {
      await Promise.all(
        targets.map(c => apiFetch(`/api/containers/${c.id}/${action}`, { method: 'POST' }))
      )
      await onAction()
    } finally {
      setBulkLoading(null)
    }
  }

  const runningCount = containers.filter(c => c.state === 'running').length
  const stoppedCount = containers.length - runningCount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A3A1A' }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between gap-4 shrink-0"
          style={{ borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(90deg, #0D200D 0%, #0A1A0A 100%)' }}>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white capitalize truncate">{project}</h2>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>
              {containers.length} servicio{containers.length !== 1 ? 's' : ''} · {runningCount} activo{runningCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Levantar todos */}
            <button
              onClick={() => handleBulk('start')}
              disabled={!!bulkLoading || stoppedCount === 0}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'rgba(16,192,72,0.1)', color: '#10C048', border: '1px solid rgba(16,192,72,0.25)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(16,192,72,0.2)' }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(16,192,72,0.1)'}>
              <Play size={11} />
              {bulkLoading === 'start' ? 'Levantando...' : 'Levantar todos'}
            </button>

            {/* Bajar todos */}
            <button
              onClick={() => handleBulk('stop')}
              disabled={!!bulkLoading || runningCount === 0}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)' }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}>
              <Square size={11} />
              {bulkLoading === 'stop' ? 'Bajando...' : 'Bajar todos'}
            </button>

            {/* Cerrar */}
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F87171'; e.currentTarget.style.color = '#F87171' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Lista de contenedores */}
        <div className="overflow-y-auto p-5">
          <div className="flex flex-col gap-2">
            {containers.map(c => (
              <ContainerCard key={c.id} container={c} onAction={onAction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
