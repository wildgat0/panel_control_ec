import { Router } from 'express'
import {
  listContainers,
  stopContainer,
  startContainer,
  restartContainer,
  getContainerLogs,
} from '../services/docker.js'

const router = Router()

router.get('/', async (_, res) => {
  try {
    const containers = await listContainers()
    res.json(containers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/stop', async (req, res) => {
  try {
    await stopContainer(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/start', async (req, res) => {
  try {
    await startContainer(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/restart', async (req, res) => {
  try {
    await restartContainer(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await getContainerLogs(req.params.id)
    res.json({ logs })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
