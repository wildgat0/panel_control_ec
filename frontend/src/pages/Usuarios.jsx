import { useEffect, useState } from 'react'
import { UserPlus, Pencil, Trash2, ShieldCheck, User, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { apiFetch } from '../api.js'

const EMPTY_FORM = { nombre: '', email: '', password: '', rol: 'cliente' }

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
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function fetchUsuarios() {
    try {
      const res = await apiFetch('/api/users')
      setUsuarios(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  function handleEditar(u) {
    setEditando(u.id)
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol })
    setError(null)
  }

  function handleCancelar() {
    setEditando(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const body = { ...form }
      if (!body.password) delete body.password
      const res = editando
        ? await apiFetch(`/api/users/${editando}`, { method: 'PUT', body: JSON.stringify(body) })
        : await apiFetch('/api/users', { method: 'POST', body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      await fetchUsuarios()
      handleCancelar()
    } finally {
      setGuardando(false)
    }
  }

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
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Usuarios</h2>
          <p className="text-xs mt-0.5" style={{ color: '#C4C87A' }}>{usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}</p>
        </div>
        {!editando && (
          <button
            onClick={() => { setEditando('nuevo'); setForm(EMPTY_FORM) }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#10C048', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A7A2A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10C048'}>
            <UserPlus size={13} />
            Nuevo usuario
          </button>
        )}
      </div>

      {editando && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1A3A1A' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#0D200D', borderBottom: '1px solid #1A3A1A' }}>
            <p className="text-sm font-semibold text-white">{editando === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}</p>
            <button onClick={handleCancelar} style={{ color: '#C4C87A' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#C4C87A'}>
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleGuardar} className="p-4 flex flex-col gap-4" style={{ backgroundColor: '#0A1A0A' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'nombre', label: 'Nombre completo', type: 'text', required: true },
                { key: 'email', label: 'Email / Usuario', type: 'text', required: true },
                { key: 'password', label: editando !== 'nuevo' ? 'Nueva contraseña (opcional)' : 'Contraseña', type: 'password', required: editando === 'nuevo' },
              ].map(({ key, label, type, required }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required={required} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#10C048'}
                    onBlur={(e) => e.target.style.borderColor = '#1A3A1A'} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>Rol</label>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#10C048'}
                  onBlur={(e) => e.target.style.borderColor = '#1A3A1A'}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-xs rounded-lg px-3 py-2"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={guardando}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: '#10C048', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A7A2A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10C048'}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button type="button" onClick={handleCancelar}
                className="text-xs px-4 py-2 rounded-lg transition-all"
                style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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

                <button onClick={() => handleEditar(u)} title="Editar"
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
  )
}
