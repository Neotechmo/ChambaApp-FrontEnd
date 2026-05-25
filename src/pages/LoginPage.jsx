function LoginPage({
  darkMode,
  toggleTheme,
  loginForm,
  updateLogin,
  handleLogin,
  loading,
  message,
  goToRegister,
}) {
  return (
    <main className={darkMode ? 'auth-page dark' : 'auth-page'}>
      <button className="theme-button" onClick={toggleTheme}>
        {darkMode ? '☀' : '☾'}
      </button>

      <section className="auth-card">
        <div className="brand-badge">CA</div>

        <h1>Bienvenido a ChambaApp</h1>

        <p className="muted">
          Inicia sesión para buscar servicios.
        </p>

        <form className="form" onSubmit={handleLogin}>
          <label>
            Correo electrónico
            <input
              type="email"
              name="correo"
              placeholder="cliente@chambaapp.com"
              value={loginForm.correo}
              onChange={updateLogin}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="Password123"
              value={loginForm.password}
              onChange={updateLogin}
              required
            />
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <button className="link-button" onClick={goToRegister}>
          Crear cuenta nueva
        </button>

        {message && <p className="status-message">{message}</p>}
      </section>
    </main>
  )
}

export default LoginPage