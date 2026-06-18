import { useState } from 'react'
import { FiStar, FiX } from 'react-icons/fi'
import { requestsApi } from '../../services/api.js'
import { trackReviewSubmitted } from '../../utils/analytics.js'

function ReviewModal({ request, onClose, onCreated }) {
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await requestsApi.review(request.id, {
        rating: Number(rating),
        comment: comment.trim(),
      })
      trackReviewSubmitted({
        requestId: request.id,
        rating: Number(rating),
        providerId: request.provider?.id,
      })
      onCreated()
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
        aria-labelledby="review-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>Calificar servicio</p>
            <h2 id="review-title">{request.title}</h2>
            <span>{request.provider.nombre}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </header>

        <form className="request-service-form" onSubmit={submit}>
          <label className="request-form-wide">
            <FiStar />
            Calificación
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Muy bueno</option>
              <option value="3">3 - Bueno</option>
              <option value="2">2 - Regular</option>
              <option value="1">1 - Malo</option>
            </select>
          </label>

          <label className="request-form-wide">
            Comentario
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows="4"
              placeholder="Cuéntanos cómo fue el servicio"
              required
            />
          </label>

          {message && <p className="status-message api-feedback request-form-wide">{message}</p>}

          <div className="request-form-actions request-form-wide">
            <button type="button" className="outline-job-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="solid-job-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ReviewModal
