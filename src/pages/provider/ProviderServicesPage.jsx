import { useEffect, useState } from 'react'
import { FiEdit3, FiPlus, FiTool, FiTrash2, FiX } from 'react-icons/fi'
import { authApi, categoriesApi, servicesApi } from '../../services/api.js'
import { money } from '../../utils/formatters.js'

const emptyForm = {
  titulo: '',
  descripcion: '',
  precio_base: '0',
  categoryId: '',
}

function ProviderServicesPage() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    setLoading(true)
    try {
      const [profileResponse, categoryResponse, serviceResponse] = await Promise.all([
        authApi.profile(),
        categoriesApi.getAll(),
        servicesApi.getAll({ limit: 100 }),
      ])
      setProfile(profileResponse)
      setCategories(categoryResponse.data || [])
      setServices(
        (serviceResponse.data || []).filter(
          (service) => service.providerId === profileResponse.id,
        ),
      )
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  async function openEdit(service) {
    try {
      const detail = await servicesApi.getById(service.id)
      setEditing(service)
      setForm({
        titulo: '',
        descripcion: detail.descripcion || '',
        precio_base: String(detail.precio || 0),
        categoryId: detail.categoria?.id ? String(detail.categoria.id) : '',
      })
      setModalOpen(true)
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function submit(event) {
    event.preventDefault()
    try {
      const payload = {
        descripcion: form.descripcion.trim(),
        precio_base: Number(form.precio_base),
        ...(form.categoryId ? { categoryId: Number(form.categoryId) } : {}),
      }
      if (editing) {
        await servicesApi.update(editing.id, payload)
        setMessage('Servicio actualizado correctamente.')
      } else {
        await servicesApi.create({ ...payload, titulo: form.titulo.trim() })
        setMessage('Servicio publicado correctamente.')
      }
      setModalOpen(false)
      await loadServices()
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function changeAvailability(service, available) {
    try {
      await servicesApi.update(service.id, { disponible: available })
      setMessage(available ? 'Servicio habilitado.' : 'Servicio pausado.')
      await loadServices()
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function removeService(service) {
    try {
      await servicesApi.remove(service.id)
      setMessage('Servicio eliminado.')
      await loadServices()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Mis servicios</h1>
          <span>Publica y administra los servicios que pueden contratarte.</span>
        </div>
        <div className="provider-page-actions">
          <button className="solid-action-button" onClick={openCreate}>
            <FiPlus />
            Nuevo servicio
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="section-title">
          <h2>Servicios publicados</h2>
          <button onClick={loadServices}>Actualizar</button>
        </div>

        <div className="provider-services-list">
          {services.map((service) => (
            <article className="dashboard-card provider-service-card" key={service.id}>
              <div className="transaction-icon"><FiTool /></div>
              <div>
                <h3>{service.oficio}</h3>
                <p>{service.categoria?.nombre || 'Servicio profesional'}</p>
                <small>{service.disponibilidad}</small>
              </div>
              <strong>{money(service.precio)} <span>por hora</span></strong>
              <div className="provider-service-actions">
                <button className="outline-job-button" onClick={() => openEdit(service)}>
                  <FiEdit3 />
                  Editar
                </button>
                {service.disponibilidad === 'Disponible' ? (
                  <button className="outline-job-button" onClick={() => changeAvailability(service, false)}>Pausar</button>
                ) : (
                  <button className="outline-job-button" onClick={() => changeAvailability(service, true)}>Activar</button>
                )}
                <button className="danger-job-button" onClick={() => removeService(service)}>
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))}
        </div>

        {!loading && services.length === 0 && (
          <article className="dashboard-card empty-state-card">
            <FiTool />
            <h2>Aún no publicas servicios</h2>
            <p>Crea un servicio para empezar a recibir solicitudes.</p>
          </article>
        )}
      </section>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
          <section className="dashboard-card request-service-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p>{editing ? 'Editar publicación' : 'Nuevo servicio'}</p>
                <h2>{editing ? editing.oficio : profile?.especialidad || 'Publicar servicio'}</h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Cerrar"><FiX /></button>
            </header>
            <form className="request-service-form" onSubmit={submit}>
              {!editing && (
                <label className="request-form-wide">
                  Título del servicio
                  <input value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} required />
                </label>
              )}
              <label className="request-form-wide">
                Descripción
                <textarea rows="4" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} required />
              </label>
              <label>
                Precio base por hora
                <input type="number" min="0" value={form.precio_base} onChange={(event) => setForm({ ...form, precio_base: event.target.value })} required />
              </label>
              <label>
                Categoría
                <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nombre}</option>
                  ))}
                </select>
              </label>
              <div className="request-form-actions request-form-wide">
                <button type="button" className="outline-job-button" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="solid-job-button">{editing ? 'Guardar cambios' : 'Publicar servicio'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default ProviderServicesPage
