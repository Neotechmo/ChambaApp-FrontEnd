import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiClock,
  FiFilter,
} from 'react-icons/fi'

function ClientSearchPage() {
  const providers = [
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
    {
      id: 3,
      name: 'Luis Hernández',
      job: 'Pintor experto',
      rating: 4.7,
      reviews: 76,
      distance: '0.8 km',
      price: 200,
      available: 'Disponible',
    },
  ]

  return (
    <>
      <header className="client-page-hero">
        <div>
          <p>Panel cliente</p>
          <h1>Buscar servicios</h1>
          <span>Encuentra prestadores disponibles cerca de ti.</span>
        </div>
      </header>

      <section className="provider-content">
        <div className="client-search-toolbar">
          <div className="client-search-input">
            <FiSearch />
            <input placeholder="Buscar plomero, electricista, limpieza..." />
          </div>

          <button>
            <FiFilter />
            Filtros
          </button>
        </div>

        <div className="section-title">
          <h2>Resultados cerca de ti</h2>
          <button>Ver mapa</button>
        </div>

        <div className="client-search-results">
          {providers.map((provider) => (
            <article className="dashboard-card client-result-card" key={provider.id}>
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
                <button>Ver perfil</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ClientSearchPage