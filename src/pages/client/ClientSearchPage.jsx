import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiClock,
  FiFilter,
  FiHeart,
} from 'react-icons/fi'
import { categoriesApi, favoritesApi, servicesApi } from '../../services/api.js'
import { money } from '../../utils/formatters.js'
import { trackFavoriteAdded } from '../../utils/analytics.js'
import { setStable } from '../../utils/state.js'
import RequestServiceModal from './RequestServiceModal.jsx'

function ClientSearchPage() {
  const location = useLocation()
  const routedCategoryId = location.state?.categoryId || ''
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState(routedCategoryId)
  const [sort, setSort] = useState('availability')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [serviceToRequest, setServiceToRequest] = useState(null)

  useEffect(() => {
    categoriesApi.getAll()
      .then((response) => setStable(setCategories, response.data || []))
      .catch((error) => setMessage(error.message))
    loadProviders({ categoryId: routedCategoryId || undefined })
  }, [routedCategoryId])

  async function loadProviders(filters = {}) {
    setLoading(true)
    setMessage('')

    try {
      const response = await servicesApi.getAll({ available: true, ...filters })
      setStable(setProviders, response.data || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function submitSearch(event) {
    event.preventDefault()
    loadProviders({ search, categoryId, sort })
  }

  async function saveFavorite(provider) {
    try {
      await favoritesApi.add(provider.providerId)
      trackFavoriteAdded({
        providerId: provider.providerId,
        serviceId: provider.id,
      })
      setMessage(`${provider.nombre} fue agregado a favoritos.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

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
        <form className="client-search-toolbar" onSubmit={submitSearch}>
          <div className="client-search-input">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar plomero, electricista, limpieza..."
            />
          </div>

          <select
            aria-label="Filtrar por categoría"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>

          <select
            aria-label="Ordenar resultados"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="availability">Disponibilidad</option>
            <option value="rating">Mejor calificación</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
          </select>

          <button type="submit">
            <FiFilter />
            Buscar
          </button>
        </form>

        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="section-title">
          <h2>Resultados disponibles</h2>
          <button onClick={() => loadProviders()}>Actualizar</button>
        </div>

        <div className="client-search-results">
          {loading ? (
            [1, 2, 3].map((item) => (
              <article className="dashboard-card client-result-card list-skeleton-row" key={item}>
                <div className="skeleton-avatar small"></div>
                <div>
                  <div className="skeleton-line wide"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line wide"></div>
                </div>
                <div className="skeleton-button compact"></div>
              </article>
            ))
          ) : providers.map((provider) => (
            <article className="dashboard-card client-result-card" key={provider.id}>
              <div className="client-provider-avatar">
                {provider.nombre.charAt(0)}
              </div>

              <div>
                <h3>{provider.nombre}</h3>
                <p>{provider.oficio}</p>

                <div className="service-meta">
                  <span>
                    <FiStar />
                    <strong>{provider.rating.toFixed(1)}</strong>
                    ({provider.reviews})
                  </span>

                  <span>
                    <FiMapPin />
                    {provider.distancia || 'Ubicación no compartida'}
                  </span>

                  <span>
                    <FiClock />
                    {provider.disponibilidad}
                  </span>
                </div>
              </div>

              <div className="client-provider-price">
                <strong>{money(provider.precio)}</strong>
                <span>por hora</span>
                <div className="favorite-actions">
                  <button onClick={() => setServiceToRequest(provider)}>Solicitar</button>
                  <button
                    className="favorite-remove-button"
                    onClick={() => saveFavorite(provider)}
                    aria-label="Agregar a favoritos"
                  >
                    <FiHeart />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && providers.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiSearch />
            <h2>No hay servicios disponibles</h2>
            <p>Prueba con otra búsqueda o vuelve a actualizar.</p>
          </article>
        )}
      </section>

      {serviceToRequest && (
        <RequestServiceModal
          service={serviceToRequest}
          onClose={() => setServiceToRequest(null)}
          onCreated={() => {
            setMessage(`Solicitud agendada y enviada a ${serviceToRequest.nombre}.`)
            setServiceToRequest(null)
          }}
        />
      )}
    </>
  )
}

export default ClientSearchPage
