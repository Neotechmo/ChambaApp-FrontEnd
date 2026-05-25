function ProviderHomePage({ user, logout }) {
  const requests = [
    {
      name: "María López",
      title: "Reparación de fuga en baño",
      location: "Col. Roma Norte, CDMX",
      distance: "2.3 km",
      time: "Hace 15 min",
      price: "$350",
      status: "Urgente",
    },
    {
      name: "Juan Pérez",
      title: "Instalación de lavabo",
      location: "Col. Condesa, CDMX",
      distance: "1.8 km",
      time: "Hace 1 hora",
      price: "$280",
      status: "Normal",
    },
    {
      name: "Ana García",
      title: "Revisión de tubería",
      location: "Col. Polanco, CDMX",
      distance: "4.2 km",
      time: "Hace 2 horas",
      price: "$200",
      status: "Flexible",
    },
  ];

  const activeJobs = [
    {
      name: "Patricia Ruiz",
      description: "Reparación urgente",
      time: "14:30 - 16:30",
      progress: 65,
      status: "Trabajando",
    },
    {
      name: "Roberto Silva",
      description: "Instalación",
      time: "17:00 - 19:00",
      progress: 30,
      status: "En camino",
    },
    {
      name: "Luis Torres",
      description: "Mantenimiento",
      time: "19:30 - 21:00",
      progress: 0,
      status: "Pendiente",
    },
  ];

  return (
    <>
      <header className="provider-hero">
        <div className="provider-hero-top">
          <div>
            <p>Bienvenido de vuelta,</p>
            <h1>{user?.nombre || "Prestador"}</h1>
          </div>

          <div className="provider-actions">
            <button className="available-pill">
              <span></span>
              Disponible
            </button>

            <button className="avatar-button">
              {user?.nombre?.charAt(0) || "P"}
            </button>

            <button className="logout-button" onClick={logout}>
              Salir
            </button>
          </div>
        </div>

        <div className="pending-banner">
          <div>
            <strong>Tienes 4 solicitudes pendientes</strong>
            <p>Responde pronto para aumentar tu rating</p>
          </div>

          <button>Ver solicitudes</button>
        </div>
      </header>

      <section className="provider-content">
        <div className="stats-grid">
          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon green">✓</div>

            <h2>124</h2>

            <p>Trabajos completados</p>

            <span>↗ +12 este mes</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon cyan">◷</div>

            <h2>4</h2>

            <p>Solicitudes nuevas</p>

            <span>↗ Requieren atención</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon yellow">☆</div>

            <h2>4.8</h2>

            <p>Calificación promedio</p>

            <span>↗ 98% satisfacción</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon purple">$</div>

            <h2>$24,500</h2>

            <p>Ganancias del mes</p>

            <span>↗ +18% vs anterior</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Solicitudes recientes</h2>

              <button>Ver todas</button>
            </div>

            <div className="request-list">
              {requests.map((request) => (
                <article
                  className="dashboard-card request-card"
                  key={request.name}
                >
                  <div className="request-top">
                    <div className="request-avatar">
                      {request.name.charAt(0)}
                    </div>

                    <div>
                      <h3>{request.name}</h3>

                      <p>{request.title}</p>

                      <small>
                        {request.location} · {request.distance} ·{" "}
                        {request.time}
                      </small>
                    </div>

                    <span
                      className={`request-tag ${request.status.toLowerCase()}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="request-bottom">
                    <strong>{request.price}</strong>

                    <div>
                      <button className="reject-button">
                        Rechazar
                      </button>

                      <button className="accept-button">
                        Aceptar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="right-column">
            <article className="dashboard-card agenda-card">
              <h2>Agenda de hoy</h2>

              <div className="date-box">
                <span>Lunes</span>

                <strong>19</strong>

                <p>Mayo 2026</p>
              </div>

              <div className="agenda-item">
                <span>09:00</span>

                <div>
                  <strong>María López</strong>

                  <p>Reparación</p>
                </div>
              </div>

              <div className="agenda-item">
                <span>14:30</span>

                <div>
                  <strong>Patricia Ruiz</strong>

                  <p>Emergencia</p>
                </div>
              </div>

              <div className="agenda-item">
                <span>17:00</span>

                <div>
                  <strong>Roberto Silva</strong>

                  <p>Instalación</p>
                </div>
              </div>
            </article>

            <article className="verified-card">
              <h2>Prestador Verificado</h2>

              <p>Certificación vigente</p>

              <div>
                <span>Especialidad</span>

                <strong>Plomería</strong>
              </div>

              <div>
                <span>Experiencia</span>

                <strong>5+ años</strong>
              </div>

              <div>
                <span>Certificaciones</span>

                <strong>3 activas</strong>
              </div>

              <button>Ver perfil completo</button>
            </article>
          </aside>
        </div>

        <div className="provider-grid bottom-grid">
          <section>
            <div className="section-title">
              <h2>Trabajos activos</h2>

              <span>3 en curso</span>
            </div>

            <div className="active-jobs">
              {activeJobs.map((job) => (
                <article
                  className="dashboard-card job-card"
                  key={job.name}
                >
                  <div>
                    <h3>{job.name}</h3>

                    <p>{job.description}</p>

                    <span>{job.time}</span>
                  </div>

                  <strong>{job.status}</strong>

                  <div className="progress-bar">
                    <div style={{ width: `${job.progress}%` }}></div>
                  </div>

                  <small>{job.progress}%</small>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Ganancias semanales</h2>

              <span>$13,200 total</span>
            </div>

            <article className="dashboard-card earnings-card">
              <div className="bars">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day, index) => (
                    <div key={day}>
                      <span
                        style={{
                          height: `${40 + index * 6}px`,
                        }}
                      ></span>

                      <p>{day}</p>
                    </div>
                  )
                )}
              </div>

              <div className="earnings-summary">
                <div>
                  <p>Promedio/día</p>

                  <strong>$1,886</strong>
                </div>

                <div>
                  <p>Mejor día</p>

                  <strong>$2,800</strong>
                </div>

                <div>
                  <p>Servicios</p>

                  <strong>18</strong>
                </div>
              </div>
            </article>
          </section>
        </div>
      </section>
    </>
  );
}

export default ProviderHomePage;