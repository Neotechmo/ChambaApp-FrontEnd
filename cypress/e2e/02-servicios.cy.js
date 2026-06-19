/**
 * ChambaApp — Cypress E2E Tests
 * Módulo: Catálogo de servicios y flujo principal (cliente)
 */
describe('Catálogo de Servicios', () => {
  beforeEach(() => {
    cy.loginAsClient();
  });

  it('debe mostrar el catálogo de servicios después del login', () => {
    cy.url().should('include', '/client');
    cy.contains('Hola,').should('be.visible');
    cy.contains('Servicios cerca de ti').should('be.visible');
    cy.contains('Plomería Express').should('be.visible');
  });

  it('debe mostrar tarjetas de servicios disponibles', () => {
    cy.visit('/client/search');
    cy.contains('Resultados disponibles').should('be.visible');
    cy.get('.client-result-card')
      .should('have.length.gte', 1);
  });

  it('debe poder agregar un servicio a favoritos', () => {
    cy.visit('/client/search');
    cy.contains('Plomería Express').should('be.visible');

    cy.get('[aria-label="Agregar a favoritos"]')
      .first().click({ force: true });

    cy.wait('@addFavorite').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.contains('fue agregado a favoritos').should('be.visible');
  });

  it('debe abrir el flujo de solicitud desde un servicio', () => {
    cy.visit('/client/search');
    cy.contains('Plomería Express').should('be.visible');
    cy.contains('.client-result-card', 'Plomería Express')
      .contains('button', 'Solicitar')
      .click();
    cy.contains('Dirección del servicio').should('be.visible');
  });
});

describe('Flujo de Solicitud de Servicio (Cliente)', () => {
  beforeEach(() => {
    cy.loginAsClient();
  });

  it('debe poder ver "Mis solicitudes"', () => {
    cy.visit('/client/requests');
    cy.contains('Mis solicitudes').should('be.visible');
    cy.contains('Reparación de fuga').should('be.visible');
  });

  it('debe ver el historial de solicitudes correctamente', () => {
    cy.visit('/client/requests');
    cy.contains('Historial de solicitudes').should('be.visible');
    cy.contains('Pagar').should('be.visible');
    cy.contains('Ya calificado').should('be.visible');
  });
});
