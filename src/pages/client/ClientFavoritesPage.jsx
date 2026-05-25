import {
  FiHeart,
  FiMapPin,
  FiStar,
  FiClock,
  FiTrash2,
} from 'react-icons/fi'

function ClientFavoritesPage() {
  const favorites = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      job: 'Plomero certificado',
      rating: 4.8,
      reviews: 124,
      distance: '1.2 km',
      price: 250,
      available: 'Disponible',
    },
    {
      id: 2,
      name: 'Ana García',
      job: 'Electricista profesional',
      rating: 4.9,
      reviews: 98,
      distance: '2.5 km',
      price: 300,
      available: 'Hoy',
    },
  ]

  return (
    <>
      <header className="client-page-hero">
        <div>
          <p>Panel cliente</p>
          <h1>Favoritos</h1>
          <span>Guarda tus prestadores preferidos para contratarlos más rápido.</span>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>2</h2>
            <p>Guardados</p>
            <span>Prestadores favoritos</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>4.8</h2>
            <p>Promedio</p>
            <span>Calificación media</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>1.8 km</h2>
            <p>Distancia media</p>
            <span>Cerca de ti</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Prestadores favoritos</h2>
          <button>Ordenar</button>
        </div>

        <div className="client-search-results">
          {favorites.map((provider) => (
            <article className="dashboard-card client-result-card favorite-card" key={provider.id}>
              <div className="client-provider-avatar">
                {provider.name.charAt(0)}
              </div>

              <div>
                <h3>{provider.name}</h3>
                <p>{provider.job}</p>

                <div className="service-meta">
                  <span>
                    <FiStar />
                    <strong>{provider.rating}</strong>
                    ({provider.reviews})
                  </span>

                  <span>
                    <FiMapPin />
                    {provider.distance}
                  </span>

                  <span>
                    <FiClock />
                    {provider.available}
                  </span>
                </div>
              </div>

              <div className="client-provider-price">
                <strong>${provider.price}</strong>
                <span>por hora</span>

                <div className="favorite-actions">
                  <button>Solicitar</button>
                  <button className="favorite-remove-button">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {favorites.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiHeart />
            <h2>No tienes favoritos todavía</h2>
            <p>Guarda prestadores para encontrarlos más rápido después.</p>
          </article>
        )}
      </section>
    </>
  )
}

export default ClientFavoritesPage