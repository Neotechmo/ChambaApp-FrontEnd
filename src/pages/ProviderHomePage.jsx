import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, providerApi } from "../services/api.js";
import { addressText, dateTime, jobProgress, money, statusLabel } from "../utils/formatters.js";
import { setStable } from "../utils/state.js";

function ProviderHomePage({ user, logout }) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      providerApi.dashboard(),
      providerApi.requests(),
      providerApi.jobs(),
      authApi.profile(),
    ])
      .then(([summary, requestResponse, jobsResponse, profileResponse]) => {
        setStable(setDashboard, summary);
        setStable(setRequests, (requestResponse.data || []).filter((request) => request.status === "pending"));
        setStable(setActiveJobs, (jobsResponse.data || []).filter((job) => job.status !== "completed"));
        setStable(setProfile, profileResponse);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  async function toggleAvailability() {
    try {
      const updated = await providerApi.updateAvailability(!profile?.disponible);
      setStable(setProfile, updated);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <header className="provider-hero">
        <div className="provider-hero-top">
          <div>
            <p>Bienvenido de vuelta,</p>
            <h1>{user?.nombre || "Prestador"}</h1>
          </div>

          <div className="provider-actions">
            <button className="available-pill" onClick={toggleAvailability}>
              <span></span>
              {profile?.disponible ? "Disponible" : "No disponible"}
            </button>

            <div className="avatar-button" aria-hidden="true">
              {user?.nombre?.charAt(0) || "P"}
            </div>

            <button className="logout-button" onClick={logout}>
              Salir
            </button>
          </div>
        </div>

        <div className="pending-banner">
          <div>
            <strong>Tienes {dashboard?.pendingRequests || 0} solicitudes pendientes</strong>
            <p>Responde pronto para aumentar tu rating</p>
          </div>

          <button onClick={() => navigate("/provider/requests")}>Ver solicitudes</button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="stats-grid">
          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon green">✓</div>

            <h2>{dashboard?.completedJobs || 0}</h2>

            <p>Trabajos completados</p>

            <span>Historial registrado</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon cyan">◷</div>

            <h2>{dashboard?.pendingRequests || 0}</h2>

            <p>Solicitudes nuevas</p>

            <span>↗ Requieren atención</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon yellow">☆</div>

            <h2>{dashboard?.rating?.toFixed(1) || "0.0"}</h2>

            <p>Calificación promedio</p>

            <span>{dashboard?.reviews || 0} reseñas</span>
          </article>

          <article className="dashboard-card stat-card-pro">
            <div className="stat-icon purple">$</div>

            <h2>{money(dashboard?.earnings?.monthTotal)}</h2>

            <p>Ganancias del mes</p>

            <span>{dashboard?.earnings?.monthlyGrowthPercent || 0}% vs anterior</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Solicitudes recientes</h2>

              <button onClick={() => navigate("/provider/requests")}>Ver todas</button>
            </div>

            <div className="request-list">
              {requests.slice(0, 3).map((request) => (
                <article
                  className="dashboard-card request-card"
                  key={request.id}
                >
                  <div className="request-top">
                    <div className="request-avatar">
                      {request.client.nombre.charAt(0)}
                    </div>

                    <div>
                      <h3>{request.client.nombre}</h3>

                      <p>{request.title}</p>

                      <small>
                        {addressText(request.address)} · {dateTime(request.requestedAt)}
                      </small>
                    </div>

                    <span
                      className={`request-tag ${request.priority === "urgent" ? "urgente" : "normal"}`}
                    >
                      {request.priority === "urgent" ? "Urgente" : "Normal"}
                    </span>
                  </div>

                  <div className="request-bottom">
                    <strong>{money(request.estimatedPrice)}</strong>

                    <div>
                      <button className="accept-button" onClick={() => navigate("/provider/requests")}>
                        Responder
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
                <span>Hoy</span>

                <strong>{new Date().getDate()}</strong>

                <p>{new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(new Date())}</p>
              </div>

              {activeJobs.slice(0, 3).map((job) => (
                <div className="agenda-item" key={job.id}>
                  <span>{job.scheduledAt ? new Date(job.scheduledAt).getHours() : "--"}:00</span>
                  <div>
                    <strong>{job.client.nombre}</strong>
                    <p>{job.title}</p>
                  </div>
                </div>
              ))}
            </article>

            <article className="verified-card">
              <h2>Prestador Verificado</h2>

              <p>{profile?.verificado ? "Perfil verificado" : "Verificación pendiente"}</p>

              <div>
                <span>Especialidad</span>

                <strong>{profile?.especialidad || "Sin registrar"}</strong>
              </div>

              <div>
                <span>Experiencia</span>

                <strong>{profile?.experienciaAnios ? `${profile.experienciaAnios} años` : "Sin registrar"}</strong>
              </div>

              <div>
                <span>Zona</span>

                <strong>{profile?.zonaCobertura || "Sin registrar"}</strong>
              </div>

              <button onClick={() => navigate("/provider/profile")}>Ver perfil completo</button>
            </article>
          </aside>
        </div>

        <div className="provider-grid bottom-grid">
          <section>
            <div className="section-title">
              <h2>Trabajos activos</h2>

              <span>{activeJobs.length} en curso</span>
            </div>

            <div className="active-jobs">
              {activeJobs.map((job) => (
                <article
                  className="dashboard-card job-card"
                  key={job.id}
                >
                  <div>
                    <h3>{job.client.nombre}</h3>

                    <p>{job.title}</p>

                    <span>{dateTime(job.scheduledAt || job.requestedAt)}</span>
                  </div>

                  <strong>{statusLabel(job.status)}</strong>

                  <div className="progress-bar">
                    <div style={{ width: `${jobProgress(job.status)}%` }}></div>
                  </div>

                  <small>{jobProgress(job.status)}%</small>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Ganancias semanales</h2>

              <span>{money(dashboard?.earnings?.weekTotal)} total</span>
            </div>

            <article className="dashboard-card earnings-card">
              <div className="bars">
                {(dashboard?.earnings?.weekly || []).map(
                  (day) => (
                    <div key={day.date}>
                      <span
                        style={{
                          height: `${Math.max(day.amount / 35, 8)}px`,
                        }}
                      ></span>

                      <p>{new Date(day.date).getDate()}</p>
                    </div>
                  )
                )}
              </div>

              <div className="earnings-summary">
                <div>
                  <p>Promedio/día</p>

                  <strong>{money(
                    (dashboard?.earnings?.weekly || []).length
                      ? dashboard.earnings.weekTotal / dashboard.earnings.weekly.length
                      : 0
                  )}</strong>
                </div>

                <div>
                  <p>Mejor día</p>

                  <strong>{money(
                    Math.max(0, ...(dashboard?.earnings?.weekly || []).map((day) => day.amount))
                  )}</strong>
                </div>

                <div>
                  <p>Servicios</p>

                  <strong>{dashboard?.completedJobs || 0}</strong>
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
