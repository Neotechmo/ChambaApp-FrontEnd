import {
  FiSearch,
  FiSend,
  FiPhone,
  FiVideo,
} from 'react-icons/fi'

function ClientMessagesPage() {
  const conversations = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      role: 'Plomero certificado',
      lastMessage: 'Voy en camino, llego en 15 minutos.',
      time: '10:24',
    },
    {
      id: 2,
      name: 'Ana García',
      role: 'Electricista profesional',
      lastMessage: 'Perfecto, quedamos para mañana.',
      time: 'Ayer',
    },
    {
      id: 3,
      name: 'Luis Hernández',
      role: 'Pintor experto',
      lastMessage: 'Te mando la cotización en un momento.',
      time: 'Lun',
    },
  ]

  return (
    <>
      <header className="client-page-hero">
        <div>
          <p>Panel cliente</p>
          <h1>Mensajes</h1>
          <span>Comunícate con los prestadores de tus servicios.</span>
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
                  C
                </div>

                <div>
                  <strong>Carlos Mendoza</strong>
                  <p>Plomero certificado</p>
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
                Hola, ya acepté tu solicitud.
              </div>

              <div className="message sent">
                Perfecto, muchas gracias.
              </div>

              <div className="message received">
                Voy en camino, llego en 15 minutos.
              </div>
            </div>

            <div className="chat-input">
              <input placeholder="Escribe un mensaje..." />

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

export default ClientMessagesPage