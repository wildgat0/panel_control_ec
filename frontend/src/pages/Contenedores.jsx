import { useEffect, useState } from 'react'
import { RefreshCw, ServerOff } from 'lucide-react'
import { apiFetch } from '../api.js'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectModal from '../components/ProjectModal.jsx'

function groupByProject(containers) {
  const groups = {}
  for (const c of containers) {
    const key = c.project ?? '— Sin proyecto'
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

export default function Contenedores() {
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [modalProject, setModalProject] = useState(null)

  async function fetchContainers(showRefresh = false) {
    if (showRefresh) setRefreshing(true)
    try {
      const res = await apiFetch('/api/containers')
      if (!res.ok) throw new Error('Error al obtener contenedores')
      setContainers(await res.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchContainers()
    const interval = setInterval(() => fetchContainers(), 10000)
    return () => clearInterval(interval)
  }, [])

  const groups = groupByProject(containers)
  const running = containers.filter(c => c.state === 'running').length

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw size={24} color="#10C048" className="animate-spin" />
        <p className="text-sm" style={{ color: '#C4C87A' }}>Cargando contenedores...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="rounded-xl px-5 py-4 flex items-center gap-3"
      style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <ServerOff size={18} color="#F87171" />
      <p className="text-sm" style={{ color: '#F87171' }}>{error}</p>
    </div>
  )

  const modalContainers = modalProject
    ? groups.find(([name]) => name === modalProject)?.[1] ?? []
    : []

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(16,192,72,0.1)', border: '1px solid rgba(16,192,72,0.2)', color: '#10C048' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {running} activo{running !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(196,200,122,0.1)', border: '1px solid rgba(196,200,122,0.2)', color: '#C4C87A' }}>
              {groups.length} proyecto{groups.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => fetchContainers(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            style={{ border: '1px solid #1A3A1A', color: '#C4C87A' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10C048'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1A3A1A'}>
            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map(([project, ctrs]) => (
            <ProjectCard
              key={project}
              project={project}
              containers={ctrs}
              onClick={() => setModalProject(project)}
            />
          ))}
        </div>
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          containers={modalContainers}
          onClose={() => setModalProject(null)}
          onAction={() => fetchContainers()}
        />
      )}
    </>
  )
}
