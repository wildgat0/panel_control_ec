import { useState } from 'react'
import { Square, Play, RotateCw, ScrollText, Box } from 'lucide-react'
import { apiFetch } from '../api.js'
import LogsModal from './LogsModal.jsx'

const STATE_CONFIG = {
  running:    { color: '#10C048', border: 'rgba(16,192,72,0.35)',  label: 'Activo' },
  exited:     { color: '#F87171', border: 'rgba(239,68,68,0.35)',  label: 'Detenido' },
  paused:     { color: '#C4C87A', border: 'rgba(196,200,122,0.35)', label: 'Pausado' },
  restarting: { color: '#0A7A2A', border: 'rgba(10,122,42,0.35)',  label: 'Reiniciando' },
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
      <div
        className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all"
        style={{
          backgroundColor: '#0D200D',
          border: '1px solid #1A3A1A',
          borderLeft: `3px solid ${state.color}`,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#112811'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0D200D'}
      >
        {/* Ícono */}
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(16,192,72,0.1)', border: '1px solid rgba(16,192,72,0.2)' }}>
          <Box size={18} color="#10C048" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{container.name}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: '#C4C87A' }}>
            {container.image}
            {ports && <span className="ml-2 opacity-70">:{ports}</span>}
          </p>
        </div>

        {/* Badge estado */}
        <span className="shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ backgroundColor: `${state.color}18`, color: state.color, border: `1px solid ${state.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{
            backgroundColor: state.color,
            boxShadow: isRunning ? `0 0 6px ${state.color}` : 'none'
          }} />
          {state.label}
        </span>

        {/* Acciones */}
        <div className="shrink-0 flex items-center gap-1.5">
          {isRunning ? (
            <>
              <button onClick={() => handleAction('stop')} disabled={!!loadingAction}
                title="Detener"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}>
                <Square size={10} />
                {loadingAction === 'stop' ? 'Deteniendo...' : 'Detener'}
              </button>
              <button onClick={() => handleAction('restart')} disabled={!!loadingAction}
                title="Reiniciar"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(196,200,122,0.08)', color: '#C4C87A', border: '1px solid rgba(196,200,122,0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(196,200,122,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(196,200,122,0.08)'}>
                <RotateCw size={10} className={loadingAction === 'restart' ? 'animate-spin' : ''} />
                {loadingAction === 'restart' ? 'Reiniciando...' : 'Reiniciar'}
              </button>
            </>
          ) : (
            <button onClick={() => handleAction('start')} disabled={!!loadingAction}
              title="Iniciar"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
              style={{ backgroundColor: 'rgba(16,192,72,0.08)', color: '#10C048', border: '1px solid rgba(16,192,72,0.2)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(16,192,72,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(16,192,72,0.08)'}>
              <Play size={10} />
              {loadingAction === 'start' ? 'Iniciando...' : 'Iniciar'}
            </button>
          )}

          <button onClick={() => setShowLogs(true)}
            title="Logs"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{ color: '#C4C87A', border: '1px solid #1A3A1A' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10C048'; e.currentTarget.style.color = '#10C048' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
            <ScrollText size={10} />
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
