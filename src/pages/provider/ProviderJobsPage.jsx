import {
  FiClock,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiNavigation,
  FiCheckCircle,
} from 'react-icons/fi'

function ProviderJobsPage() {
  const jobs = [
    {
      id: 1,
      client: 'Patricia Ruiz',
      service: 'Reparación urgente',
      address: 'Col. Roma Norte, CDMX',
      time: '14:30 - 16:30',
      status: 'Trabajando',
      progress: 65,
      price: 450,
      phone: '55 1234 5678',
    },
    {
      id: 2,
      client: 'Roberto Silva',
      service: 'Instalación de lavabo',
      address: 'Col. Condesa, CDMX',
      time: '17:00 - 19:00',
      status: 'En camino',
      progress: 30,
      price: 350,
      phone: '55 8765 4321',
    },
    {
      id: 3,
      client: 'Luis Torres',
      service: 'Mantenimiento general',
      address: 'Col. Del Valle, CDMX',
      time: '19:30 - 21:00',
      status: 'Pendiente',
      progress: 0,
      price: 280,
      phone: '55 2468 1357',
    },
  ]

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Trabajos activos</h1>
          <span>Consulta tus servicios aceptados y el avance de cada trabajo.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button">
            <FiClock />
            Hoy
          </button>

          <button className="solid-action-button">
            <FiCheckCircle />
            Finalizados
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>3</h2>
            <p>En curso</p>
            <span>Trabajos activos hoy</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>65%</h2>
            <p>Mayor avance</p>
            <span>Reparación urgente</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>$1,080</h2>
            <p>Ingreso estimado</p>
            <span>Total de trabajos activos</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Lista de trabajos</h2>
          <button>Ordenar por hora</button>
        </div>

        <div className="provider-jobs-list">
          {jobs.map((job) => (
            <article className="dashboard-card provider-job-card" key={job.id}>
              <div className="provider-job-header">
                <div className="provider-request-user">
                  <div className="request-avatar">
                    {job.client.charAt(0)}
                  </div>

                  <div>
                    <h3>{job.client}</h3>
                    <p>{job.service}</p>

                    <div className="request-meta">
                      <span>
                        <FiClock />
                        {job.time}
                      </span>

                      <span>
                        <FiMapPin />
                        {job.address}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`job-status ${job.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-progress-area">
                <div className="job-progress-top">
                  <span>Progreso del trabajo</span>
                  <strong>{job.progress}%</strong>
                </div>

                <div className="progress-bar">
                  <div style={{ width: `${job.progress}%` }}></div>
                </div>
              </div>

              <div className="provider-job-footer">
                <div>
                  <strong>${job.price}</strong>
                  <span> estimado</span>
                </div>

                <div className="provider-job-actions">
                  <button className="outline-job-button">
                    <FiPhone />
                    Llamar
                  </button>

                  <button className="outline-job-button">
                    <FiMessageSquare />
                    Mensaje
                  </button>

                  <button className="solid-job-button">
                    <FiNavigation />
                    Ver ruta
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ProviderJobsPage