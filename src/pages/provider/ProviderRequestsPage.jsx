import { useEffect, useState } from 'react'
import {
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
} from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import { addressText, dateTime, money, statusLabel } from '../../utils/formatters.js'
import { trackProviderAcceptedRequest } from '../../utils/analytics.js'
import { setStable } from '../../utils/state.js'
import ProviderRequestModal from './ProviderRequestModal.jsx'

function ProviderRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [requestAction, setRequestAction] = useState(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setLoading(true)

    try {
      const response = await providerApi.requests()
      setStable(setRequests, response.data || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function acceptRequest(id) {
    try {
      await providerApi.acceptRequest(id)
      trackProviderAcceptedRequest({ requestId: id })
      setMessage('Solicitud aceptada. Ya se encuentra en tus trabajos y calendario.')
      await loadRequests()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const pending = requests.filter((request) => request.status === 'pending')
  const urgent = pending.filter((request) => request.priority === 'urgent').length
  const estimatedTotal = pending.reduce((total, request) => total + request.estimatedPrice, 0)

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Solicitudes</h1>
          <span>Revisa y responde las solicitudes nuevas de clientes.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button" disabled title="La vista ya muestra solicitudes pendientes">
            <FiFilter />
            Pendientes
          </button>

          <button className="solid-action-button" onClick={loadRequests}>
            <FiRefreshCw />
            Actualizar
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>{pending.length}</h2>
            <p>Solicitudes pendientes</p>
            <span>Requieren respuesta</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{urgent}</h2>
            <p>Urgentes</p>
            <span>Prioridad alta</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{money(estimatedTotal)}</h2>
            <p>Valor estimado</p>
            <span>Total posible</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Solicitudes recientes</h2>
          <button onClick={loadRequests}>Actualizar</button>
        </div>

        <div className="provider-requests-list">
          {pending.map((request) => (
            <article className="dashboard-card provider-request-card" key={request.id}>
              <div className="provider-request-top">
                <div className="provider-request-user">
                  <div className="request-avatar">
                    {request.client.nombre.charAt(0)}
                  </div>

                  <div>
                    <h3>{request.client.nombre}</h3>
                    <p>{request.title}</p>

                    <div className="request-meta">
                      <span>
                        <FiMapPin />
                        {addressText(request.address)}
                      </span>

                      <span>
                        <FiClock />
                        Visita: {dateTime(request.scheduledAt || request.requestedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`request-tag ${request.priority === 'urgent' ? 'urgente' : 'normal'}`}>
                  {request.priority === 'urgent' ? 'Urgente' : statusLabel(request.status)}
                </span>
              </div>

              <p className="provider-request-description">
                {request.description}
              </p>

              <div className="provider-request-bottom">
                <div>
                  <strong>{money(request.estimatedPrice)}</strong>
                  <span> estimado</span>
                </div>

                <div className="provider-request-actions">
                  <button className="outline-job-button" onClick={() => setRequestAction({ request, mode: 'date' })}>
                    <FiCalendar />
                    Otra fecha
                  </button>

                  <button className="reject-button" onClick={() => setRequestAction({ request, mode: 'reject' })}>
                    <FiX />
                    Rechazar
                  </button>

                  <button className="accept-button" onClick={() => acceptRequest(request.id)}>
                    <FiCheck />
                    Aceptar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && pending.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiCheck />
            <h2>No hay solicitudes pendientes</h2>
            <p>Las nuevas solicitudes aparecerán en esta bandeja.</p>
          </article>
        )}
      </section>

      {requestAction && (
        <ProviderRequestModal
          request={requestAction.request}
          mode={requestAction.mode}
          onClose={() => setRequestAction(null)}
          onUpdated={async (feedback) => {
            setMessage(feedback)
            setRequestAction(null)
            await loadRequests()
          }}
        />
      )}
    </>
  )
}

export default ProviderRequestsPage
