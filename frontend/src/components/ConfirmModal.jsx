import { TriangleAlert } from 'lucide-react'

export default function ConfirmModal({ title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A3A1A' }}>

        <div className="px-5 pt-6 pb-5 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <TriangleAlert size={22} color="#F87171" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {message && (
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#C4C87A' }}>{message}</p>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.22)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)'}>
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm transition-all"
            style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
