import { useEffect, useState } from 'react'
import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
} from 'react-icons/fi'
import { providerApi } from '../../services/api.js'
import { money, shortDate } from '../../utils/formatters.js'
import { setStable } from '../../utils/state.js'

function ProviderEarningsPage() {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadEarnings()
  }, [])

  async function loadEarnings() {
    try {
      const [earningsResponse, transactionsResponse] = await Promise.all([
        providerApi.earnings(),
        providerApi.transactions(),
      ])
      setStable(setSummary, earningsResponse)
      setStable(setTransactions, transactionsResponse.data || [])
    } catch (error) {
      setMessage(error.message)
    }
  }

  const weekly = summary?.weekly || []
  const highest = weekly.reduce((max, day) => Math.max(max, day.amount), 1)

  return (
    <>
      <header className="provider-page-hero">
        <div>
          <p>Panel profesional</p>
          <h1>Ganancias</h1>
          <span>Consulta tus ingresos, pagos y rendimiento semanal.</span>
        </div>

        <div className="provider-page-actions">
          <button className="outline-action-button" onClick={loadEarnings}>
            <FiDownload />
            Actualizar
          </button>

          <button className="solid-action-button" disabled title="Pendiente en backend">
            Retiros próximamente
          </button>
        </div>
      </header>

      <section className="provider-content">
        {message && <p className="status-message api-feedback">{message}</p>}

        <div className="requests-summary-grid">
          <article className="dashboard-card request-summary-card">
            <h2>{money(summary?.monthTotal)}</h2>
            <p>Ganancias del mes</p>
            <span>{summary?.monthlyGrowthPercent || 0}% vs mes anterior</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{money(summary?.weekTotal)}</h2>
            <p>Periodo consultado</p>
            <span>Pagos registrados</span>
          </article>

          <article className="dashboard-card request-summary-card">
            <h2>{money(summary?.availableBalance)}</h2>
            <p>Saldo disponible</p>
            <span>Registro informativo</span>
          </article>
        </div>

        <div className="provider-grid">
          <section>
            <div className="section-title">
              <h2>Ganancias por día</h2>
              <button onClick={loadEarnings}>Actualizar</button>
            </div>

            <article className="dashboard-card earnings-detail-card">
              <div className="earnings-bars-large">
                {weekly.map((item) => (
                  <div key={item.date}>
                    <span style={{ height: `${Math.max((item.amount / highest) * 180, 8)}px` }}></span>
                    <strong>{money(item.amount)}</strong>
                    <p>{shortDate(item.date)}</p>
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

              <h2>{money(summary?.availableBalance)}</h2>
              <p>Saldo disponible</p>

              <button disabled>Retiro no disponible</button>
            </article>

            <article className="dashboard-card earnings-balance-card">
              <div className="stat-icon green">
                <FiTrendingUp />
              </div>

              <h2>{summary?.monthlyGrowthPercent || 0}%</h2>
              <p>Crecimiento mensual</p>

              <button onClick={loadEarnings}>Actualizar métricas</button>
            </article>
          </aside>
        </div>

        <div className="section-title bottom-grid">
          <h2>Últimos pagos</h2>
          <button onClick={loadEarnings}>Actualizar</button>
        </div>

        <div className="transactions-list">
          {transactions.map((transaction) => (
            <article className="dashboard-card transaction-card" key={transaction.id}>
              <div className="transaction-icon">
                <FiCreditCard />
              </div>

              <div>
                <h3>
                  {[transaction.solicitud?.cliente?.nombre, transaction.solicitud?.cliente?.apellido]
                    .filter(Boolean)
                    .join(' ')}
                </h3>
                <p>{transaction.solicitud?.servicio?.titulo}</p>
              </div>

              <strong>{money(transaction.monto)}</strong>

              <span className={`transaction-status ${transaction.estado === 'paid' ? 'pagado' : 'pendiente'}`}>
                {transaction.estado === 'paid' ? 'Pagado' : transaction.estado}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ProviderEarningsPage
