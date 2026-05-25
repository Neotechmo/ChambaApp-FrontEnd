import {
  FiUser,
  FiStar,
  FiBriefcase,
  FiAward,
  FiMapPin,
  FiPhone,
  FiMail,
  FiEdit3,
} from 'react-icons/fi'

function ProviderProfilePage() {
  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Perfil profesional</h1>
          <span>Administra tu información, especialidad y certificaciones.</span>
        </div>

        <div className="provider-page-actions">
          <button className="solid-action-button">
            <FiEdit3 />
            Editar perfil
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="profile-grid">
          <article className="dashboard-card profile-main-card">
            <div className="profile-avatar-large">P</div>

            <h2>Prestador</h2>
            <p>Plomero certificado</p>

            <div className="profile-rating">
              <FiStar />
              <strong>4.8</strong>
              <span>124 reseñas</span>
            </div>

            <button>Actualizar información</button>
          </article>

          <article className="dashboard-card profile-info-card">
            <h2>Información personal</h2>

            <div>
              <FiUser />
              <span>Nombre</span>
              <strong>Prestador</strong>
            </div>

            <div>
              <FiMail />
              <span>Correo</span>
              <strong>prestador@email.com</strong>
            </div>

            <div>
              <FiPhone />
              <span>Teléfono</span>
              <strong>55 1234 5678</strong>
            </div>

            <div>
              <FiMapPin />
              <span>Zona</span>
              <strong>León, Guanajuato</strong>
            </div>
          </article>
        </div>

        <div className="profile-grid bottom-grid">
          <article className="dashboard-card profile-info-card">
            <h2>Perfil laboral</h2>

            <div>
              <FiBriefcase />
              <span>Especialidad</span>
              <strong>Plomería</strong>
            </div>

            <div>
              <FiAward />
              <span>Experiencia</span>
              <strong>5+ años</strong>
            </div>

            <div>
              <FiStar />
              <span>Calificación</span>
              <strong>4.8 / 5</strong>
            </div>
          </article>

          <article className="dashboard-card profile-description-card">
            <h2>Descripción</h2>

            <p>
              Profesional especializado en reparación de fugas, instalación de
              lavabos, mantenimiento de tuberías y servicios urgentes de
              plomería para hogar y negocio.
            </p>

            <div className="profile-tags">
              <span>Fugas</span>
              <span>Instalaciones</span>
              <span>Mantenimiento</span>
              <span>Emergencias</span>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default ProviderProfilePage