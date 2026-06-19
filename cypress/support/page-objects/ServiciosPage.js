/**
 * Page Object Model — Catálogo de Servicios
 */
export class ServiciosPage {
  get searchInput() {
    return cy.get(
      '[data-cy="search-servicios"], [data-testid="search-servicios"], input[placeholder*="buscar"], input[placeholder*="search"]',
    );
  }

  get serviceCards() {
    return cy.get(
      '[data-cy="service-card"], [data-testid="service-card"], [class*="service-card"], [class*="servicio"]',
    );
  }

  get favoriteButtons() {
    return cy.get(
      '[data-cy="btn-favorite"], [data-testid="btn-favorite"], [class*="favorite"], button[aria-label*="favorito"]',
    );
  }

  get solicitudButton() {
    return cy.get(
      '[data-cy="btn-solicitar"], [data-testid="btn-solicitar"], button[class*="solicitar"]',
    );
  }

  get errorBanner() {
    return cy.get(
      '[data-cy="error-banner"], [data-testid="error-banner"], [role="alert"], [class*="error"]',
    );
  }

  visit() {
    cy.visit('/servicios');
    return this;
  }

  waitForLoad() {
    cy.intercept('GET', '**/services**').as('getServices');
    this.visit();
    cy.wait('@getServices', { timeout: 10000 });
    return this;
  }

  expectCardsVisible() {
    this.serviceCards.should('have.length.greaterThan', 0);
    return this;
  }

  expectErrorBannerVisible() {
    this.errorBanner.should('be.visible');
    return this;
  }
}
