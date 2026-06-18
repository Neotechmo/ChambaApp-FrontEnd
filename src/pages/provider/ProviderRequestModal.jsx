import { useState } from 'react'
import { FiCalendar, FiX } from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import { dateTime } from '../../utils/formatters.js'
import { trackProviderRejectedRequest } from '../../utils/analytics.js'

function inputDate(value) {
  const date = value ? new Date(value) : new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

function ProviderRequestModal({ request, mode, onClose, onUpdated }) {
  const [reason, setReason] = useState('')
  const [proposedAt, setProposedAt] = useState(inputDate(request.scheduledAt))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const proposesDate = mode === 'date'

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (proposesDate) {
        await providerApi.proposeDate(request.id, new Date(proposedAt).toISOString())
        onUpdated('Nueva fecha enviada al cliente para confirmación.')
      } else {
        await providerApi.rejectRequest(request.id, reason.trim() || undefined)
        trackProviderRejectedRequest({
          requestId: request.id,
          hasReason: Boolean(reason.trim()),
        })
        onUpdated('Solicitud rechazada.')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dashboard-card payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-action-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>{proposesDate ? 'Proponer otra fecha' : 'Rechazar solicitud'}</p>
            <h2 id="provider-action-title">{request.title}</h2>
            <span>Visita solicitada: {dateTime(request.scheduledAt)}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </header>

        <form className="request-service-form" onSubmit={submit}>
          {proposesDate ? (
            <label className="request-form-wide">
              <FiCalendar />
              Nueva fecha y hora
              <input
                type="datetime-local"
                value={proposedAt}
                min={inputDate()}
                onChange={(event) => setProposedAt(event.target.value)}
                required
              />
            </label>
          ) : (
            <label className="request-form-wide">
              Motivo (opcional)
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows="4"
                placeholder="Explica brevemente por qué no puedes atender esta solicitud"
              />
            </label>
          )}

          {message && <p className="status-message api-feedback request-form-wide">{message}</p>}

          <div className="request-form-actions request-form-wide">
            <button type="button" className="outline-job-button" onClick={onClose}>
              Cancelar
            </button>
            <button className={proposesDate ? 'solid-job-button' : 'danger-job-button'} disabled={loading}>
              {loading ? 'Enviando...' : proposesDate ? 'Enviar propuesta' : 'Confirmar rechazo'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ProviderRequestModal
