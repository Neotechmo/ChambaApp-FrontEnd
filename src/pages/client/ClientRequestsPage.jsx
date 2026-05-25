import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiMessageSquare,
  FiXCircle,
  FiStar,
} from 'react-icons/fi'

function ClientRequestsPage() {
  const requests = [
    {
      id: 2458,
      provider: 'Carlos Mendoza',
      service: 'Reparación de fuga',
      date: 'Hoy, 14:30',
      location: 'León, Guanajuato',
      price: 350,
      status: 'En camino',
      type: 'active',
    },
    {
      id: 2454,
      provider: 'Ana García',
      service: 'Instalación eléctrica',
      date: 'Ayer, 17:00',
      location: 'León, Guanajuato',
      price: 500,
      status: 'Completado',
      type: 'completed',
    },
    {
      id: 2449,
      provider: 'Luis Hernández',
      service: 'Pintura de habitación',
      date: 'Viernes, 16:00',
      location: 'León, Guanajuato',
      price: 800,
      status: 'Pendiente',
      type: 'pending',
    },
  ]

  return (
    <>
      <header className="client-page-hero">
        <div>
          <p>Panel cliente</p>
          <h1>Mis solicitudes</h1>
          <span>Da seguimiento a tus servicios solicitados.</span>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>3</h2>
            <p>Activas</p>
            <span>Solicitudes en proceso</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>12</h2>
            <p>Completadas</p>
            <span>Historial de servicios</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>1</h2>
            <p>Pendiente</p>
            <span>Esperando confirmación</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Historial de solicitudes</h2>
          <button>Filtrar</button>
        </div>

        <div className="client-requests-list">
          {requests.map((request) => (
            <article className="dashboard-card client-request-card" key={request.id}>
              <div className="client-request-main">
                <div className="client-request-icon">
                  <FiBriefcase />
                </div>

                <div>
                  <h3>{request.service}</h3>
                  <p>{request.provider}</p>

                  <div className="request-meta">
                    <span>
                      <FiClock />
                      {request.date}
                    </span>

                    <span>
                      <FiMapPin />
                      {request.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="client-request-side">
                <span className={`client-request-status ${request.type}`}>
                  {request.status}
                </span>

                <strong>${request.price}</strong>
              </div>

              <div className="client-request-actions">
                <button className="outline-job-button">
                  <FiMessageSquare />
                  Chat
                </button>

                {request.type === 'completed' ? (
                  <button className="solid-job-button">
                    <FiStar />
                    Calificar
                  </button>
                ) : request.type === 'pending' ? (
                  <button className="danger-job-button">
                    <FiXCircle />
                    Cancelar
                  </button>
                ) : (
                  <button className="solid-job-button">
                    <FiCheckCircle />
                    Ver seguimiento
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ClientRequestsPage