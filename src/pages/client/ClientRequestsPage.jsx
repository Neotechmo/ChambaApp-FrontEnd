import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiMessageSquare,
  FiXCircle,
  FiStar,
  FiCreditCard,
  FiCalendar,
} from 'react-icons/fi'
import { ratingsApi, requestsApi } from '../../services/api.js'
import { setStable } from '../../utils/state.js'
import {
  addressText,
  dateTime,
  money,
  statusClass,
  statusLabel,
} from '../../utils/formatters.js'
import PaymentModal from './PaymentModal.jsx'
import RequestDateModal from './RequestDateModal.jsx'
import ReviewModal from './ReviewModal.jsx'

function ClientRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [reviewedRequestIds, setReviewedRequestIds] = useState(new Set())
  const [requestToPay, setRequestToPay] = useState(null)
  const [requestToReschedule, setRequestToReschedule] = useState(null)
  const [requestToReview, setRequestToReview] = useState(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setLoading(true)

    try {
      const [response, ratingsResponse] = await Promise.all([
        requestsApi.mine(),
        ratingsApi.getAll(),
      ])
      setStable(setRequests, response.data || [])
      const ratings = Array.isArray(ratingsResponse)
        ? ratingsResponse
        : ratingsResponse.data || []
      setReviewedRequestIds(
        new Set(
          ratings
            .map((rating) => rating.solicitud?.id)
            .filter((value) => Number.isInteger(value)),
        ),
      )
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function cancelRequest(id) {
    try {
      await requestsApi.cancel(id)
      setMessage('Solicitud cancelada correctamente.')
      await loadRequests()
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function acceptProposedDate(id) {
    try {
      await requestsApi.acceptDate(id)
      setMessage('Aceptaste la nueva fecha de visita.')
      await loadRequests()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const active = requests.filter((request) =>
    ['pending', 'accepted', 'on_the_way', 'in_progress'].includes(request.status),
  ).length
  const completed = requests.filter((request) => request.status === 'completed').length
  const pending = requests.filter((request) => request.status === 'pending').length
  function paymentLabel(payment) {
    if (!payment) return null
    return {
      pending: 'Pago pendiente',
      pendiente: 'Pago pendiente',
      paid: 'Pagado',
      pagado: 'Pagado',
      failed: 'Pago fallido',
      fallido: 'Pago fallido',
      refunded: 'Reembolsado',
      reembolsado: 'Reembolsado',
    }[payment.status] || payment.status
  }

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
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>{active}</h2>
            <p>Activas</p>
            <span>Solicitudes en proceso</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{completed}</h2>
            <p>Completadas</p>
            <span>Historial de servicios</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{pending}</h2>
            <p>Pendiente</p>
            <span>Esperando confirmación</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Historial de solicitudes</h2>
          <button onClick={loadRequests}>Actualizar</button>
        </div>

        <div className="client-requests-list">
          {requests.map((request) => {
            const payment = request.payment
            const canPay = ['accepted', 'on_the_way', 'in_progress', 'completed'].includes(request.status)
            const reviewed = reviewedRequestIds.has(request.id)

            return (
              <article className="dashboard-card client-request-card" key={request.id}>
                <div className="client-request-main">
                  <div className="client-request-icon">
                    <FiBriefcase />
                  </div>

                  <div>
                    <h3>{request.title}</h3>
                    <p>{request.provider.nombre}</p>

                    <div className="request-meta">
                      <span>
                        <FiClock />
                        {dateTime(request.scheduledAt || request.requestedAt)}
                      </span>

                      <span>
                        <FiMapPin />
                        {addressText(request.address)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="client-request-side">
                  <span className={`client-request-status ${statusClass(request.status)}`}>
                    {statusLabel(request.status)}
                  </span>

                  <strong>{money(request.finalPrice || request.estimatedPrice)}</strong>
                  {payment && (
                    <small className={`payment-chip ${payment.status}`}>
                      {paymentLabel(payment)}
                    </small>
                  )}
                </div>

                <div className="client-request-actions">
                  <button className="outline-job-button" onClick={() => navigate('/client/messages')}>
                    <FiMessageSquare />
                    Chat
                  </button>

                  {canPay && !payment && (
                    <button className="solid-job-button" onClick={() => setRequestToPay(request)}>
                      <FiCreditCard />
                      Pagar
                    </button>
                  )}

                  {payment?.status === 'pending' && (
                    <button className="solid-job-button" onClick={() => setRequestToPay(request)}>
                      <FiCreditCard />
                      Confirmar pago
                    </button>
                  )}

                  {request.status === 'pending' && (
                    <button className="outline-job-button" onClick={() => setRequestToReschedule(request)}>
                      <FiCalendar />
                      Reprogramar
                    </button>
                  )}

                  {request.hasPendingDateProposal && (
                    <div className="date-proposal-banner">
                      <span>Nueva fecha propuesta: {dateTime(request.proposedAt)}</span>
                      <button className="solid-job-button" onClick={() => acceptProposedDate(request.id)}>
                        Aceptar fecha
                      </button>
                    </div>
                  )}

                  {request.status === 'completed' ? (
                    reviewed ? (
                      <span className="reviewed-chip">
                        <FiStar />
                        Ya calificado
                      </span>
                    ) : (
                      <button className="solid-job-button" onClick={() => setRequestToReview(request)}>
                        <FiStar />
                        Calificar
                      </button>
                    )
                  ) : ['pending', 'accepted'].includes(request.status) ? (
                    <button className="danger-job-button" onClick={() => cancelRequest(request.id)}>
                      <FiXCircle />
                      Cancelar
                    </button>
                  ) : (
                    <span className="solid-job-button readonly-action">
                      <FiCheckCircle />
                      {statusLabel(request.status)}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {!loading && requests.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiBriefcase />
            <h2>No tienes solicitudes</h2>
            <p>Busca un servicio y envía tu primera solicitud.</p>
          </article>
        )}
      </section>

      {requestToPay && (
        <PaymentModal
          request={requestToPay}
          onClose={() => setRequestToPay(null)}
          onCreated={async (_, confirmed) => {
            setMessage(confirmed ? 'Pago confirmado correctamente.' : 'Pago registrado; confirma la operación para completarla.')
            await loadRequests()
          }}
        />
      )}

      {requestToReschedule && (
        <RequestDateModal
          request={requestToReschedule}
          onClose={() => setRequestToReschedule(null)}
          onUpdated={async (_, feedback) => {
            setMessage(feedback)
            setRequestToReschedule(null)
            await loadRequests()
          }}
        />
      )}

      {requestToReview && (
        <ReviewModal
          request={requestToReview}
          onClose={() => setRequestToReview(null)}
          onCreated={async () => {
            setMessage('Gracias. Tu calificación fue enviada.')
            setRequestToReview(null)
            await loadRequests()
          }}
        />
      )}
    </>
  )
}

export default ClientRequestsPage
