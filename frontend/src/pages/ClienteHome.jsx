import { LogOut, LayoutDashboard, Clock } from 'lucide-react'
import { removeToken } from '../api.js'

export default function ClienteHome({ nombre, onLogout }) {
  function handleLogout() {
    removeToken()
    onLogout()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A1A0A' }}>
      <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1A3A1A', background: 'linear-gradient(90deg, #0D200D 0%, #0A1A0A 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10C048' }}>
            <LayoutDashboard size={18} color="white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-widest leading-none" style={{ color: '#10C048' }}>SISCOETHOS</h1>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>Bienvenido, {nombre}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all"
          style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10C048'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: 'rgba(196,200,122,0.1)', border: '1px solid rgba(196,200,122,0.2)' }}>
            <Clock size={28} color="#C4C87A" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Próximamente</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#C4C87A' }}>
            Tu sección de pagos estará disponible pronto. Te notificaremos cuando esté lista.
          </p>
        </div>
      </main>
    </div>
  )
}
