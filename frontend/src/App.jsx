import { useState } from 'react'
import { getToken } from './api.js'
import { parseToken } from './utils/token.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ClienteHome from './pages/ClienteHome.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const token = getToken()
    return token ? parseToken(token) : null
  })

  function handleLogin(data) {
    setUsuario(data)
  }

  function handleLogout() {
    setUsuario(null)
  }

  if (!usuario) return <Login onLogin={handleLogin} />
  if (usuario.rol === 'admin') return <Dashboard onLogout={handleLogout} />
  return <ClienteHome nombre={usuario.nombre} onLogout={handleLogout} />
}
