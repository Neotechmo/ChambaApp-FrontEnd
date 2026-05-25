import {
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  FiGrid,
  FiSearch,
  FiBriefcase,
  FiMessageSquare,
  FiHeart,
  FiUser,
} from 'react-icons/fi'

function ClientLayout({
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
          ? 'client-dashboard-layout dark'
          : 'client-dashboard-layout'
      }
    >
      <aside className="provider-sidebar">
        <div className="provider-brand">
          <div className="brand-badge small-brand">
            C
          </div>

          <div>
            <h2>ChambaApp</h2>
            <p>Panel Cliente</p>
          </div>
        </div>

        <nav className="provider-menu">
          <button
            className={
              location.pathname === '/client'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client')}
          >
            <div className="menu-item-left">
              <FiGrid />
              Inicio
            </div>
          </button>

          <button
            className={
              location.pathname === '/client/search'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client/search')}
          >
            <div className="menu-item-left">
              <FiSearch />
              Buscar servicios
            </div>
          </button>

          <button
            className={
              location.pathname === '/client/requests'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client/requests')}
          >
            <div className="menu-item-left">
              <FiBriefcase />
              Mis solicitudes
            </div>

            <span>2</span>
          </button>

          <button
            className={
              location.pathname === '/client/messages'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client/messages')}
          >
            <div className="menu-item-left">
              <FiMessageSquare />
              Mensajes
            </div>

            <span>1</span>
          </button>

          <button
            className={
              location.pathname === '/client/favorites'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client/favorites')}
          >
            <div className="menu-item-left">
              <FiHeart />
              Favoritos
            </div>
          </button>

          <button
            className={
              location.pathname === '/client/profile'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/client/profile')}
          >
            <div className="menu-item-left">
              <FiUser />
              Perfil
            </div>
          </button>
        </nav>

        <div className="provider-user">
          <div className="avatar">
            {(user?.nombre || 'M').charAt(0)}
          </div>

          <div>
            <strong>
              {user?.nombre || 'Cliente'}
            </strong>

            <p>Cliente</p>
          </div>
        </div>
      </aside>

      <section className="client-dashboard-main">
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

export default ClientLayout