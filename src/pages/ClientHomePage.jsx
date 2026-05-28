import {
  FiSearch,
  FiBriefcase,
  FiMapPin,
  FiStar,
  FiClock,
  FiTool,
  FiZap,
  FiDroplet,
  FiEdit3,
  FiTruck,
  FiSettings,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, categoriesApi, dashboardApi } from "../services/api.js";
import { dateTime, money } from "../utils/formatters.js";
import { setStable } from "../utils/state.js";
import RequestServiceModal from "./client/RequestServiceModal.jsx";

function ClientHomePage({
  user,
  services,
  loadServices,
  logout,
  darkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [serviceToRequest, setServiceToRequest] = useState(null);

  useEffect(() => {
    Promise.all([categoriesApi.getAll(), dashboardApi.client(), authApi.profile()])
      .then(([categoryResponse, dashboardResponse, profileResponse]) => {
        setStable(setCategories, categoryResponse.data || []);
        setStable(setDashboard, dashboardResponse);
        setStable(setProfile, profileResponse);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const categoryIcons = [<FiTool />, <FiZap />, <FiDroplet />, <FiEdit3 />, <FiTruck />, <FiSettings />];

  return (
    <main className={darkMode ? "client-dashboard dark" : "client-dashboard"}>
      <section className="client-dashboard-main">
        <button className="theme-button" onClick={toggleTheme}>
          {darkMode ? "☀" : "☾"}
        </button>

        <header className="client-dashboard-hero">
          <div className="provider-hero-top">
            <div>
              <p>Hola,</p>
              <h1>{user?.nombre || "Cliente"}</h1>
            </div>

            <div className="provider-actions">
              <div className="available-pill" aria-label="Ubicación registrada">
                <FiMapPin />
                {[profile?.ubicacion?.ciudad, profile?.ubicacion?.estado].filter(Boolean).join(", ") || "Ubicación sin registrar"}
              </div>

              <div className="avatar-button" aria-hidden="true">
                {(user?.nombre || "M").charAt(0)}
              </div>

              <button className="logout-button" onClick={logout}>
                Salir
              </button>
            </div>
          </div>

          <button className="client-dashboard-search" onClick={loadServices}>
            <FiSearch />
            <span>¿Qué servicio necesitas hoy?</span>
          </button>
        </header>

        <section className="provider-content">
          {message && <p className="status-message api-feedback">{message}</p>}

          <div className="stats-grid">
            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon cyan">
                <FiBriefcase />
              </div>

              <h2>{dashboard?.activeRequests || 0}</h2>
              <p>Solicitudes activas</p>
              <span>Servicios en seguimiento</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon yellow">
                <FiStar />
              </div>

              <h2>{dashboard?.favorites || 0}</h2>
              <p>Favoritos</p>
              <span>Prestadores guardados</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon green">
                <FiClock />
              </div>

              <h2>{dashboard?.completedServices || 0}</h2>
              <p>Servicios completados</p>
              <span>Historial activo</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon purple">$</div>

              <h2>{money(dashboard?.monthSpent)}</h2>
              <p>Gastado este mes</p>
              <span>Control de gastos</span>
            </article>
          </div>

          <div className="section-title">
            <h2>Categorías populares</h2>
            <button onClick={() => navigate("/client/search")}>Ver todas</button>
          </div>

          <div className="client-category-grid dashboard-categories">
            {categories.map((category, index) => (
              <button
                className="client-category-card"
                key={category.id}
                onClick={() => navigate("/client/search", { state: { categoryId: category.id } })}
              >
                <div>{categoryIcons[index % categoryIcons.length]}</div>
                <strong>{category.nombre}</strong>
                <span>{category.providersAvailable} disponibles</span>
              </button>
            ))}
          </div>

          <div className="provider-grid bottom-grid">
            <section>
              <div className="section-title">
                <h2>Servicios cerca de ti</h2>
                <button onClick={loadServices}>Actualizar</button>
              </div>

              <div className="client-services-list">
                {services.map((service) => {
                  const name = service.nombre || service.titulo || "Servicio";

                  const oficio =
                    service.oficio ||
                    service.descripcion ||
                    service.categoria?.nombre ||
                    "Servicio profesional";

                  return (
                    <article
                      className="dashboard-card client-provider-row"
                      key={service.id || name}
                    >
                      <div className="client-provider-avatar">
                        {name.charAt(0)}
                      </div>

                      <div>
                        <h3>{name}</h3>
                        <p>{oficio}</p>

                        <div className="service-meta">
                          <span>
                            <FiStar />
                            <strong>{service.rating?.toFixed(1) || "0.0"}</strong>(
                            {service.reviews || 0})
                          </span>

                          <span>
                            <FiMapPin />
                            {service.distancia || "Sin distancia"}
                          </span>

                          <span>
                            <FiClock />
                            {service.disponibilidad}
                          </span>
                        </div>
                      </div>

                      <div className="client-provider-price">
                        <strong>{money(service.precio)}</strong>
                        <span>por hora</span>

                        <button onClick={() => setServiceToRequest(service)}>Solicitar</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="right-column">
              <article className="dashboard-card agenda-card">
                <h2>Mis próximas chambas</h2>

                {(dashboard?.upcoming || []).map((item) => (
                  <div className="agenda-item" key={item.id}>
                    <span>{new Date(item.scheduledAt).getDate()}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{dateTime(item.scheduledAt)} - {item.provider.nombre}</p>
                    </div>
                  </div>
                ))}

                {dashboard?.upcoming?.length === 0 && <p>Sin servicios agendados.</p>}
              </article>

              <article className="verified-card">
                <h2>Tip de seguridad</h2>

                <p>
                  Revisa siempre las reseñas y verifica que el prestador tenga
                  perfil validado.
                </p>

                <div>
                  <span>Prestadores verificados</span>
                  <strong>Consulta el perfil</strong>
                </div>

                <div>
                  <span>Reseñas</span>
                  <strong>Antes de contratar</strong>
                </div>

                <button onClick={() => navigate("/client/search")}>Ver prestadores</button>
              </article>
            </aside>
          </div>
        </section>
      </section>

      {serviceToRequest && (
        <RequestServiceModal
          service={serviceToRequest}
          onClose={() => setServiceToRequest(null)}
          onCreated={async () => {
            setMessage(`Solicitud agendada y enviada a ${serviceToRequest.nombre}.`);
            setServiceToRequest(null);
            setStable(setDashboard, await dashboardApi.client());
          }}
        />
      )}
    </main>
  );
}

export default ClientHomePage;
