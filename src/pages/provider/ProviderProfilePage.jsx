import { useEffect, useState } from 'react'
import {
  FiUser,
  FiStar,
  FiBriefcase,
  FiAward,
  FiMapPin,
  FiPhone,
  FiMail,
  FiEdit3,
  FiX,
} from 'react-icons/fi'
import { authApi, providerApi } from '../../services/api.js'

function ProviderProfilePage() {
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState({ average: 0, total: 0 })
  const [message, setMessage] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    especialidad: '',
    descripcion: '',
    experienciaAnios: '0',
    precioHora: '0',
    zonaCobertura: '',
    etiquetas: '',
  })

  useEffect(() => {
    Promise.all([authApi.profile(), providerApi.reviews()])
      .then(([profileResponse, reviewsResponse]) => {
        setProfile(profileResponse)
        setReviews(reviewsResponse.summary)
      })
      .catch((error) => setMessage(error.message))
  }, [])

  function openEditor() {
    if (!profile) return
    setForm({
      especialidad: profile.especialidad || '',
      descripcion: profile.descripcion || '',
      experienciaAnios: String(profile.experienciaAnios || 0),
      precioHora: String(profile.precioHora || 0),
      zonaCobertura: profile.zonaCobertura || '',
      etiquetas: (profile.etiquetas || []).join(', '),
    })
    setEditOpen(true)
  }

  async function editProfessionalProfile(event) {
    event.preventDefault()
    try {
      const updated = await providerApi.updateProfile({
        especialidad: form.especialidad.trim(),
        descripcion: form.descripcion.trim(),
        experienciaAnios: Number(form.experienciaAnios),
        precioHora: Number(form.precioHora),
        zonaCobertura: form.zonaCobertura.trim(),
        etiquetas: form.etiquetas.split(',').map((tag) => tag.trim()).filter(Boolean),
      })
      setProfile(updated)
      setEditOpen(false)
      setMessage('Perfil profesional actualizado.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const name = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ') || 'Prestador'

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Perfil profesional</h1>
          <span>Administra tu información, especialidad y certificaciones.</span>
        </div>

        <div className="provider-page-actions">
          <button className="solid-action-button" onClick={openEditor}>
            <FiEdit3 />
            Editar perfil
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="profile-grid">
          <article className="dashboard-card profile-main-card">
            <div className="profile-avatar-large">{name.charAt(0)}</div>

            <h2>{name}</h2>
            <p>{profile?.especialidad || 'Prestador de servicios'}</p>

            <div className="profile-rating">
              <FiStar />
              <strong>{reviews.average.toFixed(1)}</strong>
              <span>{reviews.total} reseñas</span>
            </div>

            <button onClick={openEditor}>Actualizar información</button>
          </article>

          <article className="dashboard-card profile-info-card">
            <h2>Información personal</h2>

            <div>
              <FiUser />
              <span>Nombre</span>
              <strong>{name}</strong>
            </div>

            <div>
              <FiMail />
              <span>Correo</span>
              <strong>{profile?.correo || '-'}</strong>
            </div>

            <div>
              <FiPhone />
              <span>Teléfono</span>
              <strong>{profile?.telefono || '-'}</strong>
            </div>

            <div>
              <FiMapPin />
              <span>Zona</span>
              <strong>{profile?.zonaCobertura || '-'}</strong>
            </div>
          </article>
        </div>

        <div className="profile-grid bottom-grid">
          <article className="dashboard-card profile-info-card">
            <h2>Perfil laboral</h2>

            <div>
              <FiBriefcase />
              <span>Especialidad</span>
              <strong>{profile?.especialidad || '-'}</strong>
            </div>

            <div>
              <FiAward />
              <span>Experiencia</span>
              <strong>{profile?.experienciaAnios ? `${profile.experienciaAnios} años` : '-'}</strong>
            </div>

            <div>
              <FiStar />
              <span>Precio por hora</span>
              <strong>${profile?.precioHora || 0}</strong>
            </div>
          </article>

          <article className="dashboard-card profile-description-card">
            <h2>Descripción</h2>

            <p>{profile?.descripcion || 'Agrega una descripción de tus servicios.'}</p>

            <div className="profile-tags">
              {(profile?.etiquetas || []).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        </div>
      </section>

      {editOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditOpen(false)}>
          <section className="dashboard-card request-service-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p>Editar perfil</p>
                <h2>Perfil profesional</h2>
              </div>
              <button type="button" onClick={() => setEditOpen(false)} aria-label="Cerrar"><FiX /></button>
            </header>
            <form className="request-service-form" onSubmit={editProfessionalProfile}>
              <label>
                Especialidad
                <input value={form.especialidad} onChange={(event) => setForm({ ...form, especialidad: event.target.value })} required />
              </label>
              <label>
                Zona de cobertura
                <input value={form.zonaCobertura} onChange={(event) => setForm({ ...form, zonaCobertura: event.target.value })} />
              </label>
              <label>
                Experiencia (años)
                <input type="number" min="0" value={form.experienciaAnios} onChange={(event) => setForm({ ...form, experienciaAnios: event.target.value })} />
              </label>
              <label>
                Precio por hora
                <input type="number" min="0" value={form.precioHora} onChange={(event) => setForm({ ...form, precioHora: event.target.value })} />
              </label>
              <label className="request-form-wide">
                Descripción
                <textarea rows="4" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} required />
              </label>
              <label className="request-form-wide">
                Etiquetas separadas por coma
                <input value={form.etiquetas} onChange={(event) => setForm({ ...form, etiquetas: event.target.value })} placeholder="Puntual, Emergencias, Residencial" />
              </label>
              <div className="request-form-actions request-form-wide">
                <button type="button" className="outline-job-button" onClick={() => setEditOpen(false)}>Cancelar</button>
                <button className="solid-job-button">Guardar perfil</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default ProviderProfilePage
