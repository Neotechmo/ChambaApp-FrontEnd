import { useEffect, useState } from 'react'
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
} from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import { addressText, dateTime, statusLabel } from '../../utils/formatters.js'

function ProviderCalendarPage() {
  const [schedule, setSchedule] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSchedule()
  }, [])

  async function loadSchedule() {
    try {
      const response = await providerApi.calendar()
      setSchedule(response.data || [])
    } catch (error) {
      setMessage(error.message)
    }
  }

  const occupiedHours = schedule.reduce(
    (total, item) => total + (item.estimatedDurationMin || 0) / 60,
    0,
  )

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Calendario</h1>
          <span>Organiza tus servicios programados del día.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button" onClick={loadSchedule}>
            <FiCalendar />
            Actualizar
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="provider-calendar-grid">
          <article className="dashboard-card calendar-day-card">
            <span>Agenda</span>
            <strong>{new Date().getDate()}</strong>
            <p>{new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date())}</p>
          </article>

          <article className="dashboard-card calendar-summary-card">
            <h2>{schedule.length}</h2>
            <p>Servicios programados</p>
            <span>En tu agenda</span>
          </article>

          <article className="dashboard-card calendar-summary-card">
            <h2>{occupiedHours}h</h2>
            <p>Tiempo ocupado</p>
            <span>Duración estimada</span>
          </article>
        </div>

        <div className="section-title">
          <h2>Agenda de servicios</h2>
          <button onClick={loadSchedule}>Actualizar</button>
        </div>

        <div className="calendar-timeline">
          {schedule.map((item) => (
            <article className="dashboard-card calendar-event-card" key={item.id}>
              <div className="calendar-time">
                <FiClock />
                <strong>{dateTime(item.scheduledAt || item.requestedAt)}</strong>
              </div>

              <div className="calendar-event-info">
                <h3>{item.title}</h3>

                <p>
                  <FiUser />
                  {item.client.nombre}
                </p>

                <p>
                  <FiMapPin />
                  {addressText(item.address)}
                </p>
              </div>

              <span className={`calendar-status ${item.status}`}>
                {statusLabel(item.status)}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ProviderCalendarPage
