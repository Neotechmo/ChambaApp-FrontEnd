import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  FiSearch,
  FiSend,
  FiPhone,
  FiVideo,
} from 'react-icons/fi'
import { conversationsApi } from '../../services/api.js'
import { setStable } from '../../utils/state.js'

function ProviderMessagesPage() {
  const { user } = useOutletContext()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const knownMessages = useRef(new Set())
  const unreadByConversation = useRef(new Map())
  const hasSelectedConversation = useRef(false)
  const selectedId = selected?.id
  const selectedName = selected?.otherUser.nombre

  useEffect(() => {
    let active = true

    async function loadConversations() {
      try {
        const response = await conversationsApi.getAll()
        if (!active) return
        const data = response.data || []
        unreadByConversation.current = new Map(
          data.map((conversation) => [conversation.id, conversation.unreadCount || 0]),
        )
        setStable(setConversations, data)
        if (data[0] && !hasSelectedConversation.current) {
          hasSelectedConversation.current = true
          setMessagesLoading(true)
          setSelected(data[0])
        }
      } catch (error) {
        if (active) setMessage(error.message)
      } finally {
        if (active) setConversationsLoading(false)
      }
    }

    loadConversations()
    const interval = window.setInterval(loadConversations, 4000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!selectedId) return undefined

    let active = true
    let initialized = false
    knownMessages.current = new Set()

    async function refreshMessages() {
      try {
        const response = await conversationsApi.messages(selectedId)
        if (!active) return
        const data = response.data || []
        const incoming = initialized
          ? data.find(
            (chatMessage) =>
              chatMessage.senderId !== user.id &&
              !knownMessages.current.has(chatMessage.id),
          )
          : null

        setStable(setMessages, data)
        knownMessages.current = new Set(data.map((chatMessage) => chatMessage.id))
        initialized = true
        if ((unreadByConversation.current.get(selectedId) || 0) > 0) {
          await conversationsApi.read(selectedId)
          if (!active) return
          unreadByConversation.current.set(selectedId, 0)
          setConversations((current) =>
            current.map((item) =>
              item.id === selectedId ? { ...item, unreadCount: 0 } : item,
            ),
          )
        }

        if (incoming) {
          setMessage(`Nuevo mensaje de ${selectedName}.`)
        }
      } catch (error) {
        if (active) setMessage(error.message)
      } finally {
        if (active) setMessagesLoading(false)
      }
    }

    refreshMessages()
    const interval = window.setInterval(refreshMessages, 2500)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [selectedId, selectedName, user.id])

  function openConversation(conversation) {
    hasSelectedConversation.current = true
    setMessagesLoading(true)
    setSelected(conversation)
  }

  async function sendMessage(event) {
    event.preventDefault()
    if (!selected || !draft.trim()) return

    try {
      const sent = await conversationsApi.send(selected.id, draft.trim())
      setMessages((current) => [...current, sent])
      setDraft('')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Mensajes</h1>
          <span>Mantente en contacto con tus clientes.</span>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="messages-layout">
          <aside className="dashboard-card conversations-panel">
            <div className="messages-search">
              <FiSearch />
              <input type="text" placeholder="Conversaciones de solicitudes" disabled />
            </div>

            {conversationsLoading ? (
              [1, 2, 3].map((item) => (
                <article className="conversation-item conversation-skeleton" key={item}>
                  <div className="skeleton-avatar tiny"></div>
                  <div>
                    <div className="skeleton-line wide"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </article>
              ))
            ) : conversations.map((chat) => (
                <button
                  key={chat.id}
                  className={`conversation-item ${selected?.id === chat.id ? 'active' : ''}`}
                  onClick={() => openConversation(chat)}
                >
                  <div className="request-avatar">
                    {chat.otherUser.nombre.charAt(0)}
                  </div>

                  <div>
                    <strong>{chat.otherUser.nombre}</strong>
                    <p>{chat.lastMessage || 'Inicia la conversación'}</p>
                  </div>

                  <span>{chat.unreadCount > 0 ? chat.unreadCount : ''}</span>
                </button>
            ))}
          </aside>

          <section className="dashboard-card chat-panel">
            {selected ? (
              <>
                <header className="chat-header">
                  <div className="chat-user">
                    <div className="request-avatar">
                      {selected.otherUser.nombre.charAt(0)}
                    </div>

                    <div>
                      <strong>{selected.otherUser.nombre}</strong>
                      <p>Cliente · Actualización automática</p>
                    </div>
                  </div>

                  <div className="chat-actions">
                    <button type="button" disabled title="Llamadas no disponibles" aria-label="Llamar">
                      <FiPhone />
                    </button>
                    <button type="button" disabled title="Videollamada no disponible" aria-label="Videollamada">
                      <FiVideo />
                    </button>
                  </div>
                </header>

                <div className="chat-messages">
                  {messagesLoading ? (
                    <>
                      <div className="message-skeleton received"></div>
                      <div className="message-skeleton sent"></div>
                      <div className="message-skeleton received short"></div>
                    </>
                  ) : messages.map((chatMessage) => (
                      <div
                        className={`message ${chatMessage.senderId === user.id ? 'sent' : 'received'}`}
                        key={chatMessage.id}
                      >
                        {chatMessage.text}
                      </div>
                  ))}
                </div>

                <form className="chat-input" onSubmit={sendMessage}>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Escribe un mensaje..."
                  />

                  <button aria-label="Enviar"><FiSend /></button>
                </form>
              </>
            ) : conversationsLoading ? (
              <div className="chat-loading-state">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-line wide"></div>
                <div className="skeleton-line"></div>
              </div>
            ) : (
              <div className="empty-state-card">
                <FiSend />
                <h2>Sin conversaciones</h2>
                <p>Las solicitudes de clientes aparecerán aquí.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  )
}

export default ProviderMessagesPage
