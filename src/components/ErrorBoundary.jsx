import { Component } from 'react'
import { trackUnexpectedError } from '../utils/analytics.js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    trackUnexpectedError(error, {
      componentStack: info.componentStack,
      source: 'react_error_boundary',
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="auth-page">
          <section className="auth-card">
            <div className="brand-badge">CA</div>
            <h1>Algo salió mal</h1>
            <p className="muted">
              Registramos el error para revisarlo. Actualiza la página para continuar.
            </p>
            <button className="primary-button" onClick={() => window.location.reload()}>
              Recargar aplicación
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
