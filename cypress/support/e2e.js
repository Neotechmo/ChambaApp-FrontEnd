// ***********************************************************
// cypress/support/e2e.js — Archivo de soporte global para E2E
// ***********************************************************
import 'cypress-axe'; // Accesibilidad (5.2: verificación a11y en E2E críticos)
import './commands';

// Ignora errores de React no críticos en consola
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('ResizeObserver loop') ||
    err.message.includes('Non-Error promise rejection')
  ) {
    return false;
  }
});
