/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Dashboard (Cliente y Prestador)
 */
describe('Dashboard Cliente', () => {
  beforeEach(() => {
    cy.loginAsClient();
  });

  it('debe cargar el dashboard del cliente con métricas', () => {
    cy.visit('/client');
    cy.contains('Solicitudes activas').should('be.visible');
    cy.contains('Favoritos').should('be.visible');
    cy.contains('Gastado este mes').should('be.visible');
  });

  it('debe mostrar sección de solicitudes activas', () => {
    cy.visit('/client');
    cy.contains('Solicitudes activas').should('be.visible');
    cy.contains('Servicios cerca de ti').should('be.visible');
  });

  it('el dashboard debe responder en menos de 3 segundos', () => {
    const start = Date.now();
    cy.visit('/client');
    cy.contains('Servicios cerca de ti').should('be.visible').then(() => {
      const elapsed = Date.now() - start;
      expect(elapsed).to.be.lessThan(3000);
    });
  });
});

describe('Dashboard Prestador', () => {
  beforeEach(() => {
    cy.loginAsProvider();
  });

  it('debe cargar el dashboard del prestador', () => {
    cy.visit('/provider');
    cy.contains('Solicitudes nuevas').should('be.visible');
    cy.contains('Ganancias del mes').should('be.visible');
  });

  it('debe mostrar trabajos activos del prestador', () => {
    cy.visit('/provider/jobs');
    cy.contains('Trabajos activos').should('be.visible');
    cy.contains('Limpieza profunda').should('be.visible');
    cy.contains('Iniciar traslado').should('be.visible');
    cy.contains('0 finalizados').should('not.exist');
  });
});
