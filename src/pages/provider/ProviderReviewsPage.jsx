import {
  FiStar,
  FiMessageSquare,
  FiTrendingUp,
} from 'react-icons/fi'

function ProviderReviewsPage() {
  const reviews = [
    {
      id: 1,
      client: 'María López',
      service: 'Reparación de fuga',
      rating: 5,
      comment: 'Muy puntual, amable y dejó todo funcionando perfecto.',
      date: 'Hace 2 días',
    },
    {
      id: 2,
      client: 'Roberto Silva',
      service: 'Instalación de lavabo',
      rating: 5,
      comment: 'Excelente trabajo, explicó todo y fue muy limpio.',
      date: 'Hace 1 semana',
    },
    {
      id: 3,
      client: 'Ana García',
      service: 'Revisión de tubería',
      rating: 4,
      comment: 'Buen servicio, llegó un poco tarde pero resolvió el problema.',
      date: 'Hace 2 semanas',
    },
  ]

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Reseñas</h1>
          <span>Consulta la opinión de tus clientes y tu reputación.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button">
            <FiMessageSquare />
            Comentarios
          </button>

          <button className="solid-action-button">
            <FiTrendingUp />
            Estadísticas
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>4.8</h2>
            <p>Calificación promedio</p>
            <span>Basado en 124 reseñas</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>98%</h2>
            <p>Satisfacción</p>
            <span>Clientes satisfechos</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>124</h2>
            <p>Total de reseñas</p>
            <span>Historial completo</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Últimas reseñas</h2>
              <button>Ver todas</button>
            </div>

            <div className="reviews-list">
              {reviews.map((review) => (
                <article className="dashboard-card review-card" key={review.id}>
                  <div className="review-top">
                    <div className="request-avatar">
                      {review.client.charAt(0)}
                    </div>

                    <div>
                      <h3>{review.client}</h3>
                      <p>{review.service}</p>
                    </div>

                    <span>{review.date}</span>
                  </div>

                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar
                        key={index}
                        className={index < review.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>

                  <p className="review-comment">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="right-column">
            <article className="dashboard-card rating-breakdown-card">
              <h2>Distribución</h2>

              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div className="rating-row" key={stars}>
                  <span>{stars} estrellas</span>

                  <div>
                    <strong
                      style={{
                        width: `${[78, 16, 4, 1, 1][index]}%`,
                      }}
                    ></strong>
                  </div>

                  <small>{[78, 16, 4, 1, 1][index]}%</small>
                </div>
              ))}
            </article>

            <article className="verified-card">
              <h2>Reputación alta</h2>
              <p>Tu perfil mantiene una excelente calificación.</p>

              <div>
                <span>Respuesta rápida</span>
                <strong>92%</strong>
              </div>

              <div>
                <span>Puntualidad</span>
                <strong>96%</strong>
              </div>

              <div>
                <span>Calidad</span>
                <strong>98%</strong>
              </div>

              <button>Ver recomendaciones</button>
            </article>
          </aside>
        </div>
      </section>
    </>
  )
}

export default ProviderReviewsPage