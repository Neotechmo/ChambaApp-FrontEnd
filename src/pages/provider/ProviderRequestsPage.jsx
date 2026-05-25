import {
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiFilter,
} from 'react-icons/fi'

function ProviderRequestsPage() {
  const requests = [
    {
      id: 1,
      client: 'María López',
      service: 'Reparación de fuga en baño',
      description: 'Necesito reparar una fuga debajo del lavabo del baño principal.',
      location: 'Col. Roma Norte, CDMX',
      distance: '2.3 km',
      time: 'Hace 15 min',
      price: 350,
      priority: 'Urgente',
    },
    {
      id: 2,
      client: 'Juan Pérez',
      service: 'Instalación de lavabo',
      description: 'Instalación completa de lavabo nuevo con conexión de tubería.',
      location: 'Col. Condesa, CDMX',
      distance: '1.8 km',
      time: 'Hace 1 hora',
      price: 280,
      priority: 'Normal',
    },
    {
      id: 3,
      client: 'Ana García',
      service: 'Revisión de tubería',
      description: 'Revisión general de tubería por baja presión de agua.',
      location: 'Col. Polanco, CDMX',
      distance: '4.2 km',
      time: 'Hace 2 horas',
      price: 200,
      priority: 'Flexible',
    },
    {
      id: 4,
      client: 'Roberto Silva',
      service: 'Cambio de llave mezcladora',
      description: 'Cambiar llave mezcladora de cocina y revisar sellado.',
      location: 'Col. Del Valle, CDMX',
      distance: '3.1 km',
      time: 'Hace 3 horas',
      price: 220,
      priority: 'Normal',
    },
  ]

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Solicitudes</h1>
          <span>Revisa y responde las solicitudes nuevas de clientes.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button">
            <FiFilter />
            Filtrar
          </button>

          <button className="solid-action-button">
            <FiRefreshCw />
            Actualizar
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>4</h2>
            <p>Solicitudes pendientes</p>
            <span>Requieren respuesta</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>2</h2>
            <p>Urgentes</p>
            <span>Prioridad alta</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>$1,050</h2>
            <p>Valor estimado</p>
            <span>Total posible</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Solicitudes recientes</h2>
          <button>Ver historial</button>
        </div>

        <div className="provider-requests-list">
          {requests.map((request) => (
            <article className="dashboard-card provider-request-card" key={request.id}>
              <div className="provider-request-top">
                <div className="provider-request-user">
                  <div className="request-avatar">
                    {request.client.charAt(0)}
                  </div>

                  <div>
                    <h3>{request.client}</h3>
                    <p>{request.service}</p>

                    <div className="request-meta">
                      <span>
                        <FiMapPin />
                        {request.location}
                      </span>

                      <span>
                        {request.distance}
                      </span>

                      <span>
                        <FiClock />
                        {request.time}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`request-tag ${request.priority.toLowerCase()}`}>
                  {request.priority}
                </span>
              </div>

              <p className="provider-request-description">
                {request.description}
              </p>

              <div className="provider-request-bottom">
                <div>
                  <strong>${request.price}</strong>
                  <span> estimado</span>
                </div>

                <div className="provider-request-actions">
                  <button className="reject-button">
                    <FiX />
                    Rechazar
                  </button>

                  <button className="accept-button">
                    <FiCheck />
                    Aceptar
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

export default ProviderRequestsPage