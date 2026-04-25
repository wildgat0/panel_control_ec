export function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { usuario: payload.usuario, rol: payload.rol, nombre: payload.nombre }
  } catch {
    return null
  }
}
