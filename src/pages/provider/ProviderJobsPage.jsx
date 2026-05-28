import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiNavigation,
  FiCheckCircle,
} from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import {
  addressText,
  dateTime,
  jobProgress,
  jobStatusClass,
  money,
  statusLabel,
} from '../../utils/formatters.js'
import { onlyDigits } from '../../utils/forms.js'
import { setStable } from '../../utils/state.js'

function ProviderJobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadJobs()
  }, [])

  async function loadJobs() {
    setLoading(true)

    try {
      const response = await providerApi.jobs()
      setStable(setJobs, response.data || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function advanceJob(job) {
    const nextStatus = {
      accepted: 'on_the_way',
      on_the_way: 'in_progress',
      in_progress: 'completed',
    }[job.status]

    if (!nextStatus) return

    try {
      await providerApi.updateJobStatus(job.id, nextStatus)
      setMessage(`Trabajo actualizado: ${statusLabel(nextStatus)}.`)
      await loadJobs()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const activeJobs = jobs.filter((job) => job.status !== 'completed')
  const income = activeJobs.reduce((total, job) => total + job.estimatedPrice, 0)
  const maxProgress = activeJobs.reduce(
    (maximum, job) => Math.max(maximum, jobProgress(job.status)),
    0,
  )

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Trabajos activos</h1>
          <span>Consulta tus servicios aceptados y el avance de cada trabajo.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button" onClick={loadJobs}>
            <FiClock />
            Actualizar
          </button>

          <span className="solid-action-button readonly-action">
            <FiCheckCircle />
            {jobs.filter((job) => job.status === 'completed').length} finalizados
          </span>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>{activeJobs.length}</h2>
            <p>En curso</p>
            <span>Trabajos activos</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{maxProgress}%</h2>
            <p>Mayor avance</p>
            <span>Servicios en progreso</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{money(income)}</h2>
            <p>Ingreso estimado</p>
            <span>Total de trabajos activos</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Lista de trabajos</h2>
          <button onClick={loadJobs}>Actualizar</button>
        </div>

        <div className="provider-jobs-list">
          {activeJobs.map((job) => {
            const progress = jobProgress(job.status)
            const nextLabel = {
              accepted: 'Iniciar traslado',
              on_the_way: 'Iniciar trabajo',
              in_progress: 'Completar',
            }[job.status]

            return (
              <article className="dashboard-card provider-job-card" key={job.id}>
                <div className="provider-job-header">
                  <div className="provider-request-user">
                    <div className="request-avatar">
                      {job.client.nombre.charAt(0)}
                    </div>

                    <div>
                      <h3>{job.client.nombre}</h3>
                      <p>{job.title}</p>

                      <div className="request-meta">
                        <span>
                          <FiClock />
                          {dateTime(job.scheduledAt || job.requestedAt)}
                        </span>

                        <span>
                          <FiMapPin />
                          {addressText(job.address)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`job-status ${jobStatusClass(job.status)}`}>
                    {statusLabel(job.status)}
                  </span>
                </div>

                <div className="job-progress-area">
                  <div className="job-progress-top">
                    <span>Progreso del trabajo</span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-bar">
                    <div style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="provider-job-footer">
                  <div>
                    <strong>{money(job.finalPrice || job.estimatedPrice)}</strong>
                    <span> estimado</span>
                  </div>

                  <div className="provider-job-actions">
                    {onlyDigits(job.client.telefono).length > 0 && (
                      <a className="outline-job-button" href={`tel:${onlyDigits(job.client.telefono)}`}>
                        <FiPhone />
                        Llamar
                      </a>
                    )}

                    <button className="outline-job-button" onClick={() => navigate('/provider/messages')}>
                      <FiMessageSquare />
                      Mensaje
                    </button>

                    <button className="solid-job-button" onClick={() => advanceJob(job)}>
                      <FiNavigation />
                      {nextLabel}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {!loading && activeJobs.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiCheckCircle />
            <h2>No hay trabajos activos</h2>
            <p>Acepta una solicitud para verla aquí.</p>
          </article>
        )}
      </section>
    </>
  )
}

export default ProviderJobsPage
