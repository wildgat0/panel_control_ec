import { useState } from 'react'
import { Square, Play, RotateCw, ScrollText, Box } from 'lucide-react'
import { apiFetch } from '../api.js'
import LogsModal from './LogsModal.jsx'

const STATE_CONFIG = {
  running:    { bg: 'rgba(16,192,72,0.1)',   color: '#10C048', border: 'rgba(16,192,72,0.25)',   label: 'Activo' },
  exited:     { bg: 'rgba(239,68,68,0.1)',    color: '#F87171', border: 'rgba(239,68,68,0.25)',    label: 'Detenido' },
  paused:     { bg: 'rgba(196,200,122,0.1)',  color: '#C4C87A', border: 'rgba(196,200,122,0.25)', label: 'Pausado' },
  restarting: { bg: 'rgba(10,122,42,0.15)',   color: '#0A7A2A', border: 'rgba(10,122,42,0.3)',    label: 'Reiniciando' },
}

export default function ContainerCard({ container, onAction }) {
  const [loadingAction, setLoadingAction] = useState(null)
  const [showLogs, setShowLogs] = useState(false)

  async function handleAction(action) {
    setLoadingAction(action)
    try {
      await apiFetch(`/api/containers/${container.id}/${action}`, { method: 'POST' })
      await onAction()
    } finally {
      setLoadingAction(null)
    }
  }

  const state = STATE_CONFIG[container.state] ?? STATE_CONFIG.exited
  const isRunning = container.state === 'running'
  const ports = container.ports?.filter(p => p.PublicPort).map(p => p.PublicPort).join(', ')

  return (
    <>
      <div className="rounded-xl flex flex-col overflow-hidden transition-all"
        style={{ backgroundColor: '#0D200D', border: '1px solid #1A3A1A' }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2A5A2A'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>

        <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(16,192,72,0.1)', border: '1px solid rgba(16,192,72,0.2)' }}>
                <Box size={15} color="#10C048" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-white truncate">{container.name}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: '#C4C87A' }}>{container.image}</p>
              </div>
            </div>
            <span className="shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: state.bg, color: state.color, border: `1px solid ${state.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.color,
                boxShadow: isRunning ? `0 0 6px ${state.color}` : 'none' }} />
              {state.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs" style={{ color: '#C4C87A' }}>
            <span>{container.status}</span>
            {ports && (
              <span className="px-2 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(196,200,122,0.08)', border: '1px solid #1A3A1A' }}>
                :{ports}
              </span>
            )}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center gap-2 flex-wrap" style={{ borderTop: '1px solid #1A3A1A' }}>
          {isRunning ? (
            <>
              <button onClick={() => handleAction('stop')} disabled={!!loadingAction}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Square size={11} />
                {loadingAction === 'stop' ? 'Deteniendo...' : 'Detener'}
              </button>
              <button onClick={() => handleAction('restart')} disabled={!!loadingAction}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(196,200,122,0.1)', color: '#C4C87A', border: '1px solid rgba(196,200,122,0.25)' }}>
                <RotateCw size={11} className={loadingAction === 'restart' ? 'animate-spin' : ''} />
                {loadingAction === 'restart' ? 'Reiniciando...' : 'Reiniciar'}
              </button>
            </>
          ) : (
            <button onClick={() => handleAction('start')} disabled={!!loadingAction}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              style={{ backgroundColor: 'rgba(16,192,72,0.1)', color: '#10C048', border: '1px solid rgba(16,192,72,0.25)' }}>
              <Play size={11} />
              {loadingAction === 'start' ? 'Iniciando...' : 'Iniciar'}
            </button>
          )}
          <button onClick={() => setShowLogs(true)}
            className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: '#C4C87A', border: '1px solid #1A3A1A' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10C048'; e.currentTarget.style.color = '#10C048' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
            <ScrollText size={11} />
            Logs
          </button>
        </div>
      </div>

      {showLogs && (
        <LogsModal container={container} onClose={() => setShowLogs(false)} />
      )}
    </>
  )
}
