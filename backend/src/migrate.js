import { pool } from './db.js'
import bcrypt from 'bcrypt'

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id        SERIAL PRIMARY KEY,
      nombre    VARCHAR(100) NOT NULL,
      email     VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      rol       VARCHAR(20) NOT NULL DEFAULT 'cliente',
      activo    BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  const { rowCount } = await pool.query(`SELECT 1 FROM usuarios WHERE email = 'ethos_corp'`)
  if (rowCount === 0) {
    const hash = await bcrypt.hash('1234', 10)
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)`,
      ['Ethos Corp', 'ethos_corp', hash, 'admin']
    )
    console.log('Usuario admin creado: ethos_corp / 1234')
  }
}
