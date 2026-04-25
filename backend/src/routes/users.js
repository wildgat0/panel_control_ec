import { Router } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { nombre, email, password, rol = 'cliente' } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'nombre, email y password son requeridos' })
  }

  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, activo, created_at`,
      [nombre, email, hash, rol]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya existe' })
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  const { nombre, email, password, rol, activo } = req.body

  try {
    const updates = []
    const values = []
    let i = 1

    if (nombre !== undefined)  { updates.push(`nombre = $${i++}`);  values.push(nombre) }
    if (email !== undefined)   { updates.push(`email = $${i++}`);   values.push(email) }
    if (rol !== undefined)     { updates.push(`rol = $${i++}`);     values.push(rol) }
    if (activo !== undefined)  { updates.push(`activo = $${i++}`);  values.push(activo) }
    if (password !== undefined) {
      const hash = await bcrypt.hash(password, 10)
      updates.push(`password_hash = $${i++}`)
      values.push(hash)
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nada que actualizar' })

    values.push(req.params.id)
    const { rows } = await pool.query(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${i}
       RETURNING id, nombre, email, rol, activo, created_at`,
      values
    )

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya existe' })
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(`DELETE FROM usuarios WHERE id = $1`, [req.params.id])
    if (rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
