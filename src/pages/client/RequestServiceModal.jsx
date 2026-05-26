import { useEffect, useState } from 'react'
import { FiCalendar, FiMapPin, FiX } from 'react-icons/fi'
import { addressesApi, requestsApi } from '../../services/api.js'
import { money } from '../../utils/formatters.js'

function RequestServiceModal({ service, onClose, onCreated }) {
  const [form, setForm] = useState({
    direccion: '',
    descripcion: `Necesito un servicio de ${service.oficio}.`,
    fechaSolicitada: '',
    duracionEstimadaMin: '60',
    prioridad: 'normal',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [minimumDate] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  })

  useEffect(() => {
    addressesApi.getAll()
      .then((response) => setAddresses(response.data || []))
      .catch(() => {
        // A written address still permits requesting a service.
      })
  }, [])

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitRequest(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const request = await requestsApi.create({
        serviceId: service.id,
        titulo: service.oficio,
        descripcion: form.descripcion.trim(),
        ...(selectedAddress
          ? { direccionId: Number(selectedAddress) }
          : { direccion: form.direccion.trim() }),
        fechaSolicitada: new Date(form.fechaSolicitada).toISOString(),
        duracionEstimadaMin: Number(form.duracionEstimadaMin),
        prioridad: form.prioridad,
        precioEstimado: service.precio,
      })
      onCreated(request)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dashboard-card request-service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-service-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>Agendar visita</p>
            <h2 id="request-service-title">{service.oficio}</h2>
            <span>{service.nombre} · {money(service.precio)} por hora</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </header>

        <form className="request-service-form" onSubmit={submitRequest}>
          <label>
            <FiCalendar />
            Fecha y hora de visita
            <input
              type="datetime-local"
              name="fechaSolicitada"
              min={minimumDate}
              value={form.fechaSolicitada}
              onChange={updateForm}
              required
            />
          </label>

          <label>
            <FiMapPin />
            Dirección guardada
            <select
              value={selectedAddress}
              onChange={(event) => setSelectedAddress(event.target.value)}
            >
              <option value="">Escribir otra dirección</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.etiqueta || 'Dirección'} - {address.calle}, {address.ciudad}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FiMapPin />
            Dirección del servicio
            <input
              name="direccion"
              value={form.direccion}
              onChange={updateForm}
              placeholder="Calle, número, colonia y ciudad"
              required={!selectedAddress}
              disabled={Boolean(selectedAddress)}
            />
          </label>

          <label className="request-form-wide">
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={updateForm}
              rows="3"
              required
            />
          </label>

          <label>
            Duración estimada
            <select
              name="duracionEstimadaMin"
              value={form.duracionEstimadaMin}
              onChange={updateForm}
            >
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
              <option value="240">4 horas</option>
            </select>
          </label>

          <label>
            Prioridad
            <select name="prioridad" value={form.prioridad} onChange={updateForm}>
              <option value="normal">Normal</option>
              <option value="urgent">Urgente</option>
            </select>
          </label>

          {message && <p className="status-message api-feedback request-form-wide">{message}</p>}

          <div className="request-form-actions request-form-wide">
            <button type="button" className="outline-job-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="solid-job-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default RequestServiceModal
