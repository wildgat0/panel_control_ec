import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { pool } from '../db.js'

const router = Router()
const SECRET = process.env.JWT_SECRET || 'cambiar_en_produccion'

router.post('/login', async (req, res) => {
  const { usuario, password } = req.body

  try {
    const { rows } = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1 AND activo = true`,
      [usuario]
    )

    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const token = jwt.sign(
      { id: user.id, usuario: user.email, rol: user.rol },
      SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token, rol: user.rol, nombre: user.nombre })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
