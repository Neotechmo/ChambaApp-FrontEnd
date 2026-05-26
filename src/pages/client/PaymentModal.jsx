import { useState } from 'react'
import { FiCreditCard, FiX } from 'react-icons/fi'
import { paymentsApi } from '../../services/api.js'
import { money } from '../../utils/formatters.js'

function PaymentModal({ request, onClose, onCreated }) {
  const [method, setMethod] = useState('transferencia')
  const [reference, setReference] = useState('')
  const [payment, setPayment] = useState(request.payment || null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const amount = payment?.amount || request.finalPrice || request.estimatedPrice

  async function submitPayment(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const created = await paymentsApi.createForRequest(request.id, {
        method,
        reference: reference.trim() || undefined,
      })
      setPayment(created)
      onCreated(created, false)
      setMessage('Pago registrado. Confírmalo para completar la operación.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmPayment() {
    setLoading(true)
    setMessage('')

    try {
      const confirmed = await paymentsApi.confirm(request.id)
      setPayment(confirmed)
      onCreated(confirmed, true)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dashboard-card payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p>Registrar pago</p>
            <h2 id="payment-title">{request.title}</h2>
            <span>{request.provider.nombre}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </header>

        <div className="payment-total">
          <FiCreditCard />
          <div>
            <span>Total estimado</span>
            <strong>{money(amount)}</strong>
          </div>
        </div>

        {!payment && <form className="request-service-form" onSubmit={submitPayment}>
          <label className="request-form-wide">
            Método de pago
            <select value={method} onChange={(event) => setMethod(event.target.value)}>
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </label>

          <label className="request-form-wide">
            Referencia (opcional)
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Referencia o nota de pago"
            />
          </label>

          <p className="payment-note request-form-wide">
            No ingreses datos bancarios. El monto final es calculado por ChambaApp.
          </p>

          {message && <p className="status-message api-feedback request-form-wide">{message}</p>}

          <div className="request-form-actions request-form-wide">
            <button type="button" className="outline-job-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="solid-job-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar pago'}
            </button>
          </div>
        </form>}

        {payment && payment.status !== 'paid' && (
          <div className="payment-confirmation">
            <p className="payment-note">
              Tu pago está pendiente. Confirma el pago simulado para marcarlo como pagado y
              notificar al prestador.
            </p>
            {message && <p className="status-message api-feedback">{message}</p>}
            <div className="request-form-actions">
              <button type="button" className="outline-job-button" onClick={onClose}>
                Cerrar
              </button>
              <button
                type="button"
                className="solid-job-button"
                onClick={confirmPayment}
                disabled={loading}
              >
                {loading ? 'Confirmando...' : 'Confirmar pago'}
              </button>
            </div>
          </div>
        )}

        {payment?.status === 'paid' && (
          <div className="payment-confirmation payment-success">
            <p>Pago confirmado correctamente. El prestador ya fue notificado.</p>
            <button type="button" className="solid-job-button" onClick={onClose}>
              Listo
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default PaymentModal
