import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
} from 'react-icons/fi'

function ProviderEarningsPage() {
  const weekly = [
    { day: 'Lun', amount: 1200 },
    { day: 'Mar', amount: 1800 },
    { day: 'Mié', amount: 950 },
    { day: 'Jue', amount: 2200 },
    { day: 'Vie', amount: 2800 },
    { day: 'Sáb', amount: 3100 },
    { day: 'Dom', amount: 1150 },
  ]

  const transactions = [
    { id: 1, client: 'María López', service: 'Reparación de fuga', amount: 350, status: 'Pagado' },
    { id: 2, client: 'Roberto Silva', service: 'Instalación de lavabo', amount: 500, status: 'Pendiente' },
    { id: 3, client: 'Patricia Ruiz', service: 'Emergencia tubería', amount: 450, status: 'Pagado' },
  ]

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Ganancias</h1>
          <span>Consulta tus ingresos, pagos y rendimiento semanal.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button">
            <FiDownload />
            Descargar reporte
          </button>

          <button className="solid-action-button">
            Retirar saldo
          </button>
        </div>
      </header>

      <section className="provider-content">
        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>$24,500</h2>
            <p>Ganancias del mes</p>
            <span>+18% vs mes anterior</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>$13,200</h2>
            <p>Esta semana</p>
            <span>18 servicios realizados</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>$1,250</h2>
            <p>Saldo disponible</p>
            <span>Listo para retirar</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Ganancias semanales</h2>
              <button>Ver detalle</button>
            </div>

            <article className="dashboard-card earnings-detail-card">
              <div className="earnings-bars-large">
                {weekly.map((item) => (
                  <div key={item.day}>
                    <span style={{ height: `${item.amount / 35}px` }}></span>
                    <strong>${item.amount}</strong>
                    <p>{item.day}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <aside className="right-column">
            <article className="dashboard-card earnings-balance-card">
              <div className="stat-icon purple">
                <FiDollarSign />
              </div>

              <h2>$1,250</h2>
              <p>Saldo disponible</p>

              <button>Solicitar retiro</button>
            </article>

            <article className="dashboard-card earnings-balance-card">
              <div className="stat-icon green">
                <FiTrendingUp />
              </div>

              <h2>+18%</h2>
              <p>Crecimiento mensual</p>

              <button>Ver métricas</button>
            </article>
          </aside>
        </div>

        <div className="section-title bottom-grid">
          <h2>Últimos pagos</h2>
          <button>Ver todos</button>
        </div>

        <div className="transactions-list">
          {transactions.map((transaction) => (
            <article className="dashboard-card transaction-card" key={transaction.id}>
              <div className="transaction-icon">
                <FiCreditCard />
              </div>

              <div>
                <h3>{transaction.client}</h3>
                <p>{transaction.service}</p>
              </div>

              <strong>${transaction.amount}</strong>

              <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                {transaction.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ProviderEarningsPage