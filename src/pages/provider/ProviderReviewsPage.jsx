import { useEffect, useState } from 'react'
import {
  FiStar,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import { shortDate } from '../../utils/formatters.js'

function ProviderReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({
    average: 0,
    satisfactionPercent: 0,
    total: 0,
    distribution: {},
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      const response = await providerApi.reviews()
      setSummary(response.summary)
      setReviews(response.data || [])
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Reseñas</h1>
          <span>Consulta la opinión de tus clientes y tu reputación.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button" onClick={loadReviews}>
            <FiMessageSquare />
            Actualizar
          </button>

          <button className="solid-action-button" onClick={loadReviews}>
            <FiTrendingUp />
            Estadísticas
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>{summary.average.toFixed(1)}</h2>
            <p>Calificación promedio</p>
            <span>Basado en {summary.total} reseñas</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{summary.satisfactionPercent}%</h2>
            <p>Satisfacción</p>
            <span>Clientes satisfechos</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{summary.total}</h2>
            <p>Total de reseñas</p>
            <span>Historial completo</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Últimas reseñas</h2>
              <button onClick={loadReviews}>Actualizar</button>
            </div>

            <div className="reviews-list">
              {reviews.map((review) => (
                <article className="dashboard-card review-card" key={review.id}>
                  <div className="review-top">
                    <div className="request-avatar">
                      {review.clientName.charAt(0)}
                    </div>

                    <div>
                      <h3>{review.clientName}</h3>
                      <p>{review.service}</p>
                    </div>

                    <span>{shortDate(review.createdAt)}</span>
                  </div>

                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar
                        key={index}
                        className={index < review.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>

                  <p className="review-comment">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="right-column">
            <article className="dashboard-card rating-breakdown-card">
              <h2>Distribución</h2>

              {[5, 4, 3, 2, 1].map((stars) => {
                const count = summary.distribution[String(stars)] || 0
                const percent = summary.total ? Math.round((count / summary.total) * 100) : 0

                return (
                  <div className="rating-row" key={stars}>
                    <span>{stars} estrellas</span>

                    <div>
                      <strong style={{ width: `${percent}%` }}></strong>
                    </div>

                    <small>{percent}%</small>
                  </div>
                )
              })}
            </article>
          </aside>
        </div>
      </section>
    </>
  )
}

export default ProviderReviewsPage
