import {
  FiSearch,
  FiSend,
  FiPhone,
  FiVideo,
} from 'react-icons/fi'

function ProviderMessagesPage() {
  const conversations = [
    {
      id: 1,
      name: 'María López',
      lastMessage: '¿Podría llegar un poco antes?',
      time: '10:24',
      unread: true,
    },
    {
      id: 2,
      name: 'Roberto Silva',
      lastMessage: 'Perfecto, muchas gracias',
      time: 'Ayer',
      unread: false,
    },
    {
      id: 3,
      name: 'Ana García',
      lastMessage: 'Te comparto la ubicación',
      time: 'Lun',
      unread: false,
    },
  ]

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
        <div className="messages-layout">
          <aside className="dashboard-card conversations-panel">
            <div className="messages-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Buscar conversación..."
              />
            </div>

            {conversations.map((chat) => (
              <button
                key={chat.id}
                className={`conversation-item ${
                  chat.id === 1 ? 'active' : ''
                }`}
              >
                <div className="request-avatar">
                  {chat.name.charAt(0)}
                </div>

                <div>
                  <strong>{chat.name}</strong>
                  <p>{chat.lastMessage}</p>
                </div>

                <span>{chat.time}</span>
              </button>
            ))}
          </aside>

          <section className="dashboard-card chat-panel">
            <header className="chat-header">
              <div className="chat-user">
                <div className="request-avatar">
                  M
                </div>

                <div>
                  <strong>María López</strong>
                  <p>Cliente</p>
                </div>
              </div>

              <div className="chat-actions">
                <button>
                  <FiPhone />
                </button>

                <button>
                  <FiVideo />
                </button>
              </div>
            </header>

            <div className="chat-messages">
              <div className="message received">
                Hola, ¿todavía sigue disponible?
              </div>

              <div className="message sent">
                Sí claro, puedo atender hoy.
              </div>

              <div className="message received">
                Excelente, gracias.
              </div>
            </div>

            <div className="chat-input">
              <input
                placeholder="Escribe un mensaje..."
              />

              <button>
                <FiSend />
              </button>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}

export default ProviderMessagesPage