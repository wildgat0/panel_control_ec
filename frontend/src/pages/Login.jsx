import { useState } from 'react'
import { setToken } from '../api.js'
import { parseToken } from '../utils/token.js'
import Footer from '../components/Footer.jsx'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      setToken(data.token)
      onLogin(parseToken(data.token))
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #C4C87A 0%, #0A1A0A 100%)' }}
    >
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <div className="px-8 py-8 text-center" style={{ backgroundColor: '#0A1A0A' }}>
            <h1 className="text-3xl font-bold text-white tracking-widest">SISCOETHOS</h1>
            <p className="text-sm mt-1" style={{ color: '#C4C87A' }}>Sistema de Control Ethos Corp</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
                placeholder="Ingresa tu usuario"
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #C8ECEC',
                  color: '#0A1A0A',
                  backgroundColor: '#F7FDFD',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10C048'}
                onBlur={(e) => e.target.style.borderColor = '#C4C87A'}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0A7A2A' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #C8ECEC',
                  color: '#0A1A0A',
                  backgroundColor: '#F7FDFD',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10C048'}
                onBlur={(e) => e.target.style.borderColor = '#C4C87A'}
              />
            </div>

            {error && (
              <p className="text-xs rounded-lg px-3 py-2 text-center"
                style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 mt-1"
              style={{ backgroundColor: '#10C048' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0A7A2A'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10C048'}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

      </div>
      </div>
      <Footer showNav={false} />
    </div>
  )
}
