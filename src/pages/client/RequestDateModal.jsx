import { useState } from 'react'
import { FiCalendar, FiX } from 'react-icons/fi'
import { requestsApi } from '../../services/api.js'
import { dateTime } from '../../utils/formatters.js'

function inputDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

function RequestDateModal({ request, onClose, onUpdated }) {
  const [scheduledAt, setScheduledAt] = useState(inputDate(request.scheduledAt))
  const [duration, setDuration] = useState(String(request.estimatedDurationMin || 60))
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const minimumDate = inputDate(new Date())

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const updated = await requestsApi.reschedule(request.id, {
        fechaSolicitada: new Date(scheduledAt).toISOString(),
        duracionEstimadaMin: Number(duration),
      })
      onUpdated(updated, 'Solicitud reprogramada. El prestador recibirá la nueva fecha.')
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
        aria-labelledby="reschedule-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>Modificar visita</p>
            <h2 id="reschedule-title">{request.title}</h2>
            <span>Fecha actual: {dateTime(request.scheduledAt)}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </header>

        <form className="request-service-form" onSubmit={submit}>
          <label className="request-form-wide">
            <FiCalendar />
            Nueva fecha y hora
            <input
              type="datetime-local"
              min={minimumDate}
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              required
            />
          </label>

          <label className="request-form-wide">
            Duración estimada
            <select value={duration} onChange={(event) => setDuration(event.target.value)}>
              <option value="60">1 hora</option>
              <option value="90">1 hora 30 minutos</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
              <option value="240">4 horas</option>
            </select>
          </label>

          {message && <p className="status-message api-feedback request-form-wide">{message}</p>}

          <div className="request-form-actions request-form-wide">
            <button type="button" className="outline-job-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="solid-job-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Reprogramar visita'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default RequestDateModal
