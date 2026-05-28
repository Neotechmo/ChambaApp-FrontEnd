import {
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { conversationsApi, dashboardApi, notificationsApi } from '../services/api.js'
import { setStable } from '../utils/state.js'

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
  const [counts, setCounts] = useState({ requests: 0, unread: 0 })
  const [notification, setNotification] = useState('')
  const [notificationTitle, setNotificationTitle] = useState('Mensaje nuevo')
  const previousChats = useRef(new Map())
  const previousNotifications = useRef(new Set())
  const notificationsReady = useRef(false)
  const notificationTimeout = useRef(null)

  useEffect(() => {
    let active = true

    async function refreshIndicators() {
      try {
        const [dashboard, conversations, systemNotifications] = await Promise.all([
          dashboardApi.client(),
          conversationsApi.getAll(),
          notificationsApi.getAll(),
        ])
        if (!active) return

        const chats = conversations.data || []
        if (notificationsReady.current) {
          const incoming = chats.find((conversation) => {
            const previous = previousChats.current.get(conversation.id)
            return (
              conversation.unreadCount > (previous?.unreadCount || 0) &&
              conversation.lastMessageAt !== previous?.lastMessageAt
            )
          })

          if (incoming) {
            setNotificationTitle('Mensaje nuevo')
            setNotification(
              `Nuevo mensaje de ${incoming.otherUser.nombre}: ${incoming.lastMessage}`,
            )
            window.clearTimeout(notificationTimeout.current)
            notificationTimeout.current = window.setTimeout(
              () => setNotification(''),
              5000,
            )
          }

          const newEvent = systemNotifications.find(
            (item) => !item.read && !previousNotifications.current.has(item._id),
          )
          if (newEvent) {
            setNotificationTitle(newEvent.title)
            setNotification(newEvent.message)
            notificationsApi.read(newEvent._id).catch(() => {})
            window.clearTimeout(notificationTimeout.current)
            notificationTimeout.current = window.setTimeout(() => setNotification(''), 5000)
          }
        }

        previousChats.current = new Map(
          chats.map((conversation) => [
            conversation.id,
            {
              unreadCount: conversation.unreadCount,
              lastMessageAt: conversation.lastMessageAt,
            },
          ]),
        )
        notificationsReady.current = true
        previousNotifications.current = new Set(
          systemNotifications.map((item) => item._id),
        )
        setStable(setCounts, {
          requests: dashboard.activeRequests || 0,
          unread: chats.reduce(
            (total, conversation) => total + conversation.unreadCount,
            0,
          ),
        })
      } catch {
        // Keep the current badge if a background refresh fails.
      }
    }

    refreshIndicators()
    const interval = window.setInterval(refreshIndicators, 4000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [location.pathname])

  useEffect(() => () => window.clearTimeout(notificationTimeout.current), [])

  return (
    <main
      className={
        darkMode
          ? 'client-dashboard-layout dark'
          : 'client-dashboard-layout'
      }
    >
      {notification && (
        <aside className="message-toast" role="alert">
          <FiMessageSquare />
          <div>
            <strong>{notificationTitle}</strong>
            <p>{notification}</p>
          </div>
          <button onClick={() => setNotification('')} aria-label="Cerrar notificación">
            ×
          </button>
        </aside>
      )}

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

            {counts.requests > 0 && <span>{counts.requests}</span>}
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

            {counts.unread > 0 && <span>{counts.unread}</span>}
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
