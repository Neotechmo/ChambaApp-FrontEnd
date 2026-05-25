import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
} from 'react-icons/fi'

function ProviderCalendarPage() {
  const schedule = [
    {
      id: 1,
      time: '09:00',
      client: 'María López',
      service: 'Reparación de fuga',
      location: 'Roma Norte',
      status: 'Confirmado',
    },
    {
      id: 2,
      time: '14:30',
      client: 'Patricia Ruiz',
      service: 'Emergencia de tubería',
      location: 'Condesa',
      status: 'En curso',
    },
    {
      id: 3,
      time: '17:00',
      client: 'Roberto Silva',
      service: 'Instalación de lavabo',
      location: 'Del Valle',
      status: 'Pendiente',
    },
  ]

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Calendario</h1>
          <span>Organiza tus servicios programados del día.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button">
            <FiCalendar />
            Semana
          </button>

          <button className="solid-action-button">
            Agregar bloque
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="provider-calendar-grid">
          <article className="dashboard-card calendar-day-card">
            <span>Lunes</span>
            <strong>19</strong>
            <p>Mayo 2026</p>
          </article>

          <article className="dashboard-card calendar-summary-card">
            <h2>3</h2>
            <p>Servicios programados</p>
            <span>Para el día de hoy</span>
          </article>

          <article className="dashboard-card calendar-summary-card">
            <h2>6h</h2>
            <p>Tiempo ocupado</p>
            <span>Disponibilidad parcial</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Agenda del día</h2>
          <button>Ver mes completo</button>
        </div>

        <div className="calendar-timeline">
          {schedule.map((item) => (
            <article className="dashboard-card calendar-event-card" key={item.id}>
              <div className="calendar-time">
                <FiClock />
                <strong>{item.time}</strong>
              </div>

              <div className="calendar-event-info">
                <h3>{item.service}</h3>

                <p>
                  <FiUser />
                  {item.client}
                </p>

                <p>
                  <FiMapPin />
                  {item.location}
                </p>
              </div>

              <span className={`calendar-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ProviderCalendarPage