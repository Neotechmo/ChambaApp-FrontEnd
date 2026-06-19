/**
 * Page Object Model — Autenticación
 * Cumple 5.2: "Page Object Model o App Actions para encapsular interacciones de UI"
 *
 * Selectores: prioriza data-cy / data-testid sobre clases CSS (5.2 buena práctica).
 * Si el componente no tiene atributos data-*, usa selector semántico como fallback.
 */
export class AuthPage {
  // ── Selectores ─────────────────────────────────────────────────────────────
  get emailInput() {
    return cy.get(
      '[data-cy="login-email"], [data-testid="login-email"], input[type="email"]',
    );
  }

  get passwordInput() {
    return cy.get(
      '[data-cy="login-password"], [data-testid="login-password"], input[type="password"]',
    );
  }

  get submitButton() {
    return cy.get(
      '[data-cy="login-submit"], [data-testid="login-submit"], button[type="submit"]',
    );
  }

  get errorMessage() {
    return cy.get(
      '[data-cy="auth-error"], [data-testid="auth-error"], [class*="error"], [role="alert"]',
    );
  }

  get registerLink() {
    return cy.get(
      '[data-cy="go-to-register"], [data-testid="go-to-register"], a[href*="register"], a[href*="registro"]',
    );
  }

  get nombreInput() {
    return cy.get(
      '[data-cy="register-nombre"], [data-testid="register-nombre"], input[name="nombre"]',
    );
  }

  get apellidoInput() {
    return cy.get(
      '[data-cy="register-apellido"], [data-testid="register-apellido"], input[name="apellido"]',
    );
  }

  // ── Acciones ───────────────────────────────────────────────────────────────
  visit() {
    cy.visit('/login');
    return this;
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  submit() {
    this.submitButton.click();
    return this;
  }

  /** Flujo completo de login desde UI */
  loginWith(email, password) {
    this.visit().fillEmail(email).fillPassword(password).submit();
    return this;
  }

  /** Espera a que el login complete verificando la URL */
  expectRedirectToDashboard() {
    cy.url().should('include', '/dashboard');
    return this;
  }

  expectErrorVisible() {
    this.errorMessage.should('be.visible');
    return this;
  }
}
