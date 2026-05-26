import {
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { conversationsApi, notificationsApi, providerApi } from '../services/api.js'

import {
  FiGrid,
  FiInbox,
  FiBriefcase,
  FiCalendar,
  FiMessageSquare,
  FiDollarSign,
  FiStar,
  FiUser,
  FiTool,
} from 'react-icons/fi'

function ProviderLayout({
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
          providerApi.dashboard(),
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
        setCounts({
          requests: dashboard.pendingRequests || 0,
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
          ? 'provider-layout dark'
          : 'provider-layout'
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

            {counts.requests > 0 && <span>{counts.requests}</span>}
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

            {counts.unread > 0 && <span>{counts.unread}</span>}
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
              location.pathname === '/provider/services'
                ? 'active'
                : ''
            }
            onClick={() => navigate('/provider/services')}
          >
            <div className="menu-item-left">
              <FiTool />
              Mis servicios
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

            <p>Prestador</p>
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
