import { useEffect, useState } from 'react'
import { UserPlus, Pencil, Trash2, ShieldCheck, User, ToggleLeft, ToggleRight } from 'lucide-react'
import { apiFetch } from '../api.js'
import UserModal from '../components/UserModal.jsx'

function Initials({ nombre }) {
  const letters = nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ backgroundColor: 'rgba(16,192,72,0.15)', color: '#10C048', border: '1px solid rgba(16,192,72,0.25)' }}>
      {letters}
    </div>
  )
}

export default function Usuarios() {
  const [usuarios, setUsuarios]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null) // null | 'nuevo' | usuario

  async function fetchUsuarios() {
    try {
      const res = await apiFetch('/api/users')
      setUsuarios(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este usuario?')) return
    await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
    await fetchUsuarios()
  }

  async function toggleActivo(u) {
    await apiFetch(`/api/users/${u.id}`, { method: 'PUT', body: JSON.stringify({ activo: !u.activo }) })
    await fetchUsuarios()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Usuarios</h2>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>
              {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setModal('nuevo')}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#10C048', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A7A2A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10C048'}>
            <UserPlus size={13} />
            Nuevo usuario
          </button>
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: '#C4C87A' }}>Cargando...</p>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ border: '1px dashed #1A3A1A' }}>
            <User size={32} color="#1A3A1A" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: '#C4C87A' }}>No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1A3A1A' }}>
            {usuarios.map((u, i) => (
              <div key={u.id}
                className="px-4 py-3 flex items-center justify-between gap-4 transition-all"
                style={{
                  backgroundColor: u.activo ? '#0D200D' : 'rgba(13,32,13,0.4)',
                  borderTop: i > 0 ? '1px solid #1A3A1A' : 'none',
                  opacity: u.activo ? 1 : 0.6,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = u.activo ? '#112811' : 'rgba(17,40,17,0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = u.activo ? '#0D200D' : 'rgba(13,32,13,0.4)'}>

                <div className="flex items-center gap-3 min-w-0">
                  <Initials nombre={u.nombre} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.nombre}</p>
                    <p className="text-xs truncate" style={{ color: '#C4C87A' }}>{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: u.rol === 'admin' ? 'rgba(16,192,72,0.1)' : 'rgba(196,200,122,0.1)',
                      color: u.rol === 'admin' ? '#10C048' : '#C4C87A',
                      border: `1px solid ${u.rol === 'admin' ? 'rgba(16,192,72,0.25)' : 'rgba(196,200,122,0.25)'}`,
                    }}>
                    {u.rol === 'admin' ? <ShieldCheck size={10} /> : <User size={10} />}
                    {u.rol === 'admin' ? 'Admin' : 'Cliente'}
                  </span>

                  <button onClick={() => toggleActivo(u)} title={u.activo ? 'Desactivar' : 'Activar'}
                    style={{ color: u.activo ? '#10C048' : '#C4C87A' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    {u.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>

                  <button onClick={() => setModal(u)} title="Editar"
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: '#C4C87A', border: '1px solid transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#C4C87A' }}>
                    <Pencil size={13} />
                  </button>

                  <button onClick={() => handleEliminar(u.id)} title="Eliminar"
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: '#F87171', border: '1px solid transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <UserModal
          usuario={modal === 'nuevo' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchUsuarios}
        />
      )}
    </>
  )
}
