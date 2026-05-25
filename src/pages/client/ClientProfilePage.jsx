import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiEdit3,
  FiBriefcase,
} from 'react-icons/fi'

function ClientProfilePage() {
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
        <div className="profile-grid">
          <article className="dashboard-card profile-main-card">
            <div className="profile-avatar-large">
              C
            </div>

            <h2>Cliente</h2>

            <p>Usuario verificado</p>

            <div className="profile-rating">
              <FiStar />
              <strong>4.9</strong>
              <span>Experiencia promedio</span>
            </div>

            <button>
              <FiEdit3 />
              Editar perfil
            </button>
          </article>

          <article className="dashboard-card profile-info-card">
            <h2>Información personal</h2>

            <div>
              <FiUser />
              <span>Nombre</span>
              <strong>Cliente</strong>
            </div>

            <div>
              <FiMail />
              <span>Correo</span>
              <strong>cliente@email.com</strong>
            </div>

            <div>
              <FiPhone />
              <span>Teléfono</span>
              <strong>477 123 4567</strong>
            </div>

            <div>
              <FiMapPin />
              <span>Ubicación</span>
              <strong>León, Guanajuato</strong>
            </div>
          </article>
        </div>

        <div className="profile-grid bottom-grid">
          <article className="dashboard-card profile-info-card">
            <h2>Actividad</h2>

            <div>
              <FiBriefcase />
              <span>Servicios solicitados</span>
              <strong>15</strong>
            </div>

            <div>
              <FiStar />
              <span>Prestadores favoritos</span>
              <strong>2</strong>
            </div>

            <div>
              <FiBriefcase />
              <span>Servicios completados</span>
              <strong>12</strong>
            </div>
          </article>

          <article className="dashboard-card profile-description-card">
            <h2>Preferencias</h2>

            <p>
              Recibir notificaciones de nuevos mensajes,
              seguimiento de solicitudes y promociones de servicios
              cercanos a mi ubicación.
            </p>

            <div className="profile-tags">
              <span>Plomería</span>
              <span>Electricidad</span>
              <span>Limpieza</span>
              <span>Pintura</span>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default ClientProfilePage