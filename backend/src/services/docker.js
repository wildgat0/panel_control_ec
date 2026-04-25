import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export async function listContainers() {
  const containers = await docker.listContainers({ all: true })
  return containers.map((c) => ({
    id: c.Id.slice(0, 12),
    name: c.Names[0].replace('/', ''),
    image: c.Image,
    status: c.Status,
    state: c.State,
    ports: c.Ports,
    created: c.Created,
    project: c.Labels?.['com.docker.compose.project'] ?? null,
    service: c.Labels?.['com.docker.compose.service'] ?? null,
  }))
}

export async function stopContainer(id) {
  const container = docker.getContainer(id)
  await container.stop()
}

export async function startContainer(id) {
  const container = docker.getContainer(id)
  await container.start()
}

export async function restartContainer(id) {
  const container = docker.getContainer(id)
  await container.restart()
}

export async function getContainerLogs(id) {
  const container = docker.getContainer(id)
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail: 100,
    timestamps: true,
  })
  return logs.toString('utf8')
}
