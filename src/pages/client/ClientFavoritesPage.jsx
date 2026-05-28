import { useEffect, useState } from 'react'
import {
  FiHeart,
  FiMapPin,
  FiStar,
  FiClock,
  FiTrash2,
} from 'react-icons/fi'
import { favoritesApi } from '../../services/api.js'
import { money } from '../../utils/formatters.js'
import { setStable } from '../../utils/state.js'
import RequestServiceModal from './RequestServiceModal.jsx'

function ClientFavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [serviceToRequest, setServiceToRequest] = useState(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  async function loadFavorites() {
    setLoading(true)

    try {
      const response = await favoritesApi.getAll()
      setStable(setFavorites, response.data || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeFavorite(providerId) {
    try {
      await favoritesApi.remove(providerId)
      setFavorites((current) =>
        current.filter((provider) => provider.providerId !== providerId),
      )
      setMessage('Prestador eliminado de favoritos.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const average =
    favorites.length > 0
      ? favorites.reduce((total, provider) => total + provider.rating, 0) /
        favorites.length
      : 0

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
        {message && <p className="status-message api-feedback">{message}</p>}

        {loading ? (
          <div className="requests-summary-grid">
            {[1, 2, 3].map((item) => (
              <article className="dashboard-card request-summary-card dashboard-skeleton-card" key={item}>
                <div className="skeleton-line wide"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line wide"></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="requests-summary-grid">
            <article className="dashboard-card request-summary-card">
              <h2>{favorites.length}</h2>
              <p>Guardados</p>
              <span>Prestadores favoritos</span>
            </article>

            <article className="dashboard-card request-summary-card">
              <h2>{average.toFixed(1)}</h2>
              <p>Promedio</p>
              <span>Calificación media</span>
            </article>

            <article className="dashboard-card request-summary-card">
              <h2>{favorites.filter((provider) => provider.verificado).length}</h2>
              <p>Verificados</p>
              <span>Perfiles validados</span>
            </article>
          </div>
        )}

        <div className="section-title">
          <h2>Prestadores favoritos</h2>
          <button onClick={loadFavorites}>Actualizar</button>
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
          ) : favorites.map((provider) => (
            <article className="dashboard-card client-result-card favorite-card" key={provider.providerId}>
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
                    {provider.categoria?.nombre || 'Servicio profesional'}
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
                    onClick={() => removeFavorite(provider.providerId)}
                    aria-label="Eliminar de favoritos"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && favorites.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiHeart />
            <h2>No tienes favoritos todavía</h2>
            <p>Guarda prestadores para encontrarlos más rápido después.</p>
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

export default ClientFavoritesPage
