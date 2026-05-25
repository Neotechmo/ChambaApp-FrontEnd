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

function ClientHomePage({
  user,
  services,
  loadServices,
  logout,
  darkMode,
  toggleTheme,
}) {
  const categories = [
    { icon: <FiTool />, label: "Plomero", count: "245" },
    { icon: <FiZap />, label: "Electricista", count: "189" },
    { icon: <FiDroplet />, label: "Limpieza", count: "312" },
    { icon: <FiEdit3 />, label: "Pintor", count: "156" },
    { icon: <FiTruck />, label: "Mecánico", count: "203" },
    { icon: <FiSettings />, label: "Técnico", count: "167" },
  ];

  const fallbackServices = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      oficio: "Plomero certificado",
      precio: 250,
      distancia: "1.2 km",
      disponibilidad: "Disponible",
      rating: 4.8,
      reviews: 124,
      verificado: true,
    },
    {
      id: 2,
      nombre: "Ana García",
      oficio: "Electricista profesional",
      precio: 300,
      distancia: "2.5 km",
      disponibilidad: "Hoy",
      rating: 4.9,
      reviews: 98,
      verificado: true,
    },
    {
      id: 3,
      nombre: "Luis Hernández",
      oficio: "Pintor experto",
      precio: 200,
      distancia: "0.8 km",
      disponibilidad: "Disponible",
      rating: 4.7,
      reviews: 76,
      verificado: false,
    },
  ];

  const servicesToShow = services.length > 0 ? services : fallbackServices;

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
              <h1>{user?.nombre || "María López"}</h1>
            </div>

            <div className="provider-actions">
              <button className="available-pill">
                <FiMapPin />
                León, Guanajuato
              </button>

              <button className="avatar-button">
                {(user?.nombre || "M").charAt(0)}
              </button>

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
          <div className="stats-grid">
            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon cyan">
                <FiBriefcase />
              </div>

              <h2>3</h2>
              <p>Solicitudes activas</p>
              <span>↗ 2 en proceso</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon yellow">
                <FiStar />
              </div>

              <h2>4.9</h2>
              <p>Promedio recibido</p>
              <span>↗ Buena experiencia</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon green">
                <FiClock />
              </div>

              <h2>12</h2>
              <p>Servicios completados</p>
              <span>↗ Historial activo</span>
            </article>

            <article className="dashboard-card stat-card-pro">
              <div className="stat-icon purple">$</div>

              <h2>$2,450</h2>
              <p>Gastado este mes</p>
              <span>↗ Control de gastos</span>
            </article>
          </div>

          <div className="section-title">
            <h2>Categorías populares</h2>
            <button>Ver todas</button>
          </div>

          <div className="client-category-grid dashboard-categories">
            {categories.map((category) => (
              <button className="client-category-card" key={category.label}>
                <div>{category.icon}</div>
                <strong>{category.label}</strong>
                <span>{category.count} disponibles</span>
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
                {servicesToShow.map((service) => {
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
                            <strong>{service.rating || 4.8}</strong>(
                            {service.reviews || 120})
                          </span>

                          <span>
                            <FiMapPin />
                            {service.distancia || "1.2 km"}
                          </span>

                          <span>
                            <FiClock />
                            {service.disponibilidad || "Disponible"}
                          </span>
                        </div>
                      </div>

                      <div className="client-provider-price">
                        <strong>${service.precio || 250}</strong>
                        <span>por hora</span>

                        <button>Solicitar</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="right-column">
              <article className="dashboard-card agenda-card">
                <h2>Mis próximas chambas</h2>

                <div className="agenda-item">
                  <span>Hoy</span>
                  <div>
                    <strong>Reparación de fuga</strong>
                    <p>14:30 - Carlos Mendoza</p>
                  </div>
                </div>

                <div className="agenda-item">
                  <span>Jue</span>
                  <div>
                    <strong>Limpieza profunda</strong>
                    <p>10:00 - Ana García</p>
                  </div>
                </div>

                <div className="agenda-item">
                  <span>Vie</span>
                  <div>
                    <strong>Pintura de habitación</strong>
                    <p>16:00 - Luis Hernández</p>
                  </div>
                </div>
              </article>

              <article className="verified-card">
                <h2>Tip de seguridad</h2>

                <p>
                  Revisa siempre las reseñas y verifica que el prestador tenga
                  perfil validado.
                </p>

                <div>
                  <span>Prestadores verificados</span>
                  <strong>+500</strong>
                </div>

                <div>
                  <span>Soporte</span>
                  <strong>24/7</strong>
                </div>

                <button>Ver recomendaciones</button>
              </article>
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ClientHomePage;
