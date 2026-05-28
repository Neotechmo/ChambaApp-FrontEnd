import { phoneInputProps } from '../utils/forms.js'

function RegisterPage({
  darkMode,
  toggleTheme,
  registerForm,
  updateRegister,
  handleRegister,
  loading,
  message,
  goToLogin,
}) {
  return (
    <main className={darkMode ? 'auth-page dark' : 'auth-page'}>
      <button className="theme-button" onClick={toggleTheme}>
        {darkMode ? '☀' : '☾'}
      </button>

      <section className="auth-card">
        <button className="back-button" onClick={goToLogin}>
          Volver
        </button>

        <div className="brand-badge">CA</div>

        <h1>Crear cuenta</h1>

        <p className="muted">
          Regístrate como cliente o prestador.
        </p>

        <form className="form" onSubmit={handleRegister}>
          <label>
            Nombre
            <input
              name="nombre"
              value={registerForm.nombre}
              onChange={updateRegister}
              required
            />
          </label>

          <label>
            Apellido
            <input
              name="apellido"
              value={registerForm.apellido}
              onChange={updateRegister}
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="correo"
              value={registerForm.correo}
              onChange={updateRegister}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={registerForm.password}
              onChange={updateRegister}
              required
            />
          </label>

          <label>
            Teléfono
            <input
              {...phoneInputProps()}
              name="telefono"
              value={registerForm.telefono}
              onChange={updateRegister}
            />
          </label>

          <label>
            Tipo de cuenta
            <select
              name="rol"
              value={registerForm.rol}
              onChange={updateRegister}
            >
              <option value="cliente">Cliente</option>
              <option value="prestador">Prestador</option>
            </select>
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}
      </section>
    </main>
  )
}

export default RegisterPage
