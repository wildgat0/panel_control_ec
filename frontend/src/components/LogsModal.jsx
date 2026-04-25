import { useEffect, useRef, useState } from 'react'
import { X, RefreshCw, ArrowDown } from 'lucide-react'
import { apiFetch } from '../api.js'

export default function LogsModal({ container, onClose }) {
  const [logs, setLogs] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const bottomRef = useRef(null)

  async function fetchLogs(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    try {
      const res = await apiFetch(`/api/containers/${container.id}/logs`)
      const data = await res.json()
      setLogs(data.logs)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchLogs() }, [container.id])

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const lines = logs.split('\n').filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl flex flex-col rounded-2xl overflow-hidden"
        style={{ height: '80vh', border: '1px solid #1A3A1A', backgroundColor: '#050F05' }}>

        {/* Header tipo terminal */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0"
          style={{ backgroundColor: '#0D200D', borderBottom: '1px solid #1A3A1A' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F87171' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C4C87A' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10C048' }} />
            </div>
            <p className="text-xs font-mono" style={{ color: '#10C048' }}>
              {container.name} — logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollToBottom}
              title="Ir al final"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
              <ArrowDown size={11} /> Final
            </button>
            <button
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
              title="Actualizar"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
              style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
              <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} /> Actualizar
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
              style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F87171'; e.currentTarget.style.color = '#F87171' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Consola */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs" style={{ color: '#C4C87A' }}>
          {loading ? (
            <div className="flex items-center gap-2" style={{ color: '#10C048' }}>
              <RefreshCw size={13} className="animate-spin" />
              <span>Cargando logs...</span>
            </div>
          ) : lines.length === 0 ? (
            <span style={{ color: '#1A3A1A' }}>— Sin logs disponibles —</span>
          ) : (
            lines.map((line, i) => {
              const isError  = /error|fatal|exception|fail/i.test(line)
              const isWarn   = /warn|warning/i.test(line)
              const isOk     = /success|started|ready|listening|connected|ok/i.test(line)
              const color    = isError ? '#F87171' : isWarn ? '#C4C87A' : isOk ? '#10C048' : '#8AAA8A'

              return (
                <div key={i} className="flex gap-3 py-0.5 leading-relaxed"
                  style={{ borderBottom: '1px solid rgba(26,58,26,0.3)' }}>
                  <span className="shrink-0 select-none w-8 text-right" style={{ color: '#1A3A1A' }}>
                    {i + 1}
                  </span>
                  <span style={{ color, wordBreak: 'break-all' }}>{line}</span>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 flex items-center justify-between shrink-0 text-xs"
          style={{ backgroundColor: '#0D200D', borderTop: '1px solid #1A3A1A', color: '#1A3A1A' }}>
          <span>{lines.length} línea{lines.length !== 1 ? 's' : ''}</span>
          <span style={{ color: '#10C048' }}>● {container.state}</span>
        </div>
      </div>
    </div>
  )
}
