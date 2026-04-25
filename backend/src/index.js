import express from 'express'
import cors from 'cors'
import containersRouter from './routes/containers.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import { requireAuth, requireAdmin } from './middleware/auth.js'
import { migrate } from './migrate.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/containers', requireAdmin, containersRouter)
app.use('/api/users', requireAdmin, usersRouter)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

migrate()
  .then(() => app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`)))
  .catch((err) => { console.error('Error en migración:', err); process.exit(1) })
