import { useEffect, useState } from 'react'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiEdit3,
  FiBriefcase,
  FiPlus,
  FiX,
} from 'react-icons/fi'
import { addressesApi, authApi } from '../../services/api.js'
import { onlyDigits, phoneInputProps, postalCodeInputProps } from '../../utils/forms.js'
import { setStable } from '../../utils/state.js'

function ClientProfilePage() {
  const [profile, setProfile] = useState(null)
  const [message, setMessage] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState({ telefono: '', ciudad: '', estado: '' })
  const [address, setAddress] = useState({
    etiqueta: '',
    calle: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
  })

  useEffect(() => {
    Promise.all([authApi.profile(), addressesApi.getAll()])
      .then(([profileResponse, addressResponse]) => {
        setStable(setProfile, profileResponse)
        setStable(setAddresses, addressResponse.data || [])
      })
      .catch((error) => setMessage(error.message))
  }, [])

  function openEditor() {
    if (!profile) return
    setForm({
      telefono: onlyDigits(profile.telefono || ''),
      ciudad: profile.ubicacion?.ciudad || '',
      estado: profile.ubicacion?.estado || '',
    })
    setEditOpen(true)
  }

  async function editProfile(event) {
    event.preventDefault()
    try {
      const updated = await authApi.updateProfile({
        telefono: onlyDigits(form.telefono),
        ubicacion: {
          ...profile.ubicacion,
          ciudad: form.ciudad,
          estado: form.estado,
        },
      })
      setStable(setProfile, updated)
      setEditOpen(false)
      setMessage('Perfil actualizado correctamente.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function createAddress(event) {
    event.preventDefault()
    try {
      const created = await addressesApi.create(address)
      setAddresses((current) => [created, ...current])
      setAddressOpen(false)
      setAddress({ etiqueta: '', calle: '', ciudad: '', estado: '', codigoPostal: '' })
      setMessage('Dirección guardada. Ya puedes seleccionarla al agendar.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const stats = profile?.estadisticas || {}
  const categories = profile?.preferencias?.categorias || []
  const name = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ') || 'Cliente'

  return (
    <>
      <header className="client-page-hero">
        <div>
          <p>Panel cliente</p>
          <h1>Mi perfil</h1>
          <span>Administra tu información personal y preferencias.</span>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="profile-grid">
          <article className="dashboard-card profile-main-card">
            <div className="profile-avatar-large">
              {name.charAt(0)}
            </div>

            <h2>{name}</h2>

            <p>{profile?.verificado ? 'Usuario verificado' : 'Cliente'}</p>

            <div className="profile-rating">
              <FiStar />
              <strong>{stats.ratingExperiencia?.toFixed(1) || '0.0'}</strong>
              <span>Experiencia promedio</span>
            </div>

            <button onClick={openEditor}>
              <FiEdit3 />
              Editar perfil
            </button>
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
              <span>Ubicación</span>
              <strong>
                {[profile?.ubicacion?.ciudad, profile?.ubicacion?.estado]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </strong>
            </div>
          </article>
        </div>

        <div className="profile-grid bottom-grid">
          <article className="dashboard-card profile-info-card">
            <h2>Actividad</h2>

            <div>
              <FiBriefcase />
              <span>Servicios solicitados</span>
              <strong>{stats.solicitudes || 0}</strong>
            </div>

            <div>
              <FiStar />
              <span>Prestadores favoritos</span>
              <strong>{stats.favoritos || 0}</strong>
            </div>

            <div>
              <FiBriefcase />
              <span>Servicios completados</span>
              <strong>{stats.completados || 0}</strong>
            </div>
          </article>

          <article className="dashboard-card profile-description-card">
            <h2>Preferencias</h2>

            <p>
              Tus preferencias y notificaciones se recuperan desde tu perfil
              para personalizar la experiencia.
            </p>

            <div className="profile-tags">
              {categories.length > 0 ? (
                categories.map((category) => <span key={category}>{category}</span>)
              ) : (
                <span>Sin categorías registradas</span>
              )}
            </div>
          </article>
        </div>

        <article className="dashboard-card saved-addresses-card">
          <div className="section-title">
            <h2>Mis direcciones</h2>
            <button onClick={() => setAddressOpen(true)}>
              <FiPlus />
              Nueva dirección
            </button>
          </div>
          <div className="saved-address-grid">
            {addresses.map((item) => (
              <div key={item.id}>
                <FiMapPin />
                <strong>{item.etiqueta || 'Dirección guardada'}</strong>
                <span>{item.calle}, {item.ciudad}, {item.estado}</span>
              </div>
            ))}
            {addresses.length === 0 && <p>No tienes direcciones guardadas.</p>}
          </div>
        </article>
      </section>

      {editOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditOpen(false)}>
          <section className="dashboard-card payment-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p>Editar perfil</p>
                <h2>Información personal</h2>
              </div>
              <button type="button" onClick={() => setEditOpen(false)} aria-label="Cerrar"><FiX /></button>
            </header>
            <form className="request-service-form" onSubmit={editProfile}>
              <label className="request-form-wide">
                Teléfono
                <input
                  {...phoneInputProps()}
                  value={form.telefono}
                  onChange={(event) => setForm({ ...form, telefono: onlyDigits(event.target.value) })}
                />
              </label>
              <label>
                Ciudad
                <input value={form.ciudad} onChange={(event) => setForm({ ...form, ciudad: event.target.value })} />
              </label>
              <label>
                Estado
                <input value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })} />
              </label>
              <div className="request-form-actions request-form-wide">
                <button type="button" className="outline-job-button" onClick={() => setEditOpen(false)}>Cancelar</button>
                <button className="solid-job-button">Guardar cambios</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {addressOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setAddressOpen(false)}>
          <section className="dashboard-card request-service-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p>Dirección</p>
                <h2>Guardar nueva dirección</h2>
              </div>
              <button type="button" onClick={() => setAddressOpen(false)} aria-label="Cerrar"><FiX /></button>
            </header>
            <form className="request-service-form" onSubmit={createAddress}>
              <label>
                Etiqueta
                <input value={address.etiqueta} onChange={(event) => setAddress({ ...address, etiqueta: event.target.value })} placeholder="Casa, Oficina..." />
              </label>
              <label>
                Calle y número
                <input value={address.calle} onChange={(event) => setAddress({ ...address, calle: event.target.value })} required />
              </label>
              <label>
                Ciudad
                <input value={address.ciudad} onChange={(event) => setAddress({ ...address, ciudad: event.target.value })} required />
              </label>
              <label>
                Estado
                <input value={address.estado} onChange={(event) => setAddress({ ...address, estado: event.target.value })} required />
              </label>
              <label className="request-form-wide">
                Código postal
                <input
                  {...postalCodeInputProps()}
                  value={address.codigoPostal}
                  onChange={(event) => setAddress({ ...address, codigoPostal: onlyDigits(event.target.value, 5) })}
                />
              </label>
              <div className="request-form-actions request-form-wide">
                <button type="button" className="outline-job-button" onClick={() => setAddressOpen(false)}>Cancelar</button>
                <button className="solid-job-button">Guardar dirección</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default ClientProfilePage
