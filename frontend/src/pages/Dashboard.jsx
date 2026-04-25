import { useState } from 'react'
import { LogOut, Container, Users, LayoutDashboard } from 'lucide-react'
import { removeToken } from '../api.js'
import Contenedores from './Contenedores.jsx'
import Usuarios from './Usuarios.jsx'

const TABS = [
  { key: 'contenedores', label: 'Contenedores', icon: Container },
  { key: 'usuarios',     label: 'Usuarios',     icon: Users },
]

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('contenedores')

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
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>Sistema de Control Ethos Corp</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all"
          style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10C048'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </header>

      <nav className="px-6 flex gap-1" style={{ borderBottom: '1px solid #1A3A1A' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 text-sm px-4 py-3 border-b-2 transition-all"
            style={{
              borderBottomColor: tab === key ? '#10C048' : 'transparent',
              color: tab === key ? '#10C048' : '#C4C87A',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {tab === 'contenedores' && <Contenedores />}
        {tab === 'usuarios'     && <Usuarios />}
      </main>
    </div>
  )
}
