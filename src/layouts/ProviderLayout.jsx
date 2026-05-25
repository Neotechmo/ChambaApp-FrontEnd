import {
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  FiGrid,
  FiInbox,
  FiBriefcase,
  FiCalendar,
  FiMessageSquare,
  FiDollarSign,
  FiStar,
  FiUser,
} from 'react-icons/fi'

function ProviderLayout({
  user,
  logout,
  darkMode,
  toggleTheme,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <main
      className={
        darkMode
          ? 'provider-layout dark'
          : 'provider-layout'
      }
    >
      <aside className="provider-sidebar">
        <div className="provider-brand">
          <div className="brand-badge small-brand">
            C
          </div>

          <div>
            <h2>ChambaApp</h2>
            <p>Panel Profesional</p>
          </div>
        </div>

        <nav className="provider-menu">
          <button
            className={
              location.pathname === '/provider'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider')}
          >
            <div className="menu-item-left">
              <FiGrid />
              Dashboard
            </div>
          </button>

          <button
            className={
              location.pathname === '/provider/requests'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/requests')}
          >
            <div className="menu-item-left">
              <FiInbox />
              Solicitudes
            </div>

            <span>4</span>
          </button>

          <button
            className={
              location.pathname === '/provider/jobs'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/jobs')}
          >
            <div className="menu-item-left">
              <FiBriefcase />
              Trabajos activos
            </div>
          </button>

          <button
            className={
              location.pathname === '/provider/calendar'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/calendar')}
          >
            <div className="menu-item-left">
              <FiCalendar />
              Calendario
            </div>
          </button>

          <button
            className={
              location.pathname === '/provider/messages'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/messages')}
          >
            <div className="menu-item-left">
              <FiMessageSquare />
              Mensajes
            </div>

            <span>2</span>
          </button>

          <button
            className={
              location.pathname === '/provider/earnings'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/earnings')}
          >
            <div className="menu-item-left">
              <FiDollarSign />
              Ganancias
            </div>
          </button>

          <button
            className={
              location.pathname === '/provider/reviews'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/reviews')}
          >
            <div className="menu-item-left">
              <FiStar />
              Reseñas
            </div>
          </button>

          <button
            className={
              location.pathname === '/provider/profile'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/profile')}
          >
            <div className="menu-item-left">
              <FiUser />
              Perfil profesional
            </div>
          </button>
        </nav>

        <div className="provider-user">
          <div className="avatar">
            {(user?.nombre || 'P').charAt(0)}
          </div>

          <div>
            <strong>
              {user?.nombre || 'Prestador'}
            </strong>

            <p>Plomero certificado</p>
          </div>
        </div>
      </aside>

      <section className="provider-main">
        <button
          className="theme-button"
          onClick={toggleTheme}
        >
          {darkMode ? '☀' : '☾'}
        </button>

        <Outlet
          context={{
            user,
            logout,
            darkMode,
            toggleTheme,
          }}
        />
      </section>
    </main>
  )
}

export default ProviderLayout