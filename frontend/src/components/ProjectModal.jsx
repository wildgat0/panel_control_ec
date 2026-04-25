import { X } from 'lucide-react'
import ContainerCard from './ContainerCard.jsx'

export default function ProjectModal({ project, containers, onClose, onAction }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A3A1A' }}>

        <div className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(90deg, #0D200D 0%, #0A1A0A 100%)' }}>
          <div>
            <h2 className="text-base font-bold text-white capitalize">{project}</h2>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>
              {containers.length} servicio{containers.length !== 1 ? 's' : ''} · {containers.filter(c => c.state === 'running').length} activo{containers.filter(c => c.state === 'running').length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F87171'; e.currentTarget.style.color = '#F87171' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
            <X size={15} />
          </button>
        </div>

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
