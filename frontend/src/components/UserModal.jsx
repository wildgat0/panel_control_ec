import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { apiFetch } from '../api.js'

const inputStyle = {
  backgroundColor: '#050F05',
  border: '1.5px solid #1A3A1A',
  color: 'white',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
}

export default function UserModal({ usuario, onClose, onSaved }) {
  const isNuevo = !usuario
  const [form, setForm] = useState({
    nombre:   usuario?.nombre   ?? '',
    email:    usuario?.email    ?? '',
    password: '',
    rol:      usuario?.rol      ?? 'cliente',
  })
  const [error, setError]       = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const body = { ...form }
      if (!body.password) delete body.password

      const res = isNuevo
        ? await apiFetch('/api/users', { method: 'POST', body: JSON.stringify(body) })
        : await apiFetch(`/api/users/${usuario.id}`, { method: 'PUT', body: JSON.stringify(body) })

      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      onSaved()
      onClose()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#0A1A0A', border: '1px solid #1A3A1A' }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: '#0D200D', borderBottom: '1px solid #1A3A1A' }}>
          <div>
            <h2 className="text-sm font-bold text-white">
              {isNuevo ? 'Nuevo usuario' : `Editar — ${usuario.nombre}`}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>
              {isNuevo ? 'Completa los datos del nuevo usuario' : 'Modifica los datos del usuario'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F87171'; e.currentTarget.style.color = '#F87171' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1A3A1A'; e.currentTarget.style.color = '#C4C87A' }}>
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
              Nombre completo
            </label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              placeholder="Ej: Juan Pérez"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#10C048'}
              onBlur={(e)  => e.target.style.borderColor = '#1A3A1A'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
              Email / Usuario
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="Ej: juan@empresa.cl"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#10C048'}
              onBlur={(e)  => e.target.style.borderColor = '#1A3A1A'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
              Contraseña
              {!isNuevo && <span className="ml-1 normal-case font-normal" style={{ color: '#1A3A1A' }}>(dejar vacío para no cambiar)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={isNuevo}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#10C048'}
              onBlur={(e)  => e.target.style.borderColor = '#1A3A1A'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
              Rol
            </label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#10C048'}
              onBlur={(e)  => e.target.style.borderColor = '#1A3A1A'}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && (
            <p className="text-xs rounded-lg px-3 py-2"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={guardando}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: '#10C048', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A7A2A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10C048'}>
              <Save size={14} />
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
